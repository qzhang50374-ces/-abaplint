"use strict";
(self["webpackChunkabaplint_playground"] = self["webpackChunkabaplint_playground"] || []).push([[11,4830],{

/***/ 27619
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DR: () => (/* binding */ IMarkerService),
/* harmony export */   cj: () => (/* binding */ MarkerSeverity),
/* harmony export */   oc: () => (/* binding */ IMarkerData)
/* harmony export */ });
/* harmony import */ var _base_common_severity_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(66459);
/* harmony import */ var _nls_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(19746);
/* harmony import */ var _instantiation_common_instantiation_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(82399);
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/



var MarkerSeverity;
(function (MarkerSeverity) {
    MarkerSeverity[MarkerSeverity["Hint"] = 1] = "Hint";
    MarkerSeverity[MarkerSeverity["Info"] = 2] = "Info";
    MarkerSeverity[MarkerSeverity["Warning"] = 4] = "Warning";
    MarkerSeverity[MarkerSeverity["Error"] = 8] = "Error";
})(MarkerSeverity || (MarkerSeverity = {}));
(function (MarkerSeverity) {
    function compare(a, b) {
        return b - a;
    }
    MarkerSeverity.compare = compare;
    const _displayStrings = Object.create(null);
    _displayStrings[MarkerSeverity.Error] = (0,_nls_js__WEBPACK_IMPORTED_MODULE_1__/* .localize */ .kg)('sev.error', "Error");
    _displayStrings[MarkerSeverity.Warning] = (0,_nls_js__WEBPACK_IMPORTED_MODULE_1__/* .localize */ .kg)('sev.warning', "Warning");
    _displayStrings[MarkerSeverity.Info] = (0,_nls_js__WEBPACK_IMPORTED_MODULE_1__/* .localize */ .kg)('sev.info', "Info");
    function toString(a) {
        return _displayStrings[a] || '';
    }
    MarkerSeverity.toString = toString;
    function fromSeverity(severity) {
        switch (severity) {
            case _base_common_severity_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.Error: return MarkerSeverity.Error;
            case _base_common_severity_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.Warning: return MarkerSeverity.Warning;
            case _base_common_severity_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.Info: return MarkerSeverity.Info;
            case _base_common_severity_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.Ignore: return MarkerSeverity.Hint;
        }
    }
    MarkerSeverity.fromSeverity = fromSeverity;
    function toSeverity(severity) {
        switch (severity) {
            case MarkerSeverity.Error: return _base_common_severity_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.Error;
            case MarkerSeverity.Warning: return _base_common_severity_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.Warning;
            case MarkerSeverity.Info: return _base_common_severity_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.Info;
            case MarkerSeverity.Hint: return _base_common_severity_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.Ignore;
        }
    }
    MarkerSeverity.toSeverity = toSeverity;
})(MarkerSeverity || (MarkerSeverity = {}));
var IMarkerData;
(function (IMarkerData) {
    const emptyString = '';
    function makeKey(markerData) {
        return makeKeyOptionalMessage(markerData, true);
    }
    IMarkerData.makeKey = makeKey;
    function makeKeyOptionalMessage(markerData, useMessage) {
        const result = [emptyString];
        if (markerData.source) {
            result.push(markerData.source.replace('¦', '\\¦'));
        }
        else {
            result.push(emptyString);
        }
        if (markerData.code) {
            if (typeof markerData.code === 'string') {
                result.push(markerData.code.replace('¦', '\\¦'));
            }
            else {
                result.push(markerData.code.value.replace('¦', '\\¦'));
            }
        }
        else {
            result.push(emptyString);
        }
        if (markerData.severity !== undefined && markerData.severity !== null) {
            result.push(MarkerSeverity.toString(markerData.severity));
        }
        else {
            result.push(emptyString);
        }
        // Modifed to not include the message as part of the marker key to work around
        // https://github.com/microsoft/vscode/issues/77475
        if (markerData.message && useMessage) {
            result.push(markerData.message.replace('¦', '\\¦'));
        }
        else {
            result.push(emptyString);
        }
        if (markerData.startLineNumber !== undefined && markerData.startLineNumber !== null) {
            result.push(markerData.startLineNumber.toString());
        }
        else {
            result.push(emptyString);
        }
        if (markerData.startColumn !== undefined && markerData.startColumn !== null) {
            result.push(markerData.startColumn.toString());
        }
        else {
            result.push(emptyString);
        }
        if (markerData.endLineNumber !== undefined && markerData.endLineNumber !== null) {
            result.push(markerData.endLineNumber.toString());
        }
        else {
            result.push(emptyString);
        }
        if (markerData.endColumn !== undefined && markerData.endColumn !== null) {
            result.push(markerData.endColumn.toString());
        }
        else {
            result.push(emptyString);
        }
        result.push(emptyString);
        return result.join('¦');
    }
    IMarkerData.makeKeyOptionalMessage = makeKeyOptionalMessage;
})(IMarkerData || (IMarkerData = {}));
const IMarkerService = (0,_instantiation_common_instantiation_js__WEBPACK_IMPORTED_MODULE_2__/* .createDecorator */ .u1)('markerService');


/***/ },

/***/ 48295
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A3: () => (/* binding */ editorActiveIndentGuide4),
/* harmony export */   AQ: () => (/* binding */ overviewRulerInfo),
/* harmony export */   Am: () => (/* binding */ editorActiveIndentGuide2),
/* harmony export */   As: () => (/* binding */ editorActiveIndentGuide6),
/* harmony export */   BD: () => (/* binding */ editorBracketPairGuideBackground5),
/* harmony export */   Bo: () => (/* binding */ editorBracketPairGuideBackground3),
/* harmony export */   CM: () => (/* binding */ editorIndentGuide6),
/* harmony export */   D0: () => (/* binding */ editorCursorForeground),
/* harmony export */   Ek: () => (/* binding */ ghostTextForeground),
/* harmony export */   H0: () => (/* binding */ editorActiveIndentGuide1),
/* harmony export */   I2: () => (/* binding */ editorBracketPairGuideBackground2),
/* harmony export */   IW: () => (/* binding */ editorBracketPairGuideBackground6),
/* harmony export */   If: () => (/* binding */ editorBracketPairGuideBackground4),
/* harmony export */   JB: () => (/* binding */ editorDimmedLineNumber),
/* harmony export */   L0: () => (/* binding */ editorMultiCursorSecondaryBackground),
/* harmony export */   Mf: () => (/* binding */ editorLineHighlightBorder),
/* harmony export */   P1: () => (/* binding */ editorBracketPairGuideActiveBackground5),
/* harmony export */   Pe: () => (/* binding */ editorBracketPairGuideActiveBackground3),
/* harmony export */   Qt: () => (/* binding */ editorLineNumbers),
/* harmony export */   WD: () => (/* binding */ editorBracketPairGuideActiveBackground4),
/* harmony export */   WS: () => (/* binding */ editorBracketPairGuideActiveBackground2),
/* harmony export */   WY: () => (/* binding */ editorBracketPairGuideActiveBackground6),
/* harmony export */   Xr: () => (/* binding */ editorOverviewRulerBackground),
/* harmony export */   aZ: () => (/* binding */ overviewRulerWarning),
/* harmony export */   bB: () => (/* binding */ editorBracketPairGuideActiveBackground1),
/* harmony export */   hz: () => (/* binding */ editorIndentGuide3),
/* harmony export */   je: () => (/* binding */ editorMultiCursorPrimaryBackground),
/* harmony export */   kG: () => (/* binding */ editorLineHighlight),
/* harmony export */   kM: () => (/* binding */ editorCursorBackground),
/* harmony export */   l5: () => (/* binding */ editorBracketHighlightingForeground4),
/* harmony export */   lQ: () => (/* binding */ editorBracketHighlightingForeground2),
/* harmony export */   n4: () => (/* binding */ editorBracketPairGuideBackground1),
/* harmony export */   ob: () => (/* binding */ editorIndentGuide2),
/* harmony export */   ow: () => (/* binding */ editorIndentGuide4),
/* harmony export */   s7: () => (/* binding */ editorBracketHighlightingUnexpectedBracketForeground),
/* harmony export */   sC: () => (/* binding */ editorMultiCursorPrimaryForeground),
/* harmony export */   sH: () => (/* binding */ editorBracketHighlightingForeground5),
/* harmony export */   sN: () => (/* binding */ editorBracketHighlightingForeground1),
/* harmony export */   ss: () => (/* binding */ editorBracketHighlightingForeground3),
/* harmony export */   tK: () => (/* binding */ editorActiveIndentGuide3),
/* harmony export */   tp: () => (/* binding */ editorActiveIndentGuide5),
/* harmony export */   vP: () => (/* binding */ editorIndentGuide5),
/* harmony export */   vV: () => (/* binding */ editorIndentGuide1),
/* harmony export */   vp: () => (/* binding */ overviewRulerRangeHighlight),
/* harmony export */   w4: () => (/* binding */ editorWhitespaces),
/* harmony export */   we: () => (/* binding */ editorMultiCursorSecondaryForeground),
/* harmony export */   x9: () => (/* binding */ editorOverviewRulerBorder),
/* harmony export */   yI: () => (/* binding */ overviewRulerError),
/* harmony export */   yw: () => (/* binding */ editorUnnecessaryCodeOpacity),
/* harmony export */   zp: () => (/* binding */ editorBracketHighlightingForeground6)
/* harmony export */ });
/* unused harmony exports editorRangeHighlight, editorRangeHighlightBorder, editorSymbolHighlight, editorSymbolHighlightBorder, deprecatedEditorIndentGuides, deprecatedEditorActiveIndentGuides, editorActiveLineNumber, editorRuler, editorCodeLensForeground, editorBracketMatchBackground, editorBracketMatchBorder, editorGutter, editorUnnecessaryCodeBorder, ghostTextBorder, ghostTextBackground, editorUnicodeHighlightBorder, editorUnicodeHighlightBackground */
/* harmony import */ var _nls_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(19746);
/* harmony import */ var _base_common_color_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(94901);
/* harmony import */ var _platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(70559);
/* harmony import */ var _platform_theme_common_themeService_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(89044);
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/




/**
 * Definition of the editor colors
 */
