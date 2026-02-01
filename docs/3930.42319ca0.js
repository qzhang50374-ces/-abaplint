"use strict";
(self["webpackChunkabaplint_playground"] = self["webpackChunkabaplint_playground"] || []).push([[3930,5996,6995],{

/***/ 8897
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   KC: () => (/* binding */ equalsIfDefined),
/* harmony export */   S3: () => (/* binding */ itemsEquals),
/* harmony export */   dB: () => (/* binding */ structuralEquals),
/* harmony export */   nx: () => (/* binding */ strictEquals),
/* harmony export */   r: () => (/* binding */ itemEquals)
/* harmony export */ });
/* harmony import */ var _arrays_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(13338);
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * Compares two items for equality using strict equality.
*/
const strictEquals = (a, b) => a === b;
/**
 * Checks if the items of two arrays are equal.
 * By default, strict equality is used to compare elements, but a custom equality comparer can be provided.
 */
function itemsEquals(itemEquals = strictEquals) {
    return (a, b) => _arrays_js__WEBPACK_IMPORTED_MODULE_0__/* .equals */ .aI(a, b, itemEquals);
}
/**
 * Uses `item.equals(other)` to determine equality.
 */
function itemEquals() {
    return (a, b) => a.equals(b);
}
function equalsIfDefined(equalsOrV1, v2, equals) {
    if (equals !== undefined) {
        const v1 = equalsOrV1;
        if (v1 === undefined || v1 === null || v2 === undefined || v2 === null) {
            return v2 === v1;
        }
        return equals(v1, v2);
    }
    else {
        const equals = equalsOrV1;
        return (v1, v2) => {
            if (v1 === undefined || v1 === null || v2 === undefined || v2 === null) {
                return v2 === v1;
            }
            return equals(v1, v2);
        };
    }
}
/**
 * Drills into arrays (items ordered) and objects (keys unordered) and uses strict equality on everything else.
*/
function structuralEquals(a, b) {
    if (a === b) {
        return true;
    }
    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) {
            return false;
        }
        for (let i = 0; i < a.length; i++) {
            if (!structuralEquals(a[i], b[i])) {
                return false;
            }
        }
        return true;
    }
    if (a && typeof a === 'object' && b && typeof b === 'object') {
        if (Object.getPrototypeOf(a) === Object.prototype && Object.getPrototypeOf(b) === Object.prototype) {
            const aObj = a;
            const bObj = b;
            const keysA = Object.keys(aObj);
            const keysB = Object.keys(bObj);
            const keysBSet = new Set(keysB);
            if (keysA.length !== keysB.length) {
                return false;
            }
            for (const key of keysA) {
                if (!keysBSet.has(key)) {
                    return false;
                }
                if (!structuralEquals(aObj[key], bObj[key])) {
                    return false;
                }
            }
            return true;
        }
    }
    return false;
}
const objIds = new WeakMap();


/***/ },

/***/ 12146
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   OI: () => (/* binding */ recomputeInitiallyAndOnChange),
/* harmony export */   Rl: () => (/* binding */ mapObservableArrayCached),
/* harmony export */   Yd: () => (/* binding */ observableSignal),
/* harmony export */   ZX: () => (/* binding */ derivedObservableWithCache),
/* harmony export */   eP: () => (/* binding */ observableFromEventOpts),
/* harmony export */   lk: () => (/* binding */ constObservable),
/* harmony export */   t: () => (/* binding */ derivedConstOnceDefined),
/* harmony export */   y0: () => (/* binding */ observableFromEvent),
/* harmony export */   yQ: () => (/* binding */ observableSignalFromEvent)
/* harmony export */ });
/* unused harmony exports FromEventObservable, keepObserved, KeepAliveObserver, derivedObservableWithWritableCache, ValueWithChangeEventFromObservable, observableFromValueWithChangeEvent */
/* harmony import */ var _event_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2106);
/* harmony import */ var _lifecycle_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(10998);
/* harmony import */ var _base_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(34442);
/* harmony import */ var _debugName_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(49855);
/* harmony import */ var _derived_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(18366);
/* harmony import */ var _logging_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(34950);
/* harmony import */ var _equals_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(8897);
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/







/**
 * Represents an efficient observable whose value never changes.
 */
function constObservable(value) {
    return new ConstObservable(value);
}
class ConstObservable extends _base_js__WEBPACK_IMPORTED_MODULE_2__/* .ConvenientObservable */ .zV {
    constructor(value) {
        super();
        this.value = value;
    }
    get debugName() {
        return this.toString();
    }
    get() {
        return this.value;
    }
    addObserver(observer) {
        // NO OP
    }
    removeObserver(observer) {
        // NO OP
    }
    toString() {
        return `Const: ${this.value}`;
    }
}
function observableFromEvent(...args) {
    let owner;
    let event;
    let getValue;
    if (args.length === 3) {
        [owner, event, getValue] = args;
    }
    else {
        [event, getValue] = args;
    }
    return new FromEventObservable(new _debugName_js__WEBPACK_IMPORTED_MODULE_3__/* .DebugNameData */ .nA(owner, undefined, getValue), event, getValue, () => FromEventObservable.globalTransaction, _equals_js__WEBPACK_IMPORTED_MODULE_6__/* .strictEquals */ .nx);
}
function observableFromEventOpts(options, event, getValue) {
    return new FromEventObservable(new _debugName_js__WEBPACK_IMPORTED_MODULE_3__/* .DebugNameData */ .nA(options.owner, options.debugName, options.debugReferenceFn ?? getValue), event, getValue, () => FromEventObservable.globalTransaction, options.equalsFn ?? _equals_js__WEBPACK_IMPORTED_MODULE_6__/* .strictEquals */ .nx);
}
class FromEventObservable extends _base_js__WEBPACK_IMPORTED_MODULE_2__/* .BaseObservable */ .ZK {
    constructor(_debugNameData, event, _getValue, _getTransaction, _equalityComparator) {
        super();
        this._debugNameData = _debugNameData;
        this.event = event;
        this._getValue = _getValue;
        this._getTransaction = _getTransaction;
        this._equalityComparator = _equalityComparator;
        this.hasValue = false;
        this.handleEvent = (args) => {
            const newValue = this._getValue(args);
            const oldValue = this.value;
            const didChange = !this.hasValue || !(this._equalityComparator(oldValue, newValue));
            let didRunTransaction = false;
            if (didChange) {
                this.value = newValue;
                if (this.hasValue) {
                    didRunTransaction = true;
                    (0,_base_js__WEBPACK_IMPORTED_MODULE_2__/* .subtransaction */ .PO)(this._getTransaction(), (tx) => {
                        (0,_logging_js__WEBPACK_IMPORTED_MODULE_5__/* .getLogger */ .tZ)()?.handleFromEventObservableTriggered(this, { oldValue, newValue, change: undefined, didChange, hadValue: this.hasValue });
                        for (const o of this.observers) {
                            tx.updateObserver(o, this);
                            o.handleChange(this, undefined);
                        }
                    }, () => {
                        const name = this.getDebugName();
                        return 'Event fired' + (name ? `: ${name}` : '');
                    });
                }
                this.hasValue = true;
            }
            if (!didRunTransaction) {
                (0,_logging_js__WEBPACK_IMPORTED_MODULE_5__/* .getLogger */ .tZ)()?.handleFromEventObservableTriggered(this, { oldValue, newValue, change: undefined, didChange, hadValue: this.hasValue });
            }
        };
    }
    getDebugName() {
        return this._debugNameData.getDebugName(this);
    }
    get debugName() {
        const name = this.getDebugName();
        return 'From Event' + (name ? `: ${name}` : '');
    }
    onFirstObserverAdded() {
        this.subscription = this.event(this.handleEvent);
    }
    onLastObserverRemoved() {
        this.subscription.dispose();
        this.subscription = undefined;
        this.hasValue = false;
        this.value = undefined;
    }
    get() {
        if (this.subscription) {
            if (!this.hasValue) {
                this.handleEvent(undefined);
            }
            return this.value;
        }
        else {
            // no cache, as there are no subscribers to keep it updated
            const value = this._getValue(undefined);
            return value;
        }
    }
}
(function (observableFromEvent) {
    observableFromEvent.Observer = FromEventObservable;
    function batchEventsGlobally(tx, fn) {
        let didSet = false;
        if (FromEventObservable.globalTransaction === undefined) {
            FromEventObservable.globalTransaction = tx;
            didSet = true;
        }
        try {
            fn();
        }
        finally {
            if (didSet) {
                FromEventObservable.globalTransaction = undefined;
            }
        }
    }
    observableFromEvent.batchEventsGlobally = batchEventsGlobally;
})(observableFromEvent || (observableFromEvent = {}));
function observableSignalFromEvent(debugName, event) {
    return new FromEventObservableSignal(debugName, event);
}
class FromEventObservableSignal extends _base_js__WEBPACK_IMPORTED_MODULE_2__/* .BaseObservable */ .ZK {
    constructor(debugName, event) {
        super();
        this.debugName = debugName;
        this.event = event;
        this.handleEvent = () => {
            (0,_base_js__WEBPACK_IMPORTED_MODULE_2__/* .transaction */ .Rn)((tx) => {
                for (const o of this.observers) {
                    tx.updateObserver(o, this);
                    o.handleChange(this, undefined);
                }
            }, () => this.debugName);
        };
    }
    onFirstObserverAdded() {
        this.subscription = this.event(this.handleEvent);
    }
    onLastObserverRemoved() {
        this.subscription.dispose();
        this.subscription = undefined;
    }
    get() {
        // NO OP
    }
}
function observableSignal(debugNameOrOwner) {
    if (typeof debugNameOrOwner === 'string') {
        return new ObservableSignal(debugNameOrOwner);
    }
    else {
        return new ObservableSignal(undefined, debugNameOrOwner);
    }
}
class ObservableSignal extends _base_js__WEBPACK_IMPORTED_MODULE_2__/* .BaseObservable */ .ZK {
    get debugName() {
        return new _debugName_js__WEBPACK_IMPORTED_MODULE_3__/* .DebugNameData */ .nA(this._owner, this._debugName, undefined).getDebugName(this) ?? 'Observable Signal';
    }
    toString() {
        return this.debugName;
    }
    constructor(_debugName, _owner) {
        super();
        this._debugName = _debugName;
        this._owner = _owner;
    }
    trigger(tx, change) {
        if (!tx) {
            (0,_base_js__WEBPACK_IMPORTED_MODULE_2__/* .transaction */ .Rn)(tx => {
                this.trigger(tx, change);
            }, () => `Trigger signal ${this.debugName}`);
            return;
        }
        for (const o of this.observers) {
            tx.updateObserver(o, this);
            o.handleChange(this, change);
        }
    }
    get() {
        // NO OP
    }
}
/**
 * This makes sure the observable is being observed and keeps its cache alive.
 */
function keepObserved(observable) {
    const o = new KeepAliveObserver(false, undefined);
    observable.addObserver(o);
    return (0,_lifecycle_js__WEBPACK_IMPORTED_MODULE_1__/* .toDisposable */ .s)(() => {
        observable.removeObserver(o);
    });
}
(0,_base_js__WEBPACK_IMPORTED_MODULE_2__/* ._setKeepObserved */ .FB)(keepObserved);
/**
 * This converts the given observable into an autorun.
 */
function recomputeInitiallyAndOnChange(observable, handleValue) {
    const o = new KeepAliveObserver(true, handleValue);
    observable.addObserver(o);
    if (handleValue) {
        handleValue(observable.get());
    }
    else {
        observable.reportChanges();
    }
    return (0,_lifecycle_js__WEBPACK_IMPORTED_MODULE_1__/* .toDisposable */ .s)(() => {
        observable.removeObserver(o);
    });
}
(0,_base_js__WEBPACK_IMPORTED_MODULE_2__/* ._setRecomputeInitiallyAndOnChange */ .Bm)(recomputeInitiallyAndOnChange);
class KeepAliveObserver {
    constructor(_forceRecompute, _handleValue) {
        this._forceRecompute = _forceRecompute;
        this._handleValue = _handleValue;
        this._counter = 0;
    }
    beginUpdate(observable) {
        this._counter++;
    }
    endUpdate(observable) {
        this._counter--;
        if (this._counter === 0 && this._forceRecompute) {
            if (this._handleValue) {
                this._handleValue(observable.get());
            }
            else {
                observable.reportChanges();
            }
        }
    }
    handlePossibleChange(observable) {
        // NO OP
    }
    handleChange(observable, change) {
        // NO OP
    }
}
function derivedObservableWithCache(owner, computeFn) {
    let lastValue = undefined;
    const observable = (0,_derived_js__WEBPACK_IMPORTED_MODULE_4__/* .derivedOpts */ .C)({ owner, debugReferenceFn: computeFn }, reader => {
        lastValue = computeFn(reader, lastValue);
        return lastValue;
    });
    return observable;
}
function derivedObservableWithWritableCache(owner, computeFn) {
    let lastValue = undefined;
    const onChange = observableSignal('derivedObservableWithWritableCache');
    const observable = derived(owner, reader => {
        onChange.read(reader);
        lastValue = computeFn(reader, lastValue);
        return lastValue;
    });
    return Object.assign(observable, {
        clearCache: (tx) => {
            lastValue = undefined;
            onChange.trigger(tx);
        },
        setCache: (newValue, tx) => {
            lastValue = newValue;
            onChange.trigger(tx);
        }
    });
}
/**
 * When the items array changes, referential equal items are not mapped again.
 */
function mapObservableArrayCached(owner, items, map, keySelector) {
    let m = new ArrayMap(map, keySelector);
    const self = (0,_derived_js__WEBPACK_IMPORTED_MODULE_4__/* .derivedOpts */ .C)({
        debugReferenceFn: map,
        owner,
        onLastObserverRemoved: () => {
            m.dispose();
            m = new ArrayMap(map);
        }
    }, (reader) => {
        m.setItems(items.read(reader));
        return m.getItems();
    });
    return self;
}
class ArrayMap {
    constructor(_map, _keySelector) {
        this._map = _map;
        this._keySelector = _keySelector;
        this._cache = new Map();
        this._items = [];
    }
    dispose() {
        this._cache.forEach(entry => entry.store.dispose());
        this._cache.clear();
    }
    setItems(items) {
        const newItems = [];
        const itemsToRemove = new Set(this._cache.keys());
        for (const item of items) {
            const key = this._keySelector ? this._keySelector(item) : item;
            let entry = this._cache.get(key);
            if (!entry) {
                const store = new _lifecycle_js__WEBPACK_IMPORTED_MODULE_1__/* .DisposableStore */ .Cm();
                const out = this._map(item, store);
                entry = { out, store };
                this._cache.set(key, entry);
            }
            else {
                itemsToRemove.delete(key);
            }
            newItems.push(entry.out);
        }
        for (const item of itemsToRemove) {
            const entry = this._cache.get(item);
            entry.store.dispose();
            this._cache.delete(item);
        }
        this._items = newItems;
    }
    getItems() {
        return this._items;
    }
}
class ValueWithChangeEventFromObservable {
    constructor(observable) {
        this.observable = observable;
    }
    get onDidChange() {
        return Event.fromObservableLight(this.observable);
    }
    get value() {
        return this.observable.get();
    }
}
function observableFromValueWithChangeEvent(owner, value) {
    if (value instanceof ValueWithChangeEventFromObservable) {
        return value.observable;
    }
    return observableFromEvent(owner, value.onDidChange, () => value.value);
}
/**
 * Works like a derived.
 * However, if the value is not undefined, it is cached and will not be recomputed anymore.
 * In that case, the derived will unsubscribe from its dependencies.
*/
function derivedConstOnceDefined(owner, fn) {
    return derivedObservableWithCache(owner, (reader, lastValue) => lastValue ?? fn(reader));
}


/***/ },

/***/ 16311
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  BK: () => (/* reexport */ ObservablePromise),
  fm: () => (/* reexport */ autorun),
  Y: () => (/* reexport */ autorunHandleChanges),
  zL: () => (/* reexport */ autorunOpts),
  yC: () => (/* reexport */ autorunWithStore),
  ht: () => (/* reexport */ autorunWithStoreHandleChanges),
  lk: () => (/* reexport */ utils/* constObservable */.lk),
  un: () => (/* reexport */ derived/* derived */.un),
  nb: () => (/* reexport */ derived/* derivedHandleChanges */.nb),
  ZX: () => (/* reexport */ utils/* derivedObservableWithCache */.ZX),
  C: () => (/* reexport */ derived/* derivedOpts */.C),
  rm: () => (/* reexport */ derived/* derivedWithStore */.rm),
  X2: () => (/* reexport */ base/* disposableObservableValue */.X2),
  y0: () => (/* reexport */ utils/* observableFromEvent */.y0),
  Yd: () => (/* reexport */ utils/* observableSignal */.Yd),
  yQ: () => (/* reexport */ utils/* observableSignalFromEvent */.yQ),
  FY: () => (/* reexport */ base/* observableValue */.FY),
  Zh: () => (/* reexport */ observableValueOpts),
  OI: () => (/* reexport */ utils/* recomputeInitiallyAndOnChange */.OI),
  PO: () => (/* reexport */ base/* subtransaction */.PO),
  Rn: () => (/* reexport */ base/* transaction */.Rn),
  oJ: () => (/* reexport */ waitForState)
});

// UNUSED EXPORTS: PromiseResult, derivedObservableWithWritableCache, keepObserved

// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/base/common/observableInternal/base.js
var base = __webpack_require__(34442);
// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/base/common/observableInternal/derived.js
var derived = __webpack_require__(18366);
// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/base/common/assert.js
var assert = __webpack_require__(87110);
// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/base/common/lifecycle.js
var lifecycle = __webpack_require__(10998);
// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/base/common/observableInternal/debugName.js
var debugName = __webpack_require__(49855);
// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/base/common/observableInternal/logging.js
var logging = __webpack_require__(34950);
;// ./node_modules/monaco-editor/esm/vs/base/common/observableInternal/autorun.js
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/




/**
 * Runs immediately and whenever a transaction ends and an observed observable changed.
 * {@link fn} should start with a JS Doc using `@description` to name the autorun.
 */
function autorun(fn) {
    return new AutorunObserver(new debugName/* DebugNameData */.nA(undefined, undefined, fn), fn, undefined, undefined);
}
/**
 * Runs immediately and whenever a transaction ends and an observed observable changed.
 * {@link fn} should start with a JS Doc using `@description` to name the autorun.
 */
function autorunOpts(options, fn) {
    return new AutorunObserver(new debugName/* DebugNameData */.nA(options.owner, options.debugName, options.debugReferenceFn ?? fn), fn, undefined, undefined);
}
/**
 * Runs immediately and whenever a transaction ends and an observed observable changed.
 * {@link fn} should start with a JS Doc using `@description` to name the autorun.
 *
 * Use `createEmptyChangeSummary` to create a "change summary" that can collect the changes.
 * Use `handleChange` to add a reported change to the change summary.
 * The run function is given the last change summary.
 * The change summary is discarded after the run function was called.
 *
 * @see autorun
 */
function autorunHandleChanges(options, fn) {
    return new AutorunObserver(new debugName/* DebugNameData */.nA(options.owner, options.debugName, options.debugReferenceFn ?? fn), fn, options.createEmptyChangeSummary, options.handleChange);
}
/**
 * @see autorunHandleChanges (but with a disposable store that is cleared before the next run or on dispose)
 */
function autorunWithStoreHandleChanges(options, fn) {
    const store = new lifecycle/* DisposableStore */.Cm();
    const disposable = autorunHandleChanges({
        owner: options.owner,
        debugName: options.debugName,
        debugReferenceFn: options.debugReferenceFn ?? fn,
        createEmptyChangeSummary: options.createEmptyChangeSummary,
        handleChange: options.handleChange,
    }, (reader, changeSummary) => {
        store.clear();
        fn(reader, changeSummary, store);
    });
    return (0,lifecycle/* toDisposable */.s)(() => {
        disposable.dispose();
        store.dispose();
    });
}
/**
 * @see autorun (but with a disposable store that is cleared before the next run or on dispose)
 */
