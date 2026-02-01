"use strict";
(self["webpackChunkabaplint_playground"] = self["webpackChunkabaplint_playground"] || []).push([[5767],{

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

/***/ 58881
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   L: () => (/* binding */ ThemeIcon)
/* harmony export */ });
/* unused harmony export ThemeColor */
/* harmony import */ var _codicons_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5915);
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

var ThemeColor;
(function (ThemeColor) {
    function isThemeColor(obj) {
        return obj && typeof obj === 'object' && typeof obj.id === 'string';
    }
    ThemeColor.isThemeColor = isThemeColor;
})(ThemeColor || (ThemeColor = {}));
var ThemeIcon;
(function (ThemeIcon) {
    ThemeIcon.iconNameSegment = '[A-Za-z0-9]+';
    ThemeIcon.iconNameExpression = '[A-Za-z0-9-]+';
    ThemeIcon.iconModifierExpression = '~[A-Za-z]+';
    ThemeIcon.iconNameCharacter = '[A-Za-z0-9~-]';
    const ThemeIconIdRegex = new RegExp(`^(${ThemeIcon.iconNameExpression})(${ThemeIcon.iconModifierExpression})?$`);
    function asClassNameArray(icon) {
        const match = ThemeIconIdRegex.exec(icon.id);
        if (!match) {
            return asClassNameArray(_codicons_js__WEBPACK_IMPORTED_MODULE_0__/* .Codicon */ .W.error);
        }
        const [, id, modifier] = match;
        const classNames = ['codicon', 'codicon-' + id];
        if (modifier) {
            classNames.push('codicon-modifier-' + modifier.substring(1));
        }
        return classNames;
    }
    ThemeIcon.asClassNameArray = asClassNameArray;
    function asClassName(icon) {
        return asClassNameArray(icon).join(' ');
    }
    ThemeIcon.asClassName = asClassName;
    function asCSSSelector(icon) {
        return '.' + asClassNameArray(icon).join('.');
    }
    ThemeIcon.asCSSSelector = asCSSSelector;
    function isThemeIcon(obj) {
        return obj && typeof obj === 'object' && typeof obj.id === 'string' && (typeof obj.color === 'undefined' || ThemeColor.isThemeColor(obj.color));
    }
    ThemeIcon.isThemeIcon = isThemeIcon;
    const _regexFromString = new RegExp(`^\\$\\((${ThemeIcon.iconNameExpression}(?:${ThemeIcon.iconModifierExpression})?)\\)$`);
    function fromString(str) {
        const match = _regexFromString.exec(str);
        if (!match) {
            return undefined;
        }
        const [, name] = match;
        return { id: name };
    }
    ThemeIcon.fromString = fromString;
    function fromId(id) {
        return { id };
    }
    ThemeIcon.fromId = fromId;
    function modify(icon, modifier) {
        let id = icon.id;
        const tildeIndex = id.lastIndexOf('~');
        if (tildeIndex !== -1) {
            id = id.substring(0, tildeIndex);
        }
        if (modifier) {
            id = `${id}~${modifier}`;
        }
        return { id };
    }
    ThemeIcon.modify = modify;
    function getModifier(icon) {
        const tildeIndex = icon.id.lastIndexOf('~');
        if (tildeIndex !== -1) {
            return icon.id.substring(tildeIndex + 1);
        }
        return undefined;
    }
    ThemeIcon.getModifier = getModifier;
    function isEqual(ti1, ti2) {
        return ti1.id === ti2.id && ti1.color?.id === ti2.color?.id;
    }
    ThemeIcon.isEqual = isEqual;
})(ThemeIcon || (ThemeIcon = {}));


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

/***/ 78148
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getIconClasses: () => (/* binding */ getIconClasses)
/* harmony export */ });
/* harmony import */ var _base_common_network_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(13072);
/* harmony import */ var _base_common_resources_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(22467);
/* harmony import */ var _base_common_uri_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(37264);
/* harmony import */ var _languages_modesRegistry_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(54957);
/* harmony import */ var _platform_files_common_files_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(89971);
/* harmony import */ var _base_common_themables_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(58881);
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/






