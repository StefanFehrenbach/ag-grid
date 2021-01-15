// Type definitions for @ag-grid-community/core v25.0.1
// Project: http://www.ag-grid.com/
// Definitions by: Niall Crosby <https://github.com/ag-grid/>
import { BeanStub } from "../context/beanStub";
export declare class ResizeObserverService extends BeanStub {
    observeResize(element: HTMLElement, callback: () => void, debounceDelay?: number): () => void;
}