function autorunWithStore(fn) {
    const store = new lifecycle/* DisposableStore */.Cm();
    const disposable = autorunOpts({
        owner: undefined,
        debugName: undefined,
        debugReferenceFn: fn,
    }, reader => {
        store.clear();
        fn(reader, store);
    });
    return (0,lifecycle/* toDisposable */.s)(() => {
        disposable.dispose();
        store.dispose();
    });
}
class AutorunObserver {
    get debugName() {
        return this._debugNameData.getDebugName(this) ?? '(anonymous)';
    }
    constructor(_debugNameData, _runFn, createChangeSummary, _handleChange) {
        this._debugNameData = _debugNameData;
        this._runFn = _runFn;
        this.createChangeSummary = createChangeSummary;
        this._handleChange = _handleChange;
        this.state = 2 /* AutorunState.stale */;
        this.updateCount = 0;
        this.disposed = false;
        this.dependencies = new Set();
        this.dependenciesToBeRemoved = new Set();
        this.changeSummary = this.createChangeSummary?.();
        (0,logging/* getLogger */.tZ)()?.handleAutorunCreated(this);
        this._runIfNeeded();
        (0,lifecycle/* trackDisposable */.Ay)(this);
    }
    dispose() {
        this.disposed = true;
        for (const o of this.dependencies) {
            o.removeObserver(this);
        }
        this.dependencies.clear();
        (0,lifecycle/* markAsDisposed */.VD)(this);
    }
    _runIfNeeded() {
        if (this.state === 3 /* AutorunState.upToDate */) {
            return;
        }
        const emptySet = this.dependenciesToBeRemoved;
        this.dependenciesToBeRemoved = this.dependencies;
        this.dependencies = emptySet;
        this.state = 3 /* AutorunState.upToDate */;
        const isDisposed = this.disposed;
        try {
            if (!isDisposed) {
                (0,logging/* getLogger */.tZ)()?.handleAutorunTriggered(this);
                const changeSummary = this.changeSummary;
                this.changeSummary = this.createChangeSummary?.();
                this._runFn(this, changeSummary);
            }
        }
        finally {
            if (!isDisposed) {
                (0,logging/* getLogger */.tZ)()?.handleAutorunFinished(this);
            }
            // We don't want our observed observables to think that they are (not even temporarily) not being observed.
            // Thus, we only unsubscribe from observables that are definitely not read anymore.
            for (const o of this.dependenciesToBeRemoved) {
                o.removeObserver(this);
            }
            this.dependenciesToBeRemoved.clear();
        }
    }
    toString() {
        return `Autorun<${this.debugName}>`;
    }
    // IObserver implementation
    beginUpdate() {
        if (this.state === 3 /* AutorunState.upToDate */) {
            this.state = 1 /* AutorunState.dependenciesMightHaveChanged */;
        }
        this.updateCount++;
    }
    endUpdate() {
        if (this.updateCount === 1) {
            do {
                if (this.state === 1 /* AutorunState.dependenciesMightHaveChanged */) {
                    this.state = 3 /* AutorunState.upToDate */;
                    for (const d of this.dependencies) {
                        d.reportChanges();
                        if (this.state === 2 /* AutorunState.stale */) {
                            // The other dependencies will refresh on demand
                            break;
                        }
                    }
                }
                this._runIfNeeded();
            } while (this.state !== 3 /* AutorunState.upToDate */);
        }
        this.updateCount--;
        (0,assert/* assertFn */.Ft)(() => this.updateCount >= 0);
    }
    handlePossibleChange(observable) {
        if (this.state === 3 /* AutorunState.upToDate */ && this.dependencies.has(observable) && !this.dependenciesToBeRemoved.has(observable)) {
            this.state = 1 /* AutorunState.dependenciesMightHaveChanged */;
        }
    }
    handleChange(observable, change) {
        if (this.dependencies.has(observable) && !this.dependenciesToBeRemoved.has(observable)) {
            const shouldReact = this._handleChange ? this._handleChange({
                changedObservable: observable,
                change,
                didChange: (o) => o === observable,
            }, this.changeSummary) : true;
            if (shouldReact) {
                this.state = 2 /* AutorunState.stale */;
            }
        }
    }
    // IReader implementation
    readObservable(observable) {
        // In case the run action disposes the autorun
        if (this.disposed) {
            return observable.get();
        }
        observable.addObserver(this);
        const value = observable.get();
        this.dependencies.add(observable);
        this.dependenciesToBeRemoved.delete(observable);
        return value;
    }
}
(function (autorun) {
    autorun.Observer = AutorunObserver;
})(autorun || (autorun = {}));

// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/base/common/observableInternal/utils.js
var utils = __webpack_require__(12146);
// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/base/common/errors.js
var errors = __webpack_require__(94327);
;// ./node_modules/monaco-editor/esm/vs/base/common/observableInternal/promise.js
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/



/**
 * A promise whose state is observable.
 */
class ObservablePromise {
    static fromFn(fn) {
        return new ObservablePromise(fn());
    }
    constructor(promise) {
        this._value = (0,base/* observableValue */.FY)(this, undefined);
        /**
         * The current state of the promise.
         * Is `undefined` if the promise didn't resolve yet.
         */
        this.promiseResult = this._value;
        this.promise = promise.then(value => {
            (0,base/* transaction */.Rn)(tx => {
                /** @description onPromiseResolved */
                this._value.set(new PromiseResult(value, undefined), tx);
            });
            return value;
        }, error => {
            (0,base/* transaction */.Rn)(tx => {
                /** @description onPromiseRejected */
                this._value.set(new PromiseResult(undefined, error), tx);
            });
            throw error;
        });
    }
}
class PromiseResult {
    constructor(
    /**
     * The value of the resolved promise.
     * Undefined if the promise rejected.
     */
    data, 
    /**
     * The error in case of a rejected promise.
     * Undefined if the promise resolved.
     */
    error) {
        this.data = data;
        this.error = error;
    }
}
function waitForState(observable, predicate, isError, cancellationToken) {
    if (!predicate) {
        predicate = state => state !== null && state !== undefined;
    }
    return new Promise((resolve, reject) => {
        let isImmediateRun = true;
        let shouldDispose = false;
        const stateObs = observable.map(state => {
            /** @description waitForState.state */
            return {
                isFinished: predicate(state),
                error: isError ? isError(state) : false,
                state
            };
        });
        const d = autorun(reader => {
            /** @description waitForState */
            const { isFinished, error, state } = stateObs.read(reader);
            if (isFinished || error) {
                if (isImmediateRun) {
                    // The variable `d` is not initialized yet
                    shouldDispose = true;
                }
                else {
                    d.dispose();
                }
                if (error) {
                    reject(error === true ? state : error);
                }
                else {
                    resolve(state);
                }
            }
        });
        if (cancellationToken) {
            const dc = cancellationToken.onCancellationRequested(() => {
                d.dispose();
                dc.dispose();
                reject(new errors/* CancellationError */.AL());
            });
            if (cancellationToken.isCancellationRequested) {
                d.dispose();
                dc.dispose();
                reject(new errors/* CancellationError */.AL());
                return;
            }
        }
        isImmediateRun = false;
        if (shouldDispose) {
            d.dispose();
        }
    });
}

// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/base/common/equals.js
var equals = __webpack_require__(8897);
;// ./node_modules/monaco-editor/esm/vs/base/common/observableInternal/lazyObservableValue.js
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * Holds off updating observers until the value is actually read.
*/
class LazyObservableValue extends base/* BaseObservable */.ZK {
    get debugName() {
        return this._debugNameData.getDebugName(this) ?? 'LazyObservableValue';
    }
    constructor(_debugNameData, initialValue, _equalityComparator) {
        super();
        this._debugNameData = _debugNameData;
        this._equalityComparator = _equalityComparator;
        this._isUpToDate = true;
        this._deltas = [];
        this._updateCounter = 0;
        this._value = initialValue;
    }
    get() {
        this._update();
        return this._value;
    }
    _update() {
        if (this._isUpToDate) {
            return;
        }
        this._isUpToDate = true;
        if (this._deltas.length > 0) {
            for (const observer of this.observers) {
                for (const change of this._deltas) {
                    observer.handleChange(this, change);
                }
            }
            this._deltas.length = 0;
        }
        else {
            for (const observer of this.observers) {
                observer.handleChange(this, undefined);
            }
        }
    }
    _beginUpdate() {
        this._updateCounter++;
        if (this._updateCounter === 1) {
            for (const observer of this.observers) {
                observer.beginUpdate(this);
            }
        }
    }
    _endUpdate() {
        this._updateCounter--;
        if (this._updateCounter === 0) {
            this._update();
            // End update could change the observer list.
            const observers = [...this.observers];
            for (const r of observers) {
                r.endUpdate(this);
            }
        }
    }
    addObserver(observer) {
        const shouldCallBeginUpdate = !this.observers.has(observer) && this._updateCounter > 0;
        super.addObserver(observer);
        if (shouldCallBeginUpdate) {
            observer.beginUpdate(this);
        }
    }
    removeObserver(observer) {
        const shouldCallEndUpdate = this.observers.has(observer) && this._updateCounter > 0;
        super.removeObserver(observer);
        if (shouldCallEndUpdate) {
            // Calling end update after removing the observer makes sure endUpdate cannot be called twice here.
            observer.endUpdate(this);
        }
    }
    set(value, tx, change) {
        if (change === undefined && this._equalityComparator(this._value, value)) {
            return;
        }
        let _tx;
        if (!tx) {
            tx = _tx = new base/* TransactionImpl */.XL(() => { }, () => `Setting ${this.debugName}`);
        }
        try {
            this._isUpToDate = false;
            this._setValue(value);
            if (change !== undefined) {
                this._deltas.push(change);
            }
            tx.updateObserver({
                beginUpdate: () => this._beginUpdate(),
                endUpdate: () => this._endUpdate(),
                handleChange: (observable, change) => { },
                handlePossibleChange: (observable) => { },
            }, this);
            if (this._updateCounter > 1) {
                // We already started begin/end update, so we need to manually call handlePossibleChange
                for (const observer of this.observers) {
                    observer.handlePossibleChange(this);
                }
            }
        }
        finally {
            if (_tx) {
                _tx.finish();
            }
        }
    }
    toString() {
        return `${this.debugName}: ${this._value}`;
    }
    _setValue(newValue) {
        this._value = newValue;
    }
}

;// ./node_modules/monaco-editor/esm/vs/base/common/observableInternal/api.js
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/




function observableValueOpts(options, initialValue) {
    if (options.lazy) {
        return new LazyObservableValue(new debugName/* DebugNameData */.nA(options.owner, options.debugName, undefined), initialValue, options.equalsFn ?? equals/* strictEquals */.nx);
    }
    return new base/* ObservableValue */.Lj(new debugName/* DebugNameData */.nA(options.owner, options.debugName, undefined), initialValue, options.equalsFn ?? equals/* strictEquals */.nx);
}

;// ./node_modules/monaco-editor/esm/vs/base/common/observable.js
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/







// Remove "//" in the next line to enable logging
const enableLogging = false;
if (enableLogging) {
    (0,logging/* setLogger */.Br)(new logging/* ConsoleObservableLogger */.jm());
}


/***/ },

/***/ 18366
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   C: () => (/* binding */ derivedOpts),
/* harmony export */   a0: () => (/* binding */ derivedDisposable),
/* harmony export */   dQ: () => (/* binding */ derivedWithSetter),
/* harmony export */   nb: () => (/* binding */ derivedHandleChanges),
/* harmony export */   rm: () => (/* binding */ derivedWithStore),
/* harmony export */   un: () => (/* binding */ derived)
/* harmony export */ });
/* unused harmony exports Derived, DerivedWithSetter */
/* harmony import */ var _assert_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(87110);
/* harmony import */ var _equals_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8897);
/* harmony import */ var _lifecycle_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(10998);
/* harmony import */ var _base_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(34442);
/* harmony import */ var _debugName_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(49855);
/* harmony import */ var _logging_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(34950);
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/






function derived(computeFnOrOwner, computeFn) {
    if (computeFn !== undefined) {
        return new Derived(new _debugName_js__WEBPACK_IMPORTED_MODULE_4__/* .DebugNameData */ .nA(computeFnOrOwner, undefined, computeFn), computeFn, undefined, undefined, undefined, _equals_js__WEBPACK_IMPORTED_MODULE_1__/* .strictEquals */ .nx);
    }
    return new Derived(new _debugName_js__WEBPACK_IMPORTED_MODULE_4__/* .DebugNameData */ .nA(undefined, undefined, computeFnOrOwner), computeFnOrOwner, undefined, undefined, undefined, _equals_js__WEBPACK_IMPORTED_MODULE_1__/* .strictEquals */ .nx);
}
function derivedWithSetter(owner, computeFn, setter) {
    return new DerivedWithSetter(new _debugName_js__WEBPACK_IMPORTED_MODULE_4__/* .DebugNameData */ .nA(owner, undefined, computeFn), computeFn, undefined, undefined, undefined, _equals_js__WEBPACK_IMPORTED_MODULE_1__/* .strictEquals */ .nx, setter);
}
function derivedOpts(options, computeFn) {
    return new Derived(new _debugName_js__WEBPACK_IMPORTED_MODULE_4__/* .DebugNameData */ .nA(options.owner, options.debugName, options.debugReferenceFn), computeFn, undefined, undefined, options.onLastObserverRemoved, options.equalsFn ?? _equals_js__WEBPACK_IMPORTED_MODULE_1__/* .strictEquals */ .nx);
}
(0,_base_js__WEBPACK_IMPORTED_MODULE_3__/* ._setDerivedOpts */ .N2)(derivedOpts);
/**
 * Represents an observable that is derived from other observables.
 * The value is only recomputed when absolutely needed.
 *
 * {@link computeFn} should start with a JS Doc using `@description` to name the derived.
 *
 * Use `createEmptyChangeSummary` to create a "change summary" that can collect the changes.
 * Use `handleChange` to add a reported change to the change summary.
 * The compute function is given the last change summary.
 * The change summary is discarded after the compute function was called.
 *
 * @see derived
 */
function derivedHandleChanges(options, computeFn) {
    return new Derived(new _debugName_js__WEBPACK_IMPORTED_MODULE_4__/* .DebugNameData */ .nA(options.owner, options.debugName, undefined), computeFn, options.createEmptyChangeSummary, options.handleChange, undefined, options.equalityComparer ?? _equals_js__WEBPACK_IMPORTED_MODULE_1__/* .strictEquals */ .nx);
}
function derivedWithStore(computeFnOrOwner, computeFnOrUndefined) {
    let computeFn;
    let owner;
    if (computeFnOrUndefined === undefined) {
        computeFn = computeFnOrOwner;
        owner = undefined;
    }
    else {
        owner = computeFnOrOwner;
        computeFn = computeFnOrUndefined;
    }
    const store = new _lifecycle_js__WEBPACK_IMPORTED_MODULE_2__/* .DisposableStore */ .Cm();
    return new Derived(new _debugName_js__WEBPACK_IMPORTED_MODULE_4__/* .DebugNameData */ .nA(owner, undefined, computeFn), r => {
        store.clear();
        return computeFn(r, store);
    }, undefined, undefined, () => store.dispose(), _equals_js__WEBPACK_IMPORTED_MODULE_1__/* .strictEquals */ .nx);
}
function derivedDisposable(computeFnOrOwner, computeFnOrUndefined) {
    let computeFn;
    let owner;
    if (computeFnOrUndefined === undefined) {
        computeFn = computeFnOrOwner;
        owner = undefined;
    }
    else {
        owner = computeFnOrOwner;
        computeFn = computeFnOrUndefined;
    }
    let store = undefined;
    return new Derived(new _debugName_js__WEBPACK_IMPORTED_MODULE_4__/* .DebugNameData */ .nA(owner, undefined, computeFn), r => {
        if (!store) {
            store = new _lifecycle_js__WEBPACK_IMPORTED_MODULE_2__/* .DisposableStore */ .Cm();
        }
        else {
            store.clear();
        }
        const result = computeFn(r);
        if (result) {
            store.add(result);
        }
        return result;
    }, undefined, undefined, () => {
        if (store) {
            store.dispose();
            store = undefined;
        }
    }, _equals_js__WEBPACK_IMPORTED_MODULE_1__/* .strictEquals */ .nx);
}
class Derived extends _base_js__WEBPACK_IMPORTED_MODULE_3__/* .BaseObservable */ .ZK {
    get debugName() {
        return this._debugNameData.getDebugName(this) ?? '(anonymous)';
    }
    constructor(_debugNameData, _computeFn, createChangeSummary, _handleChange, _handleLastObserverRemoved = undefined, _equalityComparator) {
        super();
        this._debugNameData = _debugNameData;
        this._computeFn = _computeFn;
        this.createChangeSummary = createChangeSummary;
        this._handleChange = _handleChange;
        this._handleLastObserverRemoved = _handleLastObserverRemoved;
        this._equalityComparator = _equalityComparator;
        this.state = 0 /* DerivedState.initial */;
        this.value = undefined;
        this.updateCount = 0;
        this.dependencies = new Set();
        this.dependenciesToBeRemoved = new Set();
        this.changeSummary = undefined;
        this.changeSummary = this.createChangeSummary?.();
        (0,_logging_js__WEBPACK_IMPORTED_MODULE_5__/* .getLogger */ .tZ)()?.handleDerivedCreated(this);
    }
    onLastObserverRemoved() {
        /**
         * We are not tracking changes anymore, thus we have to assume
         * that our cache is invalid.
         */
        this.state = 0 /* DerivedState.initial */;
        this.value = undefined;
        for (const d of this.dependencies) {
            d.removeObserver(this);
        }
        this.dependencies.clear();
        this._handleLastObserverRemoved?.();
    }
    get() {
        if (this.observers.size === 0) {
            // Without observers, we don't know when to clean up stuff.
            // Thus, we don't cache anything to prevent memory leaks.
            const result = this._computeFn(this, this.createChangeSummary?.());
            // Clear new dependencies
            this.onLastObserverRemoved();
            return result;
        }
        else {
            do {
                // We might not get a notification for a dependency that changed while it is updating,
                // thus we also have to ask all our depedencies if they changed in this case.
                if (this.state === 1 /* DerivedState.dependenciesMightHaveChanged */) {
                    for (const d of this.dependencies) {
                        /** might call {@link handleChange} indirectly, which could make us stale */
                        d.reportChanges();
                        if (this.state === 2 /* DerivedState.stale */) {
                            // The other dependencies will refresh on demand, so early break
                            break;
                        }
                    }
                }
                // We called report changes of all dependencies.
                // If we are still not stale, we can assume to be up to date again.
                if (this.state === 1 /* DerivedState.dependenciesMightHaveChanged */) {
                    this.state = 3 /* DerivedState.upToDate */;
                }
                this._recomputeIfNeeded();
                // In case recomputation changed one of our dependencies, we need to recompute again.
            } while (this.state !== 3 /* DerivedState.upToDate */);
            return this.value;
        }
    }
    _recomputeIfNeeded() {
        if (this.state === 3 /* DerivedState.upToDate */) {
            return;
        }
        const emptySet = this.dependenciesToBeRemoved;
        this.dependenciesToBeRemoved = this.dependencies;
        this.dependencies = emptySet;
        const hadValue = this.state !== 0 /* DerivedState.initial */;
        const oldValue = this.value;
        this.state = 3 /* DerivedState.upToDate */;
        const changeSummary = this.changeSummary;
        this.changeSummary = this.createChangeSummary?.();
        try {
            /** might call {@link handleChange} indirectly, which could invalidate us */
            this.value = this._computeFn(this, changeSummary);
        }
        finally {
            // We don't want our observed observables to think that they are (not even temporarily) not being observed.
            // Thus, we only unsubscribe from observables that are definitely not read anymore.
            for (const o of this.dependenciesToBeRemoved) {
                o.removeObserver(this);
            }
            this.dependenciesToBeRemoved.clear();
        }
        const didChange = hadValue && !(this._equalityComparator(oldValue, this.value));
        (0,_logging_js__WEBPACK_IMPORTED_MODULE_5__/* .getLogger */ .tZ)()?.handleDerivedRecomputed(this, {
            oldValue,
            newValue: this.value,
            change: undefined,
            didChange,
            hadValue,
        });
        if (didChange) {
            for (const r of this.observers) {
                r.handleChange(this, undefined);
            }
        }
    }
    toString() {
        return `LazyDerived<${this.debugName}>`;
    }
    // IObserver Implementation
    beginUpdate(_observable) {
        this.updateCount++;
        const propagateBeginUpdate = this.updateCount === 1;
        if (this.state === 3 /* DerivedState.upToDate */) {
            this.state = 1 /* DerivedState.dependenciesMightHaveChanged */;
            // If we propagate begin update, that will already signal a possible change.
            if (!propagateBeginUpdate) {
                for (const r of this.observers) {
                    r.handlePossibleChange(this);
                }
            }
        }
        if (propagateBeginUpdate) {
            for (const r of this.observers) {
                r.beginUpdate(this); // This signals a possible change
            }
        }
    }
    endUpdate(_observable) {
        this.updateCount--;
        if (this.updateCount === 0) {
            // End update could change the observer list.
            const observers = [...this.observers];
            for (const r of observers) {
                r.endUpdate(this);
            }
        }
        (0,_assert_js__WEBPACK_IMPORTED_MODULE_0__/* .assertFn */ .Ft)(() => this.updateCount >= 0);
    }
    handlePossibleChange(observable) {
        // In all other states, observers already know that we might have changed.
        if (this.state === 3 /* DerivedState.upToDate */ && this.dependencies.has(observable) && !this.dependenciesToBeRemoved.has(observable)) {
            this.state = 1 /* DerivedState.dependenciesMightHaveChanged */;
            for (const r of this.observers) {
                r.handlePossibleChange(this);
            }
        }
    }
    handleChange(observable, change) {
        if (this.dependencies.has(observable) && !this.dependenciesToBeRemoved.has(observable)) {
            const shouldReact = this._handleChange ? this._handleChange({
                changedObservable: observable,
                change,
                didChange: (o) => o === observable,
            }, this.changeSummary) : true;
            const wasUpToDate = this.state === 3 /* DerivedState.upToDate */;
            if (shouldReact && (this.state === 1 /* DerivedState.dependenciesMightHaveChanged */ || wasUpToDate)) {
                this.state = 2 /* DerivedState.stale */;
                if (wasUpToDate) {
                    for (const r of this.observers) {
                        r.handlePossibleChange(this);
                    }
                }
            }
        }
    }
    // IReader Implementation
    readObservable(observable) {
        // Subscribe before getting the value to enable caching
        observable.addObserver(this);
        /** This might call {@link handleChange} indirectly, which could invalidate us */
        const value = observable.get();
        // Which is why we only add the observable to the dependencies now.
        this.dependencies.add(observable);
        this.dependenciesToBeRemoved.delete(observable);
        return value;
    }
    addObserver(observer) {
        const shouldCallBeginUpdate = !this.observers.has(observer) && this.updateCount > 0;
        super.addObserver(observer);
        if (shouldCallBeginUpdate) {
            observer.beginUpdate(this);
        }
    }
    removeObserver(observer) {
        const shouldCallEndUpdate = this.observers.has(observer) && this.updateCount > 0;
        super.removeObserver(observer);
        if (shouldCallEndUpdate) {
            // Calling end update after removing the observer makes sure endUpdate cannot be called twice here.
            observer.endUpdate(this);
        }
    }
}
class DerivedWithSetter extends Derived {
    constructor(debugNameData, computeFn, createChangeSummary, handleChange, handleLastObserverRemoved = undefined, equalityComparator, set) {
        super(debugNameData, computeFn, createChangeSummary, handleChange, handleLastObserverRemoved, equalityComparator);
        this.set = set;
    }
}


