/**
 * @ag-grid-community/core - Advanced Data Grid / Data Table supporting Javascript / React / AngularJS / Web Components
 * @version v23.1.1
 * @link http://www.ag-grid.com/
 * @license MIT
 */
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var context_1 = require("../context/context");
var eventKeys_1 = require("../eventKeys");
var undoRedoStack_1 = require("./undoRedoStack");
var constants_1 = require("../constants");
var moduleNames_1 = require("../modules/moduleNames");
var moduleRegistry_1 = require("../modules/moduleRegistry");
var UndoRedoService = /** @class */ (function () {
    function UndoRedoService() {
        var _this = this;
        this.cellValueChanges = [];
        this.isCellEditing = false;
        this.isRowEditing = false;
        this.isPasting = false;
        this.isFilling = false;
        this.events = [];
        this.onCellValueChanged = function (event) {
            var shouldCaptureAction = _this.isCellEditing || _this.isRowEditing || _this.isPasting || _this.isFilling;
            if (!shouldCaptureAction) {
                return;
            }
            var rowPinned = event.rowPinned, rowIndex = event.rowIndex, column = event.column, oldValue = event.oldValue, value = event.value;
            var cellValueChange = {
                rowPinned: rowPinned,
                rowIndex: rowIndex,
                columnId: column.getColId(),
                oldValue: oldValue,
                newValue: value
            };
            _this.cellValueChanges.push(cellValueChange);
        };
        this.clearStacks = function () {
            _this.undoStack.clear();
            _this.redoStack.clear();
        };
    }
    UndoRedoService.prototype.init = function () {
        if (!this.gridOptionsWrapper.isUndoRedoCellEditing()) {
            return;
        }
        var undoRedoLimit = this.gridOptionsWrapper.getUndoRedoCellEditingLimit();
        if (undoRedoLimit <= 0) {
            return;
        }
        this.undoStack = new undoRedoStack_1.UndoRedoStack(undoRedoLimit);
        this.redoStack = new undoRedoStack_1.UndoRedoStack(undoRedoLimit);
        this.events = [].concat(this.addRowEditingListeners(), this.addCellEditingListeners(), this.addPasteListeners(), this.addFillListeners(), [
            this.eventService.addEventListener(eventKeys_1.Events.EVENT_CELL_VALUE_CHANGED, this.onCellValueChanged),
            // undo / redo is restricted to actual editing so we clear the stacks when other operations are
            // performed that change the order of the row / cols.
            this.eventService.addEventListener(eventKeys_1.Events.EVENT_MODEL_UPDATED, this.clearStacks),
            this.eventService.addEventListener(eventKeys_1.Events.EVENT_COLUMN_PIVOT_MODE_CHANGED, this.clearStacks),
            this.eventService.addEventListener(eventKeys_1.Events.EVENT_COLUMN_EVERYTHING_CHANGED, this.clearStacks),
            this.eventService.addEventListener(eventKeys_1.Events.EVENT_COLUMN_GROUP_OPENED, this.clearStacks),
            this.eventService.addEventListener(eventKeys_1.Events.EVENT_COLUMN_ROW_GROUP_CHANGED, this.clearStacks),
            this.eventService.addEventListener(eventKeys_1.Events.EVENT_COLUMN_MOVED, this.clearStacks),
            this.eventService.addEventListener(eventKeys_1.Events.EVENT_COLUMN_PINNED, this.clearStacks),
            this.eventService.addEventListener(eventKeys_1.Events.EVENT_COLUMN_VISIBLE, this.clearStacks),
            this.eventService.addEventListener(eventKeys_1.Events.EVENT_ROW_DRAG_END, this.clearStacks),
        ]);
    };
    UndoRedoService.prototype.destroy = function () {
        if (this.events.length) {
            this.events.forEach(function (func) { return func(); });
            this.events = [];
        }
    };
    UndoRedoService.prototype.undo = function () {
        if (!this.undoStack) {
            return;
        }
        var undoAction = this.undoStack.pop();
        if (!undoAction || !undoAction.cellValueChanges) {
            return;
        }
        this.processAction(undoAction, function (cellValueChange) { return cellValueChange.oldValue; });
        if (undoAction instanceof undoRedoStack_1.FillUndoRedoAction) {
            this.processRangeAndCellFocus(undoAction.cellValueChanges, undoAction.initialRange);
        }
        else {
            this.processRangeAndCellFocus(undoAction.cellValueChanges);
        }
        this.redoStack.push(undoAction);
    };
    UndoRedoService.prototype.redo = function () {
        if (!this.redoStack) {
            return;
        }
        var redoAction = this.redoStack.pop();
        if (!redoAction || !redoAction.cellValueChanges) {
            return;
        }
        this.processAction(redoAction, function (cellValueChange) { return cellValueChange.newValue; });
        if (redoAction instanceof undoRedoStack_1.FillUndoRedoAction) {
            this.processRangeAndCellFocus(redoAction.cellValueChanges, redoAction.finalRange);
        }
        else {
            this.processRangeAndCellFocus(redoAction.cellValueChanges);
        }
        this.undoStack.push(redoAction);
    };
    UndoRedoService.prototype.processAction = function (action, valueExtractor) {
        var _this = this;
        action.cellValueChanges.forEach(function (cellValueChange) {
            var rowIndex = cellValueChange.rowIndex, rowPinned = cellValueChange.rowPinned, columnId = cellValueChange.columnId;
            var rowPosition = { rowIndex: rowIndex, rowPinned: rowPinned };
            var currentRow = _this.getRowNode(rowPosition);
            // checks if the row has been filtered out
            if (currentRow.rowTop == null) {
                return;
            }
            currentRow.setDataValue(columnId, valueExtractor(cellValueChange));
        });
    };
    UndoRedoService.prototype.processRangeAndCellFocus = function (cellValueChanges, range) {
        if (range) {
            var startRow = range.startRow;
            var endRow = range.endRow;
            var lastFocusedCell_1 = {
                rowPinned: startRow.rowPinned,
                rowIndex: startRow.rowIndex,
                columnId: range.startColumn.getColId()
            };
            this.setLastFocusedCell(lastFocusedCell_1);
            var cellRangeParams = {
                rowStartIndex: startRow.rowIndex,
                rowStartPinned: startRow.rowPinned,
                rowEndIndex: endRow.rowIndex,
                rowEndPinned: endRow.rowPinned,
                columnStart: range.startColumn,
                columns: range.columns
            };
            this.gridApi.addCellRange(cellRangeParams);
            return;
        }
        var cellValueChange = cellValueChanges[0];
        var rowIndex = cellValueChange.rowIndex, rowPinned = cellValueChange.rowPinned;
        var rowPosition = { rowIndex: rowIndex, rowPinned: rowPinned };
        var row = this.getRowNode(rowPosition);
        var lastFocusedCell = {
            rowPinned: cellValueChange.rowPinned,
            rowIndex: row.rowIndex,
            columnId: cellValueChange.columnId
        };
        this.setLastFocusedCell(lastFocusedCell);
    };
    UndoRedoService.prototype.setLastFocusedCell = function (lastFocusedCell) {
        var rowIndex = lastFocusedCell.rowIndex, columnId = lastFocusedCell.columnId, rowPinned = lastFocusedCell.rowPinned;
        this.gridApi.ensureIndexVisible(rowIndex);
        this.gridApi.ensureColumnVisible(columnId);
        if (moduleRegistry_1.ModuleRegistry.isRegistered(moduleNames_1.ModuleNames.RangeSelectionModule)) {
            this.gridApi.clearRangeSelection();
        }
        this.focusController.setFocusedCell(rowIndex, columnId, rowPinned, true);
    };
    UndoRedoService.prototype.addRowEditingListeners = function () {
        var _this = this;
        return [
            this.eventService.addEventListener(eventKeys_1.Events.EVENT_ROW_EDITING_STARTED, function () {
                _this.isRowEditing = true;
            }),
            this.eventService.addEventListener(eventKeys_1.Events.EVENT_ROW_EDITING_STOPPED, function () {
                var action = new undoRedoStack_1.UndoRedoAction(_this.cellValueChanges);
                _this.pushActionsToUndoStack(action);
                _this.isRowEditing = false;
            })
        ];
    };
    UndoRedoService.prototype.addCellEditingListeners = function () {
        var _this = this;
        return [
            this.eventService.addEventListener(eventKeys_1.Events.EVENT_CELL_EDITING_STARTED, function () {
                _this.isCellEditing = true;
            }),
            this.eventService.addEventListener(eventKeys_1.Events.EVENT_CELL_EDITING_STOPPED, function () {
                _this.isCellEditing = false;
                var shouldPushAction = !_this.isRowEditing && !_this.isPasting && !_this.isFilling;
                if (shouldPushAction) {
                    var action = new undoRedoStack_1.UndoRedoAction(_this.cellValueChanges);
                    _this.pushActionsToUndoStack(action);
                }
            })
        ];
    };
    UndoRedoService.prototype.addPasteListeners = function () {
        var _this = this;
        return [
            this.eventService.addEventListener(eventKeys_1.Events.EVENT_PASTE_START, function () {
                _this.isPasting = true;
            }),
            this.eventService.addEventListener(eventKeys_1.Events.EVENT_PASTE_END, function () {
                var action = new undoRedoStack_1.UndoRedoAction(_this.cellValueChanges);
                _this.pushActionsToUndoStack(action);
                _this.isPasting = false;
            })
        ];
    };
    UndoRedoService.prototype.addFillListeners = function () {
        var _this = this;
        return [
            this.eventService.addEventListener(eventKeys_1.Events.EVENT_FILL_START, function () {
                _this.isFilling = true;
            }),
            this.eventService.addEventListener(eventKeys_1.Events.EVENT_FILL_END, function (event) {
                var action = new undoRedoStack_1.FillUndoRedoAction(_this.cellValueChanges, event.initialRange, event.finalRange);
                _this.pushActionsToUndoStack(action);
                _this.isFilling = false;
            })
        ];
    };
    UndoRedoService.prototype.pushActionsToUndoStack = function (action) {
        this.undoStack.push(action);
        this.cellValueChanges = [];
        this.redoStack.clear();
    };
    UndoRedoService.prototype.getRowNode = function (gridRow) {
        switch (gridRow.rowPinned) {
            case constants_1.Constants.PINNED_TOP:
                return this.pinnedRowModel.getPinnedTopRowData()[gridRow.rowIndex];
            case constants_1.Constants.PINNED_BOTTOM:
                return this.pinnedRowModel.getPinnedBottomRowData()[gridRow.rowIndex];
            default:
                return this.rowModel.getRow(gridRow.rowIndex);
        }
    };
    __decorate([
        context_1.Autowired('gridOptionsWrapper')
    ], UndoRedoService.prototype, "gridOptionsWrapper", void 0);
    __decorate([
        context_1.Autowired('focusController')
    ], UndoRedoService.prototype, "focusController", void 0);
    __decorate([
        context_1.Autowired('eventService')
    ], UndoRedoService.prototype, "eventService", void 0);
    __decorate([
        context_1.Autowired('gridApi')
    ], UndoRedoService.prototype, "gridApi", void 0);
    __decorate([
        context_1.Autowired('rowModel')
    ], UndoRedoService.prototype, "rowModel", void 0);
    __decorate([
        context_1.Autowired('pinnedRowModel')
    ], UndoRedoService.prototype, "pinnedRowModel", void 0);
    __decorate([
        context_1.PostConstruct
    ], UndoRedoService.prototype, "init", null);
    __decorate([
        context_1.PreDestroy
    ], UndoRedoService.prototype, "destroy", null);
    UndoRedoService = __decorate([
        context_1.Bean('undoRedoService')
    ], UndoRedoService);
    return UndoRedoService;
}());
exports.UndoRedoService = UndoRedoService;

//# sourceMappingURL=undoRedoService.js.map
