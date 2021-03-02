var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { _ } from '@ag-grid-community/core';
import { RowType } from "@ag-grid-community/csv-export";
import { ExcelXlsxFactory } from './excelXlsxFactory';
import { BaseExcelSerializingSession } from './baseExcelSerializingSession';
var ExcelXlsxSerializingSession = /** @class */ (function (_super) {
    __extends(ExcelXlsxSerializingSession, _super);
    function ExcelXlsxSerializingSession() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ExcelXlsxSerializingSession.prototype.onNewHeaderGroupingRow = function () {
        var _this = this;
        var currentCells = [];
        this.rows.push({
            cells: currentCells,
            height: this.config.headerRowHeight
        });
        return {
            onColumn: function (header, index, span) {
                var styleIds = _this.config.styleLinker(RowType.HEADER_GROUPING, 1, index, "grouping-" + header, undefined, undefined);
                currentCells.push(_this.createMergedCell((styleIds && styleIds.length > 0) ? styleIds[0] : null, 's', header, span));
            }
        };
    };
    ExcelXlsxSerializingSession.prototype.createExcel = function (data) {
        return ExcelXlsxFactory.createExcel(this.excelStyles, data);
    };
    ExcelXlsxSerializingSession.prototype.getDataTypeForValue = function (valueForCell) {
        return _.isNumeric(valueForCell) ? 'n' : 's';
    };
    ExcelXlsxSerializingSession.prototype.onNewHeaderColumn = function (rowIndex, currentCells) {
        var _this = this;
        return function (column, index, node) {
            var nameForCol = _this.extractHeaderValue(column);
            var styleIds = _this.config.styleLinker(RowType.HEADER, rowIndex, index, nameForCol, column, undefined);
            currentCells.push(_this.createCell((styleIds && styleIds.length > 0) ? styleIds[0] : null, 's', nameForCol));
        };
    };
    ExcelXlsxSerializingSession.prototype.getType = function (type, style, value) {
        if (this.isFormula(value)) {
            return 'f';
        }
        if (style && style.dataType) {
            switch (style.dataType.toLocaleLowerCase()) {
                case 'formula':
                    return 'f';
                case 'string':
                    return 's';
                case 'number':
                    return 'n';
                case 'datetime':
                    return 'd';
                case 'error':
                    return 'e';
                case 'boolean':
                    return 'b';
                default:
                    console.warn("ag-grid: Unrecognized data type for excel export [" + style.id + ".dataType=" + style.dataType + "]");
            }
        }
        return type;
    };
    ExcelXlsxSerializingSession.prototype.createCell = function (styleId, type, value) {
        var actualStyle = this.getStyleById(styleId);
        var typeTransformed = this.getType(type, actualStyle, value) || type;
        ;
        return {
            styleId: actualStyle ? styleId : undefined,
            data: {
                type: typeTransformed,
                value: this.getCellValue(typeTransformed, value)
            }
        };
    };
    ExcelXlsxSerializingSession.prototype.createMergedCell = function (styleId, type, value, numOfCells) {
        return {
            styleId: !!this.getStyleById(styleId) ? styleId : undefined,
            data: {
                type: type,
                value: type === 's' ? ExcelXlsxFactory.getStringPosition(value == null ? '' : value).toString() : value
            },
            mergeAcross: numOfCells
        };
    };
    ExcelXlsxSerializingSession.prototype.getCellValue = function (type, value) {
        if (value == null) {
            return ExcelXlsxFactory.getStringPosition('').toString();
        }
        switch (type) {
            case 's':
                return ExcelXlsxFactory.getStringPosition(value).toString();
            case 'f':
                return value.slice(1);
            case 'n':
                return Number(value).toString();
            default:
                return value;
        }
    };
    return ExcelXlsxSerializingSession;
}(BaseExcelSerializingSession));
export { ExcelXlsxSerializingSession };