/***/ },

/***/ 22467
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   B6: () => (/* binding */ DataUri),
/* harmony export */   Fd: () => (/* binding */ normalizePath),
/* harmony export */   LC: () => (/* binding */ extname),
/* harmony export */   P8: () => (/* binding */ basename),
/* harmony export */   Pi: () => (/* binding */ basenameOrAuthority),
/* harmony export */   er: () => (/* binding */ extUri),
/* harmony export */   iZ: () => (/* binding */ relativePath),
/* harmony export */   n4: () => (/* binding */ isEqual),
/* harmony export */   o1: () => (/* binding */ resolvePath),
/* harmony export */   pD: () => (/* binding */ dirname),
/* harmony export */   su: () => (/* binding */ originalFSPath),
/* harmony export */   uJ: () => (/* binding */ joinPath)
/* harmony export */ });
/* unused harmony exports ExtUri, extUriBiasedIgnorePathCase, extUriIgnorePathCase, isEqualOrParent, getComparisonKey, isAbsolutePath, isEqualAuthority, hasTrailingPathSeparator, removeTrailingPathSeparator, addTrailingPathSeparator */
/* harmony import */ var _extpath_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(78518);
/* harmony import */ var _network_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(13072);
/* harmony import */ var _path_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(18019);
/* harmony import */ var _platform_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(63339);
/* harmony import */ var _strings_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(16844);
/* harmony import */ var _uri_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(37264);
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/






function originalFSPath(uri) {
    return (0,_uri_js__WEBPACK_IMPORTED_MODULE_5__/* .uriToFsPath */ .I)(uri, true);
}
class ExtUri {
    constructor(_ignorePathCasing) {
        this._ignorePathCasing = _ignorePathCasing;
    }
    compare(uri1, uri2, ignoreFragment = false) {
        if (uri1 === uri2) {
            return 0;
        }
        return (0,_strings_js__WEBPACK_IMPORTED_MODULE_4__/* .compare */ .UD)(this.getComparisonKey(uri1, ignoreFragment), this.getComparisonKey(uri2, ignoreFragment));
    }
    isEqual(uri1, uri2, ignoreFragment = false) {
        if (uri1 === uri2) {
            return true;
        }
        if (!uri1 || !uri2) {
            return false;
        }
        return this.getComparisonKey(uri1, ignoreFragment) === this.getComparisonKey(uri2, ignoreFragment);
    }
    getComparisonKey(uri, ignoreFragment = false) {
        return uri.with({
            path: this._ignorePathCasing(uri) ? uri.path.toLowerCase() : undefined,
            fragment: ignoreFragment ? null : undefined
        }).toString();
    }
    isEqualOrParent(base, parentCandidate, ignoreFragment = false) {
        if (base.scheme === parentCandidate.scheme) {
            if (base.scheme === _network_js__WEBPACK_IMPORTED_MODULE_1__/* .Schemas */ .ny.file) {
                return _extpath_js__WEBPACK_IMPORTED_MODULE_0__/* .isEqualOrParent */ ._1(originalFSPath(base), originalFSPath(parentCandidate), this._ignorePathCasing(base)) && base.query === parentCandidate.query && (ignoreFragment || base.fragment === parentCandidate.fragment);
            }
            if (isEqualAuthority(base.authority, parentCandidate.authority)) {
                return _extpath_js__WEBPACK_IMPORTED_MODULE_0__/* .isEqualOrParent */ ._1(base.path, parentCandidate.path, this._ignorePathCasing(base), '/') && base.query === parentCandidate.query && (ignoreFragment || base.fragment === parentCandidate.fragment);
            }
        }
        return false;
    }
    // --- path math
    joinPath(resource, ...pathFragment) {
        return _uri_js__WEBPACK_IMPORTED_MODULE_5__/* .URI */ .r.joinPath(resource, ...pathFragment);
    }
    basenameOrAuthority(resource) {
        return basename(resource) || resource.authority;
    }
    basename(resource) {
        return _path_js__WEBPACK_IMPORTED_MODULE_2__/* .posix */ .SA.basename(resource.path);
    }
    extname(resource) {
        return _path_js__WEBPACK_IMPORTED_MODULE_2__/* .posix */ .SA.extname(resource.path);
    }
    dirname(resource) {
        if (resource.path.length === 0) {
            return resource;
        }
        let dirname;
        if (resource.scheme === _network_js__WEBPACK_IMPORTED_MODULE_1__/* .Schemas */ .ny.file) {
            dirname = _uri_js__WEBPACK_IMPORTED_MODULE_5__/* .URI */ .r.file(_path_js__WEBPACK_IMPORTED_MODULE_2__/* .dirname */ .pD(originalFSPath(resource))).path;
        }
        else {
            dirname = _path_js__WEBPACK_IMPORTED_MODULE_2__/* .posix */ .SA.dirname(resource.path);
            if (resource.authority && dirname.length && dirname.charCodeAt(0) !== 47 /* CharCode.Slash */) {
                console.error(`dirname("${resource.toString})) resulted in a relative path`);
                dirname = '/'; // If a URI contains an authority component, then the path component must either be empty or begin with a CharCode.Slash ("/") character
            }
        }
        return resource.with({
            path: dirname
        });
    }
    normalizePath(resource) {
        if (!resource.path.length) {
            return resource;
        }
        let normalizedPath;
        if (resource.scheme === _network_js__WEBPACK_IMPORTED_MODULE_1__/* .Schemas */ .ny.file) {
            normalizedPath = _uri_js__WEBPACK_IMPORTED_MODULE_5__/* .URI */ .r.file(_path_js__WEBPACK_IMPORTED_MODULE_2__/* .normalize */ .S8(originalFSPath(resource))).path;
        }
        else {
            normalizedPath = _path_js__WEBPACK_IMPORTED_MODULE_2__/* .posix */ .SA.normalize(resource.path);
        }
        return resource.with({
            path: normalizedPath
        });
    }
    relativePath(from, to) {
        if (from.scheme !== to.scheme || !isEqualAuthority(from.authority, to.authority)) {
            return undefined;
        }
        if (from.scheme === _network_js__WEBPACK_IMPORTED_MODULE_1__/* .Schemas */ .ny.file) {
            const relativePath = _path_js__WEBPACK_IMPORTED_MODULE_2__/* .relative */ .V8(originalFSPath(from), originalFSPath(to));
            return _platform_js__WEBPACK_IMPORTED_MODULE_3__/* .isWindows */ .uF ? _extpath_js__WEBPACK_IMPORTED_MODULE_0__/* .toSlashes */ .TH(relativePath) : relativePath;
        }
        let fromPath = from.path || '/';
        const toPath = to.path || '/';
        if (this._ignorePathCasing(from)) {
            // make casing of fromPath match toPath
            let i = 0;
            for (const len = Math.min(fromPath.length, toPath.length); i < len; i++) {
                if (fromPath.charCodeAt(i) !== toPath.charCodeAt(i)) {
                    if (fromPath.charAt(i).toLowerCase() !== toPath.charAt(i).toLowerCase()) {
                        break;
                    }
                }
            }
            fromPath = toPath.substr(0, i) + fromPath.substr(i);
        }
        return _path_js__WEBPACK_IMPORTED_MODULE_2__/* .posix */ .SA.relative(fromPath, toPath);
    }
    resolvePath(base, path) {
        if (base.scheme === _network_js__WEBPACK_IMPORTED_MODULE_1__/* .Schemas */ .ny.file) {
            const newURI = _uri_js__WEBPACK_IMPORTED_MODULE_5__/* .URI */ .r.file(_path_js__WEBPACK_IMPORTED_MODULE_2__/* .resolve */ .hd(originalFSPath(base), path));
            return base.with({
                authority: newURI.authority,
                path: newURI.path
            });
        }
        path = _extpath_js__WEBPACK_IMPORTED_MODULE_0__/* .toPosixPath */ .kb(path); // we allow path to be a windows path
        return base.with({
            path: _path_js__WEBPACK_IMPORTED_MODULE_2__/* .posix */ .SA.resolve(base.path, path)
        });
    }
    // --- misc
    isAbsolutePath(resource) {
        return !!resource.path && resource.path[0] === '/';
    }
    isEqualAuthority(a1, a2) {
        return a1 === a2 || (a1 !== undefined && a2 !== undefined && (0,_strings_js__WEBPACK_IMPORTED_MODULE_4__/* .equalsIgnoreCase */ .Q_)(a1, a2));
    }
    hasTrailingPathSeparator(resource, sep = _path_js__WEBPACK_IMPORTED_MODULE_2__/* .sep */ .Vn) {
        if (resource.scheme === _network_js__WEBPACK_IMPORTED_MODULE_1__/* .Schemas */ .ny.file) {
            const fsp = originalFSPath(resource);
            return fsp.length > _extpath_js__WEBPACK_IMPORTED_MODULE_0__/* .getRoot */ .Zn(fsp).length && fsp[fsp.length - 1] === sep;
        }
        else {
            const p = resource.path;
            return (p.length > 1 && p.charCodeAt(p.length - 1) === 47 /* CharCode.Slash */) && !(/^[a-zA-Z]:(\/$|\\$)/.test(resource.fsPath)); // ignore the slash at offset 0
        }
    }
    removeTrailingPathSeparator(resource, sep = _path_js__WEBPACK_IMPORTED_MODULE_2__/* .sep */ .Vn) {
        // Make sure that the path isn't a drive letter. A trailing separator there is not removable.
        if (hasTrailingPathSeparator(resource, sep)) {
            return resource.with({ path: resource.path.substr(0, resource.path.length - 1) });
        }
        return resource;
    }
    addTrailingPathSeparator(resource, sep = _path_js__WEBPACK_IMPORTED_MODULE_2__/* .sep */ .Vn) {
        let isRootSep = false;
        if (resource.scheme === _network_js__WEBPACK_IMPORTED_MODULE_1__/* .Schemas */ .ny.file) {
            const fsp = originalFSPath(resource);
            isRootSep = ((fsp !== undefined) && (fsp.length === _extpath_js__WEBPACK_IMPORTED_MODULE_0__/* .getRoot */ .Zn(fsp).length) && (fsp[fsp.length - 1] === sep));
        }
        else {
            sep = '/';
            const p = resource.path;
            isRootSep = p.length === 1 && p.charCodeAt(p.length - 1) === 47 /* CharCode.Slash */;
        }
        if (!isRootSep && !hasTrailingPathSeparator(resource, sep)) {
            return resource.with({ path: resource.path + '/' });
        }
        return resource;
    }
}
/**
 * Unbiased utility that takes uris "as they are". This means it can be interchanged with
 * uri#toString() usages. The following is true
 * ```
 * assertEqual(aUri.toString() === bUri.toString(), exturi.isEqual(aUri, bUri))
 * ```
 */
const extUri = new ExtUri(() => false);
/**
 * BIASED utility that _mostly_ ignored the case of urs paths. ONLY use this util if you
 * understand what you are doing.
 *
 * This utility is INCOMPATIBLE with `uri.toString()`-usages and both CANNOT be used interchanged.
 *
 * When dealing with uris from files or documents, `extUri` (the unbiased friend)is sufficient
 * because those uris come from a "trustworthy source". When creating unknown uris it's always
 * better to use `IUriIdentityService` which exposes an `IExtUri`-instance which knows when path
 * casing matters.
 */
const extUriBiasedIgnorePathCase = new ExtUri(uri => {
    // A file scheme resource is in the same platform as code, so ignore case for non linux platforms
    // Resource can be from another platform. Lowering the case as an hack. Should come from File system provider
    return uri.scheme === _network_js__WEBPACK_IMPORTED_MODULE_1__/* .Schemas */ .ny.file ? !_platform_js__WEBPACK_IMPORTED_MODULE_3__/* .isLinux */ .j9 : true;
});
/**
 * BIASED utility that always ignores the casing of uris paths. ONLY use this util if you
 * understand what you are doing.
 *
 * This utility is INCOMPATIBLE with `uri.toString()`-usages and both CANNOT be used interchanged.
 *
 * When dealing with uris from files or documents, `extUri` (the unbiased friend)is sufficient
 * because those uris come from a "trustworthy source". When creating unknown uris it's always
 * better to use `IUriIdentityService` which exposes an `IExtUri`-instance which knows when path
 * casing matters.
 */
const extUriIgnorePathCase = new ExtUri(_ => true);
const isEqual = extUri.isEqual.bind(extUri);
const isEqualOrParent = extUri.isEqualOrParent.bind(extUri);
const getComparisonKey = extUri.getComparisonKey.bind(extUri);
const basenameOrAuthority = extUri.basenameOrAuthority.bind(extUri);
const basename = extUri.basename.bind(extUri);
const extname = extUri.extname.bind(extUri);
const dirname = extUri.dirname.bind(extUri);
const joinPath = extUri.joinPath.bind(extUri);
const normalizePath = extUri.normalizePath.bind(extUri);
const relativePath = extUri.relativePath.bind(extUri);
const resolvePath = extUri.resolvePath.bind(extUri);
const isAbsolutePath = extUri.isAbsolutePath.bind(extUri);
const isEqualAuthority = extUri.isEqualAuthority.bind(extUri);
const hasTrailingPathSeparator = extUri.hasTrailingPathSeparator.bind(extUri);
const removeTrailingPathSeparator = extUri.removeTrailingPathSeparator.bind(extUri);
const addTrailingPathSeparator = extUri.addTrailingPathSeparator.bind(extUri);
/**
 * Data URI related helpers.
 */
var DataUri;
(function (DataUri) {
    DataUri.META_DATA_LABEL = 'label';
    DataUri.META_DATA_DESCRIPTION = 'description';
    DataUri.META_DATA_SIZE = 'size';
    DataUri.META_DATA_MIME = 'mime';
    function parseMetaData(dataUri) {
        const metadata = new Map();
        // Given a URI of:  data:image/png;size:2313;label:SomeLabel;description:SomeDescription;base64,77+9UE5...
        // the metadata is: size:2313;label:SomeLabel;description:SomeDescription
        const meta = dataUri.path.substring(dataUri.path.indexOf(';') + 1, dataUri.path.lastIndexOf(';'));
        meta.split(';').forEach(property => {
            const [key, value] = property.split(':');
            if (key && value) {
                metadata.set(key, value);
            }
        });
        // Given a URI of:  data:image/png;size:2313;label:SomeLabel;description:SomeDescription;base64,77+9UE5...
        // the mime is: image/png
        const mime = dataUri.path.substring(0, dataUri.path.indexOf(';'));
        if (mime) {
            metadata.set(DataUri.META_DATA_MIME, mime);
        }
        return metadata;
    }
    DataUri.parseMetaData = parseMetaData;
})(DataUri || (DataUri = {}));


/***/ },

/***/ 27142
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Fd: () => (/* binding */ Extensions),
/* harmony export */   Gv: () => (/* binding */ overrideIdentifiersFromKey),
/* harmony export */   rC: () => (/* binding */ OVERRIDE_PROPERTY_REGEX)
/* harmony export */ });
/* unused harmony exports allSettings, applicationSettings, machineSettings, machineOverridableSettings, windowSettings, resourceSettings, resourceLanguageSettingsSchemaId, OVERRIDE_PROPERTY_PATTERN, getDefaultValue, validateProperty */
/* harmony import */ var _base_common_arrays_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(13338);
/* harmony import */ var _base_common_event_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2106);
/* harmony import */ var _base_common_types_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(79359);
/* harmony import */ var _nls_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(19746);
/* harmony import */ var _configuration_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(85753);
/* harmony import */ var _jsonschemas_common_jsonContributionRegistry_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(51460);
/* harmony import */ var _registry_common_platform_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(67167);
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/