const editorLineHighlight = (0,_platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .registerColor */ .x1A)('editor.lineHighlightBackground', null, _nls_js__WEBPACK_IMPORTED_MODULE_0__/* .localize */ .kg('lineHighlight', 'Background color for the highlight of line at the cursor position.'));
const editorLineHighlightBorder = (0,_platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .registerColor */ .x1A)('editor.lineHighlightBorder', { dark: '#282828', light: '#eeeeee', hcDark: '#f38518', hcLight: _platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .contrastBorder */ .b1q }, _nls_js__WEBPACK_IMPORTED_MODULE_0__/* .localize */ .kg('lineHighlightBorderBox', 'Background color for the border around the line at the cursor position.'));
const editorRangeHighlight = (0,_platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .registerColor */ .x1A)('editor.rangeHighlightBackground', { dark: '#ffffff0b', light: '#fdff0033', hcDark: null, hcLight: null }, _nls_js__WEBPACK_IMPORTED_MODULE_0__/* .localize */ .kg('rangeHighlight', 'Background color of highlighted ranges, like by quick open and find features. The color must not be opaque so as not to hide underlying decorations.'), true);
const editorRangeHighlightBorder = (0,_platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .registerColor */ .x1A)('editor.rangeHighlightBorder', { dark: null, light: null, hcDark: _platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .activeContrastBorder */ .buw, hcLight: _platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .activeContrastBorder */ .buw }, _nls_js__WEBPACK_IMPORTED_MODULE_0__/* .localize */ .kg('rangeHighlightBorder', 'Background color of the border around highlighted ranges.'));
const editorSymbolHighlight = (0,_platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .registerColor */ .x1A)('editor.symbolHighlightBackground', { dark: _platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .editorFindMatchHighlight */ .Ubg, light: _platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .editorFindMatchHighlight */ .Ubg, hcDark: null, hcLight: null }, _nls_js__WEBPACK_IMPORTED_MODULE_0__/* .localize */ .kg('symbolHighlight', 'Background color of highlighted symbol, like for go to definition or go next/previous symbol. The color must not be opaque so as not to hide underlying decorations.'), true);
const editorSymbolHighlightBorder = (0,_platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .registerColor */ .x1A)('editor.symbolHighlightBorder', { dark: null, light: null, hcDark: _platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .activeContrastBorder */ .buw, hcLight: _platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .activeContrastBorder */ .buw }, _nls_js__WEBPACK_IMPORTED_MODULE_0__/* .localize */ .kg('symbolHighlightBorder', 'Background color of the border around highlighted symbols.'));
const editorCursorForeground = (0,_platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .registerColor */ .x1A)('editorCursor.foreground', { dark: '#AEAFAD', light: _base_common_color_js__WEBPACK_IMPORTED_MODULE_1__/* .Color */ .Q1.black, hcDark: _base_common_color_js__WEBPACK_IMPORTED_MODULE_1__/* .Color */ .Q1.white, hcLight: '#0F4A85' }, _nls_js__WEBPACK_IMPORTED_MODULE_0__/* .localize */ .kg('caret', 'Color of the editor cursor.'));
const editorCursorBackground = (0,_platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .registerColor */ .x1A)('editorCursor.background', null, _nls_js__WEBPACK_IMPORTED_MODULE_0__/* .localize */ .kg('editorCursorBackground', 'The background color of the editor cursor. Allows customizing the color of a character overlapped by a block cursor.'));
const editorMultiCursorPrimaryForeground = (0,_platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .registerColor */ .x1A)('editorMultiCursor.primary.foreground', editorCursorForeground, _nls_js__WEBPACK_IMPORTED_MODULE_0__/* .localize */ .kg('editorMultiCursorPrimaryForeground', 'Color of the primary editor cursor when multiple cursors are present.'));
const editorMultiCursorPrimaryBackground = (0,_platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .registerColor */ .x1A)('editorMultiCursor.primary.background', editorCursorBackground, _nls_js__WEBPACK_IMPORTED_MODULE_0__/* .localize */ .kg('editorMultiCursorPrimaryBackground', 'The background color of the primary editor cursor when multiple cursors are present. Allows customizing the color of a character overlapped by a block cursor.'));
const editorMultiCursorSecondaryForeground = (0,_platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .registerColor */ .x1A)('editorMultiCursor.secondary.foreground', editorCursorForeground, _nls_js__WEBPACK_IMPORTED_MODULE_0__/* .localize */ .kg('editorMultiCursorSecondaryForeground', 'Color of secondary editor cursors when multiple cursors are present.'));
const editorMultiCursorSecondaryBackground = (0,_platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .registerColor */ .x1A)('editorMultiCursor.secondary.background', editorCursorBackground, _nls_js__WEBPACK_IMPORTED_MODULE_0__/* .localize */ .kg('editorMultiCursorSecondaryBackground', 'The background color of secondary editor cursors when multiple cursors are present. Allows customizing the color of a character overlapped by a block cursor.'));
const editorWhitespaces = (0,_platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .registerColor */ .x1A)('editorWhitespace.foreground', { dark: '#e3e4e229', light: '#33333333', hcDark: '#e3e4e229', hcLight: '#CCCCCC' }, _nls_js__WEBPACK_IMPORTED_MODULE_0__/* .localize */ .kg('editorWhitespaces', 'Color of whitespace characters in the editor.'));
const editorLineNumbers = (0,_platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .registerColor */ .x1A)('editorLineNumber.foreground', { dark: '#858585', light: '#237893', hcDark: _base_common_color_js__WEBPACK_IMPORTED_MODULE_1__/* .Color */ .Q1.white, hcLight: '#292929' }, _nls_js__WEBPACK_IMPORTED_MODULE_0__/* .localize */ .kg('editorLineNumbers', 'Color of editor line numbers.'));
const deprecatedEditorIndentGuides = (0,_platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .registerColor */ .x1A)('editorIndentGuide.background', editorWhitespaces, _nls_js__WEBPACK_IMPORTED_MODULE_0__/* .localize */ .kg('editorIndentGuides', 'Color of the editor indentation guides.'), false, _nls_js__WEBPACK_IMPORTED_MODULE_0__/* .localize */ .kg('deprecatedEditorIndentGuides', '\'editorIndentGuide.background\' is deprecated. Use \'editorIndentGuide.background1\' instead.'));
const deprecatedEditorActiveIndentGuides = (0,_platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .registerColor */ .x1A)('editorIndentGuide.activeBackground', editorWhitespaces, _nls_js__WEBPACK_IMPORTED_MODULE_0__/* .localize */ .kg('editorActiveIndentGuide', 'Color of the active editor indentation guides.'), false, _nls_js__WEBPACK_IMPORTED_MODULE_0__/* .localize */ .kg('deprecatedEditorActiveIndentGuide', '\'editorIndentGuide.activeBackground\' is deprecated. Use \'editorIndentGuide.activeBackground1\' instead.'));
const editorIndentGuide1 = (0,_platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .registerColor */ .x1A)('editorIndentGuide.background1', deprecatedEditorIndentGuides, _nls_js__WEBPACK_IMPORTED_MODULE_0__/* .localize */ .kg('editorIndentGuides1', 'Color of the editor indentation guides (1).'));
const editorIndentGuide2 = (0,_platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .registerColor */ .x1A)('editorIndentGuide.background2', '#00000000', _nls_js__WEBPACK_IMPORTED_MODULE_0__/* .localize */ .kg('editorIndentGuides2', 'Color of the editor indentation guides (2).'));
const editorIndentGuide3 = (0,_platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .registerColor */ .x1A)('editorIndentGuide.background3', '#00000000', _nls_js__WEBPACK_IMPORTED_MODULE_0__/* .localize */ .kg('editorIndentGuides3', 'Color of the editor indentation guides (3).'));
const editorIndentGuide4 = (0,_platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .registerColor */ .x1A)('editorIndentGuide.background4', '#00000000', _nls_js__WEBPACK_IMPORTED_MODULE_0__/* .localize */ .kg('editorIndentGuides4', 'Color of the editor indentation guides (4).'));
const editorIndentGuide5 = (0,_platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .registerColor */ .x1A)('editorIndentGuide.background5', '#00000000', _nls_js__WEBPACK_IMPORTED_MODULE_0__/* .localize */ .kg('editorIndentGuides5', 'Color of the editor indentation guides (5).'));
const editorIndentGuide6 = (0,_platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .registerColor */ .x1A)('editorIndentGuide.background6', '#00000000', _nls_js__WEBPACK_IMPORTED_MODULE_0__/* .localize */ .kg('editorIndentGuides6', 'Color of the editor indentation guides (6).'));
const editorActiveIndentGuide1 = (0,_platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .registerColor */ .x1A)('editorIndentGuide.activeBackground1', deprecatedEditorActiveIndentGuides, _nls_js__WEBPACK_IMPORTED_MODULE_0__/* .localize */ .kg('editorActiveIndentGuide1', 'Color of the active editor indentation guides (1).'));
const editorActiveIndentGuide2 = (0,_platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .registerColor */ .x1A)('editorIndentGuide.activeBackground2', '#00000000', _nls_js__WEBPACK_IMPORTED_MODULE_0__/* .localize */ .kg('editorActiveIndentGuide2', 'Color of the active editor indentation guides (2).'));
const editorActiveIndentGuide3 = (0,_platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .registerColor */ .x1A)('editorIndentGuide.activeBackground3', '#00000000', _nls_js__WEBPACK_IMPORTED_MODULE_0__/* .localize */ .kg('editorActiveIndentGuide3', 'Color of the active editor indentation guides (3).'));
const editorActiveIndentGuide4 = (0,_platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .registerColor */ .x1A)('editorIndentGuide.activeBackground4', '#00000000', _nls_js__WEBPACK_IMPORTED_MODULE_0__/* .localize */ .kg('editorActiveIndentGuide4', 'Color of the active editor indentation guides (4).'));
const editorActiveIndentGuide5 = (0,_platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .registerColor */ .x1A)('editorIndentGuide.activeBackground5', '#00000000', _nls_js__WEBPACK_IMPORTED_MODULE_0__/* .localize */ .kg('editorActiveIndentGuide5', 'Color of the active editor indentation guides (5).'));
const editorActiveIndentGuide6 = (0,_platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .registerColor */ .x1A)('editorIndentGuide.activeBackground6', '#00000000', _nls_js__WEBPACK_IMPORTED_MODULE_0__/* .localize */ .kg('editorActiveIndentGuide6', 'Color of the active editor indentation guides (6).'));
const deprecatedEditorActiveLineNumber = (0,_platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .registerColor */ .x1A)('editorActiveLineNumber.foreground', { dark: '#c6c6c6', light: '#0B216F', hcDark: _platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .activeContrastBorder */ .buw, hcLight: _platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .activeContrastBorder */ .buw }, _nls_js__WEBPACK_IMPORTED_MODULE_0__/* .localize */ .kg('editorActiveLineNumber', 'Color of editor active line number'), false, _nls_js__WEBPACK_IMPORTED_MODULE_0__/* .localize */ .kg('deprecatedEditorActiveLineNumber', 'Id is deprecated. Use \'editorLineNumber.activeForeground\' instead.'));
const editorActiveLineNumber = (0,_platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .registerColor */ .x1A)('editorLineNumber.activeForeground', deprecatedEditorActiveLineNumber, _nls_js__WEBPACK_IMPORTED_MODULE_0__/* .localize */ .kg('editorActiveLineNumber', 'Color of editor active line number'));
const editorDimmedLineNumber = (0,_platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .registerColor */ .x1A)('editorLineNumber.dimmedForeground', null, _nls_js__WEBPACK_IMPORTED_MODULE_0__/* .localize */ .kg('editorDimmedLineNumber', 'Color of the final editor line when editor.renderFinalNewline is set to dimmed.'));
const editorRuler = (0,_platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .registerColor */ .x1A)('editorRuler.foreground', { dark: '#5A5A5A', light: _base_common_color_js__WEBPACK_IMPORTED_MODULE_1__/* .Color */ .Q1.lightgrey, hcDark: _base_common_color_js__WEBPACK_IMPORTED_MODULE_1__/* .Color */ .Q1.white, hcLight: '#292929' }, _nls_js__WEBPACK_IMPORTED_MODULE_0__/* .localize */ .kg('editorRuler', 'Color of the editor rulers.'));
const editorCodeLensForeground = (0,_platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .registerColor */ .x1A)('editorCodeLens.foreground', { dark: '#999999', light: '#919191', hcDark: '#999999', hcLight: '#292929' }, _nls_js__WEBPACK_IMPORTED_MODULE_0__/* .localize */ .kg('editorCodeLensForeground', 'Foreground color of editor CodeLens'));
const editorBracketMatchBackground = (0,_platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .registerColor */ .x1A)('editorBracketMatch.background', { dark: '#0064001a', light: '#0064001a', hcDark: '#0064001a', hcLight: '#0000' }, _nls_js__WEBPACK_IMPORTED_MODULE_0__/* .localize */ .kg('editorBracketMatchBackground', 'Background color behind matching brackets'));
const editorBracketMatchBorder = (0,_platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .registerColor */ .x1A)('editorBracketMatch.border', { dark: '#888', light: '#B9B9B9', hcDark: _platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .contrastBorder */ .b1q, hcLight: _platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .contrastBorder */ .b1q }, _nls_js__WEBPACK_IMPORTED_MODULE_0__/* .localize */ .kg('editorBracketMatchBorder', 'Color for matching brackets boxes'));
const editorOverviewRulerBorder = (0,_platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .registerColor */ .x1A)('editorOverviewRuler.border', { dark: '#7f7f7f4d', light: '#7f7f7f4d', hcDark: '#7f7f7f4d', hcLight: '#666666' }, _nls_js__WEBPACK_IMPORTED_MODULE_0__/* .localize */ .kg('editorOverviewRulerBorder', 'Color of the overview ruler border.'));
const editorOverviewRulerBackground = (0,_platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .registerColor */ .x1A)('editorOverviewRuler.background', null, _nls_js__WEBPACK_IMPORTED_MODULE_0__/* .localize */ .kg('editorOverviewRulerBackground', 'Background color of the editor overview ruler.'));
const editorGutter = (0,_platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .registerColor */ .x1A)('editorGutter.background', _platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .editorBackground */ .YtV, _nls_js__WEBPACK_IMPORTED_MODULE_0__/* .localize */ .kg('editorGutter', 'Background color of the editor gutter. The gutter contains the glyph margins and the line numbers.'));
const editorUnnecessaryCodeBorder = (0,_platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .registerColor */ .x1A)('editorUnnecessaryCode.border', { dark: null, light: null, hcDark: _base_common_color_js__WEBPACK_IMPORTED_MODULE_1__/* .Color */ .Q1.fromHex('#fff').transparent(0.8), hcLight: _platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .contrastBorder */ .b1q }, _nls_js__WEBPACK_IMPORTED_MODULE_0__/* .localize */ .kg('unnecessaryCodeBorder', 'Border color of unnecessary (unused) source code in the editor.'));
const editorUnnecessaryCodeOpacity = (0,_platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .registerColor */ .x1A)('editorUnnecessaryCode.opacity', { dark: _base_common_color_js__WEBPACK_IMPORTED_MODULE_1__/* .Color */ .Q1.fromHex('#000a'), light: _base_common_color_js__WEBPACK_IMPORTED_MODULE_1__/* .Color */ .Q1.fromHex('#0007'), hcDark: null, hcLight: null }, _nls_js__WEBPACK_IMPORTED_MODULE_0__/* .localize */ .kg('unnecessaryCodeOpacity', 'Opacity of unnecessary (unused) source code in the editor. For example, "#000000c0" will render the code with 75% opacity. For high contrast themes, use the  \'editorUnnecessaryCode.border\' theme color to underline unnecessary code instead of fading it out.'));
const ghostTextBorder = (0,_platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .registerColor */ .x1A)('editorGhostText.border', { dark: null, light: null, hcDark: _base_common_color_js__WEBPACK_IMPORTED_MODULE_1__/* .Color */ .Q1.fromHex('#fff').transparent(0.8), hcLight: _base_common_color_js__WEBPACK_IMPORTED_MODULE_1__/* .Color */ .Q1.fromHex('#292929').transparent(0.8) }, _nls_js__WEBPACK_IMPORTED_MODULE_0__/* .localize */ .kg('editorGhostTextBorder', 'Border color of ghost text in the editor.'));
const ghostTextForeground = (0,_platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .registerColor */ .x1A)('editorGhostText.foreground', { dark: _base_common_color_js__WEBPACK_IMPORTED_MODULE_1__/* .Color */ .Q1.fromHex('#ffffff56'), light: _base_common_color_js__WEBPACK_IMPORTED_MODULE_1__/* .Color */ .Q1.fromHex('#0007'), hcDark: null, hcLight: null }, _nls_js__WEBPACK_IMPORTED_MODULE_0__/* .localize */ .kg('editorGhostTextForeground', 'Foreground color of the ghost text in the editor.'));
const ghostTextBackground = (0,_platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .registerColor */ .x1A)('editorGhostText.background', null, _nls_js__WEBPACK_IMPORTED_MODULE_0__/* .localize */ .kg('editorGhostTextBackground', 'Background color of the ghost text in the editor.'));
const rulerRangeDefault = new _base_common_color_js__WEBPACK_IMPORTED_MODULE_1__/* .Color */ .Q1(new _base_common_color_js__WEBPACK_IMPORTED_MODULE_1__/* .RGBA */ .bU(0, 122, 204, 0.6));
const overviewRulerRangeHighlight = (0,_platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .registerColor */ .x1A)('editorOverviewRuler.rangeHighlightForeground', rulerRangeDefault, _nls_js__WEBPACK_IMPORTED_MODULE_0__/* .localize */ .kg('overviewRulerRangeHighlight', 'Overview ruler marker color for range highlights. The color must not be opaque so as not to hide underlying decorations.'), true);
const overviewRulerError = (0,_platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .registerColor */ .x1A)('editorOverviewRuler.errorForeground', { dark: new _base_common_color_js__WEBPACK_IMPORTED_MODULE_1__/* .Color */ .Q1(new _base_common_color_js__WEBPACK_IMPORTED_MODULE_1__/* .RGBA */ .bU(255, 18, 18, 0.7)), light: new _base_common_color_js__WEBPACK_IMPORTED_MODULE_1__/* .Color */ .Q1(new _base_common_color_js__WEBPACK_IMPORTED_MODULE_1__/* .RGBA */ .bU(255, 18, 18, 0.7)), hcDark: new _base_common_color_js__WEBPACK_IMPORTED_MODULE_1__/* .Color */ .Q1(new _base_common_color_js__WEBPACK_IMPORTED_MODULE_1__/* .RGBA */ .bU(255, 50, 50, 1)), hcLight: '#B5200D' }, _nls_js__WEBPACK_IMPORTED_MODULE_0__/* .localize */ .kg('overviewRuleError', 'Overview ruler marker color for errors.'));
const overviewRulerWarning = (0,_platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .registerColor */ .x1A)('editorOverviewRuler.warningForeground', { dark: _platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .editorWarningForeground */ .Hng, light: _platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .editorWarningForeground */ .Hng, hcDark: _platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .editorWarningBorder */ .Stt, hcLight: _platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .editorWarningBorder */ .Stt }, _nls_js__WEBPACK_IMPORTED_MODULE_0__/* .localize */ .kg('overviewRuleWarning', 'Overview ruler marker color for warnings.'));
const overviewRulerInfo = (0,_platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .registerColor */ .x1A)('editorOverviewRuler.infoForeground', { dark: _platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .editorInfoForeground */ .pOz, light: _platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .editorInfoForeground */ .pOz, hcDark: _platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .editorInfoBorder */ .IIb, hcLight: _platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .editorInfoBorder */ .IIb }, _nls_js__WEBPACK_IMPORTED_MODULE_0__/* .localize */ .kg('overviewRuleInfo', 'Overview ruler marker color for infos.'));
const editorBracketHighlightingForeground1 = (0,_platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .registerColor */ .x1A)('editorBracketHighlight.foreground1', { dark: '#FFD700', light: '#0431FAFF', hcDark: '#FFD700', hcLight: '#0431FAFF' }, _nls_js__WEBPACK_IMPORTED_MODULE_0__/* .localize */ .kg('editorBracketHighlightForeground1', 'Foreground color of brackets (1). Requires enabling bracket pair colorization.'));
const editorBracketHighlightingForeground2 = (0,_platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .registerColor */ .x1A)('editorBracketHighlight.foreground2', { dark: '#DA70D6', light: '#319331FF', hcDark: '#DA70D6', hcLight: '#319331FF' }, _nls_js__WEBPACK_IMPORTED_MODULE_0__/* .localize */ .kg('editorBracketHighlightForeground2', 'Foreground color of brackets (2). Requires enabling bracket pair colorization.'));
const editorBracketHighlightingForeground3 = (0,_platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .registerColor */ .x1A)('editorBracketHighlight.foreground3', { dark: '#179FFF', light: '#7B3814FF', hcDark: '#87CEFA', hcLight: '#7B3814FF' }, _nls_js__WEBPACK_IMPORTED_MODULE_0__/* .localize */ .kg('editorBracketHighlightForeground3', 'Foreground color of brackets (3). Requires enabling bracket pair colorization.'));
const editorBracketHighlightingForeground4 = (0,_platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .registerColor */ .x1A)('editorBracketHighlight.foreground4', '#00000000', _nls_js__WEBPACK_IMPORTED_MODULE_0__/* .localize */ .kg('editorBracketHighlightForeground4', 'Foreground color of brackets (4). Requires enabling bracket pair colorization.'));
const editorBracketHighlightingForeground5 = (0,_platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .registerColor */ .x1A)('editorBracketHighlight.foreground5', '#00000000', _nls_js__WEBPACK_IMPORTED_MODULE_0__/* .localize */ .kg('editorBracketHighlightForeground5', 'Foreground color of brackets (5). Requires enabling bracket pair colorization.'));
const editorBracketHighlightingForeground6 = (0,_platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .registerColor */ .x1A)('editorBracketHighlight.foreground6', '#00000000', _nls_js__WEBPACK_IMPORTED_MODULE_0__/* .localize */ .kg('editorBracketHighlightForeground6', 'Foreground color of brackets (6). Requires enabling bracket pair colorization.'));
const editorBracketHighlightingUnexpectedBracketForeground = (0,_platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .registerColor */ .x1A)('editorBracketHighlight.unexpectedBracket.foreground', { dark: new _base_common_color_js__WEBPACK_IMPORTED_MODULE_1__/* .Color */ .Q1(new _base_common_color_js__WEBPACK_IMPORTED_MODULE_1__/* .RGBA */ .bU(255, 18, 18, 0.8)), light: new _base_common_color_js__WEBPACK_IMPORTED_MODULE_1__/* .Color */ .Q1(new _base_common_color_js__WEBPACK_IMPORTED_MODULE_1__/* .RGBA */ .bU(255, 18, 18, 0.8)), hcDark: 'new Color(new RGBA(255, 50, 50, 1))', hcLight: '#B5200D' }, _nls_js__WEBPACK_IMPORTED_MODULE_0__/* .localize */ .kg('editorBracketHighlightUnexpectedBracketForeground', 'Foreground color of unexpected brackets.'));
const editorBracketPairGuideBackground1 = (0,_platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .registerColor */ .x1A)('editorBracketPairGuide.background1', '#00000000', _nls_js__WEBPACK_IMPORTED_MODULE_0__/* .localize */ .kg('editorBracketPairGuide.background1', 'Background color of inactive bracket pair guides (1). Requires enabling bracket pair guides.'));
const editorBracketPairGuideBackground2 = (0,_platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .registerColor */ .x1A)('editorBracketPairGuide.background2', '#00000000', _nls_js__WEBPACK_IMPORTED_MODULE_0__/* .localize */ .kg('editorBracketPairGuide.background2', 'Background color of inactive bracket pair guides (2). Requires enabling bracket pair guides.'));
const editorBracketPairGuideBackground3 = (0,_platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .registerColor */ .x1A)('editorBracketPairGuide.background3', '#00000000', _nls_js__WEBPACK_IMPORTED_MODULE_0__/* .localize */ .kg('editorBracketPairGuide.background3', 'Background color of inactive bracket pair guides (3). Requires enabling bracket pair guides.'));
const editorBracketPairGuideBackground4 = (0,_platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .registerColor */ .x1A)('editorBracketPairGuide.background4', '#00000000', _nls_js__WEBPACK_IMPORTED_MODULE_0__/* .localize */ .kg('editorBracketPairGuide.background4', 'Background color of inactive bracket pair guides (4). Requires enabling bracket pair guides.'));
const editorBracketPairGuideBackground5 = (0,_platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .registerColor */ .x1A)('editorBracketPairGuide.background5', '#00000000', _nls_js__WEBPACK_IMPORTED_MODULE_0__/* .localize */ .kg('editorBracketPairGuide.background5', 'Background color of inactive bracket pair guides (5). Requires enabling bracket pair guides.'));
const editorBracketPairGuideBackground6 = (0,_platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .registerColor */ .x1A)('editorBracketPairGuide.background6', '#00000000', _nls_js__WEBPACK_IMPORTED_MODULE_0__/* .localize */ .kg('editorBracketPairGuide.background6', 'Background color of inactive bracket pair guides (6). Requires enabling bracket pair guides.'));
const editorBracketPairGuideActiveBackground1 = (0,_platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .registerColor */ .x1A)('editorBracketPairGuide.activeBackground1', '#00000000', _nls_js__WEBPACK_IMPORTED_MODULE_0__/* .localize */ .kg('editorBracketPairGuide.activeBackground1', 'Background color of active bracket pair guides (1). Requires enabling bracket pair guides.'));
const editorBracketPairGuideActiveBackground2 = (0,_platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .registerColor */ .x1A)('editorBracketPairGuide.activeBackground2', '#00000000', _nls_js__WEBPACK_IMPORTED_MODULE_0__/* .localize */ .kg('editorBracketPairGuide.activeBackground2', 'Background color of active bracket pair guides (2). Requires enabling bracket pair guides.'));
const editorBracketPairGuideActiveBackground3 = (0,_platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .registerColor */ .x1A)('editorBracketPairGuide.activeBackground3', '#00000000', _nls_js__WEBPACK_IMPORTED_MODULE_0__/* .localize */ .kg('editorBracketPairGuide.activeBackground3', 'Background color of active bracket pair guides (3). Requires enabling bracket pair guides.'));
const editorBracketPairGuideActiveBackground4 = (0,_platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .registerColor */ .x1A)('editorBracketPairGuide.activeBackground4', '#00000000', _nls_js__WEBPACK_IMPORTED_MODULE_0__/* .localize */ .kg('editorBracketPairGuide.activeBackground4', 'Background color of active bracket pair guides (4). Requires enabling bracket pair guides.'));
const editorBracketPairGuideActiveBackground5 = (0,_platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .registerColor */ .x1A)('editorBracketPairGuide.activeBackground5', '#00000000', _nls_js__WEBPACK_IMPORTED_MODULE_0__/* .localize */ .kg('editorBracketPairGuide.activeBackground5', 'Background color of active bracket pair guides (5). Requires enabling bracket pair guides.'));
const editorBracketPairGuideActiveBackground6 = (0,_platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .registerColor */ .x1A)('editorBracketPairGuide.activeBackground6', '#00000000', _nls_js__WEBPACK_IMPORTED_MODULE_0__/* .localize */ .kg('editorBracketPairGuide.activeBackground6', 'Background color of active bracket pair guides (6). Requires enabling bracket pair guides.'));
const editorUnicodeHighlightBorder = (0,_platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .registerColor */ .x1A)('editorUnicodeHighlight.border', _platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .editorWarningForeground */ .Hng, _nls_js__WEBPACK_IMPORTED_MODULE_0__/* .localize */ .kg('editorUnicodeHighlight.border', 'Border color used to highlight unicode characters.'));
const editorUnicodeHighlightBackground = (0,_platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .registerColor */ .x1A)('editorUnicodeHighlight.background', _platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .editorWarningBackground */ .whs, _nls_js__WEBPACK_IMPORTED_MODULE_0__/* .localize */ .kg('editorUnicodeHighlight.background', 'Background color used to highlight unicode characters.'));
// contains all color rules that used to defined in editor/browser/widget/editor.css
(0,_platform_theme_common_themeService_js__WEBPACK_IMPORTED_MODULE_3__/* .registerThemingParticipant */ .zy)((theme, collector) => {
    const background = theme.getColor(_platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_2__/* .editorBackground */ .YtV);
    const lineHighlight = theme.getColor(editorLineHighlight);
    const imeBackground = (lineHighlight && !lineHighlight.isTransparent() ? lineHighlight : background);
    if (imeBackground) {
        collector.addRule(`.monaco-editor .inputarea.ime-input { background-color: ${imeBackground}; }`);
    }
});


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

/***/ 64830
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   IModelService: () => (/* binding */ IModelService)
/* harmony export */ });
/* harmony import */ var _platform_instantiation_common_instantiation_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(82399);
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const IModelService = (0,_platform_instantiation_common_instantiation_js__WEBPACK_IMPORTED_MODULE_0__/* .createDecorator */ .u1)('modelService');


/***/ },

/***/ 66459
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _strings_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(16844);
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

