import { ColumnModel } from "../../../columns/columnModel";
import { Autowired, PreDestroy } from "../../../context/context";
import { Column } from "../../../entities/column";
import { IHeaderColumn } from "../../../entities/iHeaderColumn";
import { Events } from "../../../eventKeys";
import { HeaderRowCtrl } from "../../row/headerRowCtrl";
import { AbstractHeaderCellCtrl, IAbstractHeaderCellComp } from "../abstractCell/abstractHeaderCellCtrl";
import { ResizeFeature } from "./resizeFeature";
import { ColumnSortState, getAriaSortState, removeAriaSort, setAriaSort } from "../../../utils/aria";
import { ColumnHoverService } from "../../../rendering/columnHoverService";
import { HoverFeature } from "../hoverFeature";
import { Beans } from "../../../rendering/beans";
import { SetLeftFeature } from "../../../rendering/features/setLeftFeature";
import { CssClassApplier } from "../cssClassApplier";
import { ITooltipFeatureComp, ITooltipFeatureCtrl, TooltipFeature } from "../../../widgets/tooltipFeature";
import { ManagedFocusFeature } from "../../../widgets/managedFocusFeature";
import { KeyCode } from '../../../constants/keyCode';
import { SortController } from "../../../sortController";
import { IMenuFactory } from "../../../interfaces/iMenuFactory";
import { HeaderComp, IHeaderComp } from "./headerComp";
import { SelectAllFeature } from "./selectAllFeature";
import { DragAndDropService, DragItem, DragSource, DragSourceType } from "../../../dragAndDrop/dragAndDropService";

export interface IHeaderCellComp extends IAbstractHeaderCellComp, ITooltipFeatureComp {
    focus(): void;
    setWidth(width: string): void;
    addOrRemoveCssClass(cssClassName: string, on: boolean): void;
    setResizeDisplayed(displayed: boolean): void;
    setAriaSort(sort: ColumnSortState | undefined): void;
    setColId(id: string): void;
    setAriaDescribedBy(id: string | undefined): void;

    // temp
    refreshHeaderComp(): void;
    temp_getHeaderComp(): IHeaderComp | undefined;
}

export class HeaderCellCtrl extends AbstractHeaderCellCtrl {

    @Autowired('columnModel') private columnModel: ColumnModel;
    @Autowired('columnHoverService') private columnHoverService: ColumnHoverService;
    @Autowired('beans') protected beans: Beans;
    @Autowired('sortController') private sortController: SortController;
    @Autowired('menuFactory') private menuFactory: IMenuFactory;
    @Autowired('dragAndDropService') private dragAndDropService: DragAndDropService;

    private eGui: HTMLElement;

    private colDefVersion: number;

    private comp: IHeaderCellComp;

    private column: Column;

    private refreshFunctions: (() => void)[] = [];

    private selectAllFeature: SelectAllFeature;

    private moveDragSource: DragSource | undefined;

    private sortable: boolean | null | undefined;
    private displayName: string | null;
    private draggable: boolean;
    private menuEnabled: boolean;

    constructor(columnGroupChild: IHeaderColumn, parentRowCtrl: HeaderRowCtrl, column: Column) {
        super(columnGroupChild, parentRowCtrl);
        this.column = column;
    }

    public setComp(comp: IHeaderCellComp, eGui: HTMLElement, eResize: HTMLElement): void {
        super.setAbstractComp(comp);
        this.comp = comp;
        this.eGui = eGui;

        this.colDefVersion = this.columnModel.getColDefVersion();

        this.updateState();
        this.setupWidth();
        this.setupMovingCss();
        this.setupMenuClass();
        this.setupSortableClass();
        this.addColumnHoverListener();
        this.setupFilterCss();
        this.setupColId();
        this.setupClassesFromColDef();
        this.setupTooltip();
        this.addActiveHeaderMouseListeners();
        this.setupSelectAll();

        this.createManagedBean(new HoverFeature([this.column], eGui));
        this.createManagedBean(new SetLeftFeature(this.column, eGui, this.beans));
        this.createManagedBean(new ManagedFocusFeature(
            eGui,
            {
                shouldStopEventPropagation: e => this.shouldStopEventPropagation(e),
                onTabKeyDown: ()=> null,
                handleKeyDown: this.handleKeyDown.bind(this),
                onFocusIn: this.onFocusIn.bind(this),
                onFocusOut: this.onFocusOut.bind(this)
            }
        ));

        this.addManagedListener(this.eventService, Events.EVENT_NEW_COLUMNS_LOADED, this.onNewColumnsLoaded.bind(this));
        this.addManagedListener(this.eventService, Events.EVENT_COLUMN_VALUE_CHANGED, this.onColumnValueChanged.bind(this));
        this.addManagedListener(this.eventService, Events.EVENT_COLUMN_ROW_GROUP_CHANGED, this.onColumnRowGroupChanged.bind(this));
        this.addManagedListener(this.eventService, Events.EVENT_COLUMN_PIVOT_CHANGED, this.onColumnPivotChanged.bind(this));

        this.createManagedBean(new ResizeFeature(this.getPinned(), this.column, eResize, comp, this));
    }

