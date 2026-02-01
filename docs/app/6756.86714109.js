"use strict";
(self["webpackChunkabaplint_playground"] = self["webpackChunkabaplint_playground"] || []).push([[2603,6756],{

/***/ 2603
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DraggedTreeItemsIdentifier: () => (/* binding */ DraggedTreeItemsIdentifier),
/* harmony export */   TreeViewsDnDService: () => (/* binding */ TreeViewsDnDService)
/* harmony export */ });
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
class TreeViewsDnDService {
    constructor() {
        this._dragOperations = new Map();
    }
    removeDragOperationTransfer(uuid) {
        if ((uuid && this._dragOperations.has(uuid))) {
            const operation = this._dragOperations.get(uuid);
            this._dragOperations.delete(uuid);
            return operation;
        }
        return undefined;
    }
}
class DraggedTreeItemsIdentifier {
    constructor(identifier) {
        this.identifier = identifier;
    }
}


/***/ },

/***/ 26756
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ITreeViewsDnDService: () => (/* binding */ ITreeViewsDnDService)
/* harmony export */ });
/* harmony import */ var _platform_instantiation_common_extensions_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(66726);
/* harmony import */ var _platform_instantiation_common_instantiation_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(82399);
/* harmony import */ var _treeViewsDnd_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2603);
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/



const ITreeViewsDnDService = (0,_platform_instantiation_common_instantiation_js__WEBPACK_IMPORTED_MODULE_1__/* .createDecorator */ .u1)('treeViewsDndService');
(0,_platform_instantiation_common_extensions_js__WEBPACK_IMPORTED_MODULE_0__/* .registerSingleton */ .v)(ITreeViewsDnDService, _treeViewsDnd_js__WEBPACK_IMPORTED_MODULE_2__.TreeViewsDnDService, 1 /* InstantiationType.Delayed */);


/***/ },

/***/ 66726
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   N: () => (/* binding */ getSingletonServiceDescriptors),
/* harmony export */   v: () => (/* binding */ registerSingleton)
/* harmony export */ });
/* harmony import */ var _descriptors_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(83312);
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const _registry = [];
function registerSingleton(id, ctorOrDescriptor, supportsDelayedInstantiation) {
    if (!(ctorOrDescriptor instanceof _descriptors_js__WEBPACK_IMPORTED_MODULE_0__/* .SyncDescriptor */ .d)) {
        ctorOrDescriptor = new _descriptors_js__WEBPACK_IMPORTED_MODULE_0__/* .SyncDescriptor */ .d(ctorOrDescriptor, [], Boolean(supportsDelayedInstantiation));
    }
    _registry.push([id, ctorOrDescriptor]);
}
function getSingletonServiceDescriptors() {
    return _registry;
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

/***/ 83312
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   d: () => (/* binding */ SyncDescriptor)
/* harmony export */ });
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
class SyncDescriptor {
    constructor(ctor, staticArguments = [], supportsDelayedInstantiation = false) {
        this.ctor = ctor;
        this.staticArguments = staticArguments;
        this.supportsDelayedInstantiation = supportsDelayedInstantiation;
    }
}


/***/ }

}]);