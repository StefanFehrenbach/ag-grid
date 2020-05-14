export declare const _: {
    utf8_encode(s: string): string;
    camelCaseToHyphen(str: string): string;
    hyphenToCamelCase(str: string): string;
    capitalise(str: string): string;
    escape(toEscape: string): string;
    camelCaseToHumanText(camelCase: string): string;
    convertToSet<T>(list: T[]): Set<T>;
    sortRowNodesByOrder(rowNodes: import("../main").RowNode[], rowNodeOrder: {
        [id: string]: number;
    }): void;
    traverseNodesWithKey(nodes: import("../main").RowNode[], callback: (node: import("../main").RowNode, key: string) => void): void;
    iterateObject<T_1>(object: {
        [p: string]: T_1;
    } | T_1[], callback: (key: string, value: T_1) => void): void;
    cloneObject<T_2>(object: T_2): T_2;
    deepCloneObject<T_3>(object: T_3): T_3;
    getProperty<T_4, K extends keyof T_4>(object: T_4, key: K): any;
    setProperty<T_5, K_1 extends keyof T_5>(object: T_5, key: K_1, value: any): void;
    copyPropertiesIfPresent<S, T_6 extends S, K_2 extends keyof S>(source: S, target: T_6, ...properties: K_2[]): void;
    copyPropertyIfPresent<S_1, T_7 extends S_1, K_3 extends keyof S_1>(source: S_1, target: T_7, property: K_3, transform?: (value: S_1[K_3]) => any): void;
    getAllKeysInObjects(objects: any[]): string[];
    mergeDeep(dest: any, source: any, copyUndefined?: boolean): void;
    assign(object: any, ...sources: any[]): any;
    missingOrEmptyObject(value: any): boolean;
    get(source: any, expression: string, defaultValue: any): any;
    set(target: any, expression: string, value: any): void;
    deepFreeze(object: any): any;
    getValueUsingField(data: any, field: string, fieldContainsDots: boolean): any;
    padStart(value: number, totalStringSize: number): string;
    createArrayOfNumbers(first: number, last: number): number[];
    isNumeric(value: any): boolean;
    getMaxSafeInteger(): number;
    cleanNumber(value: any): number;
    decToHex(number: number, bytes: number): string;
    formatNumberTwoDecimalPlacesAndCommas(value: number): string;
    formatNumberCommas(value: number): string;
    sum(values: number[]): number;
    normalizeWheel(event: any): any;
    isLeftClick(mouseEvent: MouseEvent): boolean;
    areEventsNear(e1: Touch | MouseEvent, e2: Touch | MouseEvent, pixelCount: number): boolean;
    keys<T_8>(map: Map<T_8, any>): T_8[];
    isKeyPressed(event: KeyboardEvent, keyToCheck: number): boolean;
    isCharacterKey(event: KeyboardEvent): boolean;
    isEventFromPrintableCharacter(event: KeyboardEvent): boolean;
    isUserSuppressingKeyboardEvent(gridOptionsWrapper: import("../gridOptionsWrapper").GridOptionsWrapper, keyboardEvent: KeyboardEvent, rowNode: import("../main").RowNode, column: import("../main").Column, editing: boolean): boolean;
    createIcon(iconName: string, gridOptionsWrapper: import("../gridOptionsWrapper").GridOptionsWrapper, column: import("../main").Column): HTMLElement;
    createIconNoSpan(iconName: string, gridOptionsWrapper: import("../gridOptionsWrapper").GridOptionsWrapper, column?: import("../main").Column, forceCreate?: boolean): HTMLElement;
    iconNameClassMap: {
        [key: string]: string;
    };
    makeNull<T_9>(value?: T_9): T_9;
    exists<T_10>(value: T_10, allowEmptyString?: boolean): boolean;
    missing<T_11>(value: T_11): boolean;
    missingOrEmpty<T_12>(value?: string | T_12[]): boolean;
    toStringOrNull(value: any): string;
    referenceCompare<T_13>(left: T_13, right: T_13): boolean;
    jsonEquals<T1, T2>(val1: T1, val2: T2): boolean;
    defaultComparator(valueA: any, valueB: any, accentedCompare?: boolean): number;
    find<T_14>(collection: {
        [id: string]: T_14;
    } | T_14[], predicate: string | boolean | ((item: T_14) => boolean), value?: any): T_14;
    values<T_15>(object: {
        [key: string]: T_15;
    } | Set<T_15> | Map<any, T_15>): T_15[];
    fuzzyCheckStrings(inputValues: string[], validValues: string[], allSuggestions: string[]): {
        [p: string]: string[];
    };
    fuzzySuggestions(inputValue: string, allSuggestions: string[], hideIrrelevant?: boolean, weighted?: true): string[];
    get_bigrams(from: string): any[];
    string_distances(str1: string, str2: string): number;
    string_weighted_distances(str1: string, str2: string): number;
    doOnce(func: () => void, key: string): void;
    getFunctionParameters(func: any): any;
    isFunction(val: any): boolean;
    executeInAWhile(funcs: Function[]): void;
    executeNextVMTurn(funcs: Function[]): void;
    executeAfter(funcs: Function[], milliseconds?: number): void;
    debounce(func: (...args: any[]) => void, wait: number, immediate?: boolean): (...args: any[]) => void;
    compose(...fns: Function[]): (arg: any) => any;
    callIfPresent(func: Function): void;
    stopPropagationForAgGrid(event: Event): void;
    isStopPropagationForAgGrid(event: Event): boolean;
    getCellCompForEvent(gridOptionsWrapper: import("../gridOptionsWrapper").GridOptionsWrapper, event: Event): import("../main").CellComp;
    addChangeListener(element: HTMLElement, listener: EventListener): void;
    getTarget(event: Event): Element;
    isElementInEventPath(element: HTMLElement, event: Event): boolean;
    createEventPath(event: Event): EventTarget[];
    addAgGridEventPath(event: Event): void;
    getEventPath(event: Event): EventTarget[];
    addSafePassiveEventListener(frameworkOverrides: import("../main").IFrameworkOverrides, eElement: HTMLElement, event: string, listener: (event?: any) => void): void;
    isEventSupported: (eventName: any) => boolean;
    addCssClass(element: HTMLElement, className: string): HTMLElement;
    removeCssClass(element: HTMLElement, className: string): void;
    addOrRemoveCssClass(element: HTMLElement, className: string, addOrRemove: boolean): void;
    radioCssClass(element: HTMLElement, elementClass: string, otherElementClass?: string): void;
    containsClass(element: HTMLElement, className: string): boolean;
    setDisplayed(element: HTMLElement, displayed: boolean): void;
    setVisible(element: HTMLElement, visible: boolean): void;
    isElementChildOfClass(element: HTMLElement, cls: string, maxNest?: number): boolean;
    getElementSize(el: HTMLElement): {
        height: number;
        width: number;
        paddingTop: number;
        paddingRight: number;
        paddingBottom: number;
        paddingLeft: number;
        marginTop: number;
        marginRight: number;
        marginBottom: number;
        marginLeft: number;
        boxSizing: string;
    };
    getInnerHeight(el: HTMLElement): number;
    getInnerWidth(el: HTMLElement): number;
    getAbsoluteHeight(el: HTMLElement): number;
    getAbsoluteWidth(el: HTMLElement): number;
    getScrollLeft(element: HTMLElement, rtl: boolean): number;
    setScrollLeft(element: HTMLElement, value: number, rtl: boolean): void;
    clearElement(el: HTMLElement): void;
    removeElement(parent: HTMLElement, cssSelector: string): void;
    removeFromParent(node: Element): void;
    isVisible(element: HTMLElement): boolean;
    loadTemplate(template: string): HTMLElement;
    appendHtml(eContainer: HTMLElement, htmlTemplate: string): void;
    getElementAttribute(element: any, attributeName: string): string;
    offsetHeight(element: HTMLElement): number;
    offsetWidth(element: HTMLElement): number;
    ensureDomOrder(eContainer: HTMLElement, eChild: HTMLElement, eChildBefore: HTMLElement): void;
    setDomChildOrder(eContainer: HTMLElement, orderedChildren: HTMLElement[]): void;
    insertTemplateWithDomOrder(eContainer: HTMLElement, htmlTemplate: string, eChildBefore: HTMLElement): HTMLElement;
    prependDC(parent: HTMLElement, documentFragment: DocumentFragment): void;
    addStylesToElement(eElement: any, styles: any): void;
    isHorizontalScrollShowing(element: HTMLElement): boolean;
    isVerticalScrollShowing(element: HTMLElement): boolean;
    setElementWidth(element: HTMLElement, width: string | number): void;
    setFixedWidth(element: HTMLElement, width: string | number): void;
    setElementHeight(element: HTMLElement, height: string | number): void;
    setFixedHeight(element: HTMLElement, height: string | number): void;
    formatSize(size: string | number): string;
    isNode(o: any): boolean;
    isElement(o: any): boolean;
    isNodeOrElement(o: any): boolean;
    copyNodeList(nodeList: NodeList): Node[];
    iterateNamedNodeMap(map: NamedNodeMap, callback: (key: string, value: string) => void): void;
    setCheckboxState(eCheckbox: HTMLInputElement, state: any): void;
    serialiseDate(date: Date, includeTime?: boolean, separator?: string): string;
    parseDateTimeFromString(value: string): Date;
    stringToArray(strData: string, delimiter?: string): string[][];
    isBrowserIE(): boolean;
    isBrowserEdge(): boolean;
    isBrowserSafari(): boolean;
    isBrowserChrome(): boolean;
    isBrowserFirefox(): boolean;
    isIOSUserAgent(): boolean;
    getMaxDivHeight(): number;
    getScrollbarWidth(): number;
    hasOverflowScrolling(): boolean;
    getBodyWidth(): number;
    getBodyHeight(): number;
    firstExistingValue<A>(...values: A[]): A;
    anyExists(values: any[]): boolean;
    existsAndNotEmpty<T_16>(value?: T_16[]): boolean;
    last<T_17>(arr: T_17[]): T_17;
    areEqual<T_18>(a: T_18[], b: T_18[], comparator?: (a: T_18, b: T_18) => boolean): boolean;
    compareArrays(array1?: any[], array2?: any[]): boolean;
    shallowCompare(arr1: any[], arr2: any[]): boolean;
    sortNumerically(array: number[]): number[];
    removeRepeatsFromArray<T_19>(array: T_19[], object: T_19): void;
    removeFromArray<T_20>(array: T_20[], object: T_20): void;
    removeAllFromArray<T_21>(array: T_21[], toRemove: T_21[]): void;
    insertIntoArray<T_22>(array: T_22[], object: T_22, toIndex: number): void;
    insertArrayIntoArray<T_23>(dest: T_23[], src: T_23[], toIndex: number): void;
    moveInArray<T_24>(array: T_24[], objectsToMove: T_24[], toIndex: number): void;
    includes<T_25>(array: T_25[], value: T_25): boolean;
    flatten(arrayOfArrays: any[]): any[];
    pushAll<T_26>(target: T_26[], source: T_26[]): void;
    toStrings<T_27>(array: T_27[]): string[];
    findIndex<T_28>(collection: T_28[], predicate: (item: T_28, idx: number, collection: T_28[]) => boolean): number;
    every<T_29>(list: T_29[], predicate: (value: T_29, index: number) => boolean): boolean;
    some<T_30>(list: T_30[], predicate: (value: T_30, index: number) => boolean): boolean;
    forEach<T_31>(list: T_31[], action: (value: T_31, index: number) => void): void;
    map<T_32, V>(list: T_32[], process: (value: T_32, index: number) => V): V[];
    filter<T_33>(list: T_33[], predicate: (value: T_33, index: number) => boolean): T_33[];
    reduce<T_34, V_1>(list: T_34[], step: (acc: V_1, value: T_34, index: number) => V_1, initial: V_1): V_1;
    forEachSnapshotFirst<T_35>(list: T_35[], callback: (item: T_35) => void): void;
    getNameOfClass(theClass: any): string;
    findLineByLeastSquares(values: number[]): any[];
    cssStyleObjectToMarkup(stylesToUse: any): string;
    message(msg: string): void;
    bindCellRendererToHtmlElement(cellRendererPromise: import("./promise").Promise<import("../main").ICellRendererComp>, eTarget: HTMLElement): void;
};
