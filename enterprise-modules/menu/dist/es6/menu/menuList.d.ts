import { TabGuardComp, MenuItemDef } from "@ag-grid-community/core";
export declare class MenuList extends TabGuardComp {
    private readonly level;
    private readonly focusService;
    private menuItems;
    private activeMenuItem;
    constructor(level?: number);
    private postConstruct;
    protected onTabKeyDown(e: KeyboardEvent): void;
    protected handleKeyDown(e: KeyboardEvent): void;
    clearActiveItem(): void;
    addMenuItems(menuItems?: (MenuItemDef | string)[]): void;
    addItem(menuItemDef: MenuItemDef): void;
    activateFirstItem(): void;
    private addSeparator;
    private findTopMenu;
    private handleNavKey;
    private closeIfIsChild;
    private openChild;
    private findNextItem;
    protected destroy(): void;
}