const Extensions = {
    Configuration: 'base.contributions.configuration'
};
const allSettings = { properties: {}, patternProperties: {} };
const applicationSettings = { properties: {}, patternProperties: {} };
const machineSettings = { properties: {}, patternProperties: {} };
const machineOverridableSettings = { properties: {}, patternProperties: {} };
const windowSettings = { properties: {}, patternProperties: {} };
const resourceSettings = { properties: {}, patternProperties: {} };
const resourceLanguageSettingsSchemaId = 'vscode://schemas/settings/resourceLanguage';
const contributionRegistry = _registry_common_platform_js__WEBPACK_IMPORTED_MODULE_6__/* .Registry */ .O.as(_jsonschemas_common_jsonContributionRegistry_js__WEBPACK_IMPORTED_MODULE_5__/* .Extensions */ .F.JSONContribution);
class ConfigurationRegistry {
    constructor() {
        this.registeredConfigurationDefaults = [];
        this.overrideIdentifiers = new Set();
        this._onDidSchemaChange = new _base_common_event_js__WEBPACK_IMPORTED_MODULE_1__/* .Emitter */ .vl();
        this._onDidUpdateConfiguration = new _base_common_event_js__WEBPACK_IMPORTED_MODULE_1__/* .Emitter */ .vl();
        this.configurationDefaultsOverrides = new Map();
        this.defaultLanguageConfigurationOverridesNode = {
            id: 'defaultOverrides',
            title: _nls_js__WEBPACK_IMPORTED_MODULE_3__/* .localize */ .kg('defaultLanguageConfigurationOverrides.title', "Default Language Configuration Overrides"),
            properties: {}
        };
        this.configurationContributors = [this.defaultLanguageConfigurationOverridesNode];
        this.resourceLanguageSettingsSchema = {
            properties: {},
            patternProperties: {},
            additionalProperties: true,
            allowTrailingCommas: true,
            allowComments: true
        };
        this.configurationProperties = {};
        this.policyConfigurations = new Map();
        this.excludedConfigurationProperties = {};
        contributionRegistry.registerSchema(resourceLanguageSettingsSchemaId, this.resourceLanguageSettingsSchema);
        this.registerOverridePropertyPatternKey();
    }
    registerConfiguration(configuration, validate = true) {
        this.registerConfigurations([configuration], validate);
    }
    registerConfigurations(configurations, validate = true) {
        const properties = new Set();
        this.doRegisterConfigurations(configurations, validate, properties);
        contributionRegistry.registerSchema(resourceLanguageSettingsSchemaId, this.resourceLanguageSettingsSchema);
        this._onDidSchemaChange.fire();
        this._onDidUpdateConfiguration.fire({ properties });
    }
    registerDefaultConfigurations(configurationDefaults) {
        const properties = new Set();
        this.doRegisterDefaultConfigurations(configurationDefaults, properties);
        this._onDidSchemaChange.fire();
        this._onDidUpdateConfiguration.fire({ properties, defaultsOverrides: true });
    }
    doRegisterDefaultConfigurations(configurationDefaults, bucket) {
        this.registeredConfigurationDefaults.push(...configurationDefaults);
        const overrideIdentifiers = [];
        for (const { overrides, source } of configurationDefaults) {
            for (const key in overrides) {
                bucket.add(key);
                const configurationDefaultOverridesForKey = this.configurationDefaultsOverrides.get(key)
                    ?? this.configurationDefaultsOverrides.set(key, { configurationDefaultOverrides: [] }).get(key);
                const value = overrides[key];
                configurationDefaultOverridesForKey.configurationDefaultOverrides.push({ value, source });
                // Configuration defaults for Override Identifiers
                if (OVERRIDE_PROPERTY_REGEX.test(key)) {
                    const newDefaultOverride = this.mergeDefaultConfigurationsForOverrideIdentifier(key, value, source, configurationDefaultOverridesForKey.configurationDefaultOverrideValue);
                    if (!newDefaultOverride) {
                        continue;
                    }
                    configurationDefaultOverridesForKey.configurationDefaultOverrideValue = newDefaultOverride;
                    this.updateDefaultOverrideProperty(key, newDefaultOverride, source);
                    overrideIdentifiers.push(...overrideIdentifiersFromKey(key));
                }
                // Configuration defaults for Configuration Properties
                else {
                    const newDefaultOverride = this.mergeDefaultConfigurationsForConfigurationProperty(key, value, source, configurationDefaultOverridesForKey.configurationDefaultOverrideValue);
                    if (!newDefaultOverride) {
                        continue;
                    }
                    configurationDefaultOverridesForKey.configurationDefaultOverrideValue = newDefaultOverride;
                    const property = this.configurationProperties[key];
                    if (property) {
                        this.updatePropertyDefaultValue(key, property);
                        this.updateSchema(key, property);
                    }
                }
            }
        }
        this.doRegisterOverrideIdentifiers(overrideIdentifiers);
    }
    updateDefaultOverrideProperty(key, newDefaultOverride, source) {
        const property = {
            type: 'object',
            default: newDefaultOverride.value,
            description: _nls_js__WEBPACK_IMPORTED_MODULE_3__/* .localize */ .kg('defaultLanguageConfiguration.description', "Configure settings to be overridden for the {0} language.", (0,_configuration_js__WEBPACK_IMPORTED_MODULE_4__/* .getLanguageTagSettingPlainKey */ .Mo)(key)),
            $ref: resourceLanguageSettingsSchemaId,
            defaultDefaultValue: newDefaultOverride.value,
            source,
            defaultValueSource: source
        };
        this.configurationProperties[key] = property;
        this.defaultLanguageConfigurationOverridesNode.properties[key] = property;
    }
    mergeDefaultConfigurationsForOverrideIdentifier(overrideIdentifier, configurationValueObject, valueSource, existingDefaultOverride) {
        const defaultValue = existingDefaultOverride?.value || {};
        const source = existingDefaultOverride?.source ?? new Map();
        // This should not happen
        if (!(source instanceof Map)) {
            console.error('objectConfigurationSources is not a Map');
            return undefined;
        }
        for (const propertyKey of Object.keys(configurationValueObject)) {
            const propertyDefaultValue = configurationValueObject[propertyKey];
            const isObjectSetting = _base_common_types_js__WEBPACK_IMPORTED_MODULE_2__/* .isObject */ .Gv(propertyDefaultValue) &&
                (_base_common_types_js__WEBPACK_IMPORTED_MODULE_2__/* .isUndefined */ .b0(defaultValue[propertyKey]) || _base_common_types_js__WEBPACK_IMPORTED_MODULE_2__/* .isObject */ .Gv(defaultValue[propertyKey]));
            // If the default value is an object, merge the objects and store the source of each keys
            if (isObjectSetting) {
                defaultValue[propertyKey] = { ...(defaultValue[propertyKey] ?? {}), ...propertyDefaultValue };
                // Track the source of each value in the object
                if (valueSource) {
                    for (const objectKey in propertyDefaultValue) {
                        source.set(`${propertyKey}.${objectKey}`, valueSource);
                    }
                }
            }
            // Primitive values are overridden
            else {
                defaultValue[propertyKey] = propertyDefaultValue;
                if (valueSource) {
                    source.set(propertyKey, valueSource);
                }
                else {
                    source.delete(propertyKey);
                }
            }
        }
        return { value: defaultValue, source };
    }
    mergeDefaultConfigurationsForConfigurationProperty(propertyKey, value, valuesSource, existingDefaultOverride) {
        const property = this.configurationProperties[propertyKey];
        const existingDefaultValue = existingDefaultOverride?.value ?? property?.defaultDefaultValue;
        let source = valuesSource;
        const isObjectSetting = _base_common_types_js__WEBPACK_IMPORTED_MODULE_2__/* .isObject */ .Gv(value) &&
            (property !== undefined && property.type === 'object' ||
                property === undefined && (_base_common_types_js__WEBPACK_IMPORTED_MODULE_2__/* .isUndefined */ .b0(existingDefaultValue) || _base_common_types_js__WEBPACK_IMPORTED_MODULE_2__/* .isObject */ .Gv(existingDefaultValue)));
        // If the default value is an object, merge the objects and store the source of each keys
        if (isObjectSetting) {
            source = existingDefaultOverride?.source ?? new Map();
            // This should not happen
            if (!(source instanceof Map)) {
                console.error('defaultValueSource is not a Map');
                return undefined;
            }
            for (const objectKey in value) {
                if (valuesSource) {
                    source.set(`${propertyKey}.${objectKey}`, valuesSource);
                }
            }
            value = { ...(_base_common_types_js__WEBPACK_IMPORTED_MODULE_2__/* .isObject */ .Gv(existingDefaultValue) ? existingDefaultValue : {}), ...value };
        }
        return { value, source };
    }
    registerOverrideIdentifiers(overrideIdentifiers) {
        this.doRegisterOverrideIdentifiers(overrideIdentifiers);
        this._onDidSchemaChange.fire();
    }
    doRegisterOverrideIdentifiers(overrideIdentifiers) {
        for (const overrideIdentifier of overrideIdentifiers) {
            this.overrideIdentifiers.add(overrideIdentifier);
        }
        this.updateOverridePropertyPatternKey();
    }
    doRegisterConfigurations(configurations, validate, bucket) {
        configurations.forEach(configuration => {
            this.validateAndRegisterProperties(configuration, validate, configuration.extensionInfo, configuration.restrictedProperties, undefined, bucket);
            this.configurationContributors.push(configuration);
            this.registerJSONConfiguration(configuration);
        });
    }
    validateAndRegisterProperties(configuration, validate = true, extensionInfo, restrictedProperties, scope = 3 /* ConfigurationScope.WINDOW */, bucket) {
        scope = _base_common_types_js__WEBPACK_IMPORTED_MODULE_2__/* .isUndefinedOrNull */ .z(configuration.scope) ? scope : configuration.scope;
        const properties = configuration.properties;
        if (properties) {
            for (const key in properties) {
                const property = properties[key];
                if (validate && validateProperty(key, property)) {
                    delete properties[key];
                    continue;
                }
                property.source = extensionInfo;
                // update default value
                property.defaultDefaultValue = properties[key].default;
                this.updatePropertyDefaultValue(key, property);
                // update scope
                if (OVERRIDE_PROPERTY_REGEX.test(key)) {
                    property.scope = undefined; // No scope for overridable properties `[${identifier}]`
                }
                else {
                    property.scope = _base_common_types_js__WEBPACK_IMPORTED_MODULE_2__/* .isUndefinedOrNull */ .z(property.scope) ? scope : property.scope;
                    property.restricted = _base_common_types_js__WEBPACK_IMPORTED_MODULE_2__/* .isUndefinedOrNull */ .z(property.restricted) ? !!restrictedProperties?.includes(key) : property.restricted;
                }
                // Add to properties maps
                // Property is included by default if 'included' is unspecified
                if (properties[key].hasOwnProperty('included') && !properties[key].included) {
                    this.excludedConfigurationProperties[key] = properties[key];
                    delete properties[key];
                    continue;
                }
                else {
                    this.configurationProperties[key] = properties[key];
                    if (properties[key].policy?.name) {
                        this.policyConfigurations.set(properties[key].policy.name, key);
                    }
                }
                if (!properties[key].deprecationMessage && properties[key].markdownDeprecationMessage) {
                    // If not set, default deprecationMessage to the markdown source
                    properties[key].deprecationMessage = properties[key].markdownDeprecationMessage;
                }
                bucket.add(key);
            }
        }
        const subNodes = configuration.allOf;
        if (subNodes) {
            for (const node of subNodes) {
                this.validateAndRegisterProperties(node, validate, extensionInfo, restrictedProperties, scope, bucket);
            }
        }
    }
    getConfigurationProperties() {
        return this.configurationProperties;
    }
    getPolicyConfigurations() {
        return this.policyConfigurations;
    }
    registerJSONConfiguration(configuration) {
        const register = (configuration) => {
            const properties = configuration.properties;
            if (properties) {
                for (const key in properties) {
                    this.updateSchema(key, properties[key]);
                }
            }
            const subNodes = configuration.allOf;
            subNodes?.forEach(register);
        };
        register(configuration);
    }
    updateSchema(key, property) {
        allSettings.properties[key] = property;
        switch (property.scope) {
            case 1 /* ConfigurationScope.APPLICATION */:
                applicationSettings.properties[key] = property;
                break;
            case 2 /* ConfigurationScope.MACHINE */:
                machineSettings.properties[key] = property;
                break;
            case 6 /* ConfigurationScope.MACHINE_OVERRIDABLE */:
                machineOverridableSettings.properties[key] = property;
                break;
            case 3 /* ConfigurationScope.WINDOW */:
                windowSettings.properties[key] = property;
                break;
            case 4 /* ConfigurationScope.RESOURCE */:
                resourceSettings.properties[key] = property;
                break;
            case 5 /* ConfigurationScope.LANGUAGE_OVERRIDABLE */:
                resourceSettings.properties[key] = property;
                this.resourceLanguageSettingsSchema.properties[key] = property;
                break;
        }
    }
    updateOverridePropertyPatternKey() {
        for (const overrideIdentifier of this.overrideIdentifiers.values()) {
            const overrideIdentifierProperty = `[${overrideIdentifier}]`;
            const resourceLanguagePropertiesSchema = {
                type: 'object',
                description: _nls_js__WEBPACK_IMPORTED_MODULE_3__/* .localize */ .kg('overrideSettings.defaultDescription', "Configure editor settings to be overridden for a language."),
                errorMessage: _nls_js__WEBPACK_IMPORTED_MODULE_3__/* .localize */ .kg('overrideSettings.errorMessage', "This setting does not support per-language configuration."),
                $ref: resourceLanguageSettingsSchemaId,
            };
            this.updatePropertyDefaultValue(overrideIdentifierProperty, resourceLanguagePropertiesSchema);
            allSettings.properties[overrideIdentifierProperty] = resourceLanguagePropertiesSchema;
            applicationSettings.properties[overrideIdentifierProperty] = resourceLanguagePropertiesSchema;
            machineSettings.properties[overrideIdentifierProperty] = resourceLanguagePropertiesSchema;
            machineOverridableSettings.properties[overrideIdentifierProperty] = resourceLanguagePropertiesSchema;
            windowSettings.properties[overrideIdentifierProperty] = resourceLanguagePropertiesSchema;
            resourceSettings.properties[overrideIdentifierProperty] = resourceLanguagePropertiesSchema;
        }
    }
    registerOverridePropertyPatternKey() {
        const resourceLanguagePropertiesSchema = {
            type: 'object',
            description: _nls_js__WEBPACK_IMPORTED_MODULE_3__/* .localize */ .kg('overrideSettings.defaultDescription', "Configure editor settings to be overridden for a language."),
            errorMessage: _nls_js__WEBPACK_IMPORTED_MODULE_3__/* .localize */ .kg('overrideSettings.errorMessage', "This setting does not support per-language configuration."),
            $ref: resourceLanguageSettingsSchemaId,
        };
        allSettings.patternProperties[OVERRIDE_PROPERTY_PATTERN] = resourceLanguagePropertiesSchema;
        applicationSettings.patternProperties[OVERRIDE_PROPERTY_PATTERN] = resourceLanguagePropertiesSchema;
        machineSettings.patternProperties[OVERRIDE_PROPERTY_PATTERN] = resourceLanguagePropertiesSchema;
        machineOverridableSettings.patternProperties[OVERRIDE_PROPERTY_PATTERN] = resourceLanguagePropertiesSchema;
        windowSettings.patternProperties[OVERRIDE_PROPERTY_PATTERN] = resourceLanguagePropertiesSchema;
        resourceSettings.patternProperties[OVERRIDE_PROPERTY_PATTERN] = resourceLanguagePropertiesSchema;
        this._onDidSchemaChange.fire();
    }
    updatePropertyDefaultValue(key, property) {
        const configurationdefaultOverride = this.configurationDefaultsOverrides.get(key)?.configurationDefaultOverrideValue;
        let defaultValue = undefined;
        let defaultSource = undefined;
        if (configurationdefaultOverride
            && (!property.disallowConfigurationDefault || !configurationdefaultOverride.source) // Prevent overriding the default value if the property is disallowed to be overridden by configuration defaults from extensions
        ) {
            defaultValue = configurationdefaultOverride.value;
            defaultSource = configurationdefaultOverride.source;
        }
        if (_base_common_types_js__WEBPACK_IMPORTED_MODULE_2__/* .isUndefined */ .b0(defaultValue)) {
            defaultValue = property.defaultDefaultValue;
            defaultSource = undefined;
        }
        if (_base_common_types_js__WEBPACK_IMPORTED_MODULE_2__/* .isUndefined */ .b0(defaultValue)) {
            defaultValue = getDefaultValue(property.type);
        }
        property.default = defaultValue;
        property.defaultValueSource = defaultSource;
    }
}
const OVERRIDE_IDENTIFIER_PATTERN = `\\[([^\\]]+)\\]`;
const OVERRIDE_IDENTIFIER_REGEX = new RegExp(OVERRIDE_IDENTIFIER_PATTERN, 'g');
const OVERRIDE_PROPERTY_PATTERN = `^(${OVERRIDE_IDENTIFIER_PATTERN})+$`;
const OVERRIDE_PROPERTY_REGEX = new RegExp(OVERRIDE_PROPERTY_PATTERN);
function overrideIdentifiersFromKey(key) {
    const identifiers = [];
    if (OVERRIDE_PROPERTY_REGEX.test(key)) {
        let matches = OVERRIDE_IDENTIFIER_REGEX.exec(key);
        while (matches?.length) {
            const identifier = matches[1].trim();
            if (identifier) {
                identifiers.push(identifier);
            }
            matches = OVERRIDE_IDENTIFIER_REGEX.exec(key);
        }
    }
    return (0,_base_common_arrays_js__WEBPACK_IMPORTED_MODULE_0__/* .distinct */ .dM)(identifiers);
}
function getDefaultValue(type) {
    const t = Array.isArray(type) ? type[0] : type;
    switch (t) {
        case 'boolean':
            return false;
        case 'integer':
        case 'number':
            return 0;
        case 'string':
            return '';
        case 'array':
            return [];
        case 'object':
            return {};
        default:
            return null;
    }
}
const configurationRegistry = new ConfigurationRegistry();
_registry_common_platform_js__WEBPACK_IMPORTED_MODULE_6__/* .Registry */ .O.add(Extensions.Configuration, configurationRegistry);
function validateProperty(property, schema) {
    if (!property.trim()) {
        return _nls_js__WEBPACK_IMPORTED_MODULE_3__/* .localize */ .kg('config.property.empty', "Cannot register an empty property");
    }
    if (OVERRIDE_PROPERTY_REGEX.test(property)) {
        return _nls_js__WEBPACK_IMPORTED_MODULE_3__/* .localize */ .kg('config.property.languageDefault', "Cannot register '{0}'. This matches property pattern '\\\\[.*\\\\]$' for describing language specific editor settings. Use 'configurationDefaults' contribution.", property);
    }
    if (configurationRegistry.getConfigurationProperties()[property] !== undefined) {
        return _nls_js__WEBPACK_IMPORTED_MODULE_3__/* .localize */ .kg('config.property.duplicate', "Cannot register '{0}'. This property is already registered.", property);
    }
    if (schema.policy?.name && configurationRegistry.getPolicyConfigurations().get(schema.policy?.name) !== undefined) {
        return _nls_js__WEBPACK_IMPORTED_MODULE_3__/* .localize */ .kg('config.policy.duplicate', "Cannot register '{0}'. The associated policy {1} is already registered with {2}.", property, schema.policy?.name, configurationRegistry.getPolicyConfigurations().get(schema.policy?.name));
    }
    return null;
}


/***/ },

/***/ 34442
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Bm: () => (/* binding */ _setRecomputeInitiallyAndOnChange),
/* harmony export */   FB: () => (/* binding */ _setKeepObserved),
/* harmony export */   FY: () => (/* binding */ observableValue),
/* harmony export */   Lj: () => (/* binding */ ObservableValue),
/* harmony export */   N2: () => (/* binding */ _setDerivedOpts),
/* harmony export */   PO: () => (/* binding */ subtransaction),
/* harmony export */   Rn: () => (/* binding */ transaction),
/* harmony export */   X2: () => (/* binding */ disposableObservableValue),
/* harmony export */   XL: () => (/* binding */ TransactionImpl),
/* harmony export */   YY: () => (/* binding */ globalTransaction),
/* harmony export */   ZK: () => (/* binding */ BaseObservable),
/* harmony export */   fL: () => (/* binding */ asyncTransaction),
/* harmony export */   zV: () => (/* binding */ ConvenientObservable)
/* harmony export */ });
/* unused harmony export DisposableObservableValue */
/* harmony import */ var _equals_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8897);
/* harmony import */ var _debugName_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(49855);
/* harmony import */ var _logging_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(34950);
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/