var Severity;
(function (Severity) {
    Severity[Severity["Ignore"] = 0] = "Ignore";
    Severity[Severity["Info"] = 1] = "Info";
    Severity[Severity["Warning"] = 2] = "Warning";
    Severity[Severity["Error"] = 3] = "Error";
})(Severity || (Severity = {}));
(function (Severity) {
    const _error = 'error';
    const _warning = 'warning';
    const _warn = 'warn';
    const _info = 'info';
    const _ignore = 'ignore';
    /**
     * Parses 'error', 'warning', 'warn', 'info' in call casings
     * and falls back to ignore.
     */
    function fromValue(value) {
        if (!value) {
            return Severity.Ignore;
        }
        if (_strings_js__WEBPACK_IMPORTED_MODULE_0__/* .equalsIgnoreCase */ .Q_(_error, value)) {
            return Severity.Error;
        }
        if (_strings_js__WEBPACK_IMPORTED_MODULE_0__/* .equalsIgnoreCase */ .Q_(_warning, value) || _strings_js__WEBPACK_IMPORTED_MODULE_0__/* .equalsIgnoreCase */ .Q_(_warn, value)) {
            return Severity.Warning;
        }
        if (_strings_js__WEBPACK_IMPORTED_MODULE_0__/* .equalsIgnoreCase */ .Q_(_info, value)) {
            return Severity.Info;
        }
        return Severity.Ignore;
    }
    Severity.fromValue = fromValue;
    function toString(severity) {
        switch (severity) {
            case Severity.Error: return _error;
            case Severity.Warning: return _warning;
            case Severity.Info: return _info;
            default: return _ignore;
        }
    }
    Severity.toString = toString;
})(Severity || (Severity = {}));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Severity);


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

/***/ 70559
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  FdG: () => (/* reexport */ colorUtils/* Extensions */.Fd),
  buw: () => (/* reexport */ activeContrastBorder),
  GuP: () => (/* reexport */ colorUtils/* asCssVariable */.Gu),
  Bbc: () => (/* reexport */ colorUtils/* asCssVariableName */.Bb),
  HP_: () => (/* reexport */ colorUtils/* asCssVariableWithDefault */.HP),
  WMx: () => (/* reexport */ badgeBackground),
  zRE: () => (/* reexport */ badgeForeground),
  sAS: () => (/* reexport */ breadcrumbsActiveSelectionForeground),
  vV$: () => (/* reexport */ breadcrumbsBackground),
  etE: () => (/* reexport */ breadcrumbsFocusForeground),
  mc0: () => (/* reexport */ breadcrumbsForeground),
  XJc: () => (/* reexport */ buttonBackground),
  raQ: () => (/* reexport */ buttonBorder),
  G_h: () => (/* reexport */ buttonForeground),
  T9h: () => (/* reexport */ buttonHoverBackground),
  xOA: () => (/* reexport */ buttonSecondaryBackground),
  Inn: () => (/* reexport */ buttonSecondaryForeground),
  nZG: () => (/* reexport */ buttonSecondaryHoverBackground),
  Q1$: () => (/* reexport */ buttonSeparator),
  OcU: () => (/* reexport */ checkboxBackground),
  C5U: () => (/* reexport */ checkboxBorder),
  t0B: () => (/* reexport */ checkboxForeground),
  b1q: () => (/* reexport */ contrastBorder),
  EY1: () => (/* reexport */ defaultInsertColor),
  ZEf: () => (/* reexport */ defaultRemoveColor),
  Gj6: () => (/* reexport */ diffInserted),
  ld8: () => (/* reexport */ diffOverviewRulerInserted),
  $BZ: () => (/* reexport */ diffOverviewRulerRemoved),
  GNm: () => (/* reexport */ diffRemoved),
  Ztu: () => (/* reexport */ editorActiveLinkForeground),
  YtV: () => (/* reexport */ editorBackground),
  AN$: () => (/* reexport */ editorErrorBorder),
  Rbi: () => (/* reexport */ editorErrorForeground),
  f3U: () => (/* reexport */ editorFindMatchForeground),
  Ubg: () => (/* reexport */ editorFindMatchHighlight),
  ECk: () => (/* reexport */ editorFindMatchHighlightBorder),
  p8Y: () => (/* reexport */ editorFindMatchHighlightForeground),
  S5J: () => (/* reexport */ editorFindRangeHighlightBorder),
  By2: () => (/* reexport */ editorForeground),
  i61: () => (/* reexport */ editorHintForeground),
  WfR: () => (/* reexport */ editorHoverBackground),
  oZ8: () => (/* reexport */ editorHoverBorder),
  tan: () => (/* reexport */ editorInactiveSelection),
  IIb: () => (/* reexport */ editorInfoBorder),
  pOz: () => (/* reexport */ editorInfoForeground),
  WL6: () => (/* reexport */ editorInlayHintBackground),
  P6i: () => (/* reexport */ editorInlayHintForeground),
  B2L: () => (/* reexport */ editorInlayHintParameterBackground),
  sjA: () => (/* reexport */ editorInlayHintParameterForeground),
  _pU: () => (/* reexport */ editorInlayHintTypeBackground),
  HwT: () => (/* reexport */ editorInlayHintTypeForeground),
  seu: () => (/* reexport */ editorSelectionBackground),
  rm4: () => (/* reexport */ editorSelectionForeground),
  QwA: () => (/* reexport */ editorSelectionHighlight),
  whs: () => (/* reexport */ editorWarningBackground),
  Stt: () => (/* reexport */ editorWarningBorder),
  Hng: () => (/* reexport */ editorWarningForeground),
  CgL: () => (/* reexport */ editorWidgetBackground),
  sIe: () => (/* reexport */ editorWidgetBorder),
  FiB: () => (/* reexport */ editorWidgetForeground),
  tAP: () => (/* reexport */ focusBorder),
  CU6: () => (/* reexport */ foreground),
  t4B: () => (/* reexport */ iconForeground),
  c1f: () => (/* reexport */ inputActiveOptionBackground),
  uNK: () => (/* reexport */ inputActiveOptionBorder),
  $$0: () => (/* reexport */ inputActiveOptionForeground),
  L4c: () => (/* reexport */ inputBackground),
  Zgs: () => (/* reexport */ inputBorder),
  cws: () => (/* reexport */ inputForeground),
  _$n: () => (/* reexport */ inputValidationErrorBackground),
  eYZ: () => (/* reexport */ inputValidationErrorBorder),
  h9z: () => (/* reexport */ inputValidationErrorForeground),
  I$A: () => (/* reexport */ inputValidationInfoBackground),
  YSW: () => (/* reexport */ inputValidationInfoBorder),
  L9Z: () => (/* reexport */ inputValidationInfoForeground),
  ULt: () => (/* reexport */ inputValidationWarningBackground),
  C1n: () => (/* reexport */ inputValidationWarningBorder),
  T5N: () => (/* reexport */ inputValidationWarningForeground),
  HDX: () => (/* reexport */ keybindingLabelBackground),
  zUX: () => (/* reexport */ keybindingLabelBorder),
  Qfh: () => (/* reexport */ keybindingLabelBottomBorder),
  eUu: () => (/* reexport */ keybindingLabelForeground),
  Rjz: () => (/* reexport */ listActiveSelectionBackground),
  GVV: () => (/* reexport */ listActiveSelectionForeground),
  fED: () => (/* reexport */ listActiveSelectionIconForeground),
  yIp: () => (/* reexport */ listDropBetweenBackground),
  Yoe: () => (/* reexport */ listDropOverBackground),
  pnl: () => (/* reexport */ listFilterWidgetBackground),
  P9Z: () => (/* reexport */ listFilterWidgetNoMatchesOutline),
  fiM: () => (/* reexport */ listFilterWidgetOutline),
  H8q: () => (/* reexport */ listFilterWidgetShadow),
  gtq: () => (/* reexport */ listFocusAndSelectionOutline),
  VFX: () => (/* reexport */ listFocusBackground),
  efJ: () => (/* reexport */ listFocusForeground),
  eMz: () => (/* reexport */ listFocusHighlightForeground),
  p7Y: () => (/* reexport */ listFocusOutline),
  QI5: () => (/* reexport */ listHighlightForeground),
  lO1: () => (/* reexport */ listHoverBackground),
  QRv: () => (/* reexport */ listHoverForeground),
  CQ3: () => (/* reexport */ listInactiveFocusBackground),
  ijf: () => (/* reexport */ listInactiveFocusOutline),
  uNx: () => (/* reexport */ listInactiveSelectionBackground),
  f4y: () => (/* reexport */ listInactiveSelectionForeground),
  C9U: () => (/* reexport */ listInactiveSelectionIconForeground),
  c6Y: () => (/* reexport */ menuBackground),
  g$2: () => (/* reexport */ menuBorder),
  dd_: () => (/* reexport */ menuForeground),
  Ux$: () => (/* reexport */ menuSelectionBackground),
  SNb: () => (/* reexport */ menuSelectionBorder),
  pmr: () => (/* reexport */ menuSelectionForeground),
  D7X: () => (/* reexport */ menuSeparatorBackground),
  ILr: () => (/* reexport */ minimapBackground),
  yLC: () => (/* reexport */ minimapError),
  AjU: () => (/* reexport */ minimapFindMatch),
  K1Z: () => (/* reexport */ minimapForegroundOpacity),
  KoI: () => (/* reexport */ minimapInfo),
  yr0: () => (/* reexport */ minimapSelection),
  Xp1: () => (/* reexport */ minimapSelectionOccurrenceHighlight),
  uMG: () => (/* reexport */ minimapWarning),
  yLr: () => (/* reexport */ colorUtils/* oneOf */.yL),
  fAP: () => (/* reexport */ overviewRulerFindMatchForeground),
  z5H: () => (/* reexport */ overviewRulerSelectionHighlightForeground),
  iwL: () => (/* reexport */ pickerGroupBorder),
  NBf: () => (/* reexport */ pickerGroupForeground),
  tYX: () => (/* reexport */ problemsErrorIconForeground),
  bNw: () => (/* reexport */ problemsInfoIconForeground),
  JPj: () => (/* reexport */ problemsWarningIconForeground),
  BTi: () => (/* reexport */ progressBarBackground),
  ELA: () => (/* reexport */ quickInputBackground),
  HJZ: () => (/* reexport */ quickInputForeground),
  AlL: () => (/* reexport */ quickInputListFocusBackground),
  nH: () => (/* reexport */ quickInputListFocusForeground),
  c7i: () => (/* reexport */ quickInputListFocusIconForeground),
  er1: () => (/* reexport */ quickInputTitleBackground),
  Ukx: () => (/* reexport */ radioActiveBackground),
  Ips: () => (/* reexport */ radioActiveBorder),
  jOE: () => (/* reexport */ radioActiveForeground),
  xWN: () => (/* reexport */ radioInactiveBackground),
  ZBU: () => (/* reexport */ radioInactiveBorder),
  kPT: () => (/* reexport */ radioInactiveForeground),
  jr9: () => (/* reexport */ radioInactiveHoverBackground),
  x1A: () => (/* reexport */ colorUtils/* registerColor */.x1),
  bXl: () => (/* reexport */ scrollbarShadow),
  mhZ: () => (/* reexport */ scrollbarSliderActiveBackground),
  gnV: () => (/* reexport */ scrollbarSliderBackground),
  cI_: () => (/* reexport */ scrollbarSliderHoverBackground),
  rvE: () => (/* reexport */ selectBackground),
  HcB: () => (/* reexport */ selectBorder),
  yqq: () => (/* reexport */ selectForeground),
  lWP: () => (/* reexport */ selectListBackground),
  k5u: () => (/* reexport */ tableColumnsBorder),
  sbQ: () => (/* reexport */ tableOddRowsBackgroundColor),
  vwp: () => (/* reexport */ textLinkForeground),
  JO0: () => (/* reexport */ colorUtils/* transparent */.JO),
  pft: () => (/* reexport */ treeInactiveIndentGuidesStroke),
  U4U: () => (/* reexport */ treeIndentGuidesStroke),
  DSL: () => (/* reexport */ widgetBorder),
  f9l: () => (/* reexport */ widgetShadow)
});

// UNUSED EXPORTS: DEFAULT_COLOR_CONFIG_VALUE, _deprecatedQuickInputListFocusBackground, breadcrumbsPickerBackground, chartsBlue, chartsForeground, chartsGreen, chartsLines, chartsOrange, chartsPurple, chartsRed, chartsYellow, checkboxSelectBackground, checkboxSelectBorder, darken, descriptionForeground, diffBorder, diffDiagonalFill, diffInsertedLine, diffInsertedLineGutter, diffInsertedOutline, diffRemovedLine, diffRemovedLineGutter, diffRemovedOutline, diffUnchangedRegionBackground, diffUnchangedRegionForeground, diffUnchangedTextBackground, disabledForeground, editorActionListBackground, editorActionListFocusBackground, editorActionListFocusForeground, editorActionListForeground, editorErrorBackground, editorFindMatch, editorFindMatchBorder, editorFindRangeHighlight, editorHintBorder, editorHoverForeground, editorHoverHighlight, editorHoverStatusBarBackground, editorInfoBackground, editorLightBulbAiForeground, editorLightBulbAutoFixForeground, editorLightBulbForeground, editorSelectionHighlightBorder, editorStickyScrollBackground, editorStickyScrollBorder, editorStickyScrollHoverBackground, editorStickyScrollShadow, editorWidgetResizeBorder, errorForeground, executeTransform, ifDefinedThenElse, inputActiveOptionHoverBackground, inputPlaceholderForeground, isColorDefaults, lessProminent, lighten, listDeemphasizedForeground, listErrorForeground, listFilterMatchHighlight, listFilterMatchHighlightBorder, listInvalidItemForeground, listWarningForeground, mergeBorder, mergeCommonContentBackground, mergeCommonHeaderBackground, mergeCurrentContentBackground, mergeCurrentHeaderBackground, mergeIncomingContentBackground, mergeIncomingHeaderBackground, minimapSliderActiveBackground, minimapSliderBackground, minimapSliderHoverBackground, overviewRulerCommonContentForeground, overviewRulerCurrentContentForeground, overviewRulerIncomingContentForeground, resolveColorValue, sashHoverBorder, searchEditorFindMatch, searchEditorFindMatchBorder, searchResultsInfoForeground, selectionBackground, snippetFinalTabstopHighlightBackground, snippetFinalTabstopHighlightBorder, snippetTabstopHighlightBackground, snippetTabstopHighlightBorder, textBlockQuoteBackground, textBlockQuoteBorder, textCodeBlockBackground, textLinkActiveForeground, textPreformatBackground, textPreformatForeground, textSeparatorForeground, toolbarActiveBackground, toolbarHoverBackground, toolbarHoverOutline, workbenchColorsSchemaId

// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/platform/theme/common/colorUtils.js
var colorUtils = __webpack_require__(87676);
// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/nls.js + 1 modules
var nls = __webpack_require__(19746);
// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/base/common/color.js
var color = __webpack_require__(94901);
;// ./node_modules/monaco-editor/esm/vs/platform/theme/common/colors/baseColors.js
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// Import the effects we need


const foreground = (0,colorUtils/* registerColor */.x1)('foreground', { dark: '#CCCCCC', light: '#616161', hcDark: '#FFFFFF', hcLight: '#292929' }, nls/* localize */.kg('foreground', "Overall foreground color. This color is only used if not overridden by a component."));
const disabledForeground = (0,colorUtils/* registerColor */.x1)('disabledForeground', { dark: '#CCCCCC80', light: '#61616180', hcDark: '#A5A5A5', hcLight: '#7F7F7F' }, nls/* localize */.kg('disabledForeground', "Overall foreground for disabled elements. This color is only used if not overridden by a component."));
const errorForeground = (0,colorUtils/* registerColor */.x1)('errorForeground', { dark: '#F48771', light: '#A1260D', hcDark: '#F48771', hcLight: '#B5200D' }, nls/* localize */.kg('errorForeground', "Overall foreground color for error messages. This color is only used if not overridden by a component."));
const descriptionForeground = (0,colorUtils/* registerColor */.x1)('descriptionForeground', { light: '#717171', dark: (0,colorUtils/* transparent */.JO)(foreground, 0.7), hcDark: (0,colorUtils/* transparent */.JO)(foreground, 0.7), hcLight: (0,colorUtils/* transparent */.JO)(foreground, 0.7) }, nls/* localize */.kg('descriptionForeground', "Foreground color for description text providing additional information, for example for a label."));
const iconForeground = (0,colorUtils/* registerColor */.x1)('icon.foreground', { dark: '#C5C5C5', light: '#424242', hcDark: '#FFFFFF', hcLight: '#292929' }, nls/* localize */.kg('iconForeground', "The default color for icons in the workbench."));
const focusBorder = (0,colorUtils/* registerColor */.x1)('focusBorder', { dark: '#007FD4', light: '#0090F1', hcDark: '#F38518', hcLight: '#006BBD' }, nls/* localize */.kg('focusBorder', "Overall border color for focused elements. This color is only used if not overridden by a component."));
const contrastBorder = (0,colorUtils/* registerColor */.x1)('contrastBorder', { light: null, dark: null, hcDark: '#6FC3DF', hcLight: '#0F4A85' }, nls/* localize */.kg('contrastBorder', "An extra border around elements to separate them from others for greater contrast."));
const activeContrastBorder = (0,colorUtils/* registerColor */.x1)('contrastActiveBorder', { light: null, dark: null, hcDark: focusBorder, hcLight: focusBorder }, nls/* localize */.kg('activeContrastBorder', "An extra border around active elements to separate them from others for greater contrast."));
const selectionBackground = (0,colorUtils/* registerColor */.x1)('selection.background', null, nls/* localize */.kg('selectionBackground', "The background color of text selections in the workbench (e.g. for input fields or text areas). Note that this does not apply to selections within the editor."));
// ------ text link
const textLinkForeground = (0,colorUtils/* registerColor */.x1)('textLink.foreground', { light: '#006AB1', dark: '#3794FF', hcDark: '#21A6FF', hcLight: '#0F4A85' }, nls/* localize */.kg('textLinkForeground', "Foreground color for links in text."));
const textLinkActiveForeground = (0,colorUtils/* registerColor */.x1)('textLink.activeForeground', { light: '#006AB1', dark: '#3794FF', hcDark: '#21A6FF', hcLight: '#0F4A85' }, nls/* localize */.kg('textLinkActiveForeground', "Foreground color for links in text when clicked on and on mouse hover."));
const textSeparatorForeground = (0,colorUtils/* registerColor */.x1)('textSeparator.foreground', { light: '#0000002e', dark: '#ffffff2e', hcDark: color/* Color */.Q1.black, hcLight: '#292929' }, nls/* localize */.kg('textSeparatorForeground', "Color for text separators."));
// ------ text preformat
const textPreformatForeground = (0,colorUtils/* registerColor */.x1)('textPreformat.foreground', { light: '#A31515', dark: '#D7BA7D', hcDark: '#000000', hcLight: '#FFFFFF' }, nls/* localize */.kg('textPreformatForeground', "Foreground color for preformatted text segments."));
const textPreformatBackground = (0,colorUtils/* registerColor */.x1)('textPreformat.background', { light: '#0000001A', dark: '#FFFFFF1A', hcDark: '#FFFFFF', hcLight: '#09345f' }, nls/* localize */.kg('textPreformatBackground', "Background color for preformatted text segments."));
// ------ text block quote
const textBlockQuoteBackground = (0,colorUtils/* registerColor */.x1)('textBlockQuote.background', { light: '#f2f2f2', dark: '#222222', hcDark: null, hcLight: '#F2F2F2' }, nls/* localize */.kg('textBlockQuoteBackground', "Background color for block quotes in text."));
const textBlockQuoteBorder = (0,colorUtils/* registerColor */.x1)('textBlockQuote.border', { light: '#007acc80', dark: '#007acc80', hcDark: color/* Color */.Q1.white, hcLight: '#292929' }, nls/* localize */.kg('textBlockQuoteBorder', "Border color for block quotes in text."));
// ------ text code block
const textCodeBlockBackground = (0,colorUtils/* registerColor */.x1)('textCodeBlock.background', { light: '#dcdcdc66', dark: '#0a0a0a66', hcDark: color/* Color */.Q1.black, hcLight: '#F2F2F2' }, nls/* localize */.kg('textCodeBlockBackground', "Background color for code blocks in text."));