    private setupSelectAll(): void {
        this.selectAllFeature = this.createManagedBean(new SelectAllFeature(this.column));
        this.selectAllFeature.setComp(this.comp);
    }

    public getSelectAllGui(): HTMLElement {
        return this.selectAllFeature.getCheckboxGui();
    }

    protected handleKeyDown(e: KeyboardEvent): void {
        if (e.keyCode === KeyCode.SPACE) {
            this.selectAllFeature.onSpaceKeyPressed(e);
        }
        if (e.keyCode === KeyCode.ENTER) {
            this.onEnterKeyPressed(e);
        }
    }

    private onEnterKeyPressed(e: KeyboardEvent): void {
        /// THIS IS BAD - we are assuming the header is not a user provided comp
        const headerComp = this.comp.temp_getHeaderComp() as HeaderComp;
        if (!headerComp) { return; }

        if (e.ctrlKey || e.metaKey) {
            if (this.menuEnabled && headerComp.showMenu) {
                e.preventDefault();
                headerComp.showMenu();
            }
        } else if (this.sortable) {
            const multiSort = e.shiftKey;
            this.sortController.progressSort(this.column, multiSort, "uiColumnSorted");
        }
    }

    public isMenuEnabled(): boolean {
        return this.menuEnabled;
    }

    protected onFocusIn(e: FocusEvent) {
        if (!this.getGui().contains(e.relatedTarget as HTMLElement)) {
            const rowIndex = this.getRowIndex();
            this.focusService.setFocusedHeader(rowIndex, this.column);
        }

        this.setActiveHeader(true);
    }

    protected onFocusOut(e: FocusEvent) {
        if (
            this.getGui().contains(e.relatedTarget as HTMLElement)
        ) { return; }

        this.setActiveHeader(false);
    }

    private setupTooltip(): void {

        const tooltipCtrl: ITooltipFeatureCtrl = {
            getColumn: ()=> this.column,
            getGui: ()=> this.eGui,
            getLocation: ()=> 'header',
            getTooltipValue: () => {
                const res = this.column.getColDef().headerTooltip;
                return res;
            },
        };

        const tooltipFeature = this.createManagedBean(new TooltipFeature(tooltipCtrl, this.beans));

        tooltipFeature.setComp(this.comp);

        this.refreshFunctions.push( ()=> tooltipFeature.refreshToolTip() );
    }

    private setupClassesFromColDef(): void {
        const colDef = this.column.getColDef();
        const goa = this.gridOptionsWrapper;
        const classes = CssClassApplier.getHeaderClassesFromColDef(colDef, goa, this.column, null);
        classes.forEach( c => this.comp.addOrRemoveCssClass(c, true) );
    }

    public getGui(): HTMLElement {
        return this.eGui;
    }

    public temp_getDisplayName(): string | null {
        return this.displayName;
    }

    public setDragSource(eSource: HTMLElement): void {
        this.removeDragSource();

        if (!eSource) { return; }

        if (!this.draggable) { return; }

        this.moveDragSource = {
            type: DragSourceType.HeaderCell,
            eElement: eSource,
            defaultIconName: DragAndDropService.ICON_HIDE,
            getDragItem: () => this.createDragItem(),
            dragItemName: this.displayName,
            onDragStarted: () => this.column.setMoving(true, "uiColumnMoved"),
            onDragStopped: () => this.column.setMoving(false, "uiColumnMoved")
        };

        this.dragAndDropService.addDragSource(this.moveDragSource, true);
    }

    private createDragItem(): DragItem {
        const visibleState: { [key: string]: boolean; } = {};
        visibleState[this.column.getId()] = this.column.isVisible();

        return {
            columns: [this.column],
            visibleState: visibleState
        };
    }

    @PreDestroy
    public removeDragSource(): void {
        if (this.moveDragSource) {
            this.dragAndDropService.removeDragSource(this.moveDragSource);
            this.moveDragSource = undefined;
        }
    }

    private onNewColumnsLoaded(): void {
        const colDefVersionNow = this.columnModel.getColDefVersion();
        if (colDefVersionNow != this.colDefVersion) {
            this.colDefVersion = colDefVersionNow;
            this.refresh();
        }
    }