let _recomputeInitiallyAndOnChange;
function _setRecomputeInitiallyAndOnChange(recomputeInitiallyAndOnChange) {
    _recomputeInitiallyAndOnChange = recomputeInitiallyAndOnChange;
}
let _keepObserved;
function _setKeepObserved(keepObserved) {
    _keepObserved = keepObserved;
}
let _derived;
/**
 * @internal
 * This is to allow splitting files.
*/
function _setDerivedOpts(derived) {
    _derived = derived;
}
class ConvenientObservable {
    get TChange() { return null; }
    reportChanges() {
        this.get();
    }
    /** @sealed */
    read(reader) {
        if (reader) {
            return reader.readObservable(this);
        }
        else {
            return this.get();
        }
    }
    map(fnOrOwner, fnOrUndefined) {
        const owner = fnOrUndefined === undefined ? undefined : fnOrOwner;
        const fn = fnOrUndefined === undefined ? fnOrOwner : fnOrUndefined;
        return _derived({
            owner,
            debugName: () => {
                const name = (0,_debugName_js__WEBPACK_IMPORTED_MODULE_1__/* .getFunctionName */ .qQ)(fn);
                if (name !== undefined) {
                    return name;
                }
                // regexp to match `x => x.y` or `x => x?.y` where x and y can be arbitrary identifiers (uses backref):
                const regexp = /^\s*\(?\s*([a-zA-Z_$][a-zA-Z_$0-9]*)\s*\)?\s*=>\s*\1(?:\??)\.([a-zA-Z_$][a-zA-Z_$0-9]*)\s*$/;
                const match = regexp.exec(fn.toString());
                if (match) {
                    return `${this.debugName}.${match[2]}`;
                }
                if (!owner) {
                    return `${this.debugName} (mapped)`;
                }
                return undefined;
            },
            debugReferenceFn: fn,
        }, (reader) => fn(this.read(reader), reader));
    }
    /**
     * @sealed
     * Converts an observable of an observable value into a direct observable of the value.
    */
    flatten() {
        return _derived({
            owner: undefined,
            debugName: () => `${this.debugName} (flattened)`,
        }, (reader) => this.read(reader).read(reader));
    }
    recomputeInitiallyAndOnChange(store, handleValue) {
        store.add(_recomputeInitiallyAndOnChange(this, handleValue));
        return this;
    }
    /**
     * Ensures that this observable is observed. This keeps the cache alive.
     * However, in case of deriveds, it does not force eager evaluation (only when the value is read/get).
     * Use `recomputeInitiallyAndOnChange` for eager evaluation.
     */
    keepObserved(store) {
        store.add(_keepObserved(this));
        return this;
    }
}
class BaseObservable extends ConvenientObservable {
    constructor() {
        super(...arguments);
        this.observers = new Set();
    }
    addObserver(observer) {
        const len = this.observers.size;
        this.observers.add(observer);
        if (len === 0) {
            this.onFirstObserverAdded();
        }
    }
    removeObserver(observer) {
        const deleted = this.observers.delete(observer);
        if (deleted && this.observers.size === 0) {
            this.onLastObserverRemoved();
        }
    }
    onFirstObserverAdded() { }
    onLastObserverRemoved() { }
}
/**
 * Starts a transaction in which many observables can be changed at once.
 * {@link fn} should start with a JS Doc using `@description` to give the transaction a debug name.
 * Reaction run on demand or when the transaction ends.
 */
function transaction(fn, getDebugName) {
    const tx = new TransactionImpl(fn, getDebugName);
    try {
        fn(tx);
    }
    finally {
        tx.finish();
    }
}
let _globalTransaction = (/* runtime-dependent pure expression or super */ 3524 == __webpack_require__.j ? (undefined) : null);
function globalTransaction(fn) {
    if (_globalTransaction) {
        fn(_globalTransaction);
    }
    else {
        const tx = new TransactionImpl(fn, undefined);
        _globalTransaction = tx;
        try {
            fn(tx);
        }
        finally {
            tx.finish(); // During finish, more actions might be added to the transaction.
            // Which is why we only clear the global transaction after finish.
            _globalTransaction = undefined;
        }
    }
}
async function asyncTransaction(fn, getDebugName) {
    const tx = new TransactionImpl(fn, getDebugName);
    try {
        await fn(tx);
    }
    finally {
        tx.finish();
    }
}
/**
 * Allows to chain transactions.
 */
function subtransaction(tx, fn, getDebugName) {
    if (!tx) {
        transaction(fn, getDebugName);
    }
    else {
        fn(tx);
    }
}
class TransactionImpl {
    constructor(_fn, _getDebugName) {
        this._fn = _fn;
        this._getDebugName = _getDebugName;
        this.updatingObservers = [];
        (0,_logging_js__WEBPACK_IMPORTED_MODULE_2__/* .getLogger */ .tZ)()?.handleBeginTransaction(this);
    }
    getDebugName() {
        if (this._getDebugName) {
            return this._getDebugName();
        }
        return (0,_debugName_js__WEBPACK_IMPORTED_MODULE_1__/* .getFunctionName */ .qQ)(this._fn);
    }
    updateObserver(observer, observable) {
        // When this gets called while finish is active, they will still get considered
        this.updatingObservers.push({ observer, observable });
        observer.beginUpdate(observable);
    }
    finish() {
        const updatingObservers = this.updatingObservers;
        for (let i = 0; i < updatingObservers.length; i++) {
            const { observer, observable } = updatingObservers[i];
            observer.endUpdate(observable);
        }
        // Prevent anyone from updating observers from now on.
        this.updatingObservers = null;
        (0,_logging_js__WEBPACK_IMPORTED_MODULE_2__/* .getLogger */ .tZ)()?.handleEndTransaction();
    }
}
function observableValue(nameOrOwner, initialValue) {
    let debugNameData;
    if (typeof nameOrOwner === 'string') {
        debugNameData = new _debugName_js__WEBPACK_IMPORTED_MODULE_1__/* .DebugNameData */ .nA(undefined, nameOrOwner, undefined);
    }
    else {
        debugNameData = new _debugName_js__WEBPACK_IMPORTED_MODULE_1__/* .DebugNameData */ .nA(nameOrOwner, undefined, undefined);
    }
    return new ObservableValue(debugNameData, initialValue, _equals_js__WEBPACK_IMPORTED_MODULE_0__/* .strictEquals */ .nx);
}
class ObservableValue extends BaseObservable {
    get debugName() {
        return this._debugNameData.getDebugName(this) ?? 'ObservableValue';
    }
    constructor(_debugNameData, initialValue, _equalityComparator) {
        super();
        this._debugNameData = _debugNameData;
        this._equalityComparator = _equalityComparator;
        this._value = initialValue;
    }
    get() {
        return this._value;
    }
    set(value, tx, change) {
        if (change === undefined && this._equalityComparator(this._value, value)) {
            return;
        }
        let _tx;
        if (!tx) {
            tx = _tx = new TransactionImpl(() => { }, () => `Setting ${this.debugName}`);
        }
        try {
            const oldValue = this._value;
            this._setValue(value);
            (0,_logging_js__WEBPACK_IMPORTED_MODULE_2__/* .getLogger */ .tZ)()?.handleObservableChanged(this, { oldValue, newValue: value, change, didChange: true, hadValue: true });
            for (const observer of this.observers) {
                tx.updateObserver(observer, this);
                observer.handleChange(this, change);
            }
        }
        finally {
            if (_tx) {
                _tx.finish();
            }
        }
    }
    toString() {
        return `${this.debugName}: ${this._value}`;
    }
    _setValue(newValue) {
        this._value = newValue;
    }
}
/**
 * A disposable observable. When disposed, its value is also disposed.
 * When a new value is set, the previous value is disposed.
 */
function disposableObservableValue(nameOrOwner, initialValue) {
    let debugNameData;
    if (typeof nameOrOwner === 'string') {
        debugNameData = new _debugName_js__WEBPACK_IMPORTED_MODULE_1__/* .DebugNameData */ .nA(undefined, nameOrOwner, undefined);
    }
    else {
        debugNameData = new _debugName_js__WEBPACK_IMPORTED_MODULE_1__/* .DebugNameData */ .nA(nameOrOwner, undefined, undefined);
    }
    return new DisposableObservableValue(debugNameData, initialValue, _equals_js__WEBPACK_IMPORTED_MODULE_0__/* .strictEquals */ .nx);
}
class DisposableObservableValue extends (/* runtime-dependent pure expression or super */ 3524 == __webpack_require__.j ? (ObservableValue) : null) {
    _setValue(newValue) {
        if (this._value === newValue) {
            return;
        }
        if (this._value) {
            this._value.dispose();
        }
        this._value = newValue;
    }
    dispose() {
        this._value?.dispose();
    }
}


/***/ },

/***/ 34950
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Br: () => (/* binding */ setLogger),
/* harmony export */   jm: () => (/* binding */ ConsoleObservableLogger),
/* harmony export */   tZ: () => (/* binding */ getLogger)
/* harmony export */ });
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
let globalObservableLogger;
function setLogger(logger) {
    globalObservableLogger = logger;
}
function getLogger() {
    return globalObservableLogger;
}
class ConsoleObservableLogger {
    constructor() {
        this.indentation = 0;
        this.changedObservablesSets = new WeakMap();
    }
    textToConsoleArgs(text) {
        return consoleTextToArgs([
            normalText(repeat('|  ', this.indentation)),
            text,
        ]);
    }
    formatInfo(info) {
        if (!info.hadValue) {
            return [
                normalText(` `),
                styled(formatValue(info.newValue, 60), {
                    color: 'green',
                }),
                normalText(` (initial)`),
            ];
        }
        return info.didChange
            ? [
                normalText(` `),
                styled(formatValue(info.oldValue, 70), {
                    color: 'red',
                    strikeThrough: true,
                }),
                normalText(` `),
                styled(formatValue(info.newValue, 60), {
                    color: 'green',
                }),
            ]
            : [normalText(` (unchanged)`)];
    }
    handleObservableChanged(observable, info) {
        console.log(...this.textToConsoleArgs([
            formatKind('observable value changed'),
            styled(observable.debugName, { color: 'BlueViolet' }),
            ...this.formatInfo(info),
        ]));
    }
    formatChanges(changes) {
        if (changes.size === 0) {
            return undefined;
        }
        return styled(' (changed deps: ' +
            [...changes].map((o) => o.debugName).join(', ') +
            ')', { color: 'gray' });
    }
    handleDerivedCreated(derived) {
        const existingHandleChange = derived.handleChange;
        this.changedObservablesSets.set(derived, new Set());
        derived.handleChange = (observable, change) => {
            this.changedObservablesSets.get(derived).add(observable);
            return existingHandleChange.apply(derived, [observable, change]);
        };
    }
    handleDerivedRecomputed(derived, info) {
        const changedObservables = this.changedObservablesSets.get(derived);
        console.log(...this.textToConsoleArgs([
            formatKind('derived recomputed'),
            styled(derived.debugName, { color: 'BlueViolet' }),
            ...this.formatInfo(info),
            this.formatChanges(changedObservables),
            { data: [{ fn: derived._debugNameData.referenceFn ?? derived._computeFn }] }
        ]));
        changedObservables.clear();
    }
    handleFromEventObservableTriggered(observable, info) {
        console.log(...this.textToConsoleArgs([
            formatKind('observable from event triggered'),
            styled(observable.debugName, { color: 'BlueViolet' }),
            ...this.formatInfo(info),
            { data: [{ fn: observable._getValue }] }
        ]));
    }
    handleAutorunCreated(autorun) {
        const existingHandleChange = autorun.handleChange;
        this.changedObservablesSets.set(autorun, new Set());
        autorun.handleChange = (observable, change) => {
            this.changedObservablesSets.get(autorun).add(observable);
            return existingHandleChange.apply(autorun, [observable, change]);
        };
    }
    handleAutorunTriggered(autorun) {
        const changedObservables = this.changedObservablesSets.get(autorun);
        console.log(...this.textToConsoleArgs([
            formatKind('autorun'),
            styled(autorun.debugName, { color: 'BlueViolet' }),
            this.formatChanges(changedObservables),
            { data: [{ fn: autorun._debugNameData.referenceFn ?? autorun._runFn }] }
        ]));
        changedObservables.clear();
        this.indentation++;
    }
    handleAutorunFinished(autorun) {
        this.indentation--;
    }
    handleBeginTransaction(transaction) {
        let transactionName = transaction.getDebugName();
        if (transactionName === undefined) {
            transactionName = '';
        }
        console.log(...this.textToConsoleArgs([
            formatKind('transaction'),
            styled(transactionName, { color: 'BlueViolet' }),
            { data: [{ fn: transaction._fn }] }
        ]));
        this.indentation++;
    }
    handleEndTransaction() {
        this.indentation--;
    }
}
function consoleTextToArgs(text) {
    const styles = new Array();
    const data = [];
    let firstArg = '';
    function process(t) {
        if ('length' in t) {
            for (const item of t) {
                if (item) {
                    process(item);
                }
            }
        }
        else if ('text' in t) {
            firstArg += `%c${t.text}`;
            styles.push(t.style);
            if (t.data) {
                data.push(...t.data);
            }
        }
        else if ('data' in t) {
            data.push(...t.data);
        }
    }
    process(text);
    const result = [firstArg, ...styles];
    result.push(...data);
    return result;
}
function normalText(text) {
    return styled(text, { color: 'black' });
}
function formatKind(kind) {
    return styled(padStr(`${kind}: `, 10), { color: 'black', bold: true });
}
function styled(text, options = {
    color: 'black',
}) {
    function objToCss(styleObj) {
        return Object.entries(styleObj).reduce((styleString, [propName, propValue]) => {
            return `${styleString}${propName}:${propValue};`;
        }, '');
    }
    const style = {
        color: options.color,
    };
    if (options.strikeThrough) {
        style['text-decoration'] = 'line-through';
    }
    if (options.bold) {
        style['font-weight'] = 'bold';
    }
    return {
        text,
        style: objToCss(style),
    };
}
function formatValue(value, availableLen) {
    switch (typeof value) {
        case 'number':
            return '' + value;
        case 'string':
            if (value.length + 2 <= availableLen) {
                return `"${value}"`;
            }
            return `"${value.substr(0, availableLen - 7)}"+...`;
        case 'boolean':
            return value ? 'true' : 'false';
        case 'undefined':
            return 'undefined';
        case 'object':
            if (value === null) {
                return 'null';
            }
            if (Array.isArray(value)) {
                return formatArray(value, availableLen);
            }
            return formatObject(value, availableLen);
        case 'symbol':
            return value.toString();
        case 'function':
            return `[[Function${value.name ? ' ' + value.name : ''}]]`;
        default:
            return '' + value;
    }
}
function formatArray(value, availableLen) {
    let result = '[ ';
    let first = true;
    for (const val of value) {
        if (!first) {
            result += ', ';
        }
        if (result.length - 5 > availableLen) {
            result += '...';
            break;
        }
        first = false;
        result += `${formatValue(val, availableLen - result.length)}`;
    }
    result += ' ]';
    return result;
}
function formatObject(value, availableLen) {
    let result = '{ ';
    let first = true;
    for (const [key, val] of Object.entries(value)) {
        if (!first) {
            result += ', ';
        }
        if (result.length - 5 > availableLen) {
            result += '...';
            break;
        }
        first = false;
        result += `${key}: ${formatValue(val, availableLen - result.length)}`;
    }
    result += ' }';
    return result;
}
function repeat(str, count) {
    let result = '';
    for (let i = 1; i <= count; i++) {
        result += str;
    }
    return result;
}
function padStr(str, length) {
    while (str.length < length) {
        str += ' ';
    }
    return str;
}


/***/ },

/***/ 49855
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   nA: () => (/* binding */ DebugNameData),
/* harmony export */   qQ: () => (/* binding */ getFunctionName)
/* harmony export */ });
/* unused harmony export getDebugName */
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
class DebugNameData {
    constructor(owner, debugNameSource, referenceFn) {
        this.owner = owner;
        this.debugNameSource = debugNameSource;
        this.referenceFn = referenceFn;
    }
    getDebugName(target) {
        return getDebugName(target, this);
    }
}
const countPerName = new Map();
const cachedDebugName = new WeakMap();
function getDebugName(target, data) {
    const cached = cachedDebugName.get(target);
    if (cached) {
        return cached;
    }
    const dbgName = computeDebugName(target, data);
    if (dbgName) {
        let count = countPerName.get(dbgName) ?? 0;
        count++;
        countPerName.set(dbgName, count);
        const result = count === 1 ? dbgName : `${dbgName}#${count}`;
        cachedDebugName.set(target, result);
        return result;
    }
    return undefined;
}
function computeDebugName(self, data) {
    const cached = cachedDebugName.get(self);
    if (cached) {
        return cached;
    }
    const ownerStr = data.owner ? formatOwner(data.owner) + `.` : '';
    let result;
    const debugNameSource = data.debugNameSource;
    if (debugNameSource !== undefined) {
        if (typeof debugNameSource === 'function') {
            result = debugNameSource();
            if (result !== undefined) {
                return ownerStr + result;
            }
        }
        else {
            return ownerStr + debugNameSource;
        }
    }
    const referenceFn = data.referenceFn;
    if (referenceFn !== undefined) {
        result = getFunctionName(referenceFn);
        if (result !== undefined) {
            return ownerStr + result;
        }
    }
    if (data.owner !== undefined) {
        const key = findKey(data.owner, self);
        if (key !== undefined) {
            return ownerStr + key;
        }
    }
    return undefined;
}
function findKey(obj, value) {
    for (const key in obj) {
        if (obj[key] === value) {
            return key;
        }
    }
    return undefined;
}
const countPerClassName = new Map();
const ownerId = new WeakMap();
function formatOwner(owner) {
    const id = ownerId.get(owner);
    if (id) {
        return id;
    }
    const className = getClassName(owner);
    let count = countPerClassName.get(className) ?? 0;
    count++;
    countPerClassName.set(className, count);
    const result = count === 1 ? className : `${className}#${count}`;
    ownerId.set(owner, result);
    return result;
}
function getClassName(obj) {
    const ctor = obj.constructor;
    if (ctor) {
        return ctor.name;
    }
    return 'Object';
}
function getFunctionName(fn) {
    const fnSrc = fn.toString();
    // Pattern: /** @description ... */
    const regexp = /\/\*\*\s*@description\s*([^*]*)\*\//;
    const match = regexp.exec(fnSrc);
    const result = match ? match[1] : undefined;
    return result?.trim();
}


/***/ },

/***/ 51460
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   F: () => (/* binding */ Extensions)
/* harmony export */ });
/* harmony import */ var _base_common_event_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2106);
/* harmony import */ var _registry_common_platform_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(67167);
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/


const Extensions = {
    JSONContribution: 'base.contributions.json'
};
function normalizeId(id) {
    if (id.length > 0 && id.charAt(id.length - 1) === '#') {
        return id.substring(0, id.length - 1);
    }
    return id;
}
class JSONContributionRegistry {
    constructor() {
        this._onDidChangeSchema = new _base_common_event_js__WEBPACK_IMPORTED_MODULE_0__/* .Emitter */ .vl();
        this.schemasById = {};
    }
    registerSchema(uri, unresolvedSchemaContent) {
        this.schemasById[normalizeId(uri)] = unresolvedSchemaContent;
        this._onDidChangeSchema.fire(uri);
    }
    notifySchemaChanged(uri) {
        this._onDidChangeSchema.fire(uri);
    }
}
const jsonContributionRegistry = new JSONContributionRegistry();
_registry_common_platform_js__WEBPACK_IMPORTED_MODULE_1__/* .Registry */ .O.add(Extensions.JSONContribution, jsonContributionRegistry);