;// ./node_modules/monaco-editor/esm/vs/platform/theme/common/colors/miscColors.js
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// Import the effects we need


// Import the colors we need

// ----- sash
const sashHoverBorder = (0,colorUtils/* registerColor */.x1)('sash.hoverBorder', focusBorder, nls/* localize */.kg('sashActiveBorder', "Border color of active sashes."));
// ----- badge
const badgeBackground = (0,colorUtils/* registerColor */.x1)('badge.background', { dark: '#4D4D4D', light: '#C4C4C4', hcDark: color/* Color */.Q1.black, hcLight: '#0F4A85' }, nls/* localize */.kg('badgeBackground', "Badge background color. Badges are small information labels, e.g. for search results count."));
const badgeForeground = (0,colorUtils/* registerColor */.x1)('badge.foreground', { dark: color/* Color */.Q1.white, light: '#333', hcDark: color/* Color */.Q1.white, hcLight: color/* Color */.Q1.white }, nls/* localize */.kg('badgeForeground', "Badge foreground color. Badges are small information labels, e.g. for search results count."));
// ----- scrollbar
const scrollbarShadow = (0,colorUtils/* registerColor */.x1)('scrollbar.shadow', { dark: '#000000', light: '#DDDDDD', hcDark: null, hcLight: null }, nls/* localize */.kg('scrollbarShadow', "Scrollbar shadow to indicate that the view is scrolled."));
const scrollbarSliderBackground = (0,colorUtils/* registerColor */.x1)('scrollbarSlider.background', { dark: color/* Color */.Q1.fromHex('#797979').transparent(0.4), light: color/* Color */.Q1.fromHex('#646464').transparent(0.4), hcDark: (0,colorUtils/* transparent */.JO)(contrastBorder, 0.6), hcLight: (0,colorUtils/* transparent */.JO)(contrastBorder, 0.4) }, nls/* localize */.kg('scrollbarSliderBackground', "Scrollbar slider background color."));
const scrollbarSliderHoverBackground = (0,colorUtils/* registerColor */.x1)('scrollbarSlider.hoverBackground', { dark: color/* Color */.Q1.fromHex('#646464').transparent(0.7), light: color/* Color */.Q1.fromHex('#646464').transparent(0.7), hcDark: (0,colorUtils/* transparent */.JO)(contrastBorder, 0.8), hcLight: (0,colorUtils/* transparent */.JO)(contrastBorder, 0.8) }, nls/* localize */.kg('scrollbarSliderHoverBackground', "Scrollbar slider background color when hovering."));
const scrollbarSliderActiveBackground = (0,colorUtils/* registerColor */.x1)('scrollbarSlider.activeBackground', { dark: color/* Color */.Q1.fromHex('#BFBFBF').transparent(0.4), light: color/* Color */.Q1.fromHex('#000000').transparent(0.6), hcDark: contrastBorder, hcLight: contrastBorder }, nls/* localize */.kg('scrollbarSliderActiveBackground', "Scrollbar slider background color when clicked on."));
// ----- progress bar
const progressBarBackground = (0,colorUtils/* registerColor */.x1)('progressBar.background', { dark: color/* Color */.Q1.fromHex('#0E70C0'), light: color/* Color */.Q1.fromHex('#0E70C0'), hcDark: contrastBorder, hcLight: contrastBorder }, nls/* localize */.kg('progressBarBackground', "Background color of the progress bar that can show for long running operations."));

;// ./node_modules/monaco-editor/esm/vs/platform/theme/common/colors/editorColors.js
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// Import the effects we need


// Import the colors we need


// ----- editor
const editorBackground = (0,colorUtils/* registerColor */.x1)('editor.background', { light: '#ffffff', dark: '#1E1E1E', hcDark: color/* Color */.Q1.black, hcLight: color/* Color */.Q1.white }, nls/* localize */.kg('editorBackground', "Editor background color."));
const editorForeground = (0,colorUtils/* registerColor */.x1)('editor.foreground', { light: '#333333', dark: '#BBBBBB', hcDark: color/* Color */.Q1.white, hcLight: foreground }, nls/* localize */.kg('editorForeground', "Editor default foreground color."));
const editorStickyScrollBackground = (0,colorUtils/* registerColor */.x1)('editorStickyScroll.background', editorBackground, nls/* localize */.kg('editorStickyScrollBackground', "Background color of sticky scroll in the editor"));
const editorStickyScrollHoverBackground = (0,colorUtils/* registerColor */.x1)('editorStickyScrollHover.background', { dark: '#2A2D2E', light: '#F0F0F0', hcDark: null, hcLight: color/* Color */.Q1.fromHex('#0F4A85').transparent(0.1) }, nls/* localize */.kg('editorStickyScrollHoverBackground', "Background color of sticky scroll on hover in the editor"));
const editorStickyScrollBorder = (0,colorUtils/* registerColor */.x1)('editorStickyScroll.border', { dark: null, light: null, hcDark: contrastBorder, hcLight: contrastBorder }, nls/* localize */.kg('editorStickyScrollBorder', "Border color of sticky scroll in the editor"));
const editorStickyScrollShadow = (0,colorUtils/* registerColor */.x1)('editorStickyScroll.shadow', scrollbarShadow, nls/* localize */.kg('editorStickyScrollShadow', " Shadow color of sticky scroll in the editor"));
const editorWidgetBackground = (0,colorUtils/* registerColor */.x1)('editorWidget.background', { dark: '#252526', light: '#F3F3F3', hcDark: '#0C141F', hcLight: color/* Color */.Q1.white }, nls/* localize */.kg('editorWidgetBackground', 'Background color of editor widgets, such as find/replace.'));
const editorWidgetForeground = (0,colorUtils/* registerColor */.x1)('editorWidget.foreground', foreground, nls/* localize */.kg('editorWidgetForeground', 'Foreground color of editor widgets, such as find/replace.'));
const editorWidgetBorder = (0,colorUtils/* registerColor */.x1)('editorWidget.border', { dark: '#454545', light: '#C8C8C8', hcDark: contrastBorder, hcLight: contrastBorder }, nls/* localize */.kg('editorWidgetBorder', 'Border color of editor widgets. The color is only used if the widget chooses to have a border and if the color is not overridden by a widget.'));
const editorWidgetResizeBorder = (0,colorUtils/* registerColor */.x1)('editorWidget.resizeBorder', null, nls/* localize */.kg('editorWidgetResizeBorder', "Border color of the resize bar of editor widgets. The color is only used if the widget chooses to have a resize border and if the color is not overridden by a widget."));
const editorErrorBackground = (0,colorUtils/* registerColor */.x1)('editorError.background', null, nls/* localize */.kg('editorError.background', 'Background color of error text in the editor. The color must not be opaque so as not to hide underlying decorations.'), true);
const editorErrorForeground = (0,colorUtils/* registerColor */.x1)('editorError.foreground', { dark: '#F14C4C', light: '#E51400', hcDark: '#F48771', hcLight: '#B5200D' }, nls/* localize */.kg('editorError.foreground', 'Foreground color of error squigglies in the editor.'));
const editorErrorBorder = (0,colorUtils/* registerColor */.x1)('editorError.border', { dark: null, light: null, hcDark: color/* Color */.Q1.fromHex('#E47777').transparent(0.8), hcLight: '#B5200D' }, nls/* localize */.kg('errorBorder', 'If set, color of double underlines for errors in the editor.'));
const editorWarningBackground = (0,colorUtils/* registerColor */.x1)('editorWarning.background', null, nls/* localize */.kg('editorWarning.background', 'Background color of warning text in the editor. The color must not be opaque so as not to hide underlying decorations.'), true);
const editorWarningForeground = (0,colorUtils/* registerColor */.x1)('editorWarning.foreground', { dark: '#CCA700', light: '#BF8803', hcDark: '#FFD370', hcLight: '#895503' }, nls/* localize */.kg('editorWarning.foreground', 'Foreground color of warning squigglies in the editor.'));
const editorWarningBorder = (0,colorUtils/* registerColor */.x1)('editorWarning.border', { dark: null, light: null, hcDark: color/* Color */.Q1.fromHex('#FFCC00').transparent(0.8), hcLight: color/* Color */.Q1.fromHex('#FFCC00').transparent(0.8) }, nls/* localize */.kg('warningBorder', 'If set, color of double underlines for warnings in the editor.'));
const editorInfoBackground = (0,colorUtils/* registerColor */.x1)('editorInfo.background', null, nls/* localize */.kg('editorInfo.background', 'Background color of info text in the editor. The color must not be opaque so as not to hide underlying decorations.'), true);
const editorInfoForeground = (0,colorUtils/* registerColor */.x1)('editorInfo.foreground', { dark: '#3794FF', light: '#1a85ff', hcDark: '#3794FF', hcLight: '#1a85ff' }, nls/* localize */.kg('editorInfo.foreground', 'Foreground color of info squigglies in the editor.'));
const editorInfoBorder = (0,colorUtils/* registerColor */.x1)('editorInfo.border', { dark: null, light: null, hcDark: color/* Color */.Q1.fromHex('#3794FF').transparent(0.8), hcLight: '#292929' }, nls/* localize */.kg('infoBorder', 'If set, color of double underlines for infos in the editor.'));
const editorHintForeground = (0,colorUtils/* registerColor */.x1)('editorHint.foreground', { dark: color/* Color */.Q1.fromHex('#eeeeee').transparent(0.7), light: '#6c6c6c', hcDark: null, hcLight: null }, nls/* localize */.kg('editorHint.foreground', 'Foreground color of hint squigglies in the editor.'));
const editorHintBorder = (0,colorUtils/* registerColor */.x1)('editorHint.border', { dark: null, light: null, hcDark: color/* Color */.Q1.fromHex('#eeeeee').transparent(0.8), hcLight: '#292929' }, nls/* localize */.kg('hintBorder', 'If set, color of double underlines for hints in the editor.'));
const editorActiveLinkForeground = (0,colorUtils/* registerColor */.x1)('editorLink.activeForeground', { dark: '#4E94CE', light: color/* Color */.Q1.blue, hcDark: color/* Color */.Q1.cyan, hcLight: '#292929' }, nls/* localize */.kg('activeLinkForeground', 'Color of active links.'));
// ----- editor selection
const editorSelectionBackground = (0,colorUtils/* registerColor */.x1)('editor.selectionBackground', { light: '#ADD6FF', dark: '#264F78', hcDark: '#f3f518', hcLight: '#0F4A85' }, nls/* localize */.kg('editorSelectionBackground', "Color of the editor selection."));
const editorSelectionForeground = (0,colorUtils/* registerColor */.x1)('editor.selectionForeground', { light: null, dark: null, hcDark: '#000000', hcLight: color/* Color */.Q1.white }, nls/* localize */.kg('editorSelectionForeground', "Color of the selected text for high contrast."));
const editorInactiveSelection = (0,colorUtils/* registerColor */.x1)('editor.inactiveSelectionBackground', { light: (0,colorUtils/* transparent */.JO)(editorSelectionBackground, 0.5), dark: (0,colorUtils/* transparent */.JO)(editorSelectionBackground, 0.5), hcDark: (0,colorUtils/* transparent */.JO)(editorSelectionBackground, 0.7), hcLight: (0,colorUtils/* transparent */.JO)(editorSelectionBackground, 0.5) }, nls/* localize */.kg('editorInactiveSelection', "Color of the selection in an inactive editor. The color must not be opaque so as not to hide underlying decorations."), true);
const editorSelectionHighlight = (0,colorUtils/* registerColor */.x1)('editor.selectionHighlightBackground', { light: (0,colorUtils/* lessProminent */.oG)(editorSelectionBackground, editorBackground, 0.3, 0.6), dark: (0,colorUtils/* lessProminent */.oG)(editorSelectionBackground, editorBackground, 0.3, 0.6), hcDark: null, hcLight: null }, nls/* localize */.kg('editorSelectionHighlight', 'Color for regions with the same content as the selection. The color must not be opaque so as not to hide underlying decorations.'), true);
const editorSelectionHighlightBorder = (0,colorUtils/* registerColor */.x1)('editor.selectionHighlightBorder', { light: null, dark: null, hcDark: activeContrastBorder, hcLight: activeContrastBorder }, nls/* localize */.kg('editorSelectionHighlightBorder', "Border color for regions with the same content as the selection."));
// ----- editor find
const editorFindMatch = (0,colorUtils/* registerColor */.x1)('editor.findMatchBackground', { light: '#A8AC94', dark: '#515C6A', hcDark: null, hcLight: null }, nls/* localize */.kg('editorFindMatch', "Color of the current search match."));
const editorFindMatchForeground = (0,colorUtils/* registerColor */.x1)('editor.findMatchForeground', null, nls/* localize */.kg('editorFindMatchForeground', "Text color of the current search match."));
const editorFindMatchHighlight = (0,colorUtils/* registerColor */.x1)('editor.findMatchHighlightBackground', { light: '#EA5C0055', dark: '#EA5C0055', hcDark: null, hcLight: null }, nls/* localize */.kg('findMatchHighlight', "Color of the other search matches. The color must not be opaque so as not to hide underlying decorations."), true);
const editorFindMatchHighlightForeground = (0,colorUtils/* registerColor */.x1)('editor.findMatchHighlightForeground', null, nls/* localize */.kg('findMatchHighlightForeground', "Foreground color of the other search matches."), true);
const editorFindRangeHighlight = (0,colorUtils/* registerColor */.x1)('editor.findRangeHighlightBackground', { dark: '#3a3d4166', light: '#b4b4b44d', hcDark: null, hcLight: null }, nls/* localize */.kg('findRangeHighlight', "Color of the range limiting the search. The color must not be opaque so as not to hide underlying decorations."), true);
const editorFindMatchBorder = (0,colorUtils/* registerColor */.x1)('editor.findMatchBorder', { light: null, dark: null, hcDark: activeContrastBorder, hcLight: activeContrastBorder }, nls/* localize */.kg('editorFindMatchBorder', "Border color of the current search match."));
const editorFindMatchHighlightBorder = (0,colorUtils/* registerColor */.x1)('editor.findMatchHighlightBorder', { light: null, dark: null, hcDark: activeContrastBorder, hcLight: activeContrastBorder }, nls/* localize */.kg('findMatchHighlightBorder', "Border color of the other search matches."));
const editorFindRangeHighlightBorder = (0,colorUtils/* registerColor */.x1)('editor.findRangeHighlightBorder', { dark: null, light: null, hcDark: (0,colorUtils/* transparent */.JO)(activeContrastBorder, 0.4), hcLight: (0,colorUtils/* transparent */.JO)(activeContrastBorder, 0.4) }, nls/* localize */.kg('findRangeHighlightBorder', "Border color of the range limiting the search. The color must not be opaque so as not to hide underlying decorations."), true);
// ----- editor hover
const editorHoverHighlight = (0,colorUtils/* registerColor */.x1)('editor.hoverHighlightBackground', { light: '#ADD6FF26', dark: '#264f7840', hcDark: '#ADD6FF26', hcLight: null }, nls/* localize */.kg('hoverHighlight', 'Highlight below the word for which a hover is shown. The color must not be opaque so as not to hide underlying decorations.'), true);
const editorHoverBackground = (0,colorUtils/* registerColor */.x1)('editorHoverWidget.background', editorWidgetBackground, nls/* localize */.kg('hoverBackground', 'Background color of the editor hover.'));
const editorHoverForeground = (0,colorUtils/* registerColor */.x1)('editorHoverWidget.foreground', editorWidgetForeground, nls/* localize */.kg('hoverForeground', 'Foreground color of the editor hover.'));
const editorHoverBorder = (0,colorUtils/* registerColor */.x1)('editorHoverWidget.border', editorWidgetBorder, nls/* localize */.kg('hoverBorder', 'Border color of the editor hover.'));
const editorHoverStatusBarBackground = (0,colorUtils/* registerColor */.x1)('editorHoverWidget.statusBarBackground', { dark: (0,colorUtils/* lighten */.a)(editorHoverBackground, 0.2), light: (0,colorUtils/* darken */.e$)(editorHoverBackground, 0.05), hcDark: editorWidgetBackground, hcLight: editorWidgetBackground }, nls/* localize */.kg('statusBarBackground', "Background color of the editor hover status bar."));
// ----- editor inlay hint
const editorInlayHintForeground = (0,colorUtils/* registerColor */.x1)('editorInlayHint.foreground', { dark: '#969696', light: '#969696', hcDark: color/* Color */.Q1.white, hcLight: color/* Color */.Q1.black }, nls/* localize */.kg('editorInlayHintForeground', 'Foreground color of inline hints'));
const editorInlayHintBackground = (0,colorUtils/* registerColor */.x1)('editorInlayHint.background', { dark: (0,colorUtils/* transparent */.JO)(badgeBackground, .10), light: (0,colorUtils/* transparent */.JO)(badgeBackground, .10), hcDark: (0,colorUtils/* transparent */.JO)(color/* Color */.Q1.white, .10), hcLight: (0,colorUtils/* transparent */.JO)(badgeBackground, .10) }, nls/* localize */.kg('editorInlayHintBackground', 'Background color of inline hints'));
const editorInlayHintTypeForeground = (0,colorUtils/* registerColor */.x1)('editorInlayHint.typeForeground', editorInlayHintForeground, nls/* localize */.kg('editorInlayHintForegroundTypes', 'Foreground color of inline hints for types'));
const editorInlayHintTypeBackground = (0,colorUtils/* registerColor */.x1)('editorInlayHint.typeBackground', editorInlayHintBackground, nls/* localize */.kg('editorInlayHintBackgroundTypes', 'Background color of inline hints for types'));
const editorInlayHintParameterForeground = (0,colorUtils/* registerColor */.x1)('editorInlayHint.parameterForeground', editorInlayHintForeground, nls/* localize */.kg('editorInlayHintForegroundParameter', 'Foreground color of inline hints for parameters'));
const editorInlayHintParameterBackground = (0,colorUtils/* registerColor */.x1)('editorInlayHint.parameterBackground', editorInlayHintBackground, nls/* localize */.kg('editorInlayHintBackgroundParameter', 'Background color of inline hints for parameters'));
// ----- editor lightbulb
const editorLightBulbForeground = (0,colorUtils/* registerColor */.x1)('editorLightBulb.foreground', { dark: '#FFCC00', light: '#DDB100', hcDark: '#FFCC00', hcLight: '#007ACC' }, nls/* localize */.kg('editorLightBulbForeground', "The color used for the lightbulb actions icon."));
const editorLightBulbAutoFixForeground = (0,colorUtils/* registerColor */.x1)('editorLightBulbAutoFix.foreground', { dark: '#75BEFF', light: '#007ACC', hcDark: '#75BEFF', hcLight: '#007ACC' }, nls/* localize */.kg('editorLightBulbAutoFixForeground', "The color used for the lightbulb auto fix actions icon."));
const editorLightBulbAiForeground = (0,colorUtils/* registerColor */.x1)('editorLightBulbAi.foreground', editorLightBulbForeground, nls/* localize */.kg('editorLightBulbAiForeground', "The color used for the lightbulb AI icon."));
// ----- editor snippet
const snippetTabstopHighlightBackground = (0,colorUtils/* registerColor */.x1)('editor.snippetTabstopHighlightBackground', { dark: new color/* Color */.Q1(new color/* RGBA */.bU(124, 124, 124, 0.3)), light: new color/* Color */.Q1(new color/* RGBA */.bU(10, 50, 100, 0.2)), hcDark: new color/* Color */.Q1(new color/* RGBA */.bU(124, 124, 124, 0.3)), hcLight: new color/* Color */.Q1(new color/* RGBA */.bU(10, 50, 100, 0.2)) }, nls/* localize */.kg('snippetTabstopHighlightBackground', "Highlight background color of a snippet tabstop."));
const snippetTabstopHighlightBorder = (0,colorUtils/* registerColor */.x1)('editor.snippetTabstopHighlightBorder', null, nls/* localize */.kg('snippetTabstopHighlightBorder', "Highlight border color of a snippet tabstop."));
const snippetFinalTabstopHighlightBackground = (0,colorUtils/* registerColor */.x1)('editor.snippetFinalTabstopHighlightBackground', null, nls/* localize */.kg('snippetFinalTabstopHighlightBackground', "Highlight background color of the final tabstop of a snippet."));
const snippetFinalTabstopHighlightBorder = (0,colorUtils/* registerColor */.x1)('editor.snippetFinalTabstopHighlightBorder', { dark: '#525252', light: new color/* Color */.Q1(new color/* RGBA */.bU(10, 50, 100, 0.5)), hcDark: '#525252', hcLight: '#292929' }, nls/* localize */.kg('snippetFinalTabstopHighlightBorder', "Highlight border color of the final tabstop of a snippet."));
// ----- diff editor
const defaultInsertColor = new color/* Color */.Q1(new color/* RGBA */.bU(155, 185, 85, .2));
const defaultRemoveColor = new color/* Color */.Q1(new color/* RGBA */.bU(255, 0, 0, .2));
const diffInserted = (0,colorUtils/* registerColor */.x1)('diffEditor.insertedTextBackground', { dark: '#9ccc2c33', light: '#9ccc2c40', hcDark: null, hcLight: null }, nls/* localize */.kg('diffEditorInserted', 'Background color for text that got inserted. The color must not be opaque so as not to hide underlying decorations.'), true);
const diffRemoved = (0,colorUtils/* registerColor */.x1)('diffEditor.removedTextBackground', { dark: '#ff000033', light: '#ff000033', hcDark: null, hcLight: null }, nls/* localize */.kg('diffEditorRemoved', 'Background color for text that got removed. The color must not be opaque so as not to hide underlying decorations.'), true);
const diffInsertedLine = (0,colorUtils/* registerColor */.x1)('diffEditor.insertedLineBackground', { dark: defaultInsertColor, light: defaultInsertColor, hcDark: null, hcLight: null }, nls/* localize */.kg('diffEditorInsertedLines', 'Background color for lines that got inserted. The color must not be opaque so as not to hide underlying decorations.'), true);
const diffRemovedLine = (0,colorUtils/* registerColor */.x1)('diffEditor.removedLineBackground', { dark: defaultRemoveColor, light: defaultRemoveColor, hcDark: null, hcLight: null }, nls/* localize */.kg('diffEditorRemovedLines', 'Background color for lines that got removed. The color must not be opaque so as not to hide underlying decorations.'), true);
const diffInsertedLineGutter = (0,colorUtils/* registerColor */.x1)('diffEditorGutter.insertedLineBackground', null, nls/* localize */.kg('diffEditorInsertedLineGutter', 'Background color for the margin where lines got inserted.'));
const diffRemovedLineGutter = (0,colorUtils/* registerColor */.x1)('diffEditorGutter.removedLineBackground', null, nls/* localize */.kg('diffEditorRemovedLineGutter', 'Background color for the margin where lines got removed.'));
const diffOverviewRulerInserted = (0,colorUtils/* registerColor */.x1)('diffEditorOverview.insertedForeground', null, nls/* localize */.kg('diffEditorOverviewInserted', 'Diff overview ruler foreground for inserted content.'));
const diffOverviewRulerRemoved = (0,colorUtils/* registerColor */.x1)('diffEditorOverview.removedForeground', null, nls/* localize */.kg('diffEditorOverviewRemoved', 'Diff overview ruler foreground for removed content.'));
const diffInsertedOutline = (0,colorUtils/* registerColor */.x1)('diffEditor.insertedTextBorder', { dark: null, light: null, hcDark: '#33ff2eff', hcLight: '#374E06' }, nls/* localize */.kg('diffEditorInsertedOutline', 'Outline color for the text that got inserted.'));
const diffRemovedOutline = (0,colorUtils/* registerColor */.x1)('diffEditor.removedTextBorder', { dark: null, light: null, hcDark: '#FF008F', hcLight: '#AD0707' }, nls/* localize */.kg('diffEditorRemovedOutline', 'Outline color for text that got removed.'));
const diffBorder = (0,colorUtils/* registerColor */.x1)('diffEditor.border', { dark: null, light: null, hcDark: contrastBorder, hcLight: contrastBorder }, nls/* localize */.kg('diffEditorBorder', 'Border color between the two text editors.'));
const diffDiagonalFill = (0,colorUtils/* registerColor */.x1)('diffEditor.diagonalFill', { dark: '#cccccc33', light: '#22222233', hcDark: null, hcLight: null }, nls/* localize */.kg('diffDiagonalFill', "Color of the diff editor's diagonal fill. The diagonal fill is used in side-by-side diff views."));
const diffUnchangedRegionBackground = (0,colorUtils/* registerColor */.x1)('diffEditor.unchangedRegionBackground', 'sideBar.background', nls/* localize */.kg('diffEditor.unchangedRegionBackground', "The background color of unchanged blocks in the diff editor."));
const diffUnchangedRegionForeground = (0,colorUtils/* registerColor */.x1)('diffEditor.unchangedRegionForeground', 'foreground', nls/* localize */.kg('diffEditor.unchangedRegionForeground', "The foreground color of unchanged blocks in the diff editor."));
const diffUnchangedTextBackground = (0,colorUtils/* registerColor */.x1)('diffEditor.unchangedCodeBackground', { dark: '#74747429', light: '#b8b8b829', hcDark: null, hcLight: null }, nls/* localize */.kg('diffEditor.unchangedCodeBackground', "The background color of unchanged code in the diff editor."));
// ----- widget
const widgetShadow = (0,colorUtils/* registerColor */.x1)('widget.shadow', { dark: (0,colorUtils/* transparent */.JO)(color/* Color */.Q1.black, .36), light: (0,colorUtils/* transparent */.JO)(color/* Color */.Q1.black, .16), hcDark: null, hcLight: null }, nls/* localize */.kg('widgetShadow', 'Shadow color of widgets such as find/replace inside the editor.'));
const widgetBorder = (0,colorUtils/* registerColor */.x1)('widget.border', { dark: null, light: null, hcDark: contrastBorder, hcLight: contrastBorder }, nls/* localize */.kg('widgetBorder', 'Border color of widgets such as find/replace inside the editor.'));
// ----- toolbar
const toolbarHoverBackground = (0,colorUtils/* registerColor */.x1)('toolbar.hoverBackground', { dark: '#5a5d5e50', light: '#b8b8b850', hcDark: null, hcLight: null }, nls/* localize */.kg('toolbarHoverBackground', "Toolbar background when hovering over actions using the mouse"));
const toolbarHoverOutline = (0,colorUtils/* registerColor */.x1)('toolbar.hoverOutline', { dark: null, light: null, hcDark: activeContrastBorder, hcLight: activeContrastBorder }, nls/* localize */.kg('toolbarHoverOutline', "Toolbar outline when hovering over actions using the mouse"));
const toolbarActiveBackground = (0,colorUtils/* registerColor */.x1)('toolbar.activeBackground', { dark: (0,colorUtils/* lighten */.a)(toolbarHoverBackground, 0.1), light: (0,colorUtils/* darken */.e$)(toolbarHoverBackground, 0.1), hcDark: null, hcLight: null }, nls/* localize */.kg('toolbarActiveBackground', "Toolbar background when holding the mouse over actions"));
// ----- breadcumbs
const breadcrumbsForeground = (0,colorUtils/* registerColor */.x1)('breadcrumb.foreground', (0,colorUtils/* transparent */.JO)(foreground, 0.8), nls/* localize */.kg('breadcrumbsFocusForeground', "Color of focused breadcrumb items."));
const breadcrumbsBackground = (0,colorUtils/* registerColor */.x1)('breadcrumb.background', editorBackground, nls/* localize */.kg('breadcrumbsBackground', "Background color of breadcrumb items."));
const breadcrumbsFocusForeground = (0,colorUtils/* registerColor */.x1)('breadcrumb.focusForeground', { light: (0,colorUtils/* darken */.e$)(foreground, 0.2), dark: (0,colorUtils/* lighten */.a)(foreground, 0.1), hcDark: (0,colorUtils/* lighten */.a)(foreground, 0.1), hcLight: (0,colorUtils/* lighten */.a)(foreground, 0.1) }, nls/* localize */.kg('breadcrumbsFocusForeground', "Color of focused breadcrumb items."));
const breadcrumbsActiveSelectionForeground = (0,colorUtils/* registerColor */.x1)('breadcrumb.activeSelectionForeground', { light: (0,colorUtils/* darken */.e$)(foreground, 0.2), dark: (0,colorUtils/* lighten */.a)(foreground, 0.1), hcDark: (0,colorUtils/* lighten */.a)(foreground, 0.1), hcLight: (0,colorUtils/* lighten */.a)(foreground, 0.1) }, nls/* localize */.kg('breadcrumbsSelectedForeground', "Color of selected breadcrumb items."));
const breadcrumbsPickerBackground = (0,colorUtils/* registerColor */.x1)('breadcrumbPicker.background', editorWidgetBackground, nls/* localize */.kg('breadcrumbsSelectedBackground', "Background color of breadcrumb item picker."));
// ----- merge
const headerTransparency = 0.5;
const currentBaseColor = color/* Color */.Q1.fromHex('#40C8AE').transparent(headerTransparency);
const incomingBaseColor = color/* Color */.Q1.fromHex('#40A6FF').transparent(headerTransparency);
const commonBaseColor = color/* Color */.Q1.fromHex('#606060').transparent(0.4);
const contentTransparency = 0.4;
const rulerTransparency = 1;
const mergeCurrentHeaderBackground = (0,colorUtils/* registerColor */.x1)('merge.currentHeaderBackground', { dark: currentBaseColor, light: currentBaseColor, hcDark: null, hcLight: null }, nls/* localize */.kg('mergeCurrentHeaderBackground', 'Current header background in inline merge-conflicts. The color must not be opaque so as not to hide underlying decorations.'), true);
const mergeCurrentContentBackground = (0,colorUtils/* registerColor */.x1)('merge.currentContentBackground', (0,colorUtils/* transparent */.JO)(mergeCurrentHeaderBackground, contentTransparency), nls/* localize */.kg('mergeCurrentContentBackground', 'Current content background in inline merge-conflicts. The color must not be opaque so as not to hide underlying decorations.'), true);
const mergeIncomingHeaderBackground = (0,colorUtils/* registerColor */.x1)('merge.incomingHeaderBackground', { dark: incomingBaseColor, light: incomingBaseColor, hcDark: null, hcLight: null }, nls/* localize */.kg('mergeIncomingHeaderBackground', 'Incoming header background in inline merge-conflicts. The color must not be opaque so as not to hide underlying decorations.'), true);
const mergeIncomingContentBackground = (0,colorUtils/* registerColor */.x1)('merge.incomingContentBackground', (0,colorUtils/* transparent */.JO)(mergeIncomingHeaderBackground, contentTransparency), nls/* localize */.kg('mergeIncomingContentBackground', 'Incoming content background in inline merge-conflicts. The color must not be opaque so as not to hide underlying decorations.'), true);
const mergeCommonHeaderBackground = (0,colorUtils/* registerColor */.x1)('merge.commonHeaderBackground', { dark: commonBaseColor, light: commonBaseColor, hcDark: null, hcLight: null }, nls/* localize */.kg('mergeCommonHeaderBackground', 'Common ancestor header background in inline merge-conflicts. The color must not be opaque so as not to hide underlying decorations.'), true);
const mergeCommonContentBackground = (0,colorUtils/* registerColor */.x1)('merge.commonContentBackground', (0,colorUtils/* transparent */.JO)(mergeCommonHeaderBackground, contentTransparency), nls/* localize */.kg('mergeCommonContentBackground', 'Common ancestor content background in inline merge-conflicts. The color must not be opaque so as not to hide underlying decorations.'), true);
const mergeBorder = (0,colorUtils/* registerColor */.x1)('merge.border', { dark: null, light: null, hcDark: '#C3DF6F', hcLight: '#007ACC' }, nls/* localize */.kg('mergeBorder', 'Border color on headers and the splitter in inline merge-conflicts.'));
const overviewRulerCurrentContentForeground = (0,colorUtils/* registerColor */.x1)('editorOverviewRuler.currentContentForeground', { dark: (0,colorUtils/* transparent */.JO)(mergeCurrentHeaderBackground, rulerTransparency), light: (0,colorUtils/* transparent */.JO)(mergeCurrentHeaderBackground, rulerTransparency), hcDark: mergeBorder, hcLight: mergeBorder }, nls/* localize */.kg('overviewRulerCurrentContentForeground', 'Current overview ruler foreground for inline merge-conflicts.'));
const overviewRulerIncomingContentForeground = (0,colorUtils/* registerColor */.x1)('editorOverviewRuler.incomingContentForeground', { dark: (0,colorUtils/* transparent */.JO)(mergeIncomingHeaderBackground, rulerTransparency), light: (0,colorUtils/* transparent */.JO)(mergeIncomingHeaderBackground, rulerTransparency), hcDark: mergeBorder, hcLight: mergeBorder }, nls/* localize */.kg('overviewRulerIncomingContentForeground', 'Incoming overview ruler foreground for inline merge-conflicts.'));
const overviewRulerCommonContentForeground = (0,colorUtils/* registerColor */.x1)('editorOverviewRuler.commonContentForeground', { dark: (0,colorUtils/* transparent */.JO)(mergeCommonHeaderBackground, rulerTransparency), light: (0,colorUtils/* transparent */.JO)(mergeCommonHeaderBackground, rulerTransparency), hcDark: mergeBorder, hcLight: mergeBorder }, nls/* localize */.kg('overviewRulerCommonContentForeground', 'Common ancestor overview ruler foreground for inline merge-conflicts.'));
const overviewRulerFindMatchForeground = (0,colorUtils/* registerColor */.x1)('editorOverviewRuler.findMatchForeground', { dark: '#d186167e', light: '#d186167e', hcDark: '#AB5A00', hcLight: '#AB5A00' }, nls/* localize */.kg('overviewRulerFindMatchForeground', 'Overview ruler marker color for find matches. The color must not be opaque so as not to hide underlying decorations.'), true);
const overviewRulerSelectionHighlightForeground = (0,colorUtils/* registerColor */.x1)('editorOverviewRuler.selectionHighlightForeground', '#A0A0A0CC', nls/* localize */.kg('overviewRulerSelectionHighlightForeground', 'Overview ruler marker color for selection highlights. The color must not be opaque so as not to hide underlying decorations.'), true);
// ----- problems
const problemsErrorIconForeground = (0,colorUtils/* registerColor */.x1)('problemsErrorIcon.foreground', editorErrorForeground, nls/* localize */.kg('problemsErrorIconForeground', "The color used for the problems error icon."));
const problemsWarningIconForeground = (0,colorUtils/* registerColor */.x1)('problemsWarningIcon.foreground', editorWarningForeground, nls/* localize */.kg('problemsWarningIconForeground', "The color used for the problems warning icon."));
const problemsInfoIconForeground = (0,colorUtils/* registerColor */.x1)('problemsInfoIcon.foreground', editorInfoForeground, nls/* localize */.kg('problemsInfoIconForeground', "The color used for the problems info icon."));