    private updateState(): void {
        const colDef = this.column.getColDef();
        this.menuEnabled = this.menuFactory.isMenuEnabled(this.column) && !colDef.suppressMenu;
        this.sortable = colDef.sortable;
        this.displayName = this.calculateDisplayName();
        this.draggable = this.workOutDraggable();
    }

    public addRefreshFunction(func: ()=>void): void {
        this.refreshFunctions.push(func);
    }

    private refresh(): void {
        this.updateState();
        this.comp.refreshHeaderComp();
        this.refreshFunctions.forEach(f => f());
    }

    private calculateDisplayName(): string | null {
        return this.columnModel.getDisplayNameForColumn(this.column, 'header', true);
    }

    private checkDisplayName(): void {
        // display name can change if aggFunc different, eg sum(Gold) is now max(Gold)
        if (this.displayName !== this.calculateDisplayName()) {
            this.refresh();
        }
    }

    private workOutDraggable(): boolean {
        const colDef = this.column.getColDef();
        const isSuppressMovableColumns = this.gridOptionsWrapper.isSuppressMovableColumns();

        const colCanMove = !isSuppressMovableColumns && !colDef.suppressMovable && !colDef.lockPosition;

        // we should still be allowed drag the column, even if it can't be moved, if the column
        // can be dragged to a rowGroup or pivot drop zone
        return !!colCanMove || !!colDef.enableRowGroup || !!colDef.enablePivot;
    }

    private onColumnRowGroupChanged(): void {
        this.checkDisplayName();
    }

    private onColumnPivotChanged(): void {
        this.checkDisplayName();
    }

    private onColumnValueChanged(): void {
        this.checkDisplayName();
    }

    private setupWidth(): void {
        const listener = () => {
            this.comp.setWidth(this.column.getActualWidth() + 'px');
        };
    
        this.addManagedListener(this.column, Column.EVENT_WIDTH_CHANGED, listener);
        listener();
    }

    private setupMovingCss(): void {
        const listener = ()=> {
            // this is what makes the header go dark when it is been moved (gives impression to
            // user that the column was picked up).
            this.comp.addOrRemoveCssClass('ag-header-cell-moving', this.column.isMoving());
        };

        this.addManagedListener(this.column, Column.EVENT_MOVING_CHANGED, listener);
        listener();
    }

    private setupMenuClass(): void {
        const listener = ()=> {
            this.comp.addOrRemoveCssClass('ag-column-menu-visible', this.column.isMenuVisible());
        };

        this.addManagedListener(this.column, Column.EVENT_MENU_VISIBLE_CHANGED, listener);
        listener();
    }

    private setupSortableClass(): void {

        const updateSortableCssClass = () => {
            this.comp.addOrRemoveCssClass('ag-header-cell-sortable', !!this.sortable);
        };

        const updateAriaSort = () => {
            if (this.sortable) {
                this.comp.setAriaSort(getAriaSortState(this.column));
            } else {
                this.comp.setAriaSort(undefined);
            }
        };

        updateSortableCssClass();
        updateAriaSort();

        this.addRefreshFunction(updateSortableCssClass);
        this.addRefreshFunction(updateAriaSort);

        this.addManagedListener(this.column, Column.EVENT_SORT_CHANGED, updateAriaSort);
    }

    private addColumnHoverListener(): void {
        const listener = ()=> {
            if (!this.gridOptionsWrapper.isColumnHoverHighlight()) { return; }
            const isHovered = this.columnHoverService.isHovered(this.column);
            this.comp.addOrRemoveCssClass('ag-column-hover', isHovered);
        };

        this.addManagedListener(this.eventService, Events.EVENT_COLUMN_HOVER_CHANGED, listener);
        listener();
    }

    private setupFilterCss(): void {
        const listener = ()=> {
            this.comp.addOrRemoveCssClass('ag-header-cell-filtered', this.column.isFilterActive());
        };

        this.addManagedListener(this.column, Column.EVENT_FILTER_ACTIVE_CHANGED, listener);
        listener();
    }

    private setupColId(): void {
        this.comp.setColId(this.column.getColId());
    }

    private addActiveHeaderMouseListeners(): void {
        const listener = (e: MouseEvent) => this.setActiveHeader(e.type === 'mouseenter');
        this.addManagedListener(this.getGui(), 'mouseenter', listener);
        this.addManagedListener(this.getGui(), 'mouseleave', listener);
    }

    private setActiveHeader(active: boolean): void {
        this.comp.addOrRemoveCssClass('ag-header-active', active);
    }
}