/***/ },

/***/ 53720
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   K: () => (/* binding */ Mimes)
/* harmony export */ });
const Mimes = Object.freeze({
    text: 'text/plain',
    binary: 'application/octet-stream',
    unknown: 'application/unknown',
    markdown: 'text/markdown',
    latex: 'text/latex',
    uriList: 'text/uri-list',
});


/***/ },

/***/ 54957
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   W6: () => (/* binding */ ModesRegistry),
/* harmony export */   vH: () => (/* binding */ PLAINTEXT_LANGUAGE_ID)
/* harmony export */ });
/* unused harmony exports Extensions, EditorModesRegistry, PLAINTEXT_EXTENSION */
/* harmony import */ var _nls_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(19746);
/* harmony import */ var _base_common_event_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2106);
/* harmony import */ var _platform_registry_common_platform_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(67167);
/* harmony import */ var _base_common_mime_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(53720);
/* harmony import */ var _platform_configuration_common_configurationRegistry_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(27142);
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/





// Define extension point ids
const Extensions = {
    ModesRegistry: 'editor.modesRegistry'
};
class EditorModesRegistry {
    constructor() {
        this._onDidChangeLanguages = new _base_common_event_js__WEBPACK_IMPORTED_MODULE_1__/* .Emitter */ .vl();
        this.onDidChangeLanguages = this._onDidChangeLanguages.event;
        this._languages = [];
    }
    registerLanguage(def) {
        this._languages.push(def);
        this._onDidChangeLanguages.fire(undefined);
        return {
            dispose: () => {
                for (let i = 0, len = this._languages.length; i < len; i++) {
                    if (this._languages[i] === def) {
                        this._languages.splice(i, 1);
                        return;
                    }
                }
            }
        };
    }
    getLanguages() {
        return this._languages;
    }
}
const ModesRegistry = new EditorModesRegistry();
_platform_registry_common_platform_js__WEBPACK_IMPORTED_MODULE_2__/* .Registry */ .O.add(Extensions.ModesRegistry, ModesRegistry);
const PLAINTEXT_LANGUAGE_ID = 'plaintext';
const PLAINTEXT_EXTENSION = '.txt';
ModesRegistry.registerLanguage({
    id: PLAINTEXT_LANGUAGE_ID,
    extensions: [PLAINTEXT_EXTENSION],
    aliases: [_nls_js__WEBPACK_IMPORTED_MODULE_0__/* .localize */ .kg('plainText.alias', "Plain Text"), 'text'],
    mimetypes: [_base_common_mime_js__WEBPACK_IMPORTED_MODULE_3__/* .Mimes */ .K.text]
});
_platform_registry_common_platform_js__WEBPACK_IMPORTED_MODULE_2__/* .Registry */ .O.as(_platform_configuration_common_configurationRegistry_js__WEBPACK_IMPORTED_MODULE_4__/* .Extensions */ .Fd.Configuration)
    .registerDefaultConfigurations([{
        overrides: {
            '[plaintext]': {
                'editor.unicodeHighlight.ambiguousCharacters': false,
                'editor.unicodeHighlight.invisibleCharacters': false
            }
        }
    }]);


/***/ },

/***/ 55996
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   clearPlatformLanguageAssociations: () => (/* binding */ clearPlatformLanguageAssociations),
/* harmony export */   getLanguageIds: () => (/* binding */ getLanguageIds),
/* harmony export */   registerPlatformLanguageAssociation: () => (/* binding */ registerPlatformLanguageAssociation)
/* harmony export */ });
/* harmony import */ var _base_common_glob_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(83958);
/* harmony import */ var _base_common_mime_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(53720);
/* harmony import */ var _base_common_network_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(13072);
/* harmony import */ var _base_common_path_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(18019);
/* harmony import */ var _base_common_resources_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(22467);
/* harmony import */ var _base_common_strings_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(16844);
/* harmony import */ var _languages_modesRegistry_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(54957);
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/







let registeredAssociations = [];
let nonUserRegisteredAssociations = [];
let userRegisteredAssociations = [];
/**
 * Associate a language to the registry (platform).
 * * **NOTE**: This association will lose over associations registered using `registerConfiguredLanguageAssociation`.
 * * **NOTE**: Use `clearPlatformLanguageAssociations` to remove all associations registered using this function.
 */
function registerPlatformLanguageAssociation(association, warnOnOverwrite = false) {
    _registerLanguageAssociation(association, false, warnOnOverwrite);
}
function _registerLanguageAssociation(association, userConfigured, warnOnOverwrite) {
    // Register
    const associationItem = toLanguageAssociationItem(association, userConfigured);
    registeredAssociations.push(associationItem);
    if (!associationItem.userConfigured) {
        nonUserRegisteredAssociations.push(associationItem);
    }
    else {
        userRegisteredAssociations.push(associationItem);
    }
    // Check for conflicts unless this is a user configured association
    if (warnOnOverwrite && !associationItem.userConfigured) {
        registeredAssociations.forEach(a => {
            if (a.mime === associationItem.mime || a.userConfigured) {
                return; // same mime or userConfigured is ok
            }
            if (associationItem.extension && a.extension === associationItem.extension) {
                console.warn(`Overwriting extension <<${associationItem.extension}>> to now point to mime <<${associationItem.mime}>>`);
            }
            if (associationItem.filename && a.filename === associationItem.filename) {
                console.warn(`Overwriting filename <<${associationItem.filename}>> to now point to mime <<${associationItem.mime}>>`);
            }
            if (associationItem.filepattern && a.filepattern === associationItem.filepattern) {
                console.warn(`Overwriting filepattern <<${associationItem.filepattern}>> to now point to mime <<${associationItem.mime}>>`);
            }
            if (associationItem.firstline && a.firstline === associationItem.firstline) {
                console.warn(`Overwriting firstline <<${associationItem.firstline}>> to now point to mime <<${associationItem.mime}>>`);
            }
        });
    }
}
function toLanguageAssociationItem(association, userConfigured) {
    return {
        id: association.id,
        mime: association.mime,
        filename: association.filename,
        extension: association.extension,
        filepattern: association.filepattern,
        firstline: association.firstline,
        userConfigured: userConfigured,
        filenameLowercase: association.filename ? association.filename.toLowerCase() : undefined,
        extensionLowercase: association.extension ? association.extension.toLowerCase() : undefined,
        filepatternLowercase: association.filepattern ? (0,_base_common_glob_js__WEBPACK_IMPORTED_MODULE_0__/* .parse */ .qg)(association.filepattern.toLowerCase()) : undefined,
        filepatternOnPath: association.filepattern ? association.filepattern.indexOf(_base_common_path_js__WEBPACK_IMPORTED_MODULE_3__/* .posix */ .SA.sep) >= 0 : false
    };
}
/**
 * Clear language associations from the registry (platform).
 */
function clearPlatformLanguageAssociations() {
    registeredAssociations = registeredAssociations.filter(a => a.userConfigured);
    nonUserRegisteredAssociations = [];
}
/**
 * @see `getMimeTypes`
 */
function getLanguageIds(resource, firstLine) {
    return getAssociations(resource, firstLine).map(item => item.id);
}
function getAssociations(resource, firstLine) {
    let path;
    if (resource) {
        switch (resource.scheme) {
            case _base_common_network_js__WEBPACK_IMPORTED_MODULE_2__/* .Schemas */ .ny.file:
                path = resource.fsPath;
                break;
            case _base_common_network_js__WEBPACK_IMPORTED_MODULE_2__/* .Schemas */ .ny.data: {
                const metadata = _base_common_resources_js__WEBPACK_IMPORTED_MODULE_4__/* .DataUri */ .B6.parseMetaData(resource);
                path = metadata.get(_base_common_resources_js__WEBPACK_IMPORTED_MODULE_4__/* .DataUri */ .B6.META_DATA_LABEL);
                break;
            }
            case _base_common_network_js__WEBPACK_IMPORTED_MODULE_2__/* .Schemas */ .ny.vscodeNotebookCell:
                // File path not relevant for language detection of cell
                path = undefined;
                break;
            default:
                path = resource.path;
        }
    }
    if (!path) {
        return [{ id: 'unknown', mime: _base_common_mime_js__WEBPACK_IMPORTED_MODULE_1__/* .Mimes */ .K.unknown }];
    }
    path = path.toLowerCase();
    const filename = (0,_base_common_path_js__WEBPACK_IMPORTED_MODULE_3__/* .basename */ .P8)(path);
    // 1.) User configured mappings have highest priority
    const configuredLanguage = getAssociationByPath(path, filename, userRegisteredAssociations);
    if (configuredLanguage) {
        return [configuredLanguage, { id: _languages_modesRegistry_js__WEBPACK_IMPORTED_MODULE_6__/* .PLAINTEXT_LANGUAGE_ID */ .vH, mime: _base_common_mime_js__WEBPACK_IMPORTED_MODULE_1__/* .Mimes */ .K.text }];
    }
    // 2.) Registered mappings have middle priority
    const registeredLanguage = getAssociationByPath(path, filename, nonUserRegisteredAssociations);
    if (registeredLanguage) {
        return [registeredLanguage, { id: _languages_modesRegistry_js__WEBPACK_IMPORTED_MODULE_6__/* .PLAINTEXT_LANGUAGE_ID */ .vH, mime: _base_common_mime_js__WEBPACK_IMPORTED_MODULE_1__/* .Mimes */ .K.text }];
    }
    // 3.) Firstline has lowest priority
    if (firstLine) {
        const firstlineLanguage = getAssociationByFirstline(firstLine);
        if (firstlineLanguage) {
            return [firstlineLanguage, { id: _languages_modesRegistry_js__WEBPACK_IMPORTED_MODULE_6__/* .PLAINTEXT_LANGUAGE_ID */ .vH, mime: _base_common_mime_js__WEBPACK_IMPORTED_MODULE_1__/* .Mimes */ .K.text }];
        }
    }
    return [{ id: 'unknown', mime: _base_common_mime_js__WEBPACK_IMPORTED_MODULE_1__/* .Mimes */ .K.unknown }];
}
function getAssociationByPath(path, filename, associations) {
    let filenameMatch = undefined;
    let patternMatch = undefined;
    let extensionMatch = undefined;
    // We want to prioritize associations based on the order they are registered so that the last registered
    // association wins over all other. This is for https://github.com/microsoft/vscode/issues/20074
    for (let i = associations.length - 1; i >= 0; i--) {
        const association = associations[i];
        // First exact name match
        if (filename === association.filenameLowercase) {
            filenameMatch = association;
            break; // take it!
        }
        // Longest pattern match
        if (association.filepattern) {
            if (!patternMatch || association.filepattern.length > patternMatch.filepattern.length) {
                const target = association.filepatternOnPath ? path : filename; // match on full path if pattern contains path separator
                if (association.filepatternLowercase?.(target)) {
                    patternMatch = association;
                }
            }
        }
        // Longest extension match
        if (association.extension) {
            if (!extensionMatch || association.extension.length > extensionMatch.extension.length) {
                if (filename.endsWith(association.extensionLowercase)) {
                    extensionMatch = association;
                }
            }
        }
    }
    // 1.) Exact name match has second highest priority
    if (filenameMatch) {
        return filenameMatch;
    }
    // 2.) Match on pattern
    if (patternMatch) {
        return patternMatch;
    }
    // 3.) Match on extension comes next
    if (extensionMatch) {
        return extensionMatch;
    }
    return undefined;
}
function getAssociationByFirstline(firstLine) {
    if ((0,_base_common_strings_js__WEBPACK_IMPORTED_MODULE_5__/* .startsWithUTF8BOM */ .LU)(firstLine)) {
        firstLine = firstLine.substr(1);
    }
    if (firstLine.length > 0) {
        // We want to prioritize associations based on the order they are registered so that the last registered
        // association wins over all other. This is for https://github.com/microsoft/vscode/issues/20074
        for (let i = registeredAssociations.length - 1; i >= 0; i--) {
            const association = registeredAssociations[i];
            if (!association.firstline) {
                continue;
            }
            const matches = firstLine.match(association.firstline);
            if (matches && matches.length > 0) {
                return association;
            }
        }
    }
    return undefined;
}


/***/ },

/***/ 66995
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LanguageIdCodec: () => (/* binding */ LanguageIdCodec),
/* harmony export */   LanguagesRegistry: () => (/* binding */ LanguagesRegistry)
/* harmony export */ });
/* harmony import */ var _base_common_event_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2106);
/* harmony import */ var _base_common_lifecycle_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(10998);
/* harmony import */ var _base_common_strings_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(16844);
/* harmony import */ var _languagesAssociations_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(55996);
/* harmony import */ var _languages_modesRegistry_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(54957);
/* harmony import */ var _platform_configuration_common_configurationRegistry_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(27142);
/* harmony import */ var _platform_registry_common_platform_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(67167);
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/







const hasOwnProperty = Object.prototype.hasOwnProperty;
const NULL_LANGUAGE_ID = 'vs.editor.nullLanguage';
class LanguageIdCodec {
    constructor() {
        this._languageIdToLanguage = [];
        this._languageToLanguageId = new Map();
        this._register(NULL_LANGUAGE_ID, 0 /* LanguageId.Null */);
        this._register(_languages_modesRegistry_js__WEBPACK_IMPORTED_MODULE_4__/* .PLAINTEXT_LANGUAGE_ID */ .vH, 1 /* LanguageId.PlainText */);
        this._nextLanguageId = 2;
    }
    _register(language, languageId) {
        this._languageIdToLanguage[languageId] = language;
        this._languageToLanguageId.set(language, languageId);
    }
    register(language) {
        if (this._languageToLanguageId.has(language)) {
            return;
        }
        const languageId = this._nextLanguageId++;
        this._register(language, languageId);
    }
    encodeLanguageId(languageId) {
        return this._languageToLanguageId.get(languageId) || 0 /* LanguageId.Null */;
    }
    decodeLanguageId(languageId) {
        return this._languageIdToLanguage[languageId] || NULL_LANGUAGE_ID;
    }
}
class LanguagesRegistry extends _base_common_lifecycle_js__WEBPACK_IMPORTED_MODULE_1__/* .Disposable */ .jG {
    static { this.instanceCount = 0; }
    constructor(useModesRegistry = true, warnOnOverwrite = false) {
        super();
        this._onDidChange = this._register(new _base_common_event_js__WEBPACK_IMPORTED_MODULE_0__/* .Emitter */ .vl());
        this.onDidChange = this._onDidChange.event;
        LanguagesRegistry.instanceCount++;
        this._warnOnOverwrite = warnOnOverwrite;
        this.languageIdCodec = new LanguageIdCodec();
        this._dynamicLanguages = [];
        this._languages = {};
        this._mimeTypesMap = {};
        this._nameMap = {};
        this._lowercaseNameMap = {};
        if (useModesRegistry) {
            this._initializeFromRegistry();
            this._register(_languages_modesRegistry_js__WEBPACK_IMPORTED_MODULE_4__/* .ModesRegistry */ .W6.onDidChangeLanguages((m) => {
                this._initializeFromRegistry();
            }));
        }
    }
    dispose() {
        LanguagesRegistry.instanceCount--;
        super.dispose();
    }
    _initializeFromRegistry() {
        this._languages = {};
        this._mimeTypesMap = {};
        this._nameMap = {};
        this._lowercaseNameMap = {};
        (0,_languagesAssociations_js__WEBPACK_IMPORTED_MODULE_3__.clearPlatformLanguageAssociations)();
        const desc = [].concat(_languages_modesRegistry_js__WEBPACK_IMPORTED_MODULE_4__/* .ModesRegistry */ .W6.getLanguages()).concat(this._dynamicLanguages);
        this._registerLanguages(desc);
    }
    _registerLanguages(desc) {
        for (const d of desc) {
            this._registerLanguage(d);
        }
        // Rebuild fast path maps
        this._mimeTypesMap = {};
        this._nameMap = {};
        this._lowercaseNameMap = {};
        Object.keys(this._languages).forEach((langId) => {
            const language = this._languages[langId];
            if (language.name) {
                this._nameMap[language.name] = language.identifier;
            }
            language.aliases.forEach((alias) => {
                this._lowercaseNameMap[alias.toLowerCase()] = language.identifier;
            });
            language.mimetypes.forEach((mimetype) => {
                this._mimeTypesMap[mimetype] = language.identifier;
            });
        });
        _platform_registry_common_platform_js__WEBPACK_IMPORTED_MODULE_6__/* .Registry */ .O.as(_platform_configuration_common_configurationRegistry_js__WEBPACK_IMPORTED_MODULE_5__/* .Extensions */ .Fd.Configuration).registerOverrideIdentifiers(this.getRegisteredLanguageIds());
        this._onDidChange.fire();
    }
    _registerLanguage(lang) {
        const langId = lang.id;
        let resolvedLanguage;
        if (hasOwnProperty.call(this._languages, langId)) {
            resolvedLanguage = this._languages[langId];
        }
        else {
            this.languageIdCodec.register(langId);
            resolvedLanguage = {
                identifier: langId,
                name: null,
                mimetypes: [],
                aliases: [],
                extensions: [],
                filenames: [],
                configurationFiles: [],
                icons: []
            };
            this._languages[langId] = resolvedLanguage;
        }
        this._mergeLanguage(resolvedLanguage, lang);
    }
    _mergeLanguage(resolvedLanguage, lang) {
        const langId = lang.id;
        let primaryMime = null;
        if (Array.isArray(lang.mimetypes) && lang.mimetypes.length > 0) {
            resolvedLanguage.mimetypes.push(...lang.mimetypes);
            primaryMime = lang.mimetypes[0];
        }
        if (!primaryMime) {
            primaryMime = `text/x-${langId}`;
            resolvedLanguage.mimetypes.push(primaryMime);
        }
        if (Array.isArray(lang.extensions)) {
            if (lang.configuration) {
                // insert first as this appears to be the 'primary' language definition
                resolvedLanguage.extensions = lang.extensions.concat(resolvedLanguage.extensions);
            }
            else {
                resolvedLanguage.extensions = resolvedLanguage.extensions.concat(lang.extensions);
            }
            for (const extension of lang.extensions) {
                (0,_languagesAssociations_js__WEBPACK_IMPORTED_MODULE_3__.registerPlatformLanguageAssociation)({ id: langId, mime: primaryMime, extension: extension }, this._warnOnOverwrite);
            }
        }
        if (Array.isArray(lang.filenames)) {
            for (const filename of lang.filenames) {
                (0,_languagesAssociations_js__WEBPACK_IMPORTED_MODULE_3__.registerPlatformLanguageAssociation)({ id: langId, mime: primaryMime, filename: filename }, this._warnOnOverwrite);
                resolvedLanguage.filenames.push(filename);
            }
        }
        if (Array.isArray(lang.filenamePatterns)) {
            for (const filenamePattern of lang.filenamePatterns) {
                (0,_languagesAssociations_js__WEBPACK_IMPORTED_MODULE_3__.registerPlatformLanguageAssociation)({ id: langId, mime: primaryMime, filepattern: filenamePattern }, this._warnOnOverwrite);
            }
        }
        if (typeof lang.firstLine === 'string' && lang.firstLine.length > 0) {
            let firstLineRegexStr = lang.firstLine;
            if (firstLineRegexStr.charAt(0) !== '^') {
                firstLineRegexStr = '^' + firstLineRegexStr;
            }
            try {
                const firstLineRegex = new RegExp(firstLineRegexStr);
                if (!(0,_base_common_strings_js__WEBPACK_IMPORTED_MODULE_2__/* .regExpLeadsToEndlessLoop */ .eY)(firstLineRegex)) {
                    (0,_languagesAssociations_js__WEBPACK_IMPORTED_MODULE_3__.registerPlatformLanguageAssociation)({ id: langId, mime: primaryMime, firstline: firstLineRegex }, this._warnOnOverwrite);
                }
            }
            catch (err) {
                // Most likely, the regex was bad
                console.warn(`[${lang.id}]: Invalid regular expression \`${firstLineRegexStr}\`: `, err);
            }
        }
        resolvedLanguage.aliases.push(langId);
        let langAliases = null;
        if (typeof lang.aliases !== 'undefined' && Array.isArray(lang.aliases)) {
            if (lang.aliases.length === 0) {
                // signal that this language should not get a name
                langAliases = [null];
            }
            else {
                langAliases = lang.aliases;
            }
        }
        if (langAliases !== null) {
            for (const langAlias of langAliases) {
                if (!langAlias || langAlias.length === 0) {
                    continue;
                }
                resolvedLanguage.aliases.push(langAlias);
            }
        }
        const containsAliases = (langAliases !== null && langAliases.length > 0);
        if (containsAliases && langAliases[0] === null) {
            // signal that this language should not get a name
        }
        else {
            const bestName = (containsAliases ? langAliases[0] : null) || langId;
            if (containsAliases || !resolvedLanguage.name) {
                resolvedLanguage.name = bestName;
            }
        }
        if (lang.configuration) {
            resolvedLanguage.configurationFiles.push(lang.configuration);
        }
        if (lang.icon) {
            resolvedLanguage.icons.push(lang.icon);
        }
    }
    isRegisteredLanguageId(languageId) {
        if (!languageId) {
            return false;
        }
        return hasOwnProperty.call(this._languages, languageId);
    }
    getRegisteredLanguageIds() {
        return Object.keys(this._languages);
    }
    getLanguageIdByLanguageName(languageName) {
        const languageNameLower = languageName.toLowerCase();
        if (!hasOwnProperty.call(this._lowercaseNameMap, languageNameLower)) {
            return null;
        }
        return this._lowercaseNameMap[languageNameLower];
    }
    getLanguageIdByMimeType(mimeType) {
        if (!mimeType) {
            return null;
        }
        if (hasOwnProperty.call(this._mimeTypesMap, mimeType)) {
            return this._mimeTypesMap[mimeType];
        }
        return null;
    }
    guessLanguageIdByFilepathOrFirstLine(resource, firstLine) {
        if (!resource && !firstLine) {
            return [];
        }
        return (0,_languagesAssociations_js__WEBPACK_IMPORTED_MODULE_3__.getLanguageIds)(resource, firstLine);
    }
}


