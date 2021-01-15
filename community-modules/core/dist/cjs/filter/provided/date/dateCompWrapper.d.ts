// Type definitions for @ag-grid-community/core v25.0.1
// Project: http://www.ag-grid.com/
// Definitions by: Niall Crosby <https://github.com/ag-grid/>
import { IDateParams } from '../../../rendering/dateComponent';
import { UserComponentFactory } from '../../../components/framework/userComponentFactory';
import { Context } from '../../../context/context';
import { IAfterGuiAttachedParams } from '../../../interfaces/iAfterGuiAttachedParams';
/** Provides sync access to async component. Date component can be lazy created - this class encapsulates
 * this by keeping value locally until DateComp has loaded, then passing DateComp the value. */
export declare class DateCompWrapper {
    private dateComp;
    private tempValue;
    private alive;
    private context;
    constructor(context: Context, userComponentFactory: UserComponentFactory, dateComponentParams: IDateParams, eParent: HTMLElement);
    destroy(): void;
    getDate(): Date;
    setDate(value: Date): void;
    setInputPlaceholder(placeholder: string): void;
    setInputAriaLabel(label: string): void;
    afterGuiAttached(params?: IAfterGuiAttachedParams): void;
}