;// ./node_modules/monaco-editor/esm/vs/platform/theme/common/colors/minimapColors.js
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// Import the effects we need


// Import the colors we need


const minimapFindMatch = (0,colorUtils/* registerColor */.x1)('minimap.findMatchHighlight', { light: '#d18616', dark: '#d18616', hcDark: '#AB5A00', hcLight: '#0F4A85' }, nls/* localize */.kg('minimapFindMatchHighlight', 'Minimap marker color for find matches.'), true);
const minimapSelectionOccurrenceHighlight = (0,colorUtils/* registerColor */.x1)('minimap.selectionOccurrenceHighlight', { light: '#c9c9c9', dark: '#676767', hcDark: '#ffffff', hcLight: '#0F4A85' }, nls/* localize */.kg('minimapSelectionOccurrenceHighlight', 'Minimap marker color for repeating editor selections.'), true);
const minimapSelection = (0,colorUtils/* registerColor */.x1)('minimap.selectionHighlight', { light: '#ADD6FF', dark: '#264F78', hcDark: '#ffffff', hcLight: '#0F4A85' }, nls/* localize */.kg('minimapSelectionHighlight', 'Minimap marker color for the editor selection.'), true);
const minimapInfo = (0,colorUtils/* registerColor */.x1)('minimap.infoHighlight', { dark: editorInfoForeground, light: editorInfoForeground, hcDark: editorInfoBorder, hcLight: editorInfoBorder }, nls/* localize */.kg('minimapInfo', 'Minimap marker color for infos.'));
const minimapWarning = (0,colorUtils/* registerColor */.x1)('minimap.warningHighlight', { dark: editorWarningForeground, light: editorWarningForeground, hcDark: editorWarningBorder, hcLight: editorWarningBorder }, nls/* localize */.kg('overviewRuleWarning', 'Minimap marker color for warnings.'));
const minimapError = (0,colorUtils/* registerColor */.x1)('minimap.errorHighlight', { dark: new color/* Color */.Q1(new color/* RGBA */.bU(255, 18, 18, 0.7)), light: new color/* Color */.Q1(new color/* RGBA */.bU(255, 18, 18, 0.7)), hcDark: new color/* Color */.Q1(new color/* RGBA */.bU(255, 50, 50, 1)), hcLight: '#B5200D' }, nls/* localize */.kg('minimapError', 'Minimap marker color for errors.'));
const minimapBackground = (0,colorUtils/* registerColor */.x1)('minimap.background', null, nls/* localize */.kg('minimapBackground', "Minimap background color."));
const minimapForegroundOpacity = (0,colorUtils/* registerColor */.x1)('minimap.foregroundOpacity', color/* Color */.Q1.fromHex('#000f'), nls/* localize */.kg('minimapForegroundOpacity', 'Opacity of foreground elements rendered in the minimap. For example, "#000000c0" will render the elements with 75% opacity.'));
const minimapSliderBackground = (0,colorUtils/* registerColor */.x1)('minimapSlider.background', (0,colorUtils/* transparent */.JO)(scrollbarSliderBackground, 0.5), nls/* localize */.kg('minimapSliderBackground', "Minimap slider background color."));
const minimapSliderHoverBackground = (0,colorUtils/* registerColor */.x1)('minimapSlider.hoverBackground', (0,colorUtils/* transparent */.JO)(scrollbarSliderHoverBackground, 0.5), nls/* localize */.kg('minimapSliderHoverBackground', "Minimap slider background color when hovering."));
const minimapSliderActiveBackground = (0,colorUtils/* registerColor */.x1)('minimapSlider.activeBackground', (0,colorUtils/* transparent */.JO)(scrollbarSliderActiveBackground, 0.5), nls/* localize */.kg('minimapSliderActiveBackground', "Minimap slider background color when clicked on."));

;// ./node_modules/monaco-editor/esm/vs/platform/theme/common/colors/chartsColors.js
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/





const chartsForeground = (0,colorUtils/* registerColor */.x1)('charts.foreground', foreground, nls/* localize */.kg('chartsForeground', "The foreground color used in charts."));
const chartsLines = (0,colorUtils/* registerColor */.x1)('charts.lines', (0,colorUtils/* transparent */.JO)(foreground, .5), nls/* localize */.kg('chartsLines', "The color used for horizontal lines in charts."));
const chartsRed = (0,colorUtils/* registerColor */.x1)('charts.red', editorErrorForeground, nls/* localize */.kg('chartsRed', "The red color used in chart visualizations."));
const chartsBlue = (0,colorUtils/* registerColor */.x1)('charts.blue', editorInfoForeground, nls/* localize */.kg('chartsBlue', "The blue color used in chart visualizations."));
const chartsYellow = (0,colorUtils/* registerColor */.x1)('charts.yellow', editorWarningForeground, nls/* localize */.kg('chartsYellow', "The yellow color used in chart visualizations."));
const chartsOrange = (0,colorUtils/* registerColor */.x1)('charts.orange', minimapFindMatch, nls/* localize */.kg('chartsOrange', "The orange color used in chart visualizations."));
const chartsGreen = (0,colorUtils/* registerColor */.x1)('charts.green', { dark: '#89D185', light: '#388A34', hcDark: '#89D185', hcLight: '#374e06' }, nls/* localize */.kg('chartsGreen', "The green color used in chart visualizations."));
const chartsPurple = (0,colorUtils/* registerColor */.x1)('charts.purple', { dark: '#B180D7', light: '#652D90', hcDark: '#B180D7', hcLight: '#652D90' }, nls/* localize */.kg('chartsPurple', "The purple color used in chart visualizations."));