/***/ },

/***/ 67167
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   O: () => (/* binding */ Registry)
/* harmony export */ });
/* harmony import */ var _base_common_assert_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(87110);
/* harmony import */ var _base_common_types_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(79359);
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/


class RegistryImpl {
    constructor() {
        this.data = new Map();
    }
    add(id, data) {
        _base_common_assert_js__WEBPACK_IMPORTED_MODULE_0__.ok(_base_common_types_js__WEBPACK_IMPORTED_MODULE_1__/* .isString */ .Kg(id));
        _base_common_assert_js__WEBPACK_IMPORTED_MODULE_0__.ok(_base_common_types_js__WEBPACK_IMPORTED_MODULE_1__/* .isObject */ .Gv(data));
        _base_common_assert_js__WEBPACK_IMPORTED_MODULE_0__.ok(!this.data.has(id), 'There is already an extension with this id');
        this.data.set(id, data);
    }
    as(id) {
        return this.data.get(id) || null;
    }
}
const Registry = new RegistryImpl();


/***/ },

/***/ 78518
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   No: () => (/* binding */ hasDriveLetter),
/* harmony export */   TH: () => (/* binding */ toSlashes),
/* harmony export */   Zn: () => (/* binding */ getRoot),
/* harmony export */   _1: () => (/* binding */ isEqualOrParent),
/* harmony export */   kb: () => (/* binding */ toPosixPath)
/* harmony export */ });
/* unused harmony exports isPathSeparator, isWindowsDriveLetter */
/* harmony import */ var _path_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(18019);
/* harmony import */ var _platform_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(63339);
/* harmony import */ var _strings_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(16844);
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/



function isPathSeparator(code) {
    return code === 47 /* CharCode.Slash */ || code === 92 /* CharCode.Backslash */;
}
/**
 * Takes a Windows OS path and changes backward slashes to forward slashes.
 * This should only be done for OS paths from Windows (or user provided paths potentially from Windows).
 * Using it on a Linux or MaxOS path might change it.
 */
function toSlashes(osPath) {
    return osPath.replace(/[\\/]/g, _path_js__WEBPACK_IMPORTED_MODULE_0__/* .posix */ .SA.sep);
}
/**
 * Takes a Windows OS path (using backward or forward slashes) and turns it into a posix path:
 * - turns backward slashes into forward slashes
 * - makes it absolute if it starts with a drive letter
 * This should only be done for OS paths from Windows (or user provided paths potentially from Windows).
 * Using it on a Linux or MaxOS path might change it.
 */
function toPosixPath(osPath) {
    if (osPath.indexOf('/') === -1) {
        osPath = toSlashes(osPath);
    }
    if (/^[a-zA-Z]:(\/|$)/.test(osPath)) { // starts with a drive letter
        osPath = '/' + osPath;
    }
    return osPath;
}
/**
 * Computes the _root_ this path, like `getRoot('c:\files') === c:\`,
 * `getRoot('files:///files/path') === files:///`,
 * or `getRoot('\\server\shares\path') === \\server\shares\`
 */
function getRoot(path, sep = _path_js__WEBPACK_IMPORTED_MODULE_0__/* .posix */ .SA.sep) {
    if (!path) {
        return '';
    }
    const len = path.length;
    const firstLetter = path.charCodeAt(0);
    if (isPathSeparator(firstLetter)) {
        if (isPathSeparator(path.charCodeAt(1))) {
            // UNC candidate \\localhost\shares\ddd
            //               ^^^^^^^^^^^^^^^^^^^
            if (!isPathSeparator(path.charCodeAt(2))) {
                let pos = 3;
                const start = pos;
                for (; pos < len; pos++) {
                    if (isPathSeparator(path.charCodeAt(pos))) {
                        break;
                    }
                }
                if (start !== pos && !isPathSeparator(path.charCodeAt(pos + 1))) {
                    pos += 1;
                    for (; pos < len; pos++) {
                        if (isPathSeparator(path.charCodeAt(pos))) {
                            return path.slice(0, pos + 1) // consume this separator
                                .replace(/[\\/]/g, sep);
                        }
                    }
                }
            }
        }
        // /user/far
        // ^
        return sep;
    }
    else if (isWindowsDriveLetter(firstLetter)) {
        // check for windows drive letter c:\ or c:
        if (path.charCodeAt(1) === 58 /* CharCode.Colon */) {
            if (isPathSeparator(path.charCodeAt(2))) {
                // C:\fff
                // ^^^
                return path.slice(0, 2) + sep;
            }
            else {
                // C:
                // ^^
                return path.slice(0, 2);
            }
        }
    }
    // check for URI
    // scheme://authority/path
    // ^^^^^^^^^^^^^^^^^^^
    let pos = path.indexOf('://');
    if (pos !== -1) {
        pos += 3; // 3 -> "://".length
        for (; pos < len; pos++) {
            if (isPathSeparator(path.charCodeAt(pos))) {
                return path.slice(0, pos + 1); // consume this separator
            }
        }
    }
    return '';
}
/**
 * @deprecated please use `IUriIdentityService.extUri.isEqualOrParent` instead. If
 * you are in a context without services, consider to pass down the `extUri` from the
 * outside, or use `extUriBiasedIgnorePathCase` if you know what you are doing.
 */
function isEqualOrParent(base, parentCandidate, ignoreCase, separator = _path_js__WEBPACK_IMPORTED_MODULE_0__/* .sep */ .Vn) {
    if (base === parentCandidate) {
        return true;
    }
    if (!base || !parentCandidate) {
        return false;
    }
    if (parentCandidate.length > base.length) {
        return false;
    }
    if (ignoreCase) {
        const beginsWith = (0,_strings_js__WEBPACK_IMPORTED_MODULE_2__/* .startsWithIgnoreCase */ .ns)(base, parentCandidate);
        if (!beginsWith) {
            return false;
        }
        if (parentCandidate.length === base.length) {
            return true; // same path, different casing
        }
        let sepOffset = parentCandidate.length;
        if (parentCandidate.charAt(parentCandidate.length - 1) === separator) {
            sepOffset--; // adjust the expected sep offset in case our candidate already ends in separator character
        }
        return base.charAt(sepOffset) === separator;
    }
    if (parentCandidate.charAt(parentCandidate.length - 1) !== separator) {
        parentCandidate += separator;
    }
    return base.indexOf(parentCandidate) === 0;
}
function isWindowsDriveLetter(char0) {
    return char0 >= 65 /* CharCode.A */ && char0 <= 90 /* CharCode.Z */ || char0 >= 97 /* CharCode.a */ && char0 <= 122 /* CharCode.z */;
}
function hasDriveLetter(path, isWindowsOS = _platform_js__WEBPACK_IMPORTED_MODULE_1__/* .isWindows */ .uF) {
    if (isWindowsOS) {
        return isWindowsDriveLetter(path.charCodeAt(0)) && path.charCodeAt(1) === 58 /* CharCode.Colon */;
    }
    return false;
}


/***/ },

/***/ 82399
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   _$: () => (/* binding */ _util),
/* harmony export */   _Y: () => (/* binding */ IInstantiationService),
/* harmony export */   u1: () => (/* binding */ createDecorator)
/* harmony export */ });
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// ------ internal util
var _util;
(function (_util) {
    _util.serviceIds = new Map();
    _util.DI_TARGET = '$di$target';
    _util.DI_DEPENDENCIES = '$di$dependencies';
    function getServiceDependencies(ctor) {
        return ctor[_util.DI_DEPENDENCIES] || [];
    }
    _util.getServiceDependencies = getServiceDependencies;
})(_util || (_util = {}));
const IInstantiationService = createDecorator('instantiationService');
function storeServiceDependency(id, target, index) {
    if (target[_util.DI_TARGET] === target) {
        target[_util.DI_DEPENDENCIES].push({ id, index });
    }
    else {
        target[_util.DI_DEPENDENCIES] = [{ id, index }];
        target[_util.DI_TARGET] = target;
    }
}
/**
 * The *only* valid way to create a {{ServiceIdentifier}}.
 */
function createDecorator(serviceId) {
    if (_util.serviceIds.has(serviceId)) {
        return _util.serviceIds.get(serviceId);
    }
    const id = function (target, key, index) {
        if (arguments.length !== 3) {
            throw new Error('@IServiceName-decorator can only be used to decorate a parameter');
        }
        storeServiceDependency(id, target, index);
    };
    id.toString = () => serviceId;
    _util.serviceIds.set(serviceId, id);
    return id;
}


/***/ },

/***/ 83930
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LanguageService: () => (/* binding */ LanguageService)
/* harmony export */ });
/* harmony import */ var _base_common_event_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2106);
/* harmony import */ var _base_common_lifecycle_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(10998);
/* harmony import */ var _languagesRegistry_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(66995);
/* harmony import */ var _base_common_arrays_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(13338);
/* harmony import */ var _languages_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(44364);
/* harmony import */ var _languages_modesRegistry_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(54957);
/* harmony import */ var _base_common_observable_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(16311);
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/







class LanguageService extends _base_common_lifecycle_js__WEBPACK_IMPORTED_MODULE_1__/* .Disposable */ .jG {
    static { this.instanceCount = 0; }
    constructor(warnOnOverwrite = false) {
        super();
        this._onDidRequestBasicLanguageFeatures = this._register(new _base_common_event_js__WEBPACK_IMPORTED_MODULE_0__/* .Emitter */ .vl());
        this.onDidRequestBasicLanguageFeatures = this._onDidRequestBasicLanguageFeatures.event;
        this._onDidRequestRichLanguageFeatures = this._register(new _base_common_event_js__WEBPACK_IMPORTED_MODULE_0__/* .Emitter */ .vl());
        this.onDidRequestRichLanguageFeatures = this._onDidRequestRichLanguageFeatures.event;
        this._onDidChange = this._register(new _base_common_event_js__WEBPACK_IMPORTED_MODULE_0__/* .Emitter */ .vl({ leakWarningThreshold: 200 /* https://github.com/microsoft/vscode/issues/119968 */ }));
        this.onDidChange = this._onDidChange.event;
        this._requestedBasicLanguages = new Set();
        this._requestedRichLanguages = new Set();
        LanguageService.instanceCount++;
        this._registry = this._register(new _languagesRegistry_js__WEBPACK_IMPORTED_MODULE_2__.LanguagesRegistry(true, warnOnOverwrite));
        this.languageIdCodec = this._registry.languageIdCodec;
        this._register(this._registry.onDidChange(() => this._onDidChange.fire()));
    }
    dispose() {
        LanguageService.instanceCount--;
        super.dispose();
    }
    isRegisteredLanguageId(languageId) {
        return this._registry.isRegisteredLanguageId(languageId);
    }
    getLanguageIdByLanguageName(languageName) {
        return this._registry.getLanguageIdByLanguageName(languageName);
    }
    getLanguageIdByMimeType(mimeType) {
        return this._registry.getLanguageIdByMimeType(mimeType);
    }
    guessLanguageIdByFilepathOrFirstLine(resource, firstLine) {
        const languageIds = this._registry.guessLanguageIdByFilepathOrFirstLine(resource, firstLine);
        return (0,_base_common_arrays_js__WEBPACK_IMPORTED_MODULE_3__/* .firstOrDefault */ .Fy)(languageIds, null);
    }
    createById(languageId) {
        return new LanguageSelection(this.onDidChange, () => {
            return this._createAndGetLanguageIdentifier(languageId);
        });
    }
    createByFilepathOrFirstLine(resource, firstLine) {
        return new LanguageSelection(this.onDidChange, () => {
            const languageId = this.guessLanguageIdByFilepathOrFirstLine(resource, firstLine);
            return this._createAndGetLanguageIdentifier(languageId);
        });
    }
    _createAndGetLanguageIdentifier(languageId) {
        if (!languageId || !this.isRegisteredLanguageId(languageId)) {
            // Fall back to plain text if language is unknown
            languageId = _languages_modesRegistry_js__WEBPACK_IMPORTED_MODULE_5__/* .PLAINTEXT_LANGUAGE_ID */ .vH;
        }
        return languageId;
    }
    requestBasicLanguageFeatures(languageId) {
        if (!this._requestedBasicLanguages.has(languageId)) {
            this._requestedBasicLanguages.add(languageId);
            this._onDidRequestBasicLanguageFeatures.fire(languageId);
        }
    }
    requestRichLanguageFeatures(languageId) {
        if (!this._requestedRichLanguages.has(languageId)) {
            this._requestedRichLanguages.add(languageId);
            // Ensure basic features are requested
            this.requestBasicLanguageFeatures(languageId);
            // Ensure tokenizers are created
            _languages_js__WEBPACK_IMPORTED_MODULE_4__/* .TokenizationRegistry */ .dG.getOrCreate(languageId);
            this._onDidRequestRichLanguageFeatures.fire(languageId);
        }
    }
}
class LanguageSelection {
    constructor(onDidChangeLanguages, selector) {
        this._value = (0,_base_common_observable_js__WEBPACK_IMPORTED_MODULE_6__/* .observableFromEvent */ .y0)(this, onDidChangeLanguages, () => selector());
        this.onDidChange = _base_common_event_js__WEBPACK_IMPORTED_MODULE_0__/* .Event */ .Jh.fromObservable(this._value);
    }
    get languageId() {
        return this._value.get();
    }
}


/***/ },

/***/ 83958
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   YW: () => (/* binding */ match),
/* harmony export */   qg: () => (/* binding */ parse)
/* harmony export */ });
/* unused harmony exports GLOBSTAR, GLOB_SPLIT, splitGlobAware, isRelativePattern */
/* harmony import */ var _async_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(65958);
/* harmony import */ var _extpath_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(78518);
/* harmony import */ var _map_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(27992);
/* harmony import */ var _path_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(18019);
/* harmony import */ var _platform_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(63339);
/* harmony import */ var _strings_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(16844);






