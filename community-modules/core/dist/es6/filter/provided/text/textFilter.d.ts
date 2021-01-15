// Type definitions for @ag-grid-community/core v25.0.1
// Project: http://www.ag-grid.com/
// Definitions by: Niall Crosby <https://github.com/ag-grid/>
import { IDoesFilterPassParams } from '../../../interfaces/iFilter';
import { SimpleFilter, ConditionPosition, ISimpleFilterParams, ISimpleFilterModel } from '../simpleFilter';
import { IAfterGuiAttachedParams } from '../../../interfaces/iAfterGuiAttachedParams';
import { AgPromise } from '../../../utils';
export interface TextFilterModel extends ISimpleFilterModel {
    filter?: string;
}
export interface TextComparator {
    (filter: string, gridValue: any, filterText: string): boolean;
}
export interface TextFormatter {
    (from: string): string;
}
export interface ITextFilterParams extends ISimpleFilterParams {
    textCustomComparator?: TextComparator;
    caseSensitive?: boolean;
    textFormatter?: (from: string) => string;
}
export declare class TextFilter extends SimpleFilter<TextFilterModel> {
    static DEFAULT_FILTER_OPTIONS: string[];
    static DEFAULT_FORMATTER: TextFormatter;
    static DEFAULT_LOWERCASE_FORMATTER: TextFormatter;
    static DEFAULT_COMPARATOR: TextComparator;
    private readonly eValue1;
    private readonly eValue2;
    private comparator;
    private formatter;
    private textFilterParams;
    constructor();
    static cleanInput(value: string): string;
    protected getDefaultDebounceMs(): number;
    private getCleanValue;
    private addValueChangedListeners;
    protected setParams(params: ITextFilterParams): void;
    protected setConditionIntoUi(model: TextFilterModel, position: ConditionPosition): void;
    protected createCondition(position: ConditionPosition): TextFilterModel;
    protected getFilterType(): string;
    protected areSimpleModelsEqual(aSimple: TextFilterModel, bSimple: TextFilterModel): boolean;
    protected resetUiToDefaults(silent?: boolean): AgPromise<void>;
    private resetPlaceholder;
    private forEachInput;
    protected setValueFromFloatingFilter(value: string): void;
    protected getDefaultFilterOptions(): string[];
    protected createValueTemplate(position: ConditionPosition): string;
    protected updateUiVisibility(): void;
    afterGuiAttached(params?: IAfterGuiAttachedParams): void;
    protected isConditionUiComplete(position: ConditionPosition): boolean;
    protected individualConditionPasses(params: IDoesFilterPassParams, filterModel: TextFilterModel): boolean;
}