;// ./node_modules/monaco-editor/esm/vs/platform/theme/common/colors/inputColors.js
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// Import the effects we need


// Import the colors we need


// ----- input
const inputBackground = (0,colorUtils/* registerColor */.x1)('input.background', { dark: '#3C3C3C', light: color/* Color */.Q1.white, hcDark: color/* Color */.Q1.black, hcLight: color/* Color */.Q1.white }, nls/* localize */.kg('inputBoxBackground', "Input box background."));
const inputForeground = (0,colorUtils/* registerColor */.x1)('input.foreground', foreground, nls/* localize */.kg('inputBoxForeground', "Input box foreground."));
const inputBorder = (0,colorUtils/* registerColor */.x1)('input.border', { dark: null, light: null, hcDark: contrastBorder, hcLight: contrastBorder }, nls/* localize */.kg('inputBoxBorder', "Input box border."));
const inputActiveOptionBorder = (0,colorUtils/* registerColor */.x1)('inputOption.activeBorder', { dark: '#007ACC', light: '#007ACC', hcDark: contrastBorder, hcLight: contrastBorder }, nls/* localize */.kg('inputBoxActiveOptionBorder', "Border color of activated options in input fields."));
const inputActiveOptionHoverBackground = (0,colorUtils/* registerColor */.x1)('inputOption.hoverBackground', { dark: '#5a5d5e80', light: '#b8b8b850', hcDark: null, hcLight: null }, nls/* localize */.kg('inputOption.hoverBackground', "Background color of activated options in input fields."));
const inputActiveOptionBackground = (0,colorUtils/* registerColor */.x1)('inputOption.activeBackground', { dark: (0,colorUtils/* transparent */.JO)(focusBorder, 0.4), light: (0,colorUtils/* transparent */.JO)(focusBorder, 0.2), hcDark: color/* Color */.Q1.transparent, hcLight: color/* Color */.Q1.transparent }, nls/* localize */.kg('inputOption.activeBackground', "Background hover color of options in input fields."));
const inputActiveOptionForeground = (0,colorUtils/* registerColor */.x1)('inputOption.activeForeground', { dark: color/* Color */.Q1.white, light: color/* Color */.Q1.black, hcDark: foreground, hcLight: foreground }, nls/* localize */.kg('inputOption.activeForeground', "Foreground color of activated options in input fields."));
const inputPlaceholderForeground = (0,colorUtils/* registerColor */.x1)('input.placeholderForeground', { light: (0,colorUtils/* transparent */.JO)(foreground, 0.5), dark: (0,colorUtils/* transparent */.JO)(foreground, 0.5), hcDark: (0,colorUtils/* transparent */.JO)(foreground, 0.7), hcLight: (0,colorUtils/* transparent */.JO)(foreground, 0.7) }, nls/* localize */.kg('inputPlaceholderForeground', "Input box foreground color for placeholder text."));
// ----- input validation
const inputValidationInfoBackground = (0,colorUtils/* registerColor */.x1)('inputValidation.infoBackground', { dark: '#063B49', light: '#D6ECF2', hcDark: color/* Color */.Q1.black, hcLight: color/* Color */.Q1.white }, nls/* localize */.kg('inputValidationInfoBackground', "Input validation background color for information severity."));
const inputValidationInfoForeground = (0,colorUtils/* registerColor */.x1)('inputValidation.infoForeground', { dark: null, light: null, hcDark: null, hcLight: foreground }, nls/* localize */.kg('inputValidationInfoForeground', "Input validation foreground color for information severity."));
const inputValidationInfoBorder = (0,colorUtils/* registerColor */.x1)('inputValidation.infoBorder', { dark: '#007acc', light: '#007acc', hcDark: contrastBorder, hcLight: contrastBorder }, nls/* localize */.kg('inputValidationInfoBorder', "Input validation border color for information severity."));
const inputValidationWarningBackground = (0,colorUtils/* registerColor */.x1)('inputValidation.warningBackground', { dark: '#352A05', light: '#F6F5D2', hcDark: color/* Color */.Q1.black, hcLight: color/* Color */.Q1.white }, nls/* localize */.kg('inputValidationWarningBackground', "Input validation background color for warning severity."));
const inputValidationWarningForeground = (0,colorUtils/* registerColor */.x1)('inputValidation.warningForeground', { dark: null, light: null, hcDark: null, hcLight: foreground }, nls/* localize */.kg('inputValidationWarningForeground', "Input validation foreground color for warning severity."));
const inputValidationWarningBorder = (0,colorUtils/* registerColor */.x1)('inputValidation.warningBorder', { dark: '#B89500', light: '#B89500', hcDark: contrastBorder, hcLight: contrastBorder }, nls/* localize */.kg('inputValidationWarningBorder', "Input validation border color for warning severity."));
const inputValidationErrorBackground = (0,colorUtils/* registerColor */.x1)('inputValidation.errorBackground', { dark: '#5A1D1D', light: '#F2DEDE', hcDark: color/* Color */.Q1.black, hcLight: color/* Color */.Q1.white }, nls/* localize */.kg('inputValidationErrorBackground', "Input validation background color for error severity."));
const inputValidationErrorForeground = (0,colorUtils/* registerColor */.x1)('inputValidation.errorForeground', { dark: null, light: null, hcDark: null, hcLight: foreground }, nls/* localize */.kg('inputValidationErrorForeground', "Input validation foreground color for error severity."));
const inputValidationErrorBorder = (0,colorUtils/* registerColor */.x1)('inputValidation.errorBorder', { dark: '#BE1100', light: '#BE1100', hcDark: contrastBorder, hcLight: contrastBorder }, nls/* localize */.kg('inputValidationErrorBorder', "Input validation border color for error severity."));
// ----- select
const selectBackground = (0,colorUtils/* registerColor */.x1)('dropdown.background', { dark: '#3C3C3C', light: color/* Color */.Q1.white, hcDark: color/* Color */.Q1.black, hcLight: color/* Color */.Q1.white }, nls/* localize */.kg('dropdownBackground', "Dropdown background."));
const selectListBackground = (0,colorUtils/* registerColor */.x1)('dropdown.listBackground', { dark: null, light: null, hcDark: color/* Color */.Q1.black, hcLight: color/* Color */.Q1.white }, nls/* localize */.kg('dropdownListBackground', "Dropdown list background."));
const selectForeground = (0,colorUtils/* registerColor */.x1)('dropdown.foreground', { dark: '#F0F0F0', light: foreground, hcDark: color/* Color */.Q1.white, hcLight: foreground }, nls/* localize */.kg('dropdownForeground', "Dropdown foreground."));
const selectBorder = (0,colorUtils/* registerColor */.x1)('dropdown.border', { dark: selectBackground, light: '#CECECE', hcDark: contrastBorder, hcLight: contrastBorder }, nls/* localize */.kg('dropdownBorder', "Dropdown border."));
// ------ button
const buttonForeground = (0,colorUtils/* registerColor */.x1)('button.foreground', color/* Color */.Q1.white, nls/* localize */.kg('buttonForeground', "Button foreground color."));
const buttonSeparator = (0,colorUtils/* registerColor */.x1)('button.separator', (0,colorUtils/* transparent */.JO)(buttonForeground, .4), nls/* localize */.kg('buttonSeparator', "Button separator color."));
const buttonBackground = (0,colorUtils/* registerColor */.x1)('button.background', { dark: '#0E639C', light: '#007ACC', hcDark: null, hcLight: '#0F4A85' }, nls/* localize */.kg('buttonBackground', "Button background color."));
const buttonHoverBackground = (0,colorUtils/* registerColor */.x1)('button.hoverBackground', { dark: (0,colorUtils/* lighten */.a)(buttonBackground, 0.2), light: (0,colorUtils/* darken */.e$)(buttonBackground, 0.2), hcDark: buttonBackground, hcLight: buttonBackground }, nls/* localize */.kg('buttonHoverBackground', "Button background color when hovering."));
const buttonBorder = (0,colorUtils/* registerColor */.x1)('button.border', contrastBorder, nls/* localize */.kg('buttonBorder', "Button border color."));
const buttonSecondaryForeground = (0,colorUtils/* registerColor */.x1)('button.secondaryForeground', { dark: color/* Color */.Q1.white, light: color/* Color */.Q1.white, hcDark: color/* Color */.Q1.white, hcLight: foreground }, nls/* localize */.kg('buttonSecondaryForeground', "Secondary button foreground color."));
const buttonSecondaryBackground = (0,colorUtils/* registerColor */.x1)('button.secondaryBackground', { dark: '#3A3D41', light: '#5F6A79', hcDark: null, hcLight: color/* Color */.Q1.white }, nls/* localize */.kg('buttonSecondaryBackground', "Secondary button background color."));
const buttonSecondaryHoverBackground = (0,colorUtils/* registerColor */.x1)('button.secondaryHoverBackground', { dark: (0,colorUtils/* lighten */.a)(buttonSecondaryBackground, 0.2), light: (0,colorUtils/* darken */.e$)(buttonSecondaryBackground, 0.2), hcDark: null, hcLight: null }, nls/* localize */.kg('buttonSecondaryHoverBackground', "Secondary button background color when hovering."));
// ------ radio
const radioActiveForeground = (0,colorUtils/* registerColor */.x1)('radio.activeForeground', inputActiveOptionForeground, nls/* localize */.kg('radioActiveForeground', "Foreground color of active radio option."));
const radioActiveBackground = (0,colorUtils/* registerColor */.x1)('radio.activeBackground', inputActiveOptionBackground, nls/* localize */.kg('radioBackground', "Background color of active radio option."));
const radioActiveBorder = (0,colorUtils/* registerColor */.x1)('radio.activeBorder', inputActiveOptionBorder, nls/* localize */.kg('radioActiveBorder', "Border color of the active radio option."));
const radioInactiveForeground = (0,colorUtils/* registerColor */.x1)('radio.inactiveForeground', null, nls/* localize */.kg('radioInactiveForeground', "Foreground color of inactive radio option."));
const radioInactiveBackground = (0,colorUtils/* registerColor */.x1)('radio.inactiveBackground', null, nls/* localize */.kg('radioInactiveBackground', "Background color of inactive radio option."));
const radioInactiveBorder = (0,colorUtils/* registerColor */.x1)('radio.inactiveBorder', { light: (0,colorUtils/* transparent */.JO)(radioActiveForeground, .2), dark: (0,colorUtils/* transparent */.JO)(radioActiveForeground, .2), hcDark: (0,colorUtils/* transparent */.JO)(radioActiveForeground, .4), hcLight: (0,colorUtils/* transparent */.JO)(radioActiveForeground, .2) }, nls/* localize */.kg('radioInactiveBorder', "Border color of the inactive radio option."));
const radioInactiveHoverBackground = (0,colorUtils/* registerColor */.x1)('radio.inactiveHoverBackground', inputActiveOptionHoverBackground, nls/* localize */.kg('radioHoverBackground', "Background color of inactive active radio option when hovering."));
// ------ checkbox
const checkboxBackground = (0,colorUtils/* registerColor */.x1)('checkbox.background', selectBackground, nls/* localize */.kg('checkbox.background', "Background color of checkbox widget."));
const checkboxSelectBackground = (0,colorUtils/* registerColor */.x1)('checkbox.selectBackground', editorWidgetBackground, nls/* localize */.kg('checkbox.select.background', "Background color of checkbox widget when the element it's in is selected."));
const checkboxForeground = (0,colorUtils/* registerColor */.x1)('checkbox.foreground', selectForeground, nls/* localize */.kg('checkbox.foreground', "Foreground color of checkbox widget."));
const checkboxBorder = (0,colorUtils/* registerColor */.x1)('checkbox.border', selectBorder, nls/* localize */.kg('checkbox.border', "Border color of checkbox widget."));
const checkboxSelectBorder = (0,colorUtils/* registerColor */.x1)('checkbox.selectBorder', iconForeground, nls/* localize */.kg('checkbox.select.border', "Border color of checkbox widget when the element it's in is selected."));
// ------ keybinding label
const keybindingLabelBackground = (0,colorUtils/* registerColor */.x1)('keybindingLabel.background', { dark: new color/* Color */.Q1(new color/* RGBA */.bU(128, 128, 128, 0.17)), light: new color/* Color */.Q1(new color/* RGBA */.bU(221, 221, 221, 0.4)), hcDark: color/* Color */.Q1.transparent, hcLight: color/* Color */.Q1.transparent }, nls/* localize */.kg('keybindingLabelBackground', "Keybinding label background color. The keybinding label is used to represent a keyboard shortcut."));
const keybindingLabelForeground = (0,colorUtils/* registerColor */.x1)('keybindingLabel.foreground', { dark: color/* Color */.Q1.fromHex('#CCCCCC'), light: color/* Color */.Q1.fromHex('#555555'), hcDark: color/* Color */.Q1.white, hcLight: foreground }, nls/* localize */.kg('keybindingLabelForeground', "Keybinding label foreground color. The keybinding label is used to represent a keyboard shortcut."));
const keybindingLabelBorder = (0,colorUtils/* registerColor */.x1)('keybindingLabel.border', { dark: new color/* Color */.Q1(new color/* RGBA */.bU(51, 51, 51, 0.6)), light: new color/* Color */.Q1(new color/* RGBA */.bU(204, 204, 204, 0.4)), hcDark: new color/* Color */.Q1(new color/* RGBA */.bU(111, 195, 223)), hcLight: contrastBorder }, nls/* localize */.kg('keybindingLabelBorder', "Keybinding label border color. The keybinding label is used to represent a keyboard shortcut."));
const keybindingLabelBottomBorder = (0,colorUtils/* registerColor */.x1)('keybindingLabel.bottomBorder', { dark: new color/* Color */.Q1(new color/* RGBA */.bU(68, 68, 68, 0.6)), light: new color/* Color */.Q1(new color/* RGBA */.bU(187, 187, 187, 0.4)), hcDark: new color/* Color */.Q1(new color/* RGBA */.bU(111, 195, 223)), hcLight: foreground }, nls/* localize */.kg('keybindingLabelBottomBorder', "Keybinding label border bottom color. The keybinding label is used to represent a keyboard shortcut."));

;// ./node_modules/monaco-editor/esm/vs/platform/theme/common/colors/listColors.js
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// Import the effects we need


// Import the colors we need


