// Type definitions for @ag-grid-community/core v25.0.1
// Project: http://www.ag-grid.com/
// Definitions by: Niall Crosby <https://github.com/ag-grid/>
import { ColumnGroupChild } from "../entities/columnGroupChild";
import { OriginalColumnGroupChild } from "../entities/originalColumnGroupChild";
import { OriginalColumnGroup } from "../entities/originalColumnGroup";
import { Column } from "../entities/column";
import { BeanStub } from "../context/beanStub";
export declare class ColumnUtils extends BeanStub {
    calculateColInitialWidth(colDef: any): number;
    getOriginalPathForColumn(column: Column, originalBalancedTree: OriginalColumnGroupChild[]): OriginalColumnGroup[];
    depthFirstOriginalTreeSearch(parent: OriginalColumnGroup | null, tree: OriginalColumnGroupChild[], callback: (treeNode: OriginalColumnGroupChild, parent: OriginalColumnGroup) => void): void;
    depthFirstAllColumnTreeSearch(tree: ColumnGroupChild[] | null, callback: (treeNode: ColumnGroupChild) => void): void;
    depthFirstDisplayedColumnTreeSearch(tree: ColumnGroupChild[], callback: (treeNode: ColumnGroupChild) => void): void;
}