const GLOBSTAR = '**';
const GLOB_SPLIT = '/';
const PATH_REGEX = '[/\\\\]'; // any slash or backslash
const NO_PATH_REGEX = '[^/\\\\]'; // any non-slash and non-backslash
const ALL_FORWARD_SLASHES = /\//g;
function starsToRegExp(starCount, isLastPattern) {
    switch (starCount) {
        case 0:
            return '';
        case 1:
            return `${NO_PATH_REGEX}*?`; // 1 star matches any number of characters except path separator (/ and \) - non greedy (?)
        default:
            // Matches:  (Path Sep OR Path Val followed by Path Sep) 0-many times except when it's the last pattern
            //           in which case also matches (Path Sep followed by Path Val)
            // Group is non capturing because we don't need to capture at all (?:...)
            // Overall we use non-greedy matching because it could be that we match too much
            return `(?:${PATH_REGEX}|${NO_PATH_REGEX}+${PATH_REGEX}${isLastPattern ? `|${PATH_REGEX}${NO_PATH_REGEX}+` : ''})*?`;
    }
}
function splitGlobAware(pattern, splitChar) {
    if (!pattern) {
        return [];
    }
    const segments = [];
    let inBraces = false;
    let inBrackets = false;
    let curVal = '';
    for (const char of pattern) {
        switch (char) {
            case splitChar:
                if (!inBraces && !inBrackets) {
                    segments.push(curVal);
                    curVal = '';
                    continue;
                }
                break;
            case '{':
                inBraces = true;
                break;
            case '}':
                inBraces = false;
                break;
            case '[':
                inBrackets = true;
                break;
            case ']':
                inBrackets = false;
                break;
        }
        curVal += char;
    }
    // Tail
    if (curVal) {
        segments.push(curVal);
    }
    return segments;
}
function parseRegExp(pattern) {
    if (!pattern) {
        return '';
    }
    let regEx = '';
    // Split up into segments for each slash found
    const segments = splitGlobAware(pattern, GLOB_SPLIT);
    // Special case where we only have globstars
    if (segments.every(segment => segment === GLOBSTAR)) {
        regEx = '.*';
    }
    // Build regex over segments
    else {
        let previousSegmentWasGlobStar = false;
        segments.forEach((segment, index) => {
            // Treat globstar specially
            if (segment === GLOBSTAR) {
                // if we have more than one globstar after another, just ignore it
                if (previousSegmentWasGlobStar) {
                    return;
                }
                regEx += starsToRegExp(2, index === segments.length - 1);
            }
            // Anything else, not globstar
            else {
                // States
                let inBraces = false;
                let braceVal = '';
                let inBrackets = false;
                let bracketVal = '';
                for (const char of segment) {
                    // Support brace expansion
                    if (char !== '}' && inBraces) {
                        braceVal += char;
                        continue;
                    }
                    // Support brackets
                    if (inBrackets && (char !== ']' || !bracketVal) /* ] is literally only allowed as first character in brackets to match it */) {
                        let res;
                        // range operator
                        if (char === '-') {
                            res = char;
                        }
                        // negation operator (only valid on first index in bracket)
                        else if ((char === '^' || char === '!') && !bracketVal) {
                            res = '^';
                        }
                        // glob split matching is not allowed within character ranges
                        // see http://man7.org/linux/man-pages/man7/glob.7.html
                        else if (char === GLOB_SPLIT) {
                            res = '';
                        }
                        // anything else gets escaped
                        else {
                            res = (0,_strings_js__WEBPACK_IMPORTED_MODULE_5__/* .escapeRegExpCharacters */ .bm)(char);
                        }
                        bracketVal += res;
                        continue;
                    }
                    switch (char) {
                        case '{':
                            inBraces = true;
                            continue;
                        case '[':
                            inBrackets = true;
                            continue;
                        case '}': {
                            const choices = splitGlobAware(braceVal, ',');
                            // Converts {foo,bar} => [foo|bar]
                            const braceRegExp = `(?:${choices.map(choice => parseRegExp(choice)).join('|')})`;
                            regEx += braceRegExp;
                            inBraces = false;
                            braceVal = '';
                            break;
                        }
                        case ']': {
                            regEx += ('[' + bracketVal + ']');
                            inBrackets = false;
                            bracketVal = '';
                            break;
                        }
                        case '?':
                            regEx += NO_PATH_REGEX; // 1 ? matches any single character except path separator (/ and \)
                            continue;
                        case '*':
                            regEx += starsToRegExp(1);
                            continue;
                        default:
                            regEx += (0,_strings_js__WEBPACK_IMPORTED_MODULE_5__/* .escapeRegExpCharacters */ .bm)(char);
                    }
                }
                // Tail: Add the slash we had split on if there is more to
                // come and the remaining pattern is not a globstar
                // For example if pattern: some/**/*.js we want the "/" after
                // some to be included in the RegEx to prevent a folder called
                // "something" to match as well.
                if (index < segments.length - 1 && // more segments to come after this
                    (segments[index + 1] !== GLOBSTAR || // next segment is not **, or...
                        index + 2 < segments.length // ...next segment is ** but there is more segments after that
                    )) {
                    regEx += PATH_REGEX;
                }
            }
            // update globstar state
            previousSegmentWasGlobStar = (segment === GLOBSTAR);
        });
    }
    return regEx;
}
// regexes to check for trivial glob patterns that just check for String#endsWith
const T1 = /^\*\*\/\*\.[\w\.-]+$/; // **/*.something
const T2 = /^\*\*\/([\w\.-]+)\/?$/; // **/something
const T3 = /^{\*\*\/\*?[\w\.-]+\/?(,\*\*\/\*?[\w\.-]+\/?)*}$/; // {**/*.something,**/*.else} or {**/package.json,**/project.json}
const T3_2 = /^{\*\*\/\*?[\w\.-]+(\/(\*\*)?)?(,\*\*\/\*?[\w\.-]+(\/(\*\*)?)?)*}$/; // Like T3, with optional trailing /**
const T4 = /^\*\*((\/[\w\.-]+)+)\/?$/; // **/something/else
const T5 = /^([\w\.-]+(\/[\w\.-]+)*)\/?$/; // something/else
const CACHE = new _map_js__WEBPACK_IMPORTED_MODULE_2__/* .LRUCache */ .qK(10000); // bounded to 10000 elements
const FALSE = function () {
    return false;
};
const NULL = function () {
    return null;
};
function parsePattern(arg1, options) {
    if (!arg1) {
        return NULL;
    }
    // Handle relative patterns
    let pattern;
    if (typeof arg1 !== 'string') {
        pattern = arg1.pattern;
    }
    else {
        pattern = arg1;
    }
    // Whitespace trimming
    pattern = pattern.trim();
    // Check cache
    const patternKey = `${pattern}_${!!options.trimForExclusions}`;
    let parsedPattern = CACHE.get(patternKey);
    if (parsedPattern) {
        return wrapRelativePattern(parsedPattern, arg1);
    }
    // Check for Trivials
    let match;
    if (T1.test(pattern)) {
        parsedPattern = trivia1(pattern.substr(4), pattern); // common pattern: **/*.txt just need endsWith check
    }
    else if (match = T2.exec(trimForExclusions(pattern, options))) { // common pattern: **/some.txt just need basename check
        parsedPattern = trivia2(match[1], pattern);
    }
    else if ((options.trimForExclusions ? T3_2 : T3).test(pattern)) { // repetition of common patterns (see above) {**/*.txt,**/*.png}
        parsedPattern = trivia3(pattern, options);
    }
    else if (match = T4.exec(trimForExclusions(pattern, options))) { // common pattern: **/something/else just need endsWith check
        parsedPattern = trivia4and5(match[1].substr(1), pattern, true);
    }
    else if (match = T5.exec(trimForExclusions(pattern, options))) { // common pattern: something/else just need equals check
        parsedPattern = trivia4and5(match[1], pattern, false);
    }
    // Otherwise convert to pattern
    else {
        parsedPattern = toRegExp(pattern);
    }
    // Cache
    CACHE.set(patternKey, parsedPattern);
    return wrapRelativePattern(parsedPattern, arg1);
}
function wrapRelativePattern(parsedPattern, arg2) {
    if (typeof arg2 === 'string') {
        return parsedPattern;
    }
    const wrappedPattern = function (path, basename) {
        if (!(0,_extpath_js__WEBPACK_IMPORTED_MODULE_1__/* .isEqualOrParent */ ._1)(path, arg2.base, !_platform_js__WEBPACK_IMPORTED_MODULE_4__/* .isLinux */ .j9)) {
            // skip glob matching if `base` is not a parent of `path`
            return null;
        }
        // Given we have checked `base` being a parent of `path`,
        // we can now remove the `base` portion of the `path`
        // and only match on the remaining path components
        // For that we try to extract the portion of the `path`
        // that comes after the `base` portion. We have to account
        // for the fact that `base` might end in a path separator
        // (https://github.com/microsoft/vscode/issues/162498)
        return parsedPattern((0,_strings_js__WEBPACK_IMPORTED_MODULE_5__/* .ltrim */ .NB)(path.substr(arg2.base.length), _path_js__WEBPACK_IMPORTED_MODULE_3__/* .sep */ .Vn), basename);
    };
    // Make sure to preserve associated metadata
    wrappedPattern.allBasenames = parsedPattern.allBasenames;
    wrappedPattern.allPaths = parsedPattern.allPaths;
    wrappedPattern.basenames = parsedPattern.basenames;
    wrappedPattern.patterns = parsedPattern.patterns;
    return wrappedPattern;
}
function trimForExclusions(pattern, options) {
    return options.trimForExclusions && pattern.endsWith('/**') ? pattern.substr(0, pattern.length - 2) : pattern; // dropping **, tailing / is dropped later
}
// common pattern: **/*.txt just need endsWith check
function trivia1(base, pattern) {
    return function (path, basename) {
        return typeof path === 'string' && path.endsWith(base) ? pattern : null;
    };
}
// common pattern: **/some.txt just need basename check
function trivia2(base, pattern) {
    const slashBase = `/${base}`;
    const backslashBase = `\\${base}`;
    const parsedPattern = function (path, basename) {
        if (typeof path !== 'string') {
            return null;
        }
        if (basename) {
            return basename === base ? pattern : null;
        }
        return path === base || path.endsWith(slashBase) || path.endsWith(backslashBase) ? pattern : null;
    };
    const basenames = [base];
    parsedPattern.basenames = basenames;
    parsedPattern.patterns = [pattern];
    parsedPattern.allBasenames = basenames;
    return parsedPattern;
}
// repetition of common patterns (see above) {**/*.txt,**/*.png}
function trivia3(pattern, options) {
    const parsedPatterns = aggregateBasenameMatches(pattern.slice(1, -1)
        .split(',')
        .map(pattern => parsePattern(pattern, options))
        .filter(pattern => pattern !== NULL), pattern);
    const patternsLength = parsedPatterns.length;
    if (!patternsLength) {
        return NULL;
    }
    if (patternsLength === 1) {
        return parsedPatterns[0];
    }
    const parsedPattern = function (path, basename) {
        for (let i = 0, n = parsedPatterns.length; i < n; i++) {
            if (parsedPatterns[i](path, basename)) {
                return pattern;
            }
        }
        return null;
    };
    const withBasenames = parsedPatterns.find(pattern => !!pattern.allBasenames);
    if (withBasenames) {
        parsedPattern.allBasenames = withBasenames.allBasenames;
    }
    const allPaths = parsedPatterns.reduce((all, current) => current.allPaths ? all.concat(current.allPaths) : all, []);
    if (allPaths.length) {
        parsedPattern.allPaths = allPaths;
    }
    return parsedPattern;
}
// common patterns: **/something/else just need endsWith check, something/else just needs and equals check
function trivia4and5(targetPath, pattern, matchPathEnds) {
    const usingPosixSep = _path_js__WEBPACK_IMPORTED_MODULE_3__/* .sep */ .Vn === _path_js__WEBPACK_IMPORTED_MODULE_3__/* .posix */ .SA.sep;
    const nativePath = usingPosixSep ? targetPath : targetPath.replace(ALL_FORWARD_SLASHES, _path_js__WEBPACK_IMPORTED_MODULE_3__/* .sep */ .Vn);
    const nativePathEnd = _path_js__WEBPACK_IMPORTED_MODULE_3__/* .sep */ .Vn + nativePath;
    const targetPathEnd = _path_js__WEBPACK_IMPORTED_MODULE_3__/* .posix */ .SA.sep + targetPath;
    let parsedPattern;
    if (matchPathEnds) {
        parsedPattern = function (path, basename) {
            return typeof path === 'string' && ((path === nativePath || path.endsWith(nativePathEnd)) || !usingPosixSep && (path === targetPath || path.endsWith(targetPathEnd))) ? pattern : null;
        };
    }
    else {
        parsedPattern = function (path, basename) {
            return typeof path === 'string' && (path === nativePath || (!usingPosixSep && path === targetPath)) ? pattern : null;
        };
    }
    parsedPattern.allPaths = [(matchPathEnds ? '*/' : './') + targetPath];
    return parsedPattern;
}
function toRegExp(pattern) {
    try {
        const regExp = new RegExp(`^${parseRegExp(pattern)}$`);
        return function (path) {
            regExp.lastIndex = 0; // reset RegExp to its initial state to reuse it!
            return typeof path === 'string' && regExp.test(path) ? pattern : null;
        };
    }
    catch (error) {
        return NULL;
    }
}
function match(arg1, path, hasSibling) {
    if (!arg1 || typeof path !== 'string') {
        return false;
    }
    return parse(arg1)(path, undefined, hasSibling);
}
function parse(arg1, options = {}) {
    if (!arg1) {
        return FALSE;
    }
    // Glob with String
    if (typeof arg1 === 'string' || isRelativePattern(arg1)) {
        const parsedPattern = parsePattern(arg1, options);
        if (parsedPattern === NULL) {
            return FALSE;
        }
        const resultPattern = function (path, basename) {
            return !!parsedPattern(path, basename);
        };
        if (parsedPattern.allBasenames) {
            resultPattern.allBasenames = parsedPattern.allBasenames;
        }
        if (parsedPattern.allPaths) {
            resultPattern.allPaths = parsedPattern.allPaths;
        }
        return resultPattern;
    }
    // Glob with Expression
    return parsedExpression(arg1, options);
}
function isRelativePattern(obj) {
    const rp = obj;
    if (!rp) {
        return false;
    }
    return typeof rp.base === 'string' && typeof rp.pattern === 'string';
}
function parsedExpression(expression, options) {
    const parsedPatterns = aggregateBasenameMatches(Object.getOwnPropertyNames(expression)
        .map(pattern => parseExpressionPattern(pattern, expression[pattern], options))
        .filter(pattern => pattern !== NULL));
    const patternsLength = parsedPatterns.length;
    if (!patternsLength) {
        return NULL;
    }
    if (!parsedPatterns.some(parsedPattern => !!parsedPattern.requiresSiblings)) {
        if (patternsLength === 1) {
            return parsedPatterns[0];
        }
        const resultExpression = function (path, basename) {
            let resultPromises = undefined;
            for (let i = 0, n = parsedPatterns.length; i < n; i++) {
                const result = parsedPatterns[i](path, basename);
                if (typeof result === 'string') {
                    return result; // immediately return as soon as the first expression matches
                }
                // If the result is a promise, we have to keep it for
                // later processing and await the result properly.
                if ((0,_async_js__WEBPACK_IMPORTED_MODULE_0__/* .isThenable */ .Qg)(result)) {
                    if (!resultPromises) {
                        resultPromises = [];
                    }
                    resultPromises.push(result);
                }
            }
            // With result promises, we have to loop over each and
            // await the result before we can return any result.
            if (resultPromises) {
                return (async () => {
                    for (const resultPromise of resultPromises) {
                        const result = await resultPromise;
                        if (typeof result === 'string') {
                            return result;
                        }
                    }
                    return null;
                })();
            }
            return null;
        };
        const withBasenames = parsedPatterns.find(pattern => !!pattern.allBasenames);
        if (withBasenames) {
            resultExpression.allBasenames = withBasenames.allBasenames;
        }
        const allPaths = parsedPatterns.reduce((all, current) => current.allPaths ? all.concat(current.allPaths) : all, []);
        if (allPaths.length) {
            resultExpression.allPaths = allPaths;
        }
        return resultExpression;
    }
    const resultExpression = function (path, base, hasSibling) {
        let name = undefined;
        let resultPromises = undefined;
        for (let i = 0, n = parsedPatterns.length; i < n; i++) {
            // Pattern matches path
            const parsedPattern = parsedPatterns[i];
            if (parsedPattern.requiresSiblings && hasSibling) {
                if (!base) {
                    base = (0,_path_js__WEBPACK_IMPORTED_MODULE_3__/* .basename */ .P8)(path);
                }
                if (!name) {
                    name = base.substr(0, base.length - (0,_path_js__WEBPACK_IMPORTED_MODULE_3__/* .extname */ .LC)(path).length);
                }
            }
            const result = parsedPattern(path, base, name, hasSibling);
            if (typeof result === 'string') {
                return result; // immediately return as soon as the first expression matches
            }
            // If the result is a promise, we have to keep it for
            // later processing and await the result properly.
            if ((0,_async_js__WEBPACK_IMPORTED_MODULE_0__/* .isThenable */ .Qg)(result)) {
                if (!resultPromises) {
                    resultPromises = [];
                }
                resultPromises.push(result);
            }
        }
        // With result promises, we have to loop over each and
        // await the result before we can return any result.
        if (resultPromises) {
            return (async () => {
                for (const resultPromise of resultPromises) {
                    const result = await resultPromise;
                    if (typeof result === 'string') {
                        return result;
                    }
                }
                return null;
            })();
        }
        return null;
    };
    const withBasenames = parsedPatterns.find(pattern => !!pattern.allBasenames);
    if (withBasenames) {
        resultExpression.allBasenames = withBasenames.allBasenames;
    }
    const allPaths = parsedPatterns.reduce((all, current) => current.allPaths ? all.concat(current.allPaths) : all, []);
    if (allPaths.length) {
        resultExpression.allPaths = allPaths;
    }
    return resultExpression;
}
function parseExpressionPattern(pattern, value, options) {
    if (value === false) {
        return NULL; // pattern is disabled
    }
    const parsedPattern = parsePattern(pattern, options);
    if (parsedPattern === NULL) {
        return NULL;
    }
    // Expression Pattern is <boolean>
    if (typeof value === 'boolean') {
        return parsedPattern;
    }
    // Expression Pattern is <SiblingClause>
    if (value) {
        const when = value.when;
        if (typeof when === 'string') {
            const result = (path, basename, name, hasSibling) => {
                if (!hasSibling || !parsedPattern(path, basename)) {
                    return null;
                }
                const clausePattern = when.replace('$(basename)', () => name);
                const matched = hasSibling(clausePattern);
                return (0,_async_js__WEBPACK_IMPORTED_MODULE_0__/* .isThenable */ .Qg)(matched) ?
                    matched.then(match => match ? pattern : null) :
                    matched ? pattern : null;
            };
            result.requiresSiblings = true;
            return result;
        }
    }
    // Expression is anything
    return parsedPattern;
}
function aggregateBasenameMatches(parsedPatterns, result) {
    const basenamePatterns = parsedPatterns.filter(parsedPattern => !!parsedPattern.basenames);
    if (basenamePatterns.length < 2) {
        return parsedPatterns;
    }
    const basenames = basenamePatterns.reduce((all, current) => {
        const basenames = current.basenames;
        return basenames ? all.concat(basenames) : all;
    }, []);
    let patterns;
    if (result) {
        patterns = [];
        for (let i = 0, n = basenames.length; i < n; i++) {
            patterns.push(result);
        }
    }
    else {
        patterns = basenamePatterns.reduce((all, current) => {
            const patterns = current.patterns;
            return patterns ? all.concat(patterns) : all;
        }, []);
    }
    const aggregate = function (path, basename) {
        if (typeof path !== 'string') {
            return null;
        }
        if (!basename) {
            let i;
            for (i = path.length; i > 0; i--) {
                const ch = path.charCodeAt(i - 1);
                if (ch === 47 /* CharCode.Slash */ || ch === 92 /* CharCode.Backslash */) {
                    break;
                }
            }
            basename = path.substr(i);
        }
        const index = basenames.indexOf(basename);
        return index !== -1 ? patterns[index] : null;
    };
    aggregate.basenames = basenames;
    aggregate.patterns = patterns;
    aggregate.allBasenames = basenames;
    const aggregatedPatterns = parsedPatterns.filter(parsedPattern => !parsedPattern.basenames);
    aggregatedPatterns.push(aggregate);
    return aggregatedPatterns;
}


/***/ },

/***/ 85753
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Mo: () => (/* binding */ getLanguageTagSettingPlainKey),
/* harmony export */   ad: () => (/* binding */ toValuesTree),
/* harmony export */   gD: () => (/* binding */ getConfigurationValue),
/* harmony export */   iB: () => (/* binding */ removeFromValueTree),
/* harmony export */   kW: () => (/* binding */ addToValueTree),
/* harmony export */   pG: () => (/* binding */ IConfigurationService)
/* harmony export */ });
/* harmony import */ var _instantiation_common_instantiation_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(82399);
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const IConfigurationService = (0,_instantiation_common_instantiation_js__WEBPACK_IMPORTED_MODULE_0__/* .createDecorator */ .u1)('configurationService');
function toValuesTree(properties, conflictReporter) {
    const root = Object.create(null);
    for (const key in properties) {
        addToValueTree(root, key, properties[key], conflictReporter);
    }
    return root;
}
function addToValueTree(settingsTreeRoot, key, value, conflictReporter) {
    const segments = key.split('.');
    const last = segments.pop();
    let curr = settingsTreeRoot;
    for (let i = 0; i < segments.length; i++) {
        const s = segments[i];
        let obj = curr[s];
        switch (typeof obj) {
            case 'undefined':
                obj = curr[s] = Object.create(null);
                break;
            case 'object':
                if (obj === null) {
                    conflictReporter(`Ignoring ${key} as ${segments.slice(0, i + 1).join('.')} is null`);
                    return;
                }
                break;
            default:
                conflictReporter(`Ignoring ${key} as ${segments.slice(0, i + 1).join('.')} is ${JSON.stringify(obj)}`);
                return;
        }
        curr = obj;
    }
    if (typeof curr === 'object' && curr !== null) {
        try {
            curr[last] = value; // workaround https://github.com/microsoft/vscode/issues/13606
        }
        catch (e) {
            conflictReporter(`Ignoring ${key} as ${segments.join('.')} is ${JSON.stringify(curr)}`);
        }
    }
    else {
        conflictReporter(`Ignoring ${key} as ${segments.join('.')} is ${JSON.stringify(curr)}`);
    }
}
function removeFromValueTree(valueTree, key) {
    const segments = key.split('.');
    doRemoveFromValueTree(valueTree, segments);
}
function doRemoveFromValueTree(valueTree, segments) {
    const first = segments.shift();
    if (segments.length === 0) {
        // Reached last segment
        delete valueTree[first];
        return;
    }
    if (Object.keys(valueTree).indexOf(first) !== -1) {
        const value = valueTree[first];
        if (typeof value === 'object' && !Array.isArray(value)) {
            doRemoveFromValueTree(value, segments);
            if (Object.keys(value).length === 0) {
                delete valueTree[first];
            }
        }
    }
}
/**
 * A helper function to get the configuration value with a specific settings path (e.g. config.some.setting)
 */
function getConfigurationValue(config, settingPath, defaultValue) {
    function accessSetting(config, path) {
        let current = config;
        for (const component of path) {
            if (typeof current !== 'object' || current === null) {
                return undefined;
            }
            current = current[component];
        }
        return current;
    }
    const path = settingPath.split('.');
    const result = accessSetting(config, path);
    return typeof result === 'undefined' ? defaultValue : result;
}
function getLanguageTagSettingPlainKey(settingKey) {
    return settingKey.replace(/[\[\]]/g, '');
}


/***/ }

}]);