const listFocusBackground = (0,colorUtils/* registerColor */.x1)('list.focusBackground', null, nls/* localize */.kg('listFocusBackground', "List/Tree background color for the focused item when the list/tree is active. An active list/tree has keyboard focus, an inactive does not."));
const listFocusForeground = (0,colorUtils/* registerColor */.x1)('list.focusForeground', null, nls/* localize */.kg('listFocusForeground', "List/Tree foreground color for the focused item when the list/tree is active. An active list/tree has keyboard focus, an inactive does not."));
const listFocusOutline = (0,colorUtils/* registerColor */.x1)('list.focusOutline', { dark: focusBorder, light: focusBorder, hcDark: activeContrastBorder, hcLight: activeContrastBorder }, nls/* localize */.kg('listFocusOutline', "List/Tree outline color for the focused item when the list/tree is active. An active list/tree has keyboard focus, an inactive does not."));
const listFocusAndSelectionOutline = (0,colorUtils/* registerColor */.x1)('list.focusAndSelectionOutline', null, nls/* localize */.kg('listFocusAndSelectionOutline', "List/Tree outline color for the focused item when the list/tree is active and selected. An active list/tree has keyboard focus, an inactive does not."));
const listActiveSelectionBackground = (0,colorUtils/* registerColor */.x1)('list.activeSelectionBackground', { dark: '#04395E', light: '#0060C0', hcDark: null, hcLight: color/* Color */.Q1.fromHex('#0F4A85').transparent(0.1) }, nls/* localize */.kg('listActiveSelectionBackground', "List/Tree background color for the selected item when the list/tree is active. An active list/tree has keyboard focus, an inactive does not."));
const listActiveSelectionForeground = (0,colorUtils/* registerColor */.x1)('list.activeSelectionForeground', { dark: color/* Color */.Q1.white, light: color/* Color */.Q1.white, hcDark: null, hcLight: null }, nls/* localize */.kg('listActiveSelectionForeground', "List/Tree foreground color for the selected item when the list/tree is active. An active list/tree has keyboard focus, an inactive does not."));
const listActiveSelectionIconForeground = (0,colorUtils/* registerColor */.x1)('list.activeSelectionIconForeground', null, nls/* localize */.kg('listActiveSelectionIconForeground', "List/Tree icon foreground color for the selected item when the list/tree is active. An active list/tree has keyboard focus, an inactive does not."));
const listInactiveSelectionBackground = (0,colorUtils/* registerColor */.x1)('list.inactiveSelectionBackground', { dark: '#37373D', light: '#E4E6F1', hcDark: null, hcLight: color/* Color */.Q1.fromHex('#0F4A85').transparent(0.1) }, nls/* localize */.kg('listInactiveSelectionBackground', "List/Tree background color for the selected item when the list/tree is inactive. An active list/tree has keyboard focus, an inactive does not."));
const listInactiveSelectionForeground = (0,colorUtils/* registerColor */.x1)('list.inactiveSelectionForeground', null, nls/* localize */.kg('listInactiveSelectionForeground', "List/Tree foreground color for the selected item when the list/tree is inactive. An active list/tree has keyboard focus, an inactive does not."));
const listInactiveSelectionIconForeground = (0,colorUtils/* registerColor */.x1)('list.inactiveSelectionIconForeground', null, nls/* localize */.kg('listInactiveSelectionIconForeground', "List/Tree icon foreground color for the selected item when the list/tree is inactive. An active list/tree has keyboard focus, an inactive does not."));
const listInactiveFocusBackground = (0,colorUtils/* registerColor */.x1)('list.inactiveFocusBackground', null, nls/* localize */.kg('listInactiveFocusBackground', "List/Tree background color for the focused item when the list/tree is inactive. An active list/tree has keyboard focus, an inactive does not."));
const listInactiveFocusOutline = (0,colorUtils/* registerColor */.x1)('list.inactiveFocusOutline', null, nls/* localize */.kg('listInactiveFocusOutline', "List/Tree outline color for the focused item when the list/tree is inactive. An active list/tree has keyboard focus, an inactive does not."));
const listHoverBackground = (0,colorUtils/* registerColor */.x1)('list.hoverBackground', { dark: '#2A2D2E', light: '#F0F0F0', hcDark: color/* Color */.Q1.white.transparent(0.1), hcLight: color/* Color */.Q1.fromHex('#0F4A85').transparent(0.1) }, nls/* localize */.kg('listHoverBackground', "List/Tree background when hovering over items using the mouse."));
const listHoverForeground = (0,colorUtils/* registerColor */.x1)('list.hoverForeground', null, nls/* localize */.kg('listHoverForeground', "List/Tree foreground when hovering over items using the mouse."));
const listDropOverBackground = (0,colorUtils/* registerColor */.x1)('list.dropBackground', { dark: '#062F4A', light: '#D6EBFF', hcDark: null, hcLight: null }, nls/* localize */.kg('listDropBackground', "List/Tree drag and drop background when moving items over other items when using the mouse."));
const listDropBetweenBackground = (0,colorUtils/* registerColor */.x1)('list.dropBetweenBackground', { dark: iconForeground, light: iconForeground, hcDark: null, hcLight: null }, nls/* localize */.kg('listDropBetweenBackground', "List/Tree drag and drop border color when moving items between items when using the mouse."));
const listHighlightForeground = (0,colorUtils/* registerColor */.x1)('list.highlightForeground', { dark: '#2AAAFF', light: '#0066BF', hcDark: focusBorder, hcLight: focusBorder }, nls/* localize */.kg('highlight', 'List/Tree foreground color of the match highlights when searching inside the list/tree.'));
const listFocusHighlightForeground = (0,colorUtils/* registerColor */.x1)('list.focusHighlightForeground', { dark: listHighlightForeground, light: (0,colorUtils/* ifDefinedThenElse */.Hz)(listActiveSelectionBackground, listHighlightForeground, '#BBE7FF'), hcDark: listHighlightForeground, hcLight: listHighlightForeground }, nls/* localize */.kg('listFocusHighlightForeground', 'List/Tree foreground color of the match highlights on actively focused items when searching inside the list/tree.'));
const listInvalidItemForeground = (0,colorUtils/* registerColor */.x1)('list.invalidItemForeground', { dark: '#B89500', light: '#B89500', hcDark: '#B89500', hcLight: '#B5200D' }, nls/* localize */.kg('invalidItemForeground', 'List/Tree foreground color for invalid items, for example an unresolved root in explorer.'));
const listErrorForeground = (0,colorUtils/* registerColor */.x1)('list.errorForeground', { dark: '#F88070', light: '#B01011', hcDark: null, hcLight: null }, nls/* localize */.kg('listErrorForeground', 'Foreground color of list items containing errors.'));
const listWarningForeground = (0,colorUtils/* registerColor */.x1)('list.warningForeground', { dark: '#CCA700', light: '#855F00', hcDark: null, hcLight: null }, nls/* localize */.kg('listWarningForeground', 'Foreground color of list items containing warnings.'));
const listFilterWidgetBackground = (0,colorUtils/* registerColor */.x1)('listFilterWidget.background', { light: (0,colorUtils/* darken */.e$)(editorWidgetBackground, 0), dark: (0,colorUtils/* lighten */.a)(editorWidgetBackground, 0), hcDark: editorWidgetBackground, hcLight: editorWidgetBackground }, nls/* localize */.kg('listFilterWidgetBackground', 'Background color of the type filter widget in lists and trees.'));
const listFilterWidgetOutline = (0,colorUtils/* registerColor */.x1)('listFilterWidget.outline', { dark: color/* Color */.Q1.transparent, light: color/* Color */.Q1.transparent, hcDark: '#f38518', hcLight: '#007ACC' }, nls/* localize */.kg('listFilterWidgetOutline', 'Outline color of the type filter widget in lists and trees.'));
const listFilterWidgetNoMatchesOutline = (0,colorUtils/* registerColor */.x1)('listFilterWidget.noMatchesOutline', { dark: '#BE1100', light: '#BE1100', hcDark: contrastBorder, hcLight: contrastBorder }, nls/* localize */.kg('listFilterWidgetNoMatchesOutline', 'Outline color of the type filter widget in lists and trees, when there are no matches.'));
const listFilterWidgetShadow = (0,colorUtils/* registerColor */.x1)('listFilterWidget.shadow', widgetShadow, nls/* localize */.kg('listFilterWidgetShadow', 'Shadow color of the type filter widget in lists and trees.'));
const listFilterMatchHighlight = (0,colorUtils/* registerColor */.x1)('list.filterMatchBackground', { dark: editorFindMatchHighlight, light: editorFindMatchHighlight, hcDark: null, hcLight: null }, nls/* localize */.kg('listFilterMatchHighlight', 'Background color of the filtered match.'));
const listFilterMatchHighlightBorder = (0,colorUtils/* registerColor */.x1)('list.filterMatchBorder', { dark: editorFindMatchHighlightBorder, light: editorFindMatchHighlightBorder, hcDark: contrastBorder, hcLight: activeContrastBorder }, nls/* localize */.kg('listFilterMatchHighlightBorder', 'Border color of the filtered match.'));
const listDeemphasizedForeground = (0,colorUtils/* registerColor */.x1)('list.deemphasizedForeground', { dark: '#8C8C8C', light: '#8E8E90', hcDark: '#A7A8A9', hcLight: '#666666' }, nls/* localize */.kg('listDeemphasizedForeground', "List/Tree foreground color for items that are deemphasized."));
// ------ tree
const treeIndentGuidesStroke = (0,colorUtils/* registerColor */.x1)('tree.indentGuidesStroke', { dark: '#585858', light: '#a9a9a9', hcDark: '#a9a9a9', hcLight: '#a5a5a5' }, nls/* localize */.kg('treeIndentGuidesStroke', "Tree stroke color for the indentation guides."));
const treeInactiveIndentGuidesStroke = (0,colorUtils/* registerColor */.x1)('tree.inactiveIndentGuidesStroke', (0,colorUtils/* transparent */.JO)(treeIndentGuidesStroke, 0.4), nls/* localize */.kg('treeInactiveIndentGuidesStroke', "Tree stroke color for the indentation guides that are not active."));
// ------ table
const tableColumnsBorder = (0,colorUtils/* registerColor */.x1)('tree.tableColumnsBorder', { dark: '#CCCCCC20', light: '#61616120', hcDark: null, hcLight: null }, nls/* localize */.kg('tableColumnsBorder', "Table border color between columns."));
const tableOddRowsBackgroundColor = (0,colorUtils/* registerColor */.x1)('tree.tableOddRowsBackground', { dark: (0,colorUtils/* transparent */.JO)(foreground, 0.04), light: (0,colorUtils/* transparent */.JO)(foreground, 0.04), hcDark: null, hcLight: null }, nls/* localize */.kg('tableOddRowsBackgroundColor', "Background color for odd table rows."));
// ------ action list
const editorActionListBackground = (0,colorUtils/* registerColor */.x1)('editorActionList.background', editorWidgetBackground, nls/* localize */.kg('editorActionListBackground', "Action List background color."));
const editorActionListForeground = (0,colorUtils/* registerColor */.x1)('editorActionList.foreground', editorWidgetForeground, nls/* localize */.kg('editorActionListForeground', "Action List foreground color."));
const editorActionListFocusForeground = (0,colorUtils/* registerColor */.x1)('editorActionList.focusForeground', listActiveSelectionForeground, nls/* localize */.kg('editorActionListFocusForeground', "Action List foreground color for the focused item."));
const editorActionListFocusBackground = (0,colorUtils/* registerColor */.x1)('editorActionList.focusBackground', listActiveSelectionBackground, nls/* localize */.kg('editorActionListFocusBackground', "Action List background color for the focused item."));

;// ./node_modules/monaco-editor/esm/vs/platform/theme/common/colors/menuColors.js
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// Import the effects we need

// Import the colors we need



const menuBorder = (0,colorUtils/* registerColor */.x1)('menu.border', { dark: null, light: null, hcDark: contrastBorder, hcLight: contrastBorder }, nls/* localize */.kg('menuBorder', "Border color of menus."));
const menuForeground = (0,colorUtils/* registerColor */.x1)('menu.foreground', selectForeground, nls/* localize */.kg('menuForeground', "Foreground color of menu items."));
const menuBackground = (0,colorUtils/* registerColor */.x1)('menu.background', selectBackground, nls/* localize */.kg('menuBackground', "Background color of menu items."));
const menuSelectionForeground = (0,colorUtils/* registerColor */.x1)('menu.selectionForeground', listActiveSelectionForeground, nls/* localize */.kg('menuSelectionForeground', "Foreground color of the selected menu item in menus."));
const menuSelectionBackground = (0,colorUtils/* registerColor */.x1)('menu.selectionBackground', listActiveSelectionBackground, nls/* localize */.kg('menuSelectionBackground', "Background color of the selected menu item in menus."));
const menuSelectionBorder = (0,colorUtils/* registerColor */.x1)('menu.selectionBorder', { dark: null, light: null, hcDark: activeContrastBorder, hcLight: activeContrastBorder }, nls/* localize */.kg('menuSelectionBorder', "Border color of the selected menu item in menus."));
const menuSeparatorBackground = (0,colorUtils/* registerColor */.x1)('menu.separatorBackground', { dark: '#606060', light: '#D4D4D4', hcDark: contrastBorder, hcLight: contrastBorder }, nls/* localize */.kg('menuSeparatorBackground', "Color of a separator menu item in menus."));

;// ./node_modules/monaco-editor/esm/vs/platform/theme/common/colors/quickpickColors.js
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// Import the effects we need


// Import the colors we need


const quickInputBackground = (0,colorUtils/* registerColor */.x1)('quickInput.background', editorWidgetBackground, nls/* localize */.kg('pickerBackground', "Quick picker background color. The quick picker widget is the container for pickers like the command palette."));
const quickInputForeground = (0,colorUtils/* registerColor */.x1)('quickInput.foreground', editorWidgetForeground, nls/* localize */.kg('pickerForeground', "Quick picker foreground color. The quick picker widget is the container for pickers like the command palette."));
const quickInputTitleBackground = (0,colorUtils/* registerColor */.x1)('quickInputTitle.background', { dark: new color/* Color */.Q1(new color/* RGBA */.bU(255, 255, 255, 0.105)), light: new color/* Color */.Q1(new color/* RGBA */.bU(0, 0, 0, 0.06)), hcDark: '#000000', hcLight: color/* Color */.Q1.white }, nls/* localize */.kg('pickerTitleBackground', "Quick picker title background color. The quick picker widget is the container for pickers like the command palette."));
const pickerGroupForeground = (0,colorUtils/* registerColor */.x1)('pickerGroup.foreground', { dark: '#3794FF', light: '#0066BF', hcDark: color/* Color */.Q1.white, hcLight: '#0F4A85' }, nls/* localize */.kg('pickerGroupForeground', "Quick picker color for grouping labels."));
const pickerGroupBorder = (0,colorUtils/* registerColor */.x1)('pickerGroup.border', { dark: '#3F3F46', light: '#CCCEDB', hcDark: color/* Color */.Q1.white, hcLight: '#0F4A85' }, nls/* localize */.kg('pickerGroupBorder', "Quick picker color for grouping borders."));
const _deprecatedQuickInputListFocusBackground = (0,colorUtils/* registerColor */.x1)('quickInput.list.focusBackground', null, '', undefined, nls/* localize */.kg('quickInput.list.focusBackground deprecation', "Please use quickInputList.focusBackground instead"));
const quickInputListFocusForeground = (0,colorUtils/* registerColor */.x1)('quickInputList.focusForeground', listActiveSelectionForeground, nls/* localize */.kg('quickInput.listFocusForeground', "Quick picker foreground color for the focused item."));
const quickInputListFocusIconForeground = (0,colorUtils/* registerColor */.x1)('quickInputList.focusIconForeground', listActiveSelectionIconForeground, nls/* localize */.kg('quickInput.listFocusIconForeground', "Quick picker icon foreground color for the focused item."));
const quickInputListFocusBackground = (0,colorUtils/* registerColor */.x1)('quickInputList.focusBackground', { dark: (0,colorUtils/* oneOf */.yL)(_deprecatedQuickInputListFocusBackground, listActiveSelectionBackground), light: (0,colorUtils/* oneOf */.yL)(_deprecatedQuickInputListFocusBackground, listActiveSelectionBackground), hcDark: null, hcLight: null }, nls/* localize */.kg('quickInput.listFocusBackground', "Quick picker background color for the focused item."));

;// ./node_modules/monaco-editor/esm/vs/platform/theme/common/colors/searchColors.js
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// Import the effects we need

// Import the colors we need


const searchResultsInfoForeground = (0,colorUtils/* registerColor */.x1)('search.resultsInfoForeground', { light: foreground, dark: (0,colorUtils/* transparent */.JO)(foreground, 0.65), hcDark: foreground, hcLight: foreground }, nls/* localize */.kg('search.resultsInfoForeground', "Color of the text in the search viewlet's completion message."));
// ----- search editor (Distinct from normal editor find match to allow for better differentiation)
const searchEditorFindMatch = (0,colorUtils/* registerColor */.x1)('searchEditor.findMatchBackground', { light: (0,colorUtils/* transparent */.JO)(editorFindMatchHighlight, 0.66), dark: (0,colorUtils/* transparent */.JO)(editorFindMatchHighlight, 0.66), hcDark: editorFindMatchHighlight, hcLight: editorFindMatchHighlight }, nls/* localize */.kg('searchEditor.queryMatch', "Color of the Search Editor query matches."));
const searchEditorFindMatchBorder = (0,colorUtils/* registerColor */.x1)('searchEditor.findMatchBorder', { light: (0,colorUtils/* transparent */.JO)(editorFindMatchHighlightBorder, 0.66), dark: (0,colorUtils/* transparent */.JO)(editorFindMatchHighlightBorder, 0.66), hcDark: editorFindMatchHighlightBorder, hcLight: editorFindMatchHighlightBorder }, nls/* localize */.kg('searchEditor.editorFindMatchBorder', "Border color of the Search Editor query matches."));

;// ./node_modules/monaco-editor/esm/vs/platform/theme/common/colorRegistry.js
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// Make sure all color files are exported












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

/***/ 87676
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Bb: () => (/* binding */ asCssVariableName),
/* harmony export */   Fd: () => (/* binding */ Extensions),
/* harmony export */   Gu: () => (/* binding */ asCssVariable),
/* harmony export */   HP: () => (/* binding */ asCssVariableWithDefault),
/* harmony export */   Hz: () => (/* binding */ ifDefinedThenElse),
/* harmony export */   JO: () => (/* binding */ transparent),
/* harmony export */   a: () => (/* binding */ lighten),
/* harmony export */   e$: () => (/* binding */ darken),
/* harmony export */   oG: () => (/* binding */ lessProminent),
/* harmony export */   x1: () => (/* binding */ registerColor),
/* harmony export */   yL: () => (/* binding */ oneOf)
/* harmony export */ });
/* unused harmony exports isColorDefaults, DEFAULT_COLOR_CONFIG_VALUE, executeTransform, resolveColorValue, workbenchColorsSchemaId */
/* harmony import */ var _base_common_assert_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(87110);
/* harmony import */ var _base_common_async_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(65958);
/* harmony import */ var _base_common_color_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(94901);
/* harmony import */ var _base_common_event_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(2106);
/* harmony import */ var _jsonschemas_common_jsonContributionRegistry_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(51460);
/* harmony import */ var _registry_common_platform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(67167);
/* harmony import */ var _nls_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(19746);
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/







/**
 * Returns the css variable name for the given color identifier. Dots (`.`) are replaced with hyphens (`-`) and
 * everything is prefixed with `--vscode-`.
 *
 * @sample `editorSuggestWidget.background` is `--vscode-editorSuggestWidget-background`.
 */
function asCssVariableName(colorIdent) {
    return `--vscode-${colorIdent.replace(/\./g, '-')}`;
}
function asCssVariable(color) {
    return `var(${asCssVariableName(color)})`;
}
function asCssVariableWithDefault(color, defaultCssValue) {
    return `var(${asCssVariableName(color)}, ${defaultCssValue})`;
}
function isColorDefaults(value) {
    return value !== null && typeof value === 'object' && 'light' in value && 'dark' in value;
}
// color registry
const Extensions = {
    ColorContribution: 'base.contributions.colors'
};
const DEFAULT_COLOR_CONFIG_VALUE = 'default';
class ColorRegistry {
    constructor() {
        this._onDidChangeSchema = new _base_common_event_js__WEBPACK_IMPORTED_MODULE_3__/* .Emitter */ .vl();
        this.onDidChangeSchema = this._onDidChangeSchema.event;
        this.colorSchema = { type: 'object', properties: {} };
        this.colorReferenceSchema = { type: 'string', enum: [], enumDescriptions: [] };
        this.colorsById = {};
    }
    registerColor(id, defaults, description, needsTransparency = false, deprecationMessage) {
        const colorContribution = { id, description, defaults, needsTransparency, deprecationMessage };
        this.colorsById[id] = colorContribution;
        const propertySchema = { type: 'string', format: 'color-hex', defaultSnippets: [{ body: '${1:#ff0000}' }] };
        if (deprecationMessage) {
            propertySchema.deprecationMessage = deprecationMessage;
        }
        if (needsTransparency) {
            propertySchema.pattern = '^#(?:(?<rgba>[0-9a-fA-f]{3}[0-9a-eA-E])|(?:[0-9a-fA-F]{6}(?:(?![fF]{2})(?:[0-9a-fA-F]{2}))))?$';
            propertySchema.patternErrorMessage = _nls_js__WEBPACK_IMPORTED_MODULE_6__/* .localize */ .kg('transparecyRequired', 'This color must be transparent or it will obscure content');
        }
        this.colorSchema.properties[id] = {
            description,
            oneOf: [
                propertySchema,
                { type: 'string', const: DEFAULT_COLOR_CONFIG_VALUE, description: _nls_js__WEBPACK_IMPORTED_MODULE_6__/* .localize */ .kg('useDefault', 'Use the default color.') }
            ]
        };
        this.colorReferenceSchema.enum.push(id);
        this.colorReferenceSchema.enumDescriptions.push(description);
        this._onDidChangeSchema.fire();
        return id;
    }
    getColors() {
        return Object.keys(this.colorsById).map(id => this.colorsById[id]);
    }
    resolveDefaultColor(id, theme) {
        const colorDesc = this.colorsById[id];
        if (colorDesc?.defaults) {
            const colorValue = isColorDefaults(colorDesc.defaults) ? colorDesc.defaults[theme.type] : colorDesc.defaults;
            return resolveColorValue(colorValue, theme);
        }
        return undefined;
    }
    getColorSchema() {
        return this.colorSchema;
    }
    toString() {
        const sorter = (a, b) => {
            const cat1 = a.indexOf('.') === -1 ? 0 : 1;
            const cat2 = b.indexOf('.') === -1 ? 0 : 1;
            if (cat1 !== cat2) {
                return cat1 - cat2;
            }
            return a.localeCompare(b);
        };
        return Object.keys(this.colorsById).sort(sorter).map(k => `- \`${k}\`: ${this.colorsById[k].description}`).join('\n');
    }
}
const colorRegistry = new ColorRegistry();
_registry_common_platform_js__WEBPACK_IMPORTED_MODULE_5__/* .Registry */ .O.add(Extensions.ColorContribution, colorRegistry);
function registerColor(id, defaults, description, needsTransparency, deprecationMessage) {
    return colorRegistry.registerColor(id, defaults, description, needsTransparency, deprecationMessage);
}
// ----- color functions
function executeTransform(transform, theme) {
    switch (transform.op) {
        case 0 /* ColorTransformType.Darken */:
            return resolveColorValue(transform.value, theme)?.darken(transform.factor);
        case 1 /* ColorTransformType.Lighten */:
            return resolveColorValue(transform.value, theme)?.lighten(transform.factor);
        case 2 /* ColorTransformType.Transparent */:
            return resolveColorValue(transform.value, theme)?.transparent(transform.factor);
        case 3 /* ColorTransformType.Opaque */: {
            const backgroundColor = resolveColorValue(transform.background, theme);
            if (!backgroundColor) {
                return resolveColorValue(transform.value, theme);
            }
            return resolveColorValue(transform.value, theme)?.makeOpaque(backgroundColor);
        }
        case 4 /* ColorTransformType.OneOf */:
            for (const candidate of transform.values) {
                const color = resolveColorValue(candidate, theme);
                if (color) {
                    return color;
                }
            }
            return undefined;
        case 6 /* ColorTransformType.IfDefinedThenElse */:
            return resolveColorValue(theme.defines(transform.if) ? transform.then : transform.else, theme);
        case 5 /* ColorTransformType.LessProminent */: {
            const from = resolveColorValue(transform.value, theme);
            if (!from) {
                return undefined;
            }
            const backgroundColor = resolveColorValue(transform.background, theme);
            if (!backgroundColor) {
                return from.transparent(transform.factor * transform.transparency);
            }
            return from.isDarkerThan(backgroundColor)
                ? _base_common_color_js__WEBPACK_IMPORTED_MODULE_2__/* .Color */ .Q1.getLighterColor(from, backgroundColor, transform.factor).transparent(transform.transparency)
                : _base_common_color_js__WEBPACK_IMPORTED_MODULE_2__/* .Color */ .Q1.getDarkerColor(from, backgroundColor, transform.factor).transparent(transform.transparency);
        }
        default:
            throw (0,_base_common_assert_js__WEBPACK_IMPORTED_MODULE_0__/* .assertNever */ .xb)(transform);
    }
}
function darken(colorValue, factor) {
    return { op: 0 /* ColorTransformType.Darken */, value: colorValue, factor };
}
function lighten(colorValue, factor) {
    return { op: 1 /* ColorTransformType.Lighten */, value: colorValue, factor };
}
function transparent(colorValue, factor) {
    return { op: 2 /* ColorTransformType.Transparent */, value: colorValue, factor };
}
function oneOf(...colorValues) {
    return { op: 4 /* ColorTransformType.OneOf */, values: colorValues };
}
function ifDefinedThenElse(ifArg, thenArg, elseArg) {
    return { op: 6 /* ColorTransformType.IfDefinedThenElse */, if: ifArg, then: thenArg, else: elseArg };
}
function lessProminent(colorValue, backgroundColorValue, factor, transparency) {
    return { op: 5 /* ColorTransformType.LessProminent */, value: colorValue, background: backgroundColorValue, factor, transparency };
}
// ----- implementation
/**
 * @param colorValue Resolve a color value in the context of a theme
 */