const fileIconDirectoryRegex = /(?:\/|^)(?:([^\/]+)\/)?([^\/]+)$/;
function getIconClasses(modelService, languageService, resource, fileKind, icon) {
    if (_base_common_themables_js__WEBPACK_IMPORTED_MODULE_5__/* .ThemeIcon */ .L.isThemeIcon(icon)) {
        return [`codicon-${icon.id}`, 'predefined-file-icon'];
    }
    if (_base_common_uri_js__WEBPACK_IMPORTED_MODULE_2__/* .URI */ .r.isUri(icon)) {
        return [];
    }
    // we always set these base classes even if we do not have a path
    const classes = fileKind === _platform_files_common_files_js__WEBPACK_IMPORTED_MODULE_4__/* .FileKind */ .p.ROOT_FOLDER ? ['rootfolder-icon'] : fileKind === _platform_files_common_files_js__WEBPACK_IMPORTED_MODULE_4__/* .FileKind */ .p.FOLDER ? ['folder-icon'] : ['file-icon'];
    if (resource) {
        // Get the path and name of the resource. For data-URIs, we need to parse specially
        let name;
        if (resource.scheme === _base_common_network_js__WEBPACK_IMPORTED_MODULE_0__/* .Schemas */ .ny.data) {
            const metadata = _base_common_resources_js__WEBPACK_IMPORTED_MODULE_1__/* .DataUri */ .B6.parseMetaData(resource);
            name = metadata.get(_base_common_resources_js__WEBPACK_IMPORTED_MODULE_1__/* .DataUri */ .B6.META_DATA_LABEL);
        }
        else {
            const match = resource.path.match(fileIconDirectoryRegex);
            if (match) {
                name = cssEscape(match[2].toLowerCase());
                if (match[1]) {
                    classes.push(`${cssEscape(match[1].toLowerCase())}-name-dir-icon`); // parent directory
                }
            }
            else {
                name = cssEscape(resource.authority.toLowerCase());
            }
        }
        // Root Folders
        if (fileKind === _platform_files_common_files_js__WEBPACK_IMPORTED_MODULE_4__/* .FileKind */ .p.ROOT_FOLDER) {
            classes.push(`${name}-root-name-folder-icon`);
        }
        // Folders
        else if (fileKind === _platform_files_common_files_js__WEBPACK_IMPORTED_MODULE_4__/* .FileKind */ .p.FOLDER) {
            classes.push(`${name}-name-folder-icon`);
        }
        // Files
        else {
            // Name & Extension(s)
            if (name) {
                classes.push(`${name}-name-file-icon`);
                classes.push(`name-file-icon`); // extra segment to increase file-name score
                // Avoid doing an explosive combination of extensions for very long filenames
                // (most file systems do not allow files > 255 length) with lots of `.` characters
                // https://github.com/microsoft/vscode/issues/116199
                if (name.length <= 255) {
                    const dotSegments = name.split('.');
                    for (let i = 1; i < dotSegments.length; i++) {
                        classes.push(`${dotSegments.slice(i).join('.')}-ext-file-icon`); // add each combination of all found extensions if more than one
                    }
                }
                classes.push(`ext-file-icon`); // extra segment to increase file-ext score
            }
            // Detected Mode
            const detectedLanguageId = detectLanguageId(modelService, languageService, resource);
            if (detectedLanguageId) {
                classes.push(`${cssEscape(detectedLanguageId)}-lang-file-icon`);
            }
        }
    }
    return classes;
}
function detectLanguageId(modelService, languageService, resource) {
    if (!resource) {
        return null; // we need a resource at least
    }
    let languageId = null;
    // Data URI: check for encoded metadata
    if (resource.scheme === _base_common_network_js__WEBPACK_IMPORTED_MODULE_0__/* .Schemas */ .ny.data) {
        const metadata = _base_common_resources_js__WEBPACK_IMPORTED_MODULE_1__/* .DataUri */ .B6.parseMetaData(resource);
        const mime = metadata.get(_base_common_resources_js__WEBPACK_IMPORTED_MODULE_1__/* .DataUri */ .B6.META_DATA_MIME);
        if (mime) {
            languageId = languageService.getLanguageIdByMimeType(mime);
        }
    }
    // Any other URI: check for model if existing
    else {
        const model = modelService.getModel(resource);
        if (model) {
            languageId = model.getLanguageId();
        }
    }
    // only take if the language id is specific (aka no just plain text)
    if (languageId && languageId !== _languages_modesRegistry_js__WEBPACK_IMPORTED_MODULE_3__/* .PLAINTEXT_LANGUAGE_ID */ .vH) {
        return languageId;
    }
    // otherwise fallback to path based detection
    return languageService.guessLanguageIdByFilepathOrFirstLine(resource);
}
function cssEscape(str) {
    return str.replace(/[\s]/g, '/'); // HTML class names can not contain certain whitespace characters (https://dom.spec.whatwg.org/#interface-domtokenlist), use / instead, which doesn't exist in file names.
}


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


/***/ },

/***/ 89971
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   p: () => (/* binding */ FileKind)
/* harmony export */ });
//#endregion
//#region Utilities
var FileKind;
(function (FileKind) {
    FileKind[FileKind["FILE"] = 0] = "FILE";
    FileKind[FileKind["FOLDER"] = 1] = "FOLDER";
    FileKind[FileKind["ROOT_FOLDER"] = 2] = "ROOT_FOLDER";
})(FileKind || (FileKind = {}));
//#endregion


/***/ }

}]);