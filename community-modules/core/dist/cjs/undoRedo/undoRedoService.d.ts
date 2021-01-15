// Type definitions for @ag-grid-community/core v25.0.1
// Project: http://www.ag-grid.com/
// Definitions by: Niall Crosby <https://github.com/ag-grid/>
import { BeanStub } from "../context/beanStub";
export declare class UndoRedoService extends BeanStub {
    private focusController;
    private gridApi;
    private rowModel;
    private pinnedRowModel;
    private cellValueChanges;
    private undoStack;
    private redoStack;
    private isCellEditing;
    private isRowEditing;
    private isPasting;
    private isFilling;
    init(): void;
    private onCellValueChanged;
    private clearStacks;
    getCurrentUndoStackSize(): number;
    getCurrentRedoStackSize(): number;
    undo(): void;
    redo(): void;
    private processAction;
    private processRangeAndCellFocus;
    private setLastFocusedCell;
    private addRowEditingListeners;
    private addCellEditingListeners;
    private addPasteListeners;
    private addFillListeners;
    private pushActionsToUndoStack;
    private getRowNode;
}