function resolveColorValue(colorValue, theme) {
    if (colorValue === null) {
        return undefined;
    }
    else if (typeof colorValue === 'string') {
        if (colorValue[0] === '#') {
            return _base_common_color_js__WEBPACK_IMPORTED_MODULE_2__/* .Color */ .Q1.fromHex(colorValue);
        }
        return theme.getColor(colorValue);
    }
    else if (colorValue instanceof _base_common_color_js__WEBPACK_IMPORTED_MODULE_2__/* .Color */ .Q1) {
        return colorValue;
    }
    else if (typeof colorValue === 'object') {
        return executeTransform(colorValue, theme);
    }
    return undefined;
}
const workbenchColorsSchemaId = 'vscode://schemas/workbench-colors';
const schemaRegistry = _registry_common_platform_js__WEBPACK_IMPORTED_MODULE_5__/* .Registry */ .O.as(_jsonschemas_common_jsonContributionRegistry_js__WEBPACK_IMPORTED_MODULE_4__/* .Extensions */ .F.JSONContribution);
schemaRegistry.registerSchema(workbenchColorsSchemaId, colorRegistry.getColorSchema());
const delayer = new _base_common_async_js__WEBPACK_IMPORTED_MODULE_1__/* .RunOnceScheduler */ .uC(() => schemaRegistry.notifySchemaChanged(workbenchColorsSchemaId), 200);
colorRegistry.onDidChangeSchema(() => {
    if (!delayer.isScheduled()) {
        delayer.schedule();
    }
});
// setTimeout(_ => console.log(colorRegistry.toString()), 5000);


/***/ },

/***/ 88436
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   E: () => (/* binding */ intersection),
/* harmony export */   Z: () => (/* binding */ diffSets)
/* harmony export */ });
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
function diffSets(before, after) {
    const removed = [];
    const added = [];
    for (const element of before) {
        if (!after.has(element)) {
            removed.push(element);
        }
    }
    for (const element of after) {
        if (!before.has(element)) {
            added.push(element);
        }
    }
    return { removed, added };
}
/**
 * Computes the intersection of two sets.
 *
 * @param setA - The first set.
 * @param setB - The second iterable.
 * @returns A new set containing the elements that are in both `setA` and `setB`.
 */
function intersection(setA, setB) {
    const result = new Set();
    for (const elem of setB) {
        if (setA.has(elem)) {
            result.add(elem);
        }
    }
    return result;
}


/***/ },

/***/ 89044
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Fd: () => (/* binding */ Extensions),
/* harmony export */   Gy: () => (/* binding */ IThemeService),
/* harmony export */   Pz: () => (/* binding */ getThemeTypeSelector),
/* harmony export */   Yf: () => (/* binding */ themeColorFromId),
/* harmony export */   lR: () => (/* binding */ Themable),
/* harmony export */   zy: () => (/* binding */ registerThemingParticipant)
/* harmony export */ });
/* harmony import */ var _base_common_event_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2106);
/* harmony import */ var _base_common_lifecycle_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(10998);
/* harmony import */ var _instantiation_common_instantiation_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(82399);
/* harmony import */ var _registry_common_platform_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(67167);
/* harmony import */ var _theme_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(89563);





const IThemeService = (0,_instantiation_common_instantiation_js__WEBPACK_IMPORTED_MODULE_2__/* .createDecorator */ .u1)('themeService');
function themeColorFromId(id) {
    return { id };
}
function getThemeTypeSelector(type) {
    switch (type) {
        case _theme_js__WEBPACK_IMPORTED_MODULE_4__/* .ColorScheme */ .zM.DARK: return 'vs-dark';
        case _theme_js__WEBPACK_IMPORTED_MODULE_4__/* .ColorScheme */ .zM.HIGH_CONTRAST_DARK: return 'hc-black';
        case _theme_js__WEBPACK_IMPORTED_MODULE_4__/* .ColorScheme */ .zM.HIGH_CONTRAST_LIGHT: return 'hc-light';
        default: return 'vs';
    }
}
// static theming participant
const Extensions = {
    ThemingContribution: 'base.contributions.theming'
};
class ThemingRegistry {
    constructor() {
        this.themingParticipants = [];
        this.themingParticipants = [];
        this.onThemingParticipantAddedEmitter = new _base_common_event_js__WEBPACK_IMPORTED_MODULE_0__/* .Emitter */ .vl();
    }
    onColorThemeChange(participant) {
        this.themingParticipants.push(participant);
        this.onThemingParticipantAddedEmitter.fire(participant);
        return (0,_base_common_lifecycle_js__WEBPACK_IMPORTED_MODULE_1__/* .toDisposable */ .s)(() => {
            const idx = this.themingParticipants.indexOf(participant);
            this.themingParticipants.splice(idx, 1);
        });
    }
    getThemingParticipants() {
        return this.themingParticipants;
    }
}
const themingRegistry = new ThemingRegistry();
_registry_common_platform_js__WEBPACK_IMPORTED_MODULE_3__/* .Registry */ .O.add(Extensions.ThemingContribution, themingRegistry);
function registerThemingParticipant(participant) {
    return themingRegistry.onColorThemeChange(participant);
}
/**
 * Utility base class for all themable components.
 */
class Themable extends _base_common_lifecycle_js__WEBPACK_IMPORTED_MODULE_1__/* .Disposable */ .jG {
    constructor(themeService) {
        super();
        this.themeService = themeService;
        this.theme = themeService.getColorTheme();
        // Hook up to theme changes
        this._register(this.themeService.onDidColorThemeChange(theme => this.onThemeChange(theme)));
    }
    onThemeChange(theme) {
        this.theme = theme;
        this.updateStyles();
    }
    updateStyles() {
        // Subclasses to override
    }
}


/***/ },

/***/ 89563
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Bb: () => (/* binding */ isHighContrast),
/* harmony export */   HD: () => (/* binding */ isDark),
/* harmony export */   zM: () => (/* binding */ ColorScheme)
/* harmony export */ });
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
/**
 * Color scheme used by the OS and by color themes.
 */
var ColorScheme;
(function (ColorScheme) {
    ColorScheme["DARK"] = "dark";
    ColorScheme["LIGHT"] = "light";
    ColorScheme["HIGH_CONTRAST_DARK"] = "hcDark";
    ColorScheme["HIGH_CONTRAST_LIGHT"] = "hcLight";
})(ColorScheme || (ColorScheme = {}));
function isHighContrast(scheme) {
    return scheme === ColorScheme.HIGH_CONTRAST_DARK || scheme === ColorScheme.HIGH_CONTRAST_LIGHT;
}
function isDark(scheme) {
    return scheme === ColorScheme.DARK || scheme === ColorScheme.HIGH_CONTRAST_DARK;
}


/***/ },

/***/ 90011
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MarkerDecorationsService: () => (/* binding */ MarkerDecorationsService)
/* harmony export */ });
/* harmony import */ var _platform_markers_common_markers_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(27619);
/* harmony import */ var _base_common_lifecycle_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(10998);
/* harmony import */ var _model_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(66055);
/* harmony import */ var _platform_theme_common_themeService_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(89044);
/* harmony import */ var _core_editorColorRegistry_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(48295);
/* harmony import */ var _model_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(64830);
/* harmony import */ var _core_range_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(28061);
/* harmony import */ var _base_common_network_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(13072);
/* harmony import */ var _base_common_event_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(2106);
/* harmony import */ var _platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(70559);
/* harmony import */ var _base_common_map_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(27992);
/* harmony import */ var _base_common_collections_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(88436);
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};












let MarkerDecorationsService = class MarkerDecorationsService extends _base_common_lifecycle_js__WEBPACK_IMPORTED_MODULE_1__/* .Disposable */ .jG {
    constructor(modelService, _markerService) {
        super();
        this._markerService = _markerService;
        this._onDidChangeMarker = this._register(new _base_common_event_js__WEBPACK_IMPORTED_MODULE_8__/* .Emitter */ .vl());
        this._markerDecorations = new _base_common_map_js__WEBPACK_IMPORTED_MODULE_10__/* .ResourceMap */ .fT();
        modelService.getModels().forEach(model => this._onModelAdded(model));
        this._register(modelService.onModelAdded(this._onModelAdded, this));
        this._register(modelService.onModelRemoved(this._onModelRemoved, this));
        this._register(this._markerService.onMarkerChanged(this._handleMarkerChange, this));
    }
    dispose() {
        super.dispose();
        this._markerDecorations.forEach(value => value.dispose());
        this._markerDecorations.clear();
    }
    getMarker(uri, decoration) {
        const markerDecorations = this._markerDecorations.get(uri);
        return markerDecorations ? (markerDecorations.getMarker(decoration) || null) : null;
    }
    _handleMarkerChange(changedResources) {
        changedResources.forEach((resource) => {
            const markerDecorations = this._markerDecorations.get(resource);
            if (markerDecorations) {
                this._updateDecorations(markerDecorations);
            }
        });
    }
    _onModelAdded(model) {
        const markerDecorations = new MarkerDecorations(model);
        this._markerDecorations.set(model.uri, markerDecorations);
        this._updateDecorations(markerDecorations);
    }
    _onModelRemoved(model) {
        const markerDecorations = this._markerDecorations.get(model.uri);
        if (markerDecorations) {
            markerDecorations.dispose();
            this._markerDecorations.delete(model.uri);
        }
        // clean up markers for internal, transient models
        if (model.uri.scheme === _base_common_network_js__WEBPACK_IMPORTED_MODULE_7__/* .Schemas */ .ny.inMemory
            || model.uri.scheme === _base_common_network_js__WEBPACK_IMPORTED_MODULE_7__/* .Schemas */ .ny.internal
            || model.uri.scheme === _base_common_network_js__WEBPACK_IMPORTED_MODULE_7__/* .Schemas */ .ny.vscode) {
            this._markerService?.read({ resource: model.uri }).map(marker => marker.owner).forEach(owner => this._markerService.remove(owner, [model.uri]));
        }
    }
    _updateDecorations(markerDecorations) {
        // Limit to the first 500 errors/warnings
        const markers = this._markerService.read({ resource: markerDecorations.model.uri, take: 500 });
        if (markerDecorations.update(markers)) {
            this._onDidChangeMarker.fire(markerDecorations.model);
        }
    }
};
MarkerDecorationsService = __decorate([
    __param(0, _model_js__WEBPACK_IMPORTED_MODULE_5__.IModelService),
    __param(1, _platform_markers_common_markers_js__WEBPACK_IMPORTED_MODULE_0__/* .IMarkerService */ .DR)
], MarkerDecorationsService);

class MarkerDecorations extends _base_common_lifecycle_js__WEBPACK_IMPORTED_MODULE_1__/* .Disposable */ .jG {
    constructor(model) {
        super();
        this.model = model;
        this._map = new _base_common_map_js__WEBPACK_IMPORTED_MODULE_10__/* .BidirectionalMap */ .cO();
        this._register((0,_base_common_lifecycle_js__WEBPACK_IMPORTED_MODULE_1__/* .toDisposable */ .s)(() => {
            this.model.deltaDecorations([...this._map.values()], []);
            this._map.clear();
        }));
    }
    update(markers) {
        // We use the fact that marker instances are not recreated when different owners
        // update. So we can compare references to find out what changed since the last update.
        const { added, removed } = (0,_base_common_collections_js__WEBPACK_IMPORTED_MODULE_11__/* .diffSets */ .Z)(new Set(this._map.keys()), new Set(markers));
        if (added.length === 0 && removed.length === 0) {
            return false;
        }
        const oldIds = removed.map(marker => this._map.get(marker));
        const newDecorations = added.map(marker => {
            return {
                range: this._createDecorationRange(this.model, marker),
                options: this._createDecorationOption(marker)
            };
        });
        const ids = this.model.deltaDecorations(oldIds, newDecorations);
        for (const removedMarker of removed) {
            this._map.delete(removedMarker);
        }
        for (let index = 0; index < ids.length; index++) {
            this._map.set(added[index], ids[index]);
        }
        return true;
    }
    getMarker(decoration) {
        return this._map.getKey(decoration.id);
    }
    _createDecorationRange(model, rawMarker) {
        let ret = _core_range_js__WEBPACK_IMPORTED_MODULE_6__/* .Range */ .Q.lift(rawMarker);
        if (rawMarker.severity === _platform_markers_common_markers_js__WEBPACK_IMPORTED_MODULE_0__/* .MarkerSeverity */ .cj.Hint && !this._hasMarkerTag(rawMarker, 1 /* MarkerTag.Unnecessary */) && !this._hasMarkerTag(rawMarker, 2 /* MarkerTag.Deprecated */)) {
            // * never render hints on multiple lines
            // * make enough space for three dots
            ret = ret.setEndPosition(ret.startLineNumber, ret.startColumn + 2);
        }
        ret = model.validateRange(ret);
        if (ret.isEmpty()) {
            const maxColumn = model.getLineLastNonWhitespaceColumn(ret.startLineNumber) ||
                model.getLineMaxColumn(ret.startLineNumber);
            if (maxColumn === 1 || ret.endColumn >= maxColumn) {
                // empty line or behind eol
                // keep the range as is, it will be rendered 1ch wide
                return ret;
            }
            const word = model.getWordAtPosition(ret.getStartPosition());
            if (word) {
                ret = new _core_range_js__WEBPACK_IMPORTED_MODULE_6__/* .Range */ .Q(ret.startLineNumber, word.startColumn, ret.endLineNumber, word.endColumn);
            }
        }
        else if (rawMarker.endColumn === Number.MAX_VALUE && rawMarker.startColumn === 1 && ret.startLineNumber === ret.endLineNumber) {
            const minColumn = model.getLineFirstNonWhitespaceColumn(rawMarker.startLineNumber);
            if (minColumn < ret.endColumn) {
                ret = new _core_range_js__WEBPACK_IMPORTED_MODULE_6__/* .Range */ .Q(ret.startLineNumber, minColumn, ret.endLineNumber, ret.endColumn);
                rawMarker.startColumn = minColumn;
            }
        }
        return ret;
    }
    _createDecorationOption(marker) {
        let className;
        let color = undefined;
        let zIndex;
        let inlineClassName = undefined;
        let minimap;
        switch (marker.severity) {
            case _platform_markers_common_markers_js__WEBPACK_IMPORTED_MODULE_0__/* .MarkerSeverity */ .cj.Hint:
                if (this._hasMarkerTag(marker, 2 /* MarkerTag.Deprecated */)) {
                    className = undefined;
                }
                else if (this._hasMarkerTag(marker, 1 /* MarkerTag.Unnecessary */)) {
                    className = "squiggly-unnecessary" /* ClassName.EditorUnnecessaryDecoration */;
                }
                else {
                    className = "squiggly-hint" /* ClassName.EditorHintDecoration */;
                }
                zIndex = 0;
                break;
            case _platform_markers_common_markers_js__WEBPACK_IMPORTED_MODULE_0__/* .MarkerSeverity */ .cj.Info:
                className = "squiggly-info" /* ClassName.EditorInfoDecoration */;
                color = (0,_platform_theme_common_themeService_js__WEBPACK_IMPORTED_MODULE_3__/* .themeColorFromId */ .Yf)(_core_editorColorRegistry_js__WEBPACK_IMPORTED_MODULE_4__/* .overviewRulerInfo */ .AQ);
                zIndex = 10;
                minimap = {
                    color: (0,_platform_theme_common_themeService_js__WEBPACK_IMPORTED_MODULE_3__/* .themeColorFromId */ .Yf)(_platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_9__/* .minimapInfo */ .KoI),
                    position: 1 /* MinimapPosition.Inline */
                };
                break;
            case _platform_markers_common_markers_js__WEBPACK_IMPORTED_MODULE_0__/* .MarkerSeverity */ .cj.Warning:
                className = "squiggly-warning" /* ClassName.EditorWarningDecoration */;
                color = (0,_platform_theme_common_themeService_js__WEBPACK_IMPORTED_MODULE_3__/* .themeColorFromId */ .Yf)(_core_editorColorRegistry_js__WEBPACK_IMPORTED_MODULE_4__/* .overviewRulerWarning */ .aZ);
                zIndex = 20;
                minimap = {
                    color: (0,_platform_theme_common_themeService_js__WEBPACK_IMPORTED_MODULE_3__/* .themeColorFromId */ .Yf)(_platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_9__/* .minimapWarning */ .uMG),
                    position: 1 /* MinimapPosition.Inline */
                };
                break;
            case _platform_markers_common_markers_js__WEBPACK_IMPORTED_MODULE_0__/* .MarkerSeverity */ .cj.Error:
            default:
                className = "squiggly-error" /* ClassName.EditorErrorDecoration */;
                color = (0,_platform_theme_common_themeService_js__WEBPACK_IMPORTED_MODULE_3__/* .themeColorFromId */ .Yf)(_core_editorColorRegistry_js__WEBPACK_IMPORTED_MODULE_4__/* .overviewRulerError */ .yI);
                zIndex = 30;
                minimap = {
                    color: (0,_platform_theme_common_themeService_js__WEBPACK_IMPORTED_MODULE_3__/* .themeColorFromId */ .Yf)(_platform_theme_common_colorRegistry_js__WEBPACK_IMPORTED_MODULE_9__/* .minimapError */ .yLC),
                    position: 1 /* MinimapPosition.Inline */
                };
                break;
        }
        if (marker.tags) {
            if (marker.tags.indexOf(1 /* MarkerTag.Unnecessary */) !== -1) {
                inlineClassName = "squiggly-inline-unnecessary" /* ClassName.EditorUnnecessaryInlineDecoration */;
            }
            if (marker.tags.indexOf(2 /* MarkerTag.Deprecated */) !== -1) {
                inlineClassName = "squiggly-inline-deprecated" /* ClassName.EditorDeprecatedInlineDecoration */;
            }
        }
        return {
            description: 'marker-decoration',
            stickiness: 1 /* TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges */,
            className,
            showIfCollapsed: true,
            overviewRuler: {
                color,
                position: _model_js__WEBPACK_IMPORTED_MODULE_2__/* .OverviewRulerLane */ .A5.Right
            },
            minimap,
            zIndex,
            inlineClassName,
        };
    }
    _hasMarkerTag(marker, tag) {
        if (marker.tags) {
            return marker.tags.indexOf(tag) >= 0;
        }
        return false;
    }
}


/***/ }

}]);