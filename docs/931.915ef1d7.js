(self["webpackChunkabaplint_playground"] = self["webpackChunkabaplint_playground"] || []).push([[931,1504,5320],{

/***/ 251
(__unused_webpack_module, exports) {

/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ },

/***/ 1804
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Fu: () => (/* binding */ BracketsUtils),
/* harmony export */   az: () => (/* binding */ RichEditBrackets),
/* harmony export */   xb: () => (/* binding */ createBracketOrRegExp)
/* harmony export */ });
/* unused harmony export RichEditBracket */
/* harmony import */ var _base_common_strings_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(16844);
/* harmony import */ var _core_stringBuilder_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(54324);
/* harmony import */ var _core_range_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(28061);
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/



/**
 * Represents a grouping of colliding bracket pairs.
 *
 * Most of the times this contains a single bracket pair,
 * but sometimes this contains multiple bracket pairs in cases
 * where the same string appears as a closing bracket for multiple
 * bracket pairs, or the same string appears an opening bracket for
 * multiple bracket pairs.
 *
 * e.g. of a group containing a single pair:
 *   open: ['{'], close: ['}']
 *
 * e.g. of a group containing multiple pairs:
 *   open: ['if', 'for'], close: ['end', 'end']
 */
class RichEditBracket {
    constructor(languageId, index, open, close, forwardRegex, reversedRegex) {
        this._richEditBracketBrand = undefined;
        this.languageId = languageId;
        this.index = index;
        this.open = open;
        this.close = close;
        this.forwardRegex = forwardRegex;
        this.reversedRegex = reversedRegex;
        this._openSet = RichEditBracket._toSet(this.open);
        this._closeSet = RichEditBracket._toSet(this.close);
    }
    /**
     * Check if the provided `text` is an open bracket in this group.
     */
    isOpen(text) {
        return this._openSet.has(text);
    }
    /**
     * Check if the provided `text` is a close bracket in this group.
     */
    isClose(text) {
        return this._closeSet.has(text);
    }
    static _toSet(arr) {
        const result = new Set();
        for (const element of arr) {
            result.add(element);
        }
        return result;
    }
}
/**
 * Groups together brackets that have equal open or close sequences.
 *
 * For example, if the following brackets are defined:
 *   ['IF','END']
 *   ['for','end']
 *   ['{','}']
 *
 * Then the grouped brackets would be:
 *   { open: ['if', 'for'], close: ['end', 'end'] }
 *   { open: ['{'], close: ['}'] }
 *
 */
function groupFuzzyBrackets(brackets) {
    const N = brackets.length;
    brackets = brackets.map(b => [b[0].toLowerCase(), b[1].toLowerCase()]);
    const group = [];
    for (let i = 0; i < N; i++) {
        group[i] = i;
    }
    const areOverlapping = (a, b) => {
        const [aOpen, aClose] = a;
        const [bOpen, bClose] = b;
        return (aOpen === bOpen || aOpen === bClose || aClose === bOpen || aClose === bClose);
    };
    const mergeGroups = (g1, g2) => {
        const newG = Math.min(g1, g2);
        const oldG = Math.max(g1, g2);
        for (let i = 0; i < N; i++) {
            if (group[i] === oldG) {
                group[i] = newG;
            }
        }
    };
    // group together brackets that have the same open or the same close sequence
    for (let i = 0; i < N; i++) {
        const a = brackets[i];
        for (let j = i + 1; j < N; j++) {
            const b = brackets[j];
            if (areOverlapping(a, b)) {
                mergeGroups(group[i], group[j]);
            }
        }
    }
    const result = [];
    for (let g = 0; g < N; g++) {
        const currentOpen = [];
        const currentClose = [];
        for (let i = 0; i < N; i++) {
            if (group[i] === g) {
                const [open, close] = brackets[i];
                currentOpen.push(open);
                currentClose.push(close);
            }
        }
        if (currentOpen.length > 0) {
            result.push({
                open: currentOpen,
                close: currentClose
            });
        }
    }
    return result;
}
class RichEditBrackets {
    constructor(languageId, _brackets) {
        this._richEditBracketsBrand = undefined;
        const brackets = groupFuzzyBrackets(_brackets);
        this.brackets = brackets.map((b, index) => {
            return new RichEditBracket(languageId, index, b.open, b.close, getRegexForBracketPair(b.open, b.close, brackets, index), getReversedRegexForBracketPair(b.open, b.close, brackets, index));
        });
        this.forwardRegex = getRegexForBrackets(this.brackets);
        this.reversedRegex = getReversedRegexForBrackets(this.brackets);
        this.textIsBracket = {};
        this.textIsOpenBracket = {};
        this.maxBracketLength = 0;
        for (const bracket of this.brackets) {
            for (const open of bracket.open) {
                this.textIsBracket[open] = bracket;
                this.textIsOpenBracket[open] = true;
                this.maxBracketLength = Math.max(this.maxBracketLength, open.length);
            }
            for (const close of bracket.close) {
                this.textIsBracket[close] = bracket;
                this.textIsOpenBracket[close] = false;
                this.maxBracketLength = Math.max(this.maxBracketLength, close.length);
            }
        }
    }
}
function collectSuperstrings(str, brackets, currentIndex, dest) {
    for (let i = 0, len = brackets.length; i < len; i++) {
        if (i === currentIndex) {
            continue;
        }
        const bracket = brackets[i];
        for (const open of bracket.open) {
            if (open.indexOf(str) >= 0) {
                dest.push(open);
            }
        }
        for (const close of bracket.close) {
            if (close.indexOf(str) >= 0) {
                dest.push(close);
            }
        }
    }
}
function lengthcmp(a, b) {
    return a.length - b.length;
}
function unique(arr) {
    if (arr.length <= 1) {
        return arr;
    }
    const result = [];
    const seen = new Set();
    for (const element of arr) {
        if (seen.has(element)) {
            continue;
        }
        result.push(element);
        seen.add(element);
    }
    return result;
}
/**
 * Create a regular expression that can be used to search forward in a piece of text
 * for a group of bracket pairs. But this regex must be built in a way in which
 * it is aware of the other bracket pairs defined for the language.
 *
 * For example, if a language contains the following bracket pairs:
 *   ['begin', 'end']
 *   ['if', 'end if']
 * The two bracket pairs do not collide because no open or close brackets are equal.
 * So the function getRegexForBracketPair is called twice, once with
 * the ['begin'], ['end'] group consisting of one bracket pair, and once with
 * the ['if'], ['end if'] group consiting of the other bracket pair.
 *
 * But there could be a situation where an occurrence of 'end if' is mistaken
 * for an occurrence of 'end'.
 *
 * Therefore, for the bracket pair ['begin', 'end'], the regex will also
 * target 'end if'. The regex will be something like:
 *   /(\bend if\b)|(\bend\b)|(\bif\b)/
 *
 * The regex also searches for "superstrings" (other brackets that might be mistaken with the current bracket).
 *
 */
function getRegexForBracketPair(open, close, brackets, currentIndex) {
    // search in all brackets for other brackets that are a superstring of these brackets
    let pieces = [];
    pieces = pieces.concat(open);
    pieces = pieces.concat(close);
    for (let i = 0, len = pieces.length; i < len; i++) {
        collectSuperstrings(pieces[i], brackets, currentIndex, pieces);
    }
    pieces = unique(pieces);
    pieces.sort(lengthcmp);
    pieces.reverse();
    return createBracketOrRegExp(pieces);
}
/**
 * Matching a regular expression in JS can only be done "forwards". So JS offers natively only
 * methods to find the first match of a regex in a string. But sometimes, it is useful to
 * find the last match of a regex in a string. For such a situation, a nice solution is to
 * simply reverse the string and then search for a reversed regex.
 *
 * This function also has the fine details of `getRegexForBracketPair`. For the same example
 * given above, the regex produced here would look like:
 *   /(\bfi dne\b)|(\bdne\b)|(\bfi\b)/
 */
function getReversedRegexForBracketPair(open, close, brackets, currentIndex) {
    // search in all brackets for other brackets that are a superstring of these brackets
    let pieces = [];
    pieces = pieces.concat(open);
    pieces = pieces.concat(close);
    for (let i = 0, len = pieces.length; i < len; i++) {
        collectSuperstrings(pieces[i], brackets, currentIndex, pieces);
    }
    pieces = unique(pieces);
    pieces.sort(lengthcmp);
    pieces.reverse();
    return createBracketOrRegExp(pieces.map(toReversedString));
}
/**
 * Creates a regular expression that targets all bracket pairs.
 *
 * e.g. for the bracket pairs:
 *  ['{','}']
 *  ['begin,'end']
 *  ['for','end']
 * the regex would look like:
 *  /(\{)|(\})|(\bbegin\b)|(\bend\b)|(\bfor\b)/
 */
function getRegexForBrackets(brackets) {
    let pieces = [];
    for (const bracket of brackets) {
        for (const open of bracket.open) {
            pieces.push(open);
        }
        for (const close of bracket.close) {
            pieces.push(close);
        }
    }
    pieces = unique(pieces);
    return createBracketOrRegExp(pieces);
}
/**
 * Matching a regular expression in JS can only be done "forwards". So JS offers natively only
 * methods to find the first match of a regex in a string. But sometimes, it is useful to
 * find the last match of a regex in a string. For such a situation, a nice solution is to
 * simply reverse the string and then search for a reversed regex.
 *
 * e.g. for the bracket pairs:
 *  ['{','}']
 *  ['begin,'end']
 *  ['for','end']
 * the regex would look like:
 *  /(\{)|(\})|(\bnigeb\b)|(\bdne\b)|(\brof\b)/
 */
function getReversedRegexForBrackets(brackets) {
    let pieces = [];
    for (const bracket of brackets) {
        for (const open of bracket.open) {
            pieces.push(open);
        }
        for (const close of bracket.close) {
            pieces.push(close);
        }
    }
    pieces = unique(pieces);
    return createBracketOrRegExp(pieces.map(toReversedString));
}
function prepareBracketForRegExp(str) {
    // This bracket pair uses letters like e.g. "begin" - "end"
    const insertWordBoundaries = (/^[\w ]+$/.test(str));
    str = _base_common_strings_js__WEBPACK_IMPORTED_MODULE_0__/* .escapeRegExpCharacters */ .bm(str);
    return (insertWordBoundaries ? `\\b${str}\\b` : str);
}
function createBracketOrRegExp(pieces, options) {
    const regexStr = `(${pieces.map(prepareBracketForRegExp).join(')|(')})`;
    return _base_common_strings_js__WEBPACK_IMPORTED_MODULE_0__/* .createRegExp */ .OS(regexStr, true, options);
}
const toReversedString = (function () {
    function reverse(str) {
        // create a Uint16Array and then use a TextDecoder to create a string
        const arr = new Uint16Array(str.length);
        let offset = 0;
        for (let i = str.length - 1; i >= 0; i--) {
            arr[offset++] = str.charCodeAt(i);
        }
        return _core_stringBuilder_js__WEBPACK_IMPORTED_MODULE_1__/* .getPlatformTextDecoder */ .b7().decode(arr);
    }
    let lastInput = null;
    let lastOutput = null;
    return function toReversedString(str) {
        if (lastInput !== str) {
            lastInput = str;
            lastOutput = reverse(lastInput);
        }
        return lastOutput;
    };
})();
class BracketsUtils {
    static _findPrevBracketInText(reversedBracketRegex, lineNumber, reversedText, offset) {
        const m = reversedText.match(reversedBracketRegex);
        if (!m) {
            return null;
        }
        const matchOffset = reversedText.length - (m.index || 0);
        const matchLength = m[0].length;
        const absoluteMatchOffset = offset + matchOffset;
        return new _core_range_js__WEBPACK_IMPORTED_MODULE_2__/* .Range */ .Q(lineNumber, absoluteMatchOffset - matchLength + 1, lineNumber, absoluteMatchOffset + 1);
    }
    static findPrevBracketInRange(reversedBracketRegex, lineNumber, lineText, startOffset, endOffset) {
        // Because JS does not support backwards regex search, we search forwards in a reversed string with a reversed regex ;)
        const reversedLineText = toReversedString(lineText);
        const reversedSubstr = reversedLineText.substring(lineText.length - endOffset, lineText.length - startOffset);
        return this._findPrevBracketInText(reversedBracketRegex, lineNumber, reversedSubstr, startOffset);
    }
    static findNextBracketInText(bracketRegex, lineNumber, text, offset) {
        const m = text.match(bracketRegex);
        if (!m) {
            return null;
        }
        const matchOffset = m.index || 0;
        const matchLength = m[0].length;
        if (matchLength === 0) {
            return null;
        }
        const absoluteMatchOffset = offset + matchOffset;
        return new _core_range_js__WEBPACK_IMPORTED_MODULE_2__/* .Range */ .Q(lineNumber, absoluteMatchOffset + 1, lineNumber, absoluteMatchOffset + 1 + matchLength);
    }
    static findNextBracketInRange(bracketRegex, lineNumber, lineText, startOffset, endOffset) {
        const substr = lineText.substring(startOffset, endOffset);
        return this.findNextBracketInText(bracketRegex, lineNumber, substr, startOffset);
    }
}


/***/ },

/***/ 3902
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   W: () => (/* binding */ countEOL)
/* harmony export */ });
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
function countEOL(text) {
    let eolCount = 0;
    let firstLineLength = 0;
    let lastLineStart = 0;
    let eol = 0 /* StringEOL.Unknown */;
    for (let i = 0, len = text.length; i < len; i++) {
        const chr = text.charCodeAt(i);
        if (chr === 13 /* CharCode.CarriageReturn */) {
            if (eolCount === 0) {
                firstLineLength = i;
            }
            eolCount++;
            if (i + 1 < len && text.charCodeAt(i + 1) === 10 /* CharCode.LineFeed */) {
                // \r\n... case
                eol |= 2 /* StringEOL.CRLF */;
                i++; // skip \n
            }
            else {
                // \r... case
                eol |= 3 /* StringEOL.Invalid */;
            }
            lastLineStart = i + 1;
        }
        else if (chr === 10 /* CharCode.LineFeed */) {
            // \n... case
            eol |= 1 /* StringEOL.LF */;
            if (eolCount === 0) {
                firstLineLength = i;
            }
            eolCount++;
            lastLineStart = i + 1;
        }
    }
    if (eolCount === 0) {
        firstLineLength = text.length;
    }
    return [eolCount, firstLineLength, text.length - lastLineStart, eol];
}


/***/ },

/***/ 6949
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   k: () => (/* binding */ TextChange),
/* harmony export */   x: () => (/* binding */ compressConsecutiveTextChanges)
/* harmony export */ });
/* harmony import */ var _base_common_buffer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(42802);
/* harmony import */ var _stringBuilder_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(54324);
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/


function escapeNewLine(str) {
    return (str
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r'));
}
class TextChange {
    get oldLength() {
        return this.oldText.length;
    }
    get oldEnd() {
        return this.oldPosition + this.oldText.length;
    }
    get newLength() {
        return this.newText.length;
    }
    get newEnd() {
        return this.newPosition + this.newText.length;
    }
    constructor(oldPosition, oldText, newPosition, newText) {
        this.oldPosition = oldPosition;
        this.oldText = oldText;
        this.newPosition = newPosition;
        this.newText = newText;
    }
    toString() {
        if (this.oldText.length === 0) {
            return `(insert@${this.oldPosition} "${escapeNewLine(this.newText)}")`;
        }
        if (this.newText.length === 0) {
            return `(delete@${this.oldPosition} "${escapeNewLine(this.oldText)}")`;
        }
        return `(replace@${this.oldPosition} "${escapeNewLine(this.oldText)}" with "${escapeNewLine(this.newText)}")`;
    }
    static _writeStringSize(str) {
        return (4 + 2 * str.length);
    }
    static _writeString(b, str, offset) {
        const len = str.length;
        _base_common_buffer_js__WEBPACK_IMPORTED_MODULE_0__/* .writeUInt32BE */ .Sw(b, len, offset);
        offset += 4;
        for (let i = 0; i < len; i++) {
            _base_common_buffer_js__WEBPACK_IMPORTED_MODULE_0__/* .writeUInt16LE */ .gN(b, str.charCodeAt(i), offset);
            offset += 2;
        }
        return offset;
    }
    static _readString(b, offset) {
        const len = _base_common_buffer_js__WEBPACK_IMPORTED_MODULE_0__/* .readUInt32BE */ .bb(b, offset);
        offset += 4;
        return (0,_stringBuilder_js__WEBPACK_IMPORTED_MODULE_1__/* .decodeUTF16LE */ .Su)(b, offset, len);
    }
    writeSize() {
        return (+4 // oldPosition
            + 4 // newPosition
            + TextChange._writeStringSize(this.oldText)
            + TextChange._writeStringSize(this.newText));
    }
    write(b, offset) {
        _base_common_buffer_js__WEBPACK_IMPORTED_MODULE_0__/* .writeUInt32BE */ .Sw(b, this.oldPosition, offset);
        offset += 4;
        _base_common_buffer_js__WEBPACK_IMPORTED_MODULE_0__/* .writeUInt32BE */ .Sw(b, this.newPosition, offset);
        offset += 4;
        offset = TextChange._writeString(b, this.oldText, offset);
        offset = TextChange._writeString(b, this.newText, offset);
        return offset;
    }
    static read(b, offset, dest) {
        const oldPosition = _base_common_buffer_js__WEBPACK_IMPORTED_MODULE_0__/* .readUInt32BE */ .bb(b, offset);
        offset += 4;
        const newPosition = _base_common_buffer_js__WEBPACK_IMPORTED_MODULE_0__/* .readUInt32BE */ .bb(b, offset);
        offset += 4;
        const oldText = TextChange._readString(b, offset);
        offset += TextChange._writeStringSize(oldText);
        const newText = TextChange._readString(b, offset);
        offset += TextChange._writeStringSize(newText);
        dest.push(new TextChange(oldPosition, oldText, newPosition, newText));
        return offset;
    }
}
function compressConsecutiveTextChanges(prevEdits, currEdits) {
    if (prevEdits === null || prevEdits.length === 0) {
        return currEdits;
    }
    const compressor = new TextChangeCompressor(prevEdits, currEdits);
    return compressor.compress();
}
class TextChangeCompressor {
    constructor(prevEdits, currEdits) {
        this._prevEdits = prevEdits;
        this._currEdits = currEdits;
        this._result = [];
        this._resultLen = 0;
        this._prevLen = this._prevEdits.length;
        this._prevDeltaOffset = 0;
        this._currLen = this._currEdits.length;
        this._currDeltaOffset = 0;
    }
    compress() {
        let prevIndex = 0;
        let currIndex = 0;
        let prevEdit = this._getPrev(prevIndex);
        let currEdit = this._getCurr(currIndex);
        while (prevIndex < this._prevLen || currIndex < this._currLen) {
            if (prevEdit === null) {
                this._acceptCurr(currEdit);
                currEdit = this._getCurr(++currIndex);
                continue;
            }
            if (currEdit === null) {
                this._acceptPrev(prevEdit);
                prevEdit = this._getPrev(++prevIndex);
                continue;
            }
            if (currEdit.oldEnd <= prevEdit.newPosition) {
                this._acceptCurr(currEdit);
                currEdit = this._getCurr(++currIndex);
                continue;
            }
            if (prevEdit.newEnd <= currEdit.oldPosition) {
                this._acceptPrev(prevEdit);
                prevEdit = this._getPrev(++prevIndex);
                continue;
            }
            if (currEdit.oldPosition < prevEdit.newPosition) {
                const [e1, e2] = TextChangeCompressor._splitCurr(currEdit, prevEdit.newPosition - currEdit.oldPosition);
                this._acceptCurr(e1);
                currEdit = e2;
                continue;
            }
            if (prevEdit.newPosition < currEdit.oldPosition) {
                const [e1, e2] = TextChangeCompressor._splitPrev(prevEdit, currEdit.oldPosition - prevEdit.newPosition);
                this._acceptPrev(e1);
                prevEdit = e2;
                continue;
            }
            // At this point, currEdit.oldPosition === prevEdit.newPosition
            let mergePrev;
            let mergeCurr;
            if (currEdit.oldEnd === prevEdit.newEnd) {
                mergePrev = prevEdit;
                mergeCurr = currEdit;
                prevEdit = this._getPrev(++prevIndex);
                currEdit = this._getCurr(++currIndex);
            }
            else if (currEdit.oldEnd < prevEdit.newEnd) {
                const [e1, e2] = TextChangeCompressor._splitPrev(prevEdit, currEdit.oldLength);
                mergePrev = e1;
                mergeCurr = currEdit;
                prevEdit = e2;
                currEdit = this._getCurr(++currIndex);
            }
            else {
                const [e1, e2] = TextChangeCompressor._splitCurr(currEdit, prevEdit.newLength);
                mergePrev = prevEdit;
                mergeCurr = e1;
                prevEdit = this._getPrev(++prevIndex);
                currEdit = e2;
            }
            this._result[this._resultLen++] = new TextChange(mergePrev.oldPosition, mergePrev.oldText, mergeCurr.newPosition, mergeCurr.newText);
            this._prevDeltaOffset += mergePrev.newLength - mergePrev.oldLength;
            this._currDeltaOffset += mergeCurr.newLength - mergeCurr.oldLength;
        }
        const merged = TextChangeCompressor._merge(this._result);
        const cleaned = TextChangeCompressor._removeNoOps(merged);
        return cleaned;
    }
    _acceptCurr(currEdit) {
        this._result[this._resultLen++] = TextChangeCompressor._rebaseCurr(this._prevDeltaOffset, currEdit);
        this._currDeltaOffset += currEdit.newLength - currEdit.oldLength;
    }
    _getCurr(currIndex) {
        return (currIndex < this._currLen ? this._currEdits[currIndex] : null);
    }
    _acceptPrev(prevEdit) {
        this._result[this._resultLen++] = TextChangeCompressor._rebasePrev(this._currDeltaOffset, prevEdit);
        this._prevDeltaOffset += prevEdit.newLength - prevEdit.oldLength;
    }
    _getPrev(prevIndex) {
        return (prevIndex < this._prevLen ? this._prevEdits[prevIndex] : null);
    }
    static _rebaseCurr(prevDeltaOffset, currEdit) {
        return new TextChange(currEdit.oldPosition - prevDeltaOffset, currEdit.oldText, currEdit.newPosition, currEdit.newText);
    }
    static _rebasePrev(currDeltaOffset, prevEdit) {
        return new TextChange(prevEdit.oldPosition, prevEdit.oldText, prevEdit.newPosition + currDeltaOffset, prevEdit.newText);
    }
    static _splitPrev(edit, offset) {
        const preText = edit.newText.substr(0, offset);
        const postText = edit.newText.substr(offset);
        return [
            new TextChange(edit.oldPosition, edit.oldText, edit.newPosition, preText),
            new TextChange(edit.oldEnd, '', edit.newPosition + offset, postText)
        ];
    }
    static _splitCurr(edit, offset) {
        const preText = edit.oldText.substr(0, offset);
        const postText = edit.oldText.substr(offset);
        return [
            new TextChange(edit.oldPosition, preText, edit.newPosition, edit.newText),
            new TextChange(edit.oldPosition + offset, postText, edit.newEnd, '')
        ];
    }
    static _merge(edits) {
        if (edits.length === 0) {
            return edits;
        }
        const result = [];
        let resultLen = 0;
        let prev = edits[0];
        for (let i = 1; i < edits.length; i++) {
            const curr = edits[i];
            if (prev.oldEnd === curr.oldPosition) {
                // Merge into `prev`
                prev = new TextChange(prev.oldPosition, prev.oldText + curr.oldText, prev.newPosition, prev.newText + curr.newText);
            }
            else {
                result[resultLen++] = prev;
                prev = curr;
            }
        }
        result[resultLen++] = prev;
        return result;
    }
    static _removeNoOps(edits) {
        if (edits.length === 0) {
            return edits;
        }
        const result = [];
        let resultLen = 0;
        for (let i = 0; i < edits.length; i++) {
            const edit = edits[i];
            if (edit.oldText === edit.newText) {
                continue;
            }
            result[resultLen++] = edit;
        }
        return result;
    }
}


/***/ },

/***/ 11907
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  Ho: () => (/* binding */ ModelDecorationInjectedTextOptions),
  kI: () => (/* binding */ ModelDecorationOptions),
  Bz: () => (/* binding */ TextModel)
});

// UNUSED EXPORTS: ModelDecorationGlyphMarginOptions, ModelDecorationMinimapOptions, ModelDecorationOverviewRulerOptions, createTextBuffer, createTextBufferFactory, createTextBufferFactoryFromSnapshot, indentOfLine

// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/base/common/arrays.js
var arrays = __webpack_require__(13338);
// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/base/common/color.js
var common_color = __webpack_require__(94901);
// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/base/common/errors.js
var errors = __webpack_require__(94327);
// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/base/common/event.js
var common_event = __webpack_require__(2106);
// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/base/common/lifecycle.js
var lifecycle = __webpack_require__(10998);
// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/base/common/strings.js
var strings = __webpack_require__(16844);
// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/base/common/uri.js
var uri = __webpack_require__(37264);
// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/editor/common/core/eolCounter.js
var eolCounter = __webpack_require__(3902);
// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/editor/common/core/indentation.js
var indentation = __webpack_require__(57999);
// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/editor/common/core/position.js
var core_position = __webpack_require__(15365);
// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/editor/common/core/range.js
var core_range = __webpack_require__(28061);
// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/editor/common/core/selection.js
var selection = __webpack_require__(93702);
// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/editor/common/core/textModelDefaults.js
var textModelDefaults = __webpack_require__(12590);
// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/editor/common/languages/language.js
var language = __webpack_require__(77922);
// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/editor/common/languages/languageConfigurationRegistry.js + 5 modules
var languageConfigurationRegistry = __webpack_require__(52394);
// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/editor/common/model.js
var model = __webpack_require__(66055);
// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/editor/common/languages/supports.js
var supports = __webpack_require__(19184);
// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/editor/common/languages/supports/richEditBrackets.js
var richEditBrackets = __webpack_require__(1804);
;// ./node_modules/monaco-editor/esm/vs/editor/common/textModelBracketPairs.js
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
class BracketInfo {
    constructor(range, 
    /** 0-based level */
    nestingLevel, nestingLevelOfEqualBracketType, isInvalid) {
        this.range = range;
        this.nestingLevel = nestingLevel;
        this.nestingLevelOfEqualBracketType = nestingLevelOfEqualBracketType;
        this.isInvalid = isInvalid;
    }
}
class BracketPairInfo {
    constructor(range, openingBracketRange, closingBracketRange, 
    /** 0-based */
    nestingLevel, nestingLevelOfEqualBracketType, bracketPairNode) {
        this.range = range;
        this.openingBracketRange = openingBracketRange;
        this.closingBracketRange = closingBracketRange;
        this.nestingLevel = nestingLevel;
        this.nestingLevelOfEqualBracketType = nestingLevelOfEqualBracketType;
        this.bracketPairNode = bracketPairNode;
    }
    get openingBracketInfo() {
        return this.bracketPairNode.openingBracket.bracketInfo;
    }
}
class BracketPairWithMinIndentationInfo extends BracketPairInfo {
    constructor(range, openingBracketRange, closingBracketRange, 
    /**
     * 0-based
    */
    nestingLevel, nestingLevelOfEqualBracketType, bracketPairNode, 
    /**
     * -1 if not requested, otherwise the size of the minimum indentation in the bracket pair in terms of visible columns.
    */
    minVisibleColumnIndentation) {
        super(range, openingBracketRange, closingBracketRange, nestingLevel, nestingLevelOfEqualBracketType, bracketPairNode);
        this.minVisibleColumnIndentation = minVisibleColumnIndentation;
    }
}

// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/editor/common/model/bracketPairsTextModelPart/bracketPairsTree/beforeEditPositionMapper.js
var beforeEditPositionMapper = __webpack_require__(22994);
// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/editor/common/model/bracketPairsTextModelPart/bracketPairsTree/brackets.js
var brackets = __webpack_require__(85702);
// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/editor/common/model/bracketPairsTextModelPart/bracketPairsTree/length.js
var bracketPairsTree_length = __webpack_require__(34883);
// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/editor/common/model/bracketPairsTextModelPart/bracketPairsTree/parser.js + 2 modules
var parser = __webpack_require__(68302);
// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/editor/common/model/bracketPairsTextModelPart/bracketPairsTree/smallImmutableSet.js
var smallImmutableSet = __webpack_require__(60756);
// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/editor/common/model/bracketPairsTextModelPart/bracketPairsTree/tokenizer.js
var bracketPairsTree_tokenizer = __webpack_require__(33206);
// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/editor/common/model/bracketPairsTextModelPart/bracketPairsTree/combineTextEditInfos.js
var combineTextEditInfos = __webpack_require__(47132);
;// ./node_modules/monaco-editor/esm/vs/editor/common/model/bracketPairsTextModelPart/bracketPairsTree/bracketPairsTree.js
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/











class BracketPairsTree extends lifecycle/* Disposable */.jG {
    didLanguageChange(languageId) {
        return this.brackets.didLanguageChange(languageId);
    }
    constructor(textModel, getLanguageConfiguration) {
        super();
        this.textModel = textModel;
        this.getLanguageConfiguration = getLanguageConfiguration;
        this.didChangeEmitter = new common_event/* Emitter */.vl();
        this.denseKeyProvider = new smallImmutableSet/* DenseKeyProvider */.Mg();
        this.brackets = new brackets/* LanguageAgnosticBracketTokens */.Z(this.denseKeyProvider, this.getLanguageConfiguration);
        this.onDidChange = this.didChangeEmitter.event;
        this.queuedTextEditsForInitialAstWithoutTokens = [];
        this.queuedTextEdits = [];
        if (!textModel.tokenization.hasTokens) {
            const brackets = this.brackets.getSingleLanguageBracketTokens(this.textModel.getLanguageId());
            const tokenizer = new bracketPairsTree_tokenizer/* FastTokenizer */._(this.textModel.getValue(), brackets);
            this.initialAstWithoutTokens = (0,parser/* parseDocument */.T)(tokenizer, [], undefined, true);
            this.astWithTokens = this.initialAstWithoutTokens;
        }
        else if (textModel.tokenization.backgroundTokenizationState === 2 /* BackgroundTokenizationState.Completed */) {
            // Skip the initial ast, as there is no flickering.
            // Directly create the tree with token information.
            this.initialAstWithoutTokens = undefined;
            this.astWithTokens = this.parseDocumentFromTextBuffer([], undefined, false);
        }
        else {
            // We missed some token changes already, so we cannot use the fast tokenizer + delta increments
            this.initialAstWithoutTokens = this.parseDocumentFromTextBuffer([], undefined, true);
            this.astWithTokens = this.initialAstWithoutTokens;
        }
    }
    //#region TextModel events
    handleDidChangeBackgroundTokenizationState() {
        if (this.textModel.tokenization.backgroundTokenizationState === 2 /* BackgroundTokenizationState.Completed */) {
            const wasUndefined = this.initialAstWithoutTokens === undefined;
            // Clear the initial tree as we can use the tree with token information now.
            this.initialAstWithoutTokens = undefined;
            if (!wasUndefined) {
                this.didChangeEmitter.fire();
            }
        }
    }
    handleDidChangeTokens({ ranges }) {
        const edits = ranges.map(r => new beforeEditPositionMapper/* TextEditInfo */.c((0,bracketPairsTree_length/* toLength */.qe)(r.fromLineNumber - 1, 0), (0,bracketPairsTree_length/* toLength */.qe)(r.toLineNumber, 0), (0,bracketPairsTree_length/* toLength */.qe)(r.toLineNumber - r.fromLineNumber + 1, 0)));
        this.handleEdits(edits, true);
        if (!this.initialAstWithoutTokens) {
            this.didChangeEmitter.fire();
        }
    }
    handleContentChanged(change) {
        const edits = beforeEditPositionMapper/* TextEditInfo */.c.fromModelContentChanges(change.changes);
        this.handleEdits(edits, false);
    }
    handleEdits(edits, tokenChange) {
        // Lazily queue the edits and only apply them when the tree is accessed.
        const result = (0,combineTextEditInfos/* combineTextEditInfos */.M)(this.queuedTextEdits, edits);
        this.queuedTextEdits = result;
        if (this.initialAstWithoutTokens && !tokenChange) {
            this.queuedTextEditsForInitialAstWithoutTokens = (0,combineTextEditInfos/* combineTextEditInfos */.M)(this.queuedTextEditsForInitialAstWithoutTokens, edits);
        }
    }
    //#endregion
    flushQueue() {
        if (this.queuedTextEdits.length > 0) {
            this.astWithTokens = this.parseDocumentFromTextBuffer(this.queuedTextEdits, this.astWithTokens, false);
            this.queuedTextEdits = [];
        }
        if (this.queuedTextEditsForInitialAstWithoutTokens.length > 0) {
            if (this.initialAstWithoutTokens) {
                this.initialAstWithoutTokens = this.parseDocumentFromTextBuffer(this.queuedTextEditsForInitialAstWithoutTokens, this.initialAstWithoutTokens, false);
            }
            this.queuedTextEditsForInitialAstWithoutTokens = [];
        }
    }
    /**
     * @pure (only if isPure = true)
    */
    parseDocumentFromTextBuffer(edits, previousAst, immutable) {
        // Is much faster if `isPure = false`.
        const isPure = false;
        const previousAstClone = isPure ? previousAst?.deepClone() : previousAst;
        const tokenizer = new bracketPairsTree_tokenizer/* TextBufferTokenizer */.tk(this.textModel, this.brackets);
        const result = (0,parser/* parseDocument */.T)(tokenizer, edits, previousAstClone, immutable);
        return result;
    }
    getBracketsInRange(range, onlyColorizedBrackets) {
        this.flushQueue();
        const startOffset = (0,bracketPairsTree_length/* toLength */.qe)(range.startLineNumber - 1, range.startColumn - 1);
        const endOffset = (0,bracketPairsTree_length/* toLength */.qe)(range.endLineNumber - 1, range.endColumn - 1);
        return new arrays/* CallbackIterable */.c1(cb => {
            const node = this.initialAstWithoutTokens || this.astWithTokens;
            collectBrackets(node, bracketPairsTree_length/* lengthZero */.Vp, node.length, startOffset, endOffset, cb, 0, 0, new Map(), onlyColorizedBrackets);
        });
    }
    getBracketPairsInRange(range, includeMinIndentation) {
        this.flushQueue();
        const startLength = (0,bracketPairsTree_length/* positionToLength */.VL)(range.getStartPosition());
        const endLength = (0,bracketPairsTree_length/* positionToLength */.VL)(range.getEndPosition());
        return new arrays/* CallbackIterable */.c1(cb => {
            const node = this.initialAstWithoutTokens || this.astWithTokens;
            const context = new CollectBracketPairsContext(cb, includeMinIndentation, this.textModel);
            collectBracketPairs(node, bracketPairsTree_length/* lengthZero */.Vp, node.length, startLength, endLength, context, 0, new Map());
        });
    }
    getFirstBracketAfter(position) {
        this.flushQueue();
        const node = this.initialAstWithoutTokens || this.astWithTokens;
        return getFirstBracketAfter(node, bracketPairsTree_length/* lengthZero */.Vp, node.length, (0,bracketPairsTree_length/* positionToLength */.VL)(position));
    }
    getFirstBracketBefore(position) {
        this.flushQueue();
        const node = this.initialAstWithoutTokens || this.astWithTokens;
        return getFirstBracketBefore(node, bracketPairsTree_length/* lengthZero */.Vp, node.length, (0,bracketPairsTree_length/* positionToLength */.VL)(position));
    }
}
function getFirstBracketBefore(node, nodeOffsetStart, nodeOffsetEnd, position) {
    if (node.kind === 4 /* AstNodeKind.List */ || node.kind === 2 /* AstNodeKind.Pair */) {
        const lengths = [];
        for (const child of node.children) {
            nodeOffsetEnd = (0,bracketPairsTree_length/* lengthAdd */.QB)(nodeOffsetStart, child.length);
            lengths.push({ nodeOffsetStart, nodeOffsetEnd });
            nodeOffsetStart = nodeOffsetEnd;
        }
        for (let i = lengths.length - 1; i >= 0; i--) {
            const { nodeOffsetStart, nodeOffsetEnd } = lengths[i];
            if ((0,bracketPairsTree_length/* lengthLessThan */.zG)(nodeOffsetStart, position)) {
                const result = getFirstBracketBefore(node.children[i], nodeOffsetStart, nodeOffsetEnd, position);
                if (result) {
                    return result;
                }
            }
        }
        return null;
    }
    else if (node.kind === 3 /* AstNodeKind.UnexpectedClosingBracket */) {
        return null;
    }
    else if (node.kind === 1 /* AstNodeKind.Bracket */) {
        const range = (0,bracketPairsTree_length/* lengthsToRange */.Qx)(nodeOffsetStart, nodeOffsetEnd);
        return {
            bracketInfo: node.bracketInfo,
            range
        };
    }
    return null;
}
function getFirstBracketAfter(node, nodeOffsetStart, nodeOffsetEnd, position) {
    if (node.kind === 4 /* AstNodeKind.List */ || node.kind === 2 /* AstNodeKind.Pair */) {
        for (const child of node.children) {
            nodeOffsetEnd = (0,bracketPairsTree_length/* lengthAdd */.QB)(nodeOffsetStart, child.length);
            if ((0,bracketPairsTree_length/* lengthLessThan */.zG)(position, nodeOffsetEnd)) {
                const result = getFirstBracketAfter(child, nodeOffsetStart, nodeOffsetEnd, position);
                if (result) {
                    return result;
                }
            }
            nodeOffsetStart = nodeOffsetEnd;
        }
        return null;
    }
    else if (node.kind === 3 /* AstNodeKind.UnexpectedClosingBracket */) {
        return null;
    }
    else if (node.kind === 1 /* AstNodeKind.Bracket */) {
        const range = (0,bracketPairsTree_length/* lengthsToRange */.Qx)(nodeOffsetStart, nodeOffsetEnd);
        return {
            bracketInfo: node.bracketInfo,
            range
        };
    }
    return null;
}
function collectBrackets(node, nodeOffsetStart, nodeOffsetEnd, startOffset, endOffset, push, level, nestingLevelOfEqualBracketType, levelPerBracketType, onlyColorizedBrackets, parentPairIsIncomplete = false) {
    if (level > 200) {
        return true;
    }
    whileLoop: while (true) {
        switch (node.kind) {
            case 4 /* AstNodeKind.List */: {
                const childCount = node.childrenLength;
                for (let i = 0; i < childCount; i++) {
                    const child = node.getChild(i);
                    if (!child) {
                        continue;
                    }
                    nodeOffsetEnd = (0,bracketPairsTree_length/* lengthAdd */.QB)(nodeOffsetStart, child.length);
                    if ((0,bracketPairsTree_length/* lengthLessThanEqual */.vr)(nodeOffsetStart, endOffset) &&
                        (0,bracketPairsTree_length/* lengthGreaterThanEqual */.o0)(nodeOffsetEnd, startOffset)) {
                        const childEndsAfterEnd = (0,bracketPairsTree_length/* lengthGreaterThanEqual */.o0)(nodeOffsetEnd, endOffset);
                        if (childEndsAfterEnd) {
                            // No child after this child in the requested window, don't recurse
                            node = child;
                            continue whileLoop;
                        }
                        const shouldContinue = collectBrackets(child, nodeOffsetStart, nodeOffsetEnd, startOffset, endOffset, push, level, 0, levelPerBracketType, onlyColorizedBrackets);
                        if (!shouldContinue) {
                            return false;
                        }
                    }
                    nodeOffsetStart = nodeOffsetEnd;
                }
                return true;
            }
            case 2 /* AstNodeKind.Pair */: {
                const colorize = !onlyColorizedBrackets || !node.closingBracket || node.closingBracket.bracketInfo.closesColorized(node.openingBracket.bracketInfo);
                let levelPerBracket = 0;
                if (levelPerBracketType) {
                    let existing = levelPerBracketType.get(node.openingBracket.text);
                    if (existing === undefined) {
                        existing = 0;
                    }
                    levelPerBracket = existing;
                    if (colorize) {
                        existing++;
                        levelPerBracketType.set(node.openingBracket.text, existing);
                    }
                }
                const childCount = node.childrenLength;
                for (let i = 0; i < childCount; i++) {
                    const child = node.getChild(i);
                    if (!child) {
                        continue;
                    }
                    nodeOffsetEnd = (0,bracketPairsTree_length/* lengthAdd */.QB)(nodeOffsetStart, child.length);
                    if ((0,bracketPairsTree_length/* lengthLessThanEqual */.vr)(nodeOffsetStart, endOffset) &&
                        (0,bracketPairsTree_length/* lengthGreaterThanEqual */.o0)(nodeOffsetEnd, startOffset)) {
                        const childEndsAfterEnd = (0,bracketPairsTree_length/* lengthGreaterThanEqual */.o0)(nodeOffsetEnd, endOffset);
                        if (childEndsAfterEnd && child.kind !== 1 /* AstNodeKind.Bracket */) {
                            // No child after this child in the requested window, don't recurse
                            // Don't do this for brackets because of unclosed/unopened brackets
                            node = child;
                            if (colorize) {
                                level++;
                                nestingLevelOfEqualBracketType = levelPerBracket + 1;
                            }
                            else {
                                nestingLevelOfEqualBracketType = levelPerBracket;
                            }
                            continue whileLoop;
                        }
                        if (colorize || child.kind !== 1 /* AstNodeKind.Bracket */ || !node.closingBracket) {
                            const shouldContinue = collectBrackets(child, nodeOffsetStart, nodeOffsetEnd, startOffset, endOffset, push, colorize ? level + 1 : level, colorize ? levelPerBracket + 1 : levelPerBracket, levelPerBracketType, onlyColorizedBrackets, !node.closingBracket);
                            if (!shouldContinue) {
                                return false;
                            }
                        }
                    }
                    nodeOffsetStart = nodeOffsetEnd;
                }
                levelPerBracketType?.set(node.openingBracket.text, levelPerBracket);
                return true;
            }
            case 3 /* AstNodeKind.UnexpectedClosingBracket */: {
                const range = (0,bracketPairsTree_length/* lengthsToRange */.Qx)(nodeOffsetStart, nodeOffsetEnd);
                return push(new BracketInfo(range, level - 1, 0, true));
            }
            case 1 /* AstNodeKind.Bracket */: {
                const range = (0,bracketPairsTree_length/* lengthsToRange */.Qx)(nodeOffsetStart, nodeOffsetEnd);
                return push(new BracketInfo(range, level - 1, nestingLevelOfEqualBracketType - 1, parentPairIsIncomplete));
            }
            case 0 /* AstNodeKind.Text */:
                return true;
        }
    }
}
class CollectBracketPairsContext {
    constructor(push, includeMinIndentation, textModel) {
        this.push = push;
        this.includeMinIndentation = includeMinIndentation;
        this.textModel = textModel;
    }
}
function collectBracketPairs(node, nodeOffsetStart, nodeOffsetEnd, startOffset, endOffset, context, level, levelPerBracketType) {
    if (level > 200) {
        return true;
    }
    let shouldContinue = true;
    if (node.kind === 2 /* AstNodeKind.Pair */) {
        let levelPerBracket = 0;
        if (levelPerBracketType) {
            let existing = levelPerBracketType.get(node.openingBracket.text);
            if (existing === undefined) {
                existing = 0;
            }
            levelPerBracket = existing;
            existing++;
            levelPerBracketType.set(node.openingBracket.text, existing);
        }
        const openingBracketEnd = (0,bracketPairsTree_length/* lengthAdd */.QB)(nodeOffsetStart, node.openingBracket.length);
        let minIndentation = -1;
        if (context.includeMinIndentation) {
            minIndentation = node.computeMinIndentation(nodeOffsetStart, context.textModel);
        }
        shouldContinue = context.push(new BracketPairWithMinIndentationInfo((0,bracketPairsTree_length/* lengthsToRange */.Qx)(nodeOffsetStart, nodeOffsetEnd), (0,bracketPairsTree_length/* lengthsToRange */.Qx)(nodeOffsetStart, openingBracketEnd), node.closingBracket
            ? (0,bracketPairsTree_length/* lengthsToRange */.Qx)((0,bracketPairsTree_length/* lengthAdd */.QB)(openingBracketEnd, node.child?.length || bracketPairsTree_length/* lengthZero */.Vp), nodeOffsetEnd)
            : undefined, level, levelPerBracket, node, minIndentation));
        nodeOffsetStart = openingBracketEnd;
        if (shouldContinue && node.child) {
            const child = node.child;
            nodeOffsetEnd = (0,bracketPairsTree_length/* lengthAdd */.QB)(nodeOffsetStart, child.length);
            if ((0,bracketPairsTree_length/* lengthLessThanEqual */.vr)(nodeOffsetStart, endOffset) &&
                (0,bracketPairsTree_length/* lengthGreaterThanEqual */.o0)(nodeOffsetEnd, startOffset)) {
                shouldContinue = collectBracketPairs(child, nodeOffsetStart, nodeOffsetEnd, startOffset, endOffset, context, level + 1, levelPerBracketType);
                if (!shouldContinue) {
                    return false;
                }
            }
        }
        levelPerBracketType?.set(node.openingBracket.text, levelPerBracket);
    }
    else {
        let curOffset = nodeOffsetStart;
        for (const child of node.children) {
            const childOffset = curOffset;
            curOffset = (0,bracketPairsTree_length/* lengthAdd */.QB)(curOffset, child.length);
            if ((0,bracketPairsTree_length/* lengthLessThanEqual */.vr)(childOffset, endOffset) &&
                (0,bracketPairsTree_length/* lengthLessThanEqual */.vr)(startOffset, curOffset)) {
                shouldContinue = collectBracketPairs(child, childOffset, curOffset, startOffset, endOffset, context, level, levelPerBracketType);
                if (!shouldContinue) {
                    return false;
                }
            }
        }
    }
    return shouldContinue;
}

;// ./node_modules/monaco-editor/esm/vs/editor/common/model/bracketPairsTextModelPart/bracketPairsImpl.js
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/







class BracketPairsTextModelPart extends lifecycle/* Disposable */.jG {
    get canBuildAST() {
        const maxSupportedDocumentLength = /* max lines */ 50_000 * /* average column count */ 100;
        return this.textModel.getValueLength() <= maxSupportedDocumentLength;
    }
    constructor(textModel, languageConfigurationService) {
        super();
        this.textModel = textModel;
        this.languageConfigurationService = languageConfigurationService;
        this.bracketPairsTree = this._register(new lifecycle/* MutableDisposable */.HE());
        this.onDidChangeEmitter = new common_event/* Emitter */.vl();
        this.onDidChange = this.onDidChangeEmitter.event;
        this.bracketsRequested = false;
    }
    //#region TextModel events
    handleLanguageConfigurationServiceChange(e) {
        if (!e.languageId || this.bracketPairsTree.value?.object.didLanguageChange(e.languageId)) {
            this.bracketPairsTree.clear();
            this.updateBracketPairsTree();
        }
    }
    handleDidChangeOptions(e) {
        this.bracketPairsTree.clear();
        this.updateBracketPairsTree();
    }
    handleDidChangeLanguage(e) {
        this.bracketPairsTree.clear();
        this.updateBracketPairsTree();
    }
    handleDidChangeContent(change) {
        this.bracketPairsTree.value?.object.handleContentChanged(change);
    }
    handleDidChangeBackgroundTokenizationState() {
        this.bracketPairsTree.value?.object.handleDidChangeBackgroundTokenizationState();
    }
    handleDidChangeTokens(e) {
        this.bracketPairsTree.value?.object.handleDidChangeTokens(e);
    }
    //#endregion
    updateBracketPairsTree() {
        if (this.bracketsRequested && this.canBuildAST) {
            if (!this.bracketPairsTree.value) {
                const store = new lifecycle/* DisposableStore */.Cm();
                this.bracketPairsTree.value = createDisposableRef(store.add(new BracketPairsTree(this.textModel, (languageId) => {
                    return this.languageConfigurationService.getLanguageConfiguration(languageId);
                })), store);
                store.add(this.bracketPairsTree.value.object.onDidChange(e => this.onDidChangeEmitter.fire(e)));
                this.onDidChangeEmitter.fire();
            }
        }
        else {
            if (this.bracketPairsTree.value) {
                this.bracketPairsTree.clear();
                // Important: Don't call fire if there was no change!
                this.onDidChangeEmitter.fire();
            }
        }
    }
    /**
     * Returns all bracket pairs that intersect the given range.
     * The result is sorted by the start position.
    */
    getBracketPairsInRange(range) {
        this.bracketsRequested = true;
        this.updateBracketPairsTree();
        return this.bracketPairsTree.value?.object.getBracketPairsInRange(range, false) || arrays/* CallbackIterable */.c1.empty;
    }
    getBracketPairsInRangeWithMinIndentation(range) {
        this.bracketsRequested = true;
        this.updateBracketPairsTree();
        return this.bracketPairsTree.value?.object.getBracketPairsInRange(range, true) || arrays/* CallbackIterable */.c1.empty;
    }
    getBracketsInRange(range, onlyColorizedBrackets = false) {
        this.bracketsRequested = true;
        this.updateBracketPairsTree();
        return this.bracketPairsTree.value?.object.getBracketsInRange(range, onlyColorizedBrackets) || arrays/* CallbackIterable */.c1.empty;
    }
    findMatchingBracketUp(_bracket, _position, maxDuration) {
        const position = this.textModel.validatePosition(_position);
        const languageId = this.textModel.getLanguageIdAtPosition(position.lineNumber, position.column);
        if (this.canBuildAST) {
            const closingBracketInfo = this.languageConfigurationService
                .getLanguageConfiguration(languageId)
                .bracketsNew.getClosingBracketInfo(_bracket);
            if (!closingBracketInfo) {
                return null;
            }
            const bracketPair = this.getBracketPairsInRange(core_range/* Range */.Q.fromPositions(_position, _position)).findLast((b) => closingBracketInfo.closes(b.openingBracketInfo));
            if (bracketPair) {
                return bracketPair.openingBracketRange;
            }
            return null;
        }
        else {
            // Fallback to old bracket matching code:
            const bracket = _bracket.toLowerCase();
            const bracketsSupport = this.languageConfigurationService.getLanguageConfiguration(languageId).brackets;
            if (!bracketsSupport) {
                return null;
            }
            const data = bracketsSupport.textIsBracket[bracket];
            if (!data) {
                return null;
            }
            return stripBracketSearchCanceled(this._findMatchingBracketUp(data, position, createTimeBasedContinueBracketSearchPredicate(maxDuration)));
        }
    }
    matchBracket(position, maxDuration) {
        if (this.canBuildAST) {
            const bracketPair = this.getBracketPairsInRange(core_range/* Range */.Q.fromPositions(position, position)).filter((item) => item.closingBracketRange !== undefined &&
                (item.openingBracketRange.containsPosition(position) ||
                    item.closingBracketRange.containsPosition(position))).findLastMaxBy((0,arrays/* compareBy */.VE)((item) => item.openingBracketRange.containsPosition(position)
                ? item.openingBracketRange
                : item.closingBracketRange, core_range/* Range */.Q.compareRangesUsingStarts));
            if (bracketPair) {
                return [bracketPair.openingBracketRange, bracketPair.closingBracketRange];
            }
            return null;
        }
        else {
            // Fallback to old bracket matching code:
            const continueSearchPredicate = createTimeBasedContinueBracketSearchPredicate(maxDuration);
            return this._matchBracket(this.textModel.validatePosition(position), continueSearchPredicate);
        }
    }
    _establishBracketSearchOffsets(position, lineTokens, modeBrackets, tokenIndex) {
        const tokenCount = lineTokens.getCount();
        const currentLanguageId = lineTokens.getLanguageId(tokenIndex);
        // limit search to not go before `maxBracketLength`
        let searchStartOffset = Math.max(0, position.column - 1 - modeBrackets.maxBracketLength);
        for (let i = tokenIndex - 1; i >= 0; i--) {
            const tokenEndOffset = lineTokens.getEndOffset(i);
            if (tokenEndOffset <= searchStartOffset) {
                break;
            }
            if ((0,supports/* ignoreBracketsInToken */.Yo)(lineTokens.getStandardTokenType(i)) || lineTokens.getLanguageId(i) !== currentLanguageId) {
                searchStartOffset = tokenEndOffset;
                break;
            }
        }
        // limit search to not go after `maxBracketLength`
        let searchEndOffset = Math.min(lineTokens.getLineContent().length, position.column - 1 + modeBrackets.maxBracketLength);
        for (let i = tokenIndex + 1; i < tokenCount; i++) {
            const tokenStartOffset = lineTokens.getStartOffset(i);
            if (tokenStartOffset >= searchEndOffset) {
                break;
            }
            if ((0,supports/* ignoreBracketsInToken */.Yo)(lineTokens.getStandardTokenType(i)) || lineTokens.getLanguageId(i) !== currentLanguageId) {
                searchEndOffset = tokenStartOffset;
                break;
            }
        }
        return { searchStartOffset, searchEndOffset };
    }
    _matchBracket(position, continueSearchPredicate) {
        const lineNumber = position.lineNumber;
        const lineTokens = this.textModel.tokenization.getLineTokens(lineNumber);
        const lineText = this.textModel.getLineContent(lineNumber);
        const tokenIndex = lineTokens.findTokenIndexAtOffset(position.column - 1);
        if (tokenIndex < 0) {
            return null;
        }
        const currentModeBrackets = this.languageConfigurationService.getLanguageConfiguration(lineTokens.getLanguageId(tokenIndex)).brackets;
        // check that the token is not to be ignored
        if (currentModeBrackets && !(0,supports/* ignoreBracketsInToken */.Yo)(lineTokens.getStandardTokenType(tokenIndex))) {
            let { searchStartOffset, searchEndOffset } = this._establishBracketSearchOffsets(position, lineTokens, currentModeBrackets, tokenIndex);
            // it might be the case that [currentTokenStart -> currentTokenEnd] contains multiple brackets
            // `bestResult` will contain the most right-side result
            let bestResult = null;
            while (true) {
                const foundBracket = richEditBrackets/* BracketsUtils */.Fu.findNextBracketInRange(currentModeBrackets.forwardRegex, lineNumber, lineText, searchStartOffset, searchEndOffset);
                if (!foundBracket) {
                    // there are no more brackets in this text
                    break;
                }
                // check that we didn't hit a bracket too far away from position
                if (foundBracket.startColumn <= position.column && position.column <= foundBracket.endColumn) {
                    const foundBracketText = lineText.substring(foundBracket.startColumn - 1, foundBracket.endColumn - 1).toLowerCase();
                    const r = this._matchFoundBracket(foundBracket, currentModeBrackets.textIsBracket[foundBracketText], currentModeBrackets.textIsOpenBracket[foundBracketText], continueSearchPredicate);
                    if (r) {
                        if (r instanceof BracketSearchCanceled) {
                            return null;
                        }
                        bestResult = r;
                    }
                }
                searchStartOffset = foundBracket.endColumn - 1;
            }
            if (bestResult) {
                return bestResult;
            }
        }
        // If position is in between two tokens, try also looking in the previous token
        if (tokenIndex > 0 && lineTokens.getStartOffset(tokenIndex) === position.column - 1) {
            const prevTokenIndex = tokenIndex - 1;
            const prevModeBrackets = this.languageConfigurationService.getLanguageConfiguration(lineTokens.getLanguageId(prevTokenIndex)).brackets;
            // check that previous token is not to be ignored
            if (prevModeBrackets && !(0,supports/* ignoreBracketsInToken */.Yo)(lineTokens.getStandardTokenType(prevTokenIndex))) {
                const { searchStartOffset, searchEndOffset } = this._establishBracketSearchOffsets(position, lineTokens, prevModeBrackets, prevTokenIndex);
                const foundBracket = richEditBrackets/* BracketsUtils */.Fu.findPrevBracketInRange(prevModeBrackets.reversedRegex, lineNumber, lineText, searchStartOffset, searchEndOffset);
                // check that we didn't hit a bracket too far away from position
                if (foundBracket && foundBracket.startColumn <= position.column && position.column <= foundBracket.endColumn) {
                    const foundBracketText = lineText.substring(foundBracket.startColumn - 1, foundBracket.endColumn - 1).toLowerCase();
                    const r = this._matchFoundBracket(foundBracket, prevModeBrackets.textIsBracket[foundBracketText], prevModeBrackets.textIsOpenBracket[foundBracketText], continueSearchPredicate);
                    if (r) {
                        if (r instanceof BracketSearchCanceled) {
                            return null;
                        }
                        return r;
                    }
                }
            }
        }
        return null;
    }
    _matchFoundBracket(foundBracket, data, isOpen, continueSearchPredicate) {
        if (!data) {
            return null;
        }
        const matched = (isOpen
            ? this._findMatchingBracketDown(data, foundBracket.getEndPosition(), continueSearchPredicate)
            : this._findMatchingBracketUp(data, foundBracket.getStartPosition(), continueSearchPredicate));
        if (!matched) {
            return null;
        }
        if (matched instanceof BracketSearchCanceled) {
            return matched;
        }
        return [foundBracket, matched];
    }
    _findMatchingBracketUp(bracket, position, continueSearchPredicate) {
        // console.log('_findMatchingBracketUp: ', 'bracket: ', JSON.stringify(bracket), 'startPosition: ', String(position));
        const languageId = bracket.languageId;
        const reversedBracketRegex = bracket.reversedRegex;
        let count = -1;
        let totalCallCount = 0;
        const searchPrevMatchingBracketInRange = (lineNumber, lineText, searchStartOffset, searchEndOffset) => {
            while (true) {
                if (continueSearchPredicate && (++totalCallCount) % 100 === 0 && !continueSearchPredicate()) {
                    return BracketSearchCanceled.INSTANCE;
                }
                const r = richEditBrackets/* BracketsUtils */.Fu.findPrevBracketInRange(reversedBracketRegex, lineNumber, lineText, searchStartOffset, searchEndOffset);
                if (!r) {
                    break;
                }
                const hitText = lineText.substring(r.startColumn - 1, r.endColumn - 1).toLowerCase();
                if (bracket.isOpen(hitText)) {
                    count++;
                }
                else if (bracket.isClose(hitText)) {
                    count--;
                }
                if (count === 0) {
                    return r;
                }
                searchEndOffset = r.startColumn - 1;
            }
            return null;
        };
        for (let lineNumber = position.lineNumber; lineNumber >= 1; lineNumber--) {
            const lineTokens = this.textModel.tokenization.getLineTokens(lineNumber);
            const tokenCount = lineTokens.getCount();
            const lineText = this.textModel.getLineContent(lineNumber);
            let tokenIndex = tokenCount - 1;
            let searchStartOffset = lineText.length;
            let searchEndOffset = lineText.length;
            if (lineNumber === position.lineNumber) {
                tokenIndex = lineTokens.findTokenIndexAtOffset(position.column - 1);
                searchStartOffset = position.column - 1;
                searchEndOffset = position.column - 1;
            }
            let prevSearchInToken = true;
            for (; tokenIndex >= 0; tokenIndex--) {
                const searchInToken = (lineTokens.getLanguageId(tokenIndex) === languageId && !(0,supports/* ignoreBracketsInToken */.Yo)(lineTokens.getStandardTokenType(tokenIndex)));
                if (searchInToken) {
                    // this token should be searched
                    if (prevSearchInToken) {
                        // the previous token should be searched, simply extend searchStartOffset
                        searchStartOffset = lineTokens.getStartOffset(tokenIndex);
                    }
                    else {
                        // the previous token should not be searched
                        searchStartOffset = lineTokens.getStartOffset(tokenIndex);
                        searchEndOffset = lineTokens.getEndOffset(tokenIndex);
                    }
                }
                else {
                    // this token should not be searched
                    if (prevSearchInToken && searchStartOffset !== searchEndOffset) {
                        const r = searchPrevMatchingBracketInRange(lineNumber, lineText, searchStartOffset, searchEndOffset);
                        if (r) {
                            return r;
                        }
                    }
                }
                prevSearchInToken = searchInToken;
            }
            if (prevSearchInToken && searchStartOffset !== searchEndOffset) {
                const r = searchPrevMatchingBracketInRange(lineNumber, lineText, searchStartOffset, searchEndOffset);
                if (r) {
                    return r;
                }
            }
        }
        return null;
    }
    _findMatchingBracketDown(bracket, position, continueSearchPredicate) {
        // console.log('_findMatchingBracketDown: ', 'bracket: ', JSON.stringify(bracket), 'startPosition: ', String(position));
        const languageId = bracket.languageId;
        const bracketRegex = bracket.forwardRegex;
        let count = 1;
        let totalCallCount = 0;
        const searchNextMatchingBracketInRange = (lineNumber, lineText, searchStartOffset, searchEndOffset) => {
            while (true) {
                if (continueSearchPredicate && (++totalCallCount) % 100 === 0 && !continueSearchPredicate()) {
                    return BracketSearchCanceled.INSTANCE;
                }
                const r = richEditBrackets/* BracketsUtils */.Fu.findNextBracketInRange(bracketRegex, lineNumber, lineText, searchStartOffset, searchEndOffset);
                if (!r) {
                    break;
                }
                const hitText = lineText.substring(r.startColumn - 1, r.endColumn - 1).toLowerCase();
                if (bracket.isOpen(hitText)) {
                    count++;
                }
                else if (bracket.isClose(hitText)) {
                    count--;
                }
                if (count === 0) {
                    return r;
                }
                searchStartOffset = r.endColumn - 1;
            }
            return null;
        };
        const lineCount = this.textModel.getLineCount();
        for (let lineNumber = position.lineNumber; lineNumber <= lineCount; lineNumber++) {
            const lineTokens = this.textModel.tokenization.getLineTokens(lineNumber);
            const tokenCount = lineTokens.getCount();
            const lineText = this.textModel.getLineContent(lineNumber);
            let tokenIndex = 0;
            let searchStartOffset = 0;
            let searchEndOffset = 0;
            if (lineNumber === position.lineNumber) {
                tokenIndex = lineTokens.findTokenIndexAtOffset(position.column - 1);
                searchStartOffset = position.column - 1;
                searchEndOffset = position.column - 1;
            }
            let prevSearchInToken = true;
            for (; tokenIndex < tokenCount; tokenIndex++) {
                const searchInToken = (lineTokens.getLanguageId(tokenIndex) === languageId && !(0,supports/* ignoreBracketsInToken */.Yo)(lineTokens.getStandardTokenType(tokenIndex)));
                if (searchInToken) {
                    // this token should be searched
                    if (prevSearchInToken) {
                        // the previous token should be searched, simply extend searchEndOffset
                        searchEndOffset = lineTokens.getEndOffset(tokenIndex);
                    }
                    else {
                        // the previous token should not be searched
                        searchStartOffset = lineTokens.getStartOffset(tokenIndex);
                        searchEndOffset = lineTokens.getEndOffset(tokenIndex);
                    }
                }
                else {
                    // this token should not be searched
                    if (prevSearchInToken && searchStartOffset !== searchEndOffset) {
                        const r = searchNextMatchingBracketInRange(lineNumber, lineText, searchStartOffset, searchEndOffset);
                        if (r) {
                            return r;
                        }
                    }
                }
                prevSearchInToken = searchInToken;
            }
            if (prevSearchInToken && searchStartOffset !== searchEndOffset) {
                const r = searchNextMatchingBracketInRange(lineNumber, lineText, searchStartOffset, searchEndOffset);
                if (r) {
                    return r;
                }
            }
        }
        return null;
    }
    findPrevBracket(_position) {
        const position = this.textModel.validatePosition(_position);
        if (this.canBuildAST) {
            this.bracketsRequested = true;
            this.updateBracketPairsTree();
            return this.bracketPairsTree.value?.object.getFirstBracketBefore(position) || null;
        }
        let languageId = null;
        let modeBrackets = null;
        let bracketConfig = null;
        for (let lineNumber = position.lineNumber; lineNumber >= 1; lineNumber--) {
            const lineTokens = this.textModel.tokenization.getLineTokens(lineNumber);
            const tokenCount = lineTokens.getCount();
            const lineText = this.textModel.getLineContent(lineNumber);
            let tokenIndex = tokenCount - 1;
            let searchStartOffset = lineText.length;
            let searchEndOffset = lineText.length;
            if (lineNumber === position.lineNumber) {
                tokenIndex = lineTokens.findTokenIndexAtOffset(position.column - 1);
                searchStartOffset = position.column - 1;
                searchEndOffset = position.column - 1;
                const tokenLanguageId = lineTokens.getLanguageId(tokenIndex);
                if (languageId !== tokenLanguageId) {
                    languageId = tokenLanguageId;
                    modeBrackets = this.languageConfigurationService.getLanguageConfiguration(languageId).brackets;
                    bracketConfig = this.languageConfigurationService.getLanguageConfiguration(languageId).bracketsNew;
                }
            }
            let prevSearchInToken = true;
            for (; tokenIndex >= 0; tokenIndex--) {
                const tokenLanguageId = lineTokens.getLanguageId(tokenIndex);
                if (languageId !== tokenLanguageId) {
                    // language id change!
                    if (modeBrackets && bracketConfig && prevSearchInToken && searchStartOffset !== searchEndOffset) {
                        const r = richEditBrackets/* BracketsUtils */.Fu.findPrevBracketInRange(modeBrackets.reversedRegex, lineNumber, lineText, searchStartOffset, searchEndOffset);
                        if (r) {
                            return this._toFoundBracket(bracketConfig, r);
                        }
                        prevSearchInToken = false;
                    }
                    languageId = tokenLanguageId;
                    modeBrackets = this.languageConfigurationService.getLanguageConfiguration(languageId).brackets;
                    bracketConfig = this.languageConfigurationService.getLanguageConfiguration(languageId).bracketsNew;
                }
                const searchInToken = (!!modeBrackets && !(0,supports/* ignoreBracketsInToken */.Yo)(lineTokens.getStandardTokenType(tokenIndex)));
                if (searchInToken) {
                    // this token should be searched
                    if (prevSearchInToken) {
                        // the previous token should be searched, simply extend searchStartOffset
                        searchStartOffset = lineTokens.getStartOffset(tokenIndex);
                    }
                    else {
                        // the previous token should not be searched
                        searchStartOffset = lineTokens.getStartOffset(tokenIndex);
                        searchEndOffset = lineTokens.getEndOffset(tokenIndex);
                    }
                }
                else {
                    // this token should not be searched
                    if (bracketConfig && modeBrackets && prevSearchInToken && searchStartOffset !== searchEndOffset) {
                        const r = richEditBrackets/* BracketsUtils */.Fu.findPrevBracketInRange(modeBrackets.reversedRegex, lineNumber, lineText, searchStartOffset, searchEndOffset);
                        if (r) {
                            return this._toFoundBracket(bracketConfig, r);
                        }
                    }
                }
                prevSearchInToken = searchInToken;
            }
            if (bracketConfig && modeBrackets && prevSearchInToken && searchStartOffset !== searchEndOffset) {
                const r = richEditBrackets/* BracketsUtils */.Fu.findPrevBracketInRange(modeBrackets.reversedRegex, lineNumber, lineText, searchStartOffset, searchEndOffset);
                if (r) {
                    return this._toFoundBracket(bracketConfig, r);
                }
            }
        }
        return null;
    }
    findNextBracket(_position) {
        const position = this.textModel.validatePosition(_position);
        if (this.canBuildAST) {
            this.bracketsRequested = true;
            this.updateBracketPairsTree();
            return this.bracketPairsTree.value?.object.getFirstBracketAfter(position) || null;
        }
        const lineCount = this.textModel.getLineCount();
        let languageId = null;
        let modeBrackets = null;
        let bracketConfig = null;
        for (let lineNumber = position.lineNumber; lineNumber <= lineCount; lineNumber++) {
            const lineTokens = this.textModel.tokenization.getLineTokens(lineNumber);
            const tokenCount = lineTokens.getCount();
            const lineText = this.textModel.getLineContent(lineNumber);
            let tokenIndex = 0;
            let searchStartOffset = 0;
            let searchEndOffset = 0;
            if (lineNumber === position.lineNumber) {
                tokenIndex = lineTokens.findTokenIndexAtOffset(position.column - 1);
                searchStartOffset = position.column - 1;
                searchEndOffset = position.column - 1;
                const tokenLanguageId = lineTokens.getLanguageId(tokenIndex);
                if (languageId !== tokenLanguageId) {
                    languageId = tokenLanguageId;
                    modeBrackets = this.languageConfigurationService.getLanguageConfiguration(languageId).brackets;
                    bracketConfig = this.languageConfigurationService.getLanguageConfiguration(languageId).bracketsNew;
                }
            }
            let prevSearchInToken = true;
            for (; tokenIndex < tokenCount; tokenIndex++) {
                const tokenLanguageId = lineTokens.getLanguageId(tokenIndex);
                if (languageId !== tokenLanguageId) {
                    // language id change!
                    if (bracketConfig && modeBrackets && prevSearchInToken && searchStartOffset !== searchEndOffset) {
                        const r = richEditBrackets/* BracketsUtils */.Fu.findNextBracketInRange(modeBrackets.forwardRegex, lineNumber, lineText, searchStartOffset, searchEndOffset);
                        if (r) {
                            return this._toFoundBracket(bracketConfig, r);
                        }
                        prevSearchInToken = false;
                    }
                    languageId = tokenLanguageId;
                    modeBrackets = this.languageConfigurationService.getLanguageConfiguration(languageId).brackets;
                    bracketConfig = this.languageConfigurationService.getLanguageConfiguration(languageId).bracketsNew;
                }
                const searchInToken = (!!modeBrackets && !(0,supports/* ignoreBracketsInToken */.Yo)(lineTokens.getStandardTokenType(tokenIndex)));
                if (searchInToken) {
                    // this token should be searched
                    if (prevSearchInToken) {
                        // the previous token should be searched, simply extend searchEndOffset
                        searchEndOffset = lineTokens.getEndOffset(tokenIndex);
                    }
                    else {
                        // the previous token should not be searched
                        searchStartOffset = lineTokens.getStartOffset(tokenIndex);
                        searchEndOffset = lineTokens.getEndOffset(tokenIndex);
                    }
                }
                else {
                    // this token should not be searched
                    if (bracketConfig && modeBrackets && prevSearchInToken && searchStartOffset !== searchEndOffset) {
                        const r = richEditBrackets/* BracketsUtils */.Fu.findNextBracketInRange(modeBrackets.forwardRegex, lineNumber, lineText, searchStartOffset, searchEndOffset);
                        if (r) {
                            return this._toFoundBracket(bracketConfig, r);
                        }
                    }
                }
                prevSearchInToken = searchInToken;
            }
            if (bracketConfig && modeBrackets && prevSearchInToken && searchStartOffset !== searchEndOffset) {
                const r = richEditBrackets/* BracketsUtils */.Fu.findNextBracketInRange(modeBrackets.forwardRegex, lineNumber, lineText, searchStartOffset, searchEndOffset);
                if (r) {
                    return this._toFoundBracket(bracketConfig, r);
                }
            }
        }
        return null;
    }
    findEnclosingBrackets(_position, maxDuration) {
        const position = this.textModel.validatePosition(_position);
        if (this.canBuildAST) {
            const range = core_range/* Range */.Q.fromPositions(position);
            const bracketPair = this.getBracketPairsInRange(core_range/* Range */.Q.fromPositions(position, position)).findLast((item) => item.closingBracketRange !== undefined && item.range.strictContainsRange(range));
            if (bracketPair) {
                return [bracketPair.openingBracketRange, bracketPair.closingBracketRange];
            }
            return null;
        }
        const continueSearchPredicate = createTimeBasedContinueBracketSearchPredicate(maxDuration);
        const lineCount = this.textModel.getLineCount();
        const savedCounts = new Map();
        let counts = [];
        const resetCounts = (languageId, modeBrackets) => {
            if (!savedCounts.has(languageId)) {
                const tmp = [];
                for (let i = 0, len = modeBrackets ? modeBrackets.brackets.length : 0; i < len; i++) {
                    tmp[i] = 0;
                }
                savedCounts.set(languageId, tmp);
            }
            counts = savedCounts.get(languageId);
        };
        let totalCallCount = 0;
        const searchInRange = (modeBrackets, lineNumber, lineText, searchStartOffset, searchEndOffset) => {
            while (true) {
                if (continueSearchPredicate && (++totalCallCount) % 100 === 0 && !continueSearchPredicate()) {
                    return BracketSearchCanceled.INSTANCE;
                }
                const r = richEditBrackets/* BracketsUtils */.Fu.findNextBracketInRange(modeBrackets.forwardRegex, lineNumber, lineText, searchStartOffset, searchEndOffset);
                if (!r) {
                    break;
                }
                const hitText = lineText.substring(r.startColumn - 1, r.endColumn - 1).toLowerCase();
                const bracket = modeBrackets.textIsBracket[hitText];
                if (bracket) {
                    if (bracket.isOpen(hitText)) {
                        counts[bracket.index]++;
                    }
                    else if (bracket.isClose(hitText)) {
                        counts[bracket.index]--;
                    }
                    if (counts[bracket.index] === -1) {
                        return this._matchFoundBracket(r, bracket, false, continueSearchPredicate);
                    }
                }
                searchStartOffset = r.endColumn - 1;
            }
            return null;
        };
        let languageId = null;
        let modeBrackets = null;
        for (let lineNumber = position.lineNumber; lineNumber <= lineCount; lineNumber++) {
            const lineTokens = this.textModel.tokenization.getLineTokens(lineNumber);
            const tokenCount = lineTokens.getCount();
            const lineText = this.textModel.getLineContent(lineNumber);
            let tokenIndex = 0;
            let searchStartOffset = 0;
            let searchEndOffset = 0;
            if (lineNumber === position.lineNumber) {
                tokenIndex = lineTokens.findTokenIndexAtOffset(position.column - 1);
                searchStartOffset = position.column - 1;
                searchEndOffset = position.column - 1;
                const tokenLanguageId = lineTokens.getLanguageId(tokenIndex);
                if (languageId !== tokenLanguageId) {
                    languageId = tokenLanguageId;
                    modeBrackets = this.languageConfigurationService.getLanguageConfiguration(languageId).brackets;
                    resetCounts(languageId, modeBrackets);
                }
            }
            let prevSearchInToken = true;
            for (; tokenIndex < tokenCount; tokenIndex++) {
                const tokenLanguageId = lineTokens.getLanguageId(tokenIndex);
                if (languageId !== tokenLanguageId) {
                    // language id change!
                    if (modeBrackets && prevSearchInToken && searchStartOffset !== searchEndOffset) {
                        const r = searchInRange(modeBrackets, lineNumber, lineText, searchStartOffset, searchEndOffset);
                        if (r) {
                            return stripBracketSearchCanceled(r);
                        }
                        prevSearchInToken = false;
                    }
                    languageId = tokenLanguageId;
                    modeBrackets = this.languageConfigurationService.getLanguageConfiguration(languageId).brackets;
                    resetCounts(languageId, modeBrackets);
                }
                const searchInToken = (!!modeBrackets && !(0,supports/* ignoreBracketsInToken */.Yo)(lineTokens.getStandardTokenType(tokenIndex)));
                if (searchInToken) {
                    // this token should be searched
                    if (prevSearchInToken) {
                        // the previous token should be searched, simply extend searchEndOffset
                        searchEndOffset = lineTokens.getEndOffset(tokenIndex);
                    }
                    else {
                        // the previous token should not be searched
                        searchStartOffset = lineTokens.getStartOffset(tokenIndex);
                        searchEndOffset = lineTokens.getEndOffset(tokenIndex);
                    }
                }
                else {
                    // this token should not be searched
                    if (modeBrackets && prevSearchInToken && searchStartOffset !== searchEndOffset) {
                        const r = searchInRange(modeBrackets, lineNumber, lineText, searchStartOffset, searchEndOffset);
                        if (r) {
                            return stripBracketSearchCanceled(r);
                        }
                    }
                }
                prevSearchInToken = searchInToken;
            }
            if (modeBrackets && prevSearchInToken && searchStartOffset !== searchEndOffset) {
                const r = searchInRange(modeBrackets, lineNumber, lineText, searchStartOffset, searchEndOffset);
                if (r) {
                    return stripBracketSearchCanceled(r);
                }
            }
        }
        return null;
    }
    _toFoundBracket(bracketConfig, r) {
        if (!r) {
            return null;
        }
        let text = this.textModel.getValueInRange(r);
        text = text.toLowerCase();
        const bracketInfo = bracketConfig.getBracketInfo(text);
        if (!bracketInfo) {
            return null;
        }
        return {
            range: r,
            bracketInfo
        };
    }
}
function createDisposableRef(object, disposable) {
    return {
        object,
        dispose: () => disposable?.dispose(),
    };
}
function createTimeBasedContinueBracketSearchPredicate(maxDuration) {
    if (typeof maxDuration === 'undefined') {
        return () => true;
    }
    else {
        const startTime = Date.now();
        return () => {
            return (Date.now() - startTime <= maxDuration);
        };
    }
}
class BracketSearchCanceled {
    static { this.INSTANCE = new BracketSearchCanceled(); }
    constructor() {
        this._searchCanceledBrand = undefined;
    }
}
function stripBracketSearchCanceled(result) {
    if (result instanceof BracketSearchCanceled) {
        return null;
    }
    return result;
}

// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/editor/common/core/editorColorRegistry.js
var editorColorRegistry = __webpack_require__(48295);
// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/platform/theme/common/themeService.js
var themeService = __webpack_require__(89044);
;// ./node_modules/monaco-editor/esm/vs/editor/common/model/bracketPairsTextModelPart/colorizedBracketPairsDecorationProvider.js
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/





class ColorizedBracketPairsDecorationProvider extends lifecycle/* Disposable */.jG {
    constructor(textModel) {
        super();
        this.textModel = textModel;
        this.colorProvider = new ColorProvider();
        this.onDidChangeEmitter = new common_event/* Emitter */.vl();
        this.onDidChange = this.onDidChangeEmitter.event;
        this.colorizationOptions = textModel.getOptions().bracketPairColorizationOptions;
        this._register(textModel.bracketPairs.onDidChange(e => {
            this.onDidChangeEmitter.fire();
        }));
    }
    //#region TextModel events
    handleDidChangeOptions(e) {
        this.colorizationOptions = this.textModel.getOptions().bracketPairColorizationOptions;
    }
    //#endregion
    getDecorationsInRange(range, ownerId, filterOutValidation, onlyMinimapDecorations) {
        if (onlyMinimapDecorations) {
            // Bracket pair colorization decorations are not rendered in the minimap
            return [];
        }
        if (ownerId === undefined) {
            return [];
        }
        if (!this.colorizationOptions.enabled) {
            return [];
        }
        const result = this.textModel.bracketPairs.getBracketsInRange(range, true).map(bracket => ({
            id: `bracket${bracket.range.toString()}-${bracket.nestingLevel}`,
            options: {
                description: 'BracketPairColorization',
                inlineClassName: this.colorProvider.getInlineClassName(bracket, this.colorizationOptions.independentColorPoolPerBracketType),
            },
            ownerId: 0,
            range: bracket.range,
        })).toArray();
        return result;
    }
    getAllDecorations(ownerId, filterOutValidation) {
        if (ownerId === undefined) {
            return [];
        }
        if (!this.colorizationOptions.enabled) {
            return [];
        }
        return this.getDecorationsInRange(new core_range/* Range */.Q(1, 1, this.textModel.getLineCount(), 1), ownerId, filterOutValidation);
    }
}
class ColorProvider {
    constructor() {
        this.unexpectedClosingBracketClassName = 'unexpected-closing-bracket';
    }
    getInlineClassName(bracket, independentColorPoolPerBracketType) {
        if (bracket.isInvalid) {
            return this.unexpectedClosingBracketClassName;
        }
        return this.getInlineClassNameOfLevel(independentColorPoolPerBracketType ? bracket.nestingLevelOfEqualBracketType : bracket.nestingLevel);
    }
    getInlineClassNameOfLevel(level) {
        // To support a dynamic amount of colors up to 6 colors,
        // we use a number that is a lcm of all numbers from 1 to 6.
        return `bracket-highlighting-${level % 30}`;
    }
}
(0,themeService/* registerThemingParticipant */.zy)((theme, collector) => {
    const colors = [
        editorColorRegistry/* editorBracketHighlightingForeground1 */.sN,
        editorColorRegistry/* editorBracketHighlightingForeground2 */.lQ,
        editorColorRegistry/* editorBracketHighlightingForeground3 */.ss,
        editorColorRegistry/* editorBracketHighlightingForeground4 */.l5,
        editorColorRegistry/* editorBracketHighlightingForeground5 */.sH,
        editorColorRegistry/* editorBracketHighlightingForeground6 */.zp
    ];
    const colorProvider = new ColorProvider();
    collector.addRule(`.monaco-editor .${colorProvider.unexpectedClosingBracketClassName} { color: ${theme.getColor(editorColorRegistry/* editorBracketHighlightingUnexpectedBracketForeground */.s7)}; }`);
    const colorValues = colors
        .map(c => theme.getColor(c))
        .filter((c) => !!c)
        .filter(c => !c.isTransparent());
    for (let level = 0; level < 30; level++) {
        const color = colorValues[level % colorValues.length];
        collector.addRule(`.monaco-editor .${colorProvider.getInlineClassNameOfLevel(level)} { color: ${color}; }`);
    }
});

// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/editor/common/model/editStack.js
var editStack = __webpack_require__(54296);
// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/editor/common/model/guidesTextModelPart.js
var guidesTextModelPart = __webpack_require__(52818);
;// ./node_modules/monaco-editor/esm/vs/editor/common/model/indentationGuesser.js
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
class SpacesDiffResult {
    constructor() {
        this.spacesDiff = 0;
        this.looksLikeAlignment = false;
    }
}
/**
 * Compute the diff in spaces between two line's indentation.
 */
function spacesDiff(a, aLength, b, bLength, result) {
    result.spacesDiff = 0;
    result.looksLikeAlignment = false;
    // This can go both ways (e.g.):
    //  - a: "\t"
    //  - b: "\t    "
    //  => This should count 1 tab and 4 spaces
    let i;
    for (i = 0; i < aLength && i < bLength; i++) {
        const aCharCode = a.charCodeAt(i);
        const bCharCode = b.charCodeAt(i);
        if (aCharCode !== bCharCode) {
            break;
        }
    }
    let aSpacesCnt = 0, aTabsCount = 0;
    for (let j = i; j < aLength; j++) {
        const aCharCode = a.charCodeAt(j);
        if (aCharCode === 32 /* CharCode.Space */) {
            aSpacesCnt++;
        }
        else {
            aTabsCount++;
        }
    }
    let bSpacesCnt = 0, bTabsCount = 0;
    for (let j = i; j < bLength; j++) {
        const bCharCode = b.charCodeAt(j);
        if (bCharCode === 32 /* CharCode.Space */) {
            bSpacesCnt++;
        }
        else {
            bTabsCount++;
        }
    }
    if (aSpacesCnt > 0 && aTabsCount > 0) {
        return;
    }
    if (bSpacesCnt > 0 && bTabsCount > 0) {
        return;
    }
    const tabsDiff = Math.abs(aTabsCount - bTabsCount);
    const spacesDiff = Math.abs(aSpacesCnt - bSpacesCnt);
    if (tabsDiff === 0) {
        // check if the indentation difference might be caused by alignment reasons
        // sometime folks like to align their code, but this should not be used as a hint
        result.spacesDiff = spacesDiff;
        if (spacesDiff > 0 && 0 <= bSpacesCnt - 1 && bSpacesCnt - 1 < a.length && bSpacesCnt < b.length) {
            if (b.charCodeAt(bSpacesCnt) !== 32 /* CharCode.Space */ && a.charCodeAt(bSpacesCnt - 1) === 32 /* CharCode.Space */) {
                if (a.charCodeAt(a.length - 1) === 44 /* CharCode.Comma */) {
                    // This looks like an alignment desire: e.g.
                    // const a = b + c,
                    //       d = b - c;
                    result.looksLikeAlignment = true;
                }
            }
        }
        return;
    }
    if (spacesDiff % tabsDiff === 0) {
        result.spacesDiff = spacesDiff / tabsDiff;
        return;
    }
}
function guessIndentation(source, defaultTabSize, defaultInsertSpaces) {
    // Look at most at the first 10k lines
    const linesCount = Math.min(source.getLineCount(), 10000);
    let linesIndentedWithTabsCount = 0; // number of lines that contain at least one tab in indentation
    let linesIndentedWithSpacesCount = 0; // number of lines that contain only spaces in indentation
    let previousLineText = ''; // content of latest line that contained non-whitespace chars
    let previousLineIndentation = 0; // index at which latest line contained the first non-whitespace char
    const ALLOWED_TAB_SIZE_GUESSES = [2, 4, 6, 8, 3, 5, 7]; // prefer even guesses for `tabSize`, limit to [2, 8].
    const MAX_ALLOWED_TAB_SIZE_GUESS = 8; // max(ALLOWED_TAB_SIZE_GUESSES) = 8
    const spacesDiffCount = [0, 0, 0, 0, 0, 0, 0, 0, 0]; // `tabSize` scores
    const tmp = new SpacesDiffResult();
    for (let lineNumber = 1; lineNumber <= linesCount; lineNumber++) {
        const currentLineLength = source.getLineLength(lineNumber);
        const currentLineText = source.getLineContent(lineNumber);
        // if the text buffer is chunk based, so long lines are cons-string, v8 will flattern the string when we check charCode.
        // checking charCode on chunks directly is cheaper.
        const useCurrentLineText = (currentLineLength <= 65536);
        let currentLineHasContent = false; // does `currentLineText` contain non-whitespace chars
        let currentLineIndentation = 0; // index at which `currentLineText` contains the first non-whitespace char
        let currentLineSpacesCount = 0; // count of spaces found in `currentLineText` indentation
        let currentLineTabsCount = 0; // count of tabs found in `currentLineText` indentation
        for (let j = 0, lenJ = currentLineLength; j < lenJ; j++) {
            const charCode = (useCurrentLineText ? currentLineText.charCodeAt(j) : source.getLineCharCode(lineNumber, j));
            if (charCode === 9 /* CharCode.Tab */) {
                currentLineTabsCount++;
            }
            else if (charCode === 32 /* CharCode.Space */) {
                currentLineSpacesCount++;
            }
            else {
                // Hit non whitespace character on this line
                currentLineHasContent = true;
                currentLineIndentation = j;
                break;
            }
        }
        // Ignore empty or only whitespace lines
        if (!currentLineHasContent) {
            continue;
        }
        if (currentLineTabsCount > 0) {
            linesIndentedWithTabsCount++;
        }
        else if (currentLineSpacesCount > 1) {
            linesIndentedWithSpacesCount++;
        }
        spacesDiff(previousLineText, previousLineIndentation, currentLineText, currentLineIndentation, tmp);
        if (tmp.looksLikeAlignment) {
            // if defaultInsertSpaces === true && the spaces count == tabSize, we may want to count it as valid indentation
            //
            // - item1
            //   - item2
            //
            // otherwise skip this line entirely
            //
            // const a = 1,
            //       b = 2;
            if (!(defaultInsertSpaces && defaultTabSize === tmp.spacesDiff)) {
                continue;
            }
        }
        const currentSpacesDiff = tmp.spacesDiff;
        if (currentSpacesDiff <= MAX_ALLOWED_TAB_SIZE_GUESS) {
            spacesDiffCount[currentSpacesDiff]++;
        }
        previousLineText = currentLineText;
        previousLineIndentation = currentLineIndentation;
    }
    let insertSpaces = defaultInsertSpaces;
    if (linesIndentedWithTabsCount !== linesIndentedWithSpacesCount) {
        insertSpaces = (linesIndentedWithTabsCount < linesIndentedWithSpacesCount);
    }
    let tabSize = defaultTabSize;
    // Guess tabSize only if inserting spaces...
    if (insertSpaces) {
        let tabSizeScore = (insertSpaces ? 0 : 0.1 * linesCount);
        // console.log("score threshold: " + tabSizeScore);
        ALLOWED_TAB_SIZE_GUESSES.forEach((possibleTabSize) => {
            const possibleTabSizeScore = spacesDiffCount[possibleTabSize];
            if (possibleTabSizeScore > tabSizeScore) {
                tabSizeScore = possibleTabSizeScore;
                tabSize = possibleTabSize;
            }
        });
        // Let a tabSize of 2 win even if it is not the maximum
        // (only in case 4 was guessed)
        if (tabSize === 4 && spacesDiffCount[4] > 0 && spacesDiffCount[2] > 0 && spacesDiffCount[2] >= spacesDiffCount[4] / 2) {
            tabSize = 2;
        }
    }
    // console.log('--------------------------');
    // console.log('linesIndentedWithTabsCount: ' + linesIndentedWithTabsCount + ', linesIndentedWithSpacesCount: ' + linesIndentedWithSpacesCount);
    // console.log('spacesDiffCount: ' + spacesDiffCount);
    // console.log('tabSize: ' + tabSize + ', tabSizeScore: ' + tabSizeScore);
    return {
        insertSpaces: insertSpaces,
        tabSize: tabSize
    };
}

;// ./node_modules/monaco-editor/esm/vs/editor/common/model/intervalTree.js
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
function getNodeColor(node) {
    return ((node.metadata & 1 /* Constants.ColorMask */) >>> 0 /* Constants.ColorOffset */);
}
function setNodeColor(node, color) {
    node.metadata = ((node.metadata & 254 /* Constants.ColorMaskInverse */) | (color << 0 /* Constants.ColorOffset */));
}
function getNodeIsVisited(node) {
    return ((node.metadata & 2 /* Constants.IsVisitedMask */) >>> 1 /* Constants.IsVisitedOffset */) === 1;
}
function setNodeIsVisited(node, value) {
    node.metadata = ((node.metadata & 253 /* Constants.IsVisitedMaskInverse */) | ((value ? 1 : 0) << 1 /* Constants.IsVisitedOffset */));
}
function getNodeIsForValidation(node) {
    return ((node.metadata & 4 /* Constants.IsForValidationMask */) >>> 2 /* Constants.IsForValidationOffset */) === 1;
}
function setNodeIsForValidation(node, value) {
    node.metadata = ((node.metadata & 251 /* Constants.IsForValidationMaskInverse */) | ((value ? 1 : 0) << 2 /* Constants.IsForValidationOffset */));
}
function getNodeIsInGlyphMargin(node) {
    return ((node.metadata & 64 /* Constants.IsMarginMask */) >>> 6 /* Constants.IsMarginOffset */) === 1;
}
function setNodeIsInGlyphMargin(node, value) {
    node.metadata = ((node.metadata & 191 /* Constants.IsMarginMaskInverse */) | ((value ? 1 : 0) << 6 /* Constants.IsMarginOffset */));
}
function getNodeStickiness(node) {
    return ((node.metadata & 24 /* Constants.StickinessMask */) >>> 3 /* Constants.StickinessOffset */);
}
function _setNodeStickiness(node, stickiness) {
    node.metadata = ((node.metadata & 231 /* Constants.StickinessMaskInverse */) | (stickiness << 3 /* Constants.StickinessOffset */));
}
function getCollapseOnReplaceEdit(node) {
    return ((node.metadata & 32 /* Constants.CollapseOnReplaceEditMask */) >>> 5 /* Constants.CollapseOnReplaceEditOffset */) === 1;
}
function setCollapseOnReplaceEdit(node, value) {
    node.metadata = ((node.metadata & 223 /* Constants.CollapseOnReplaceEditMaskInverse */) | ((value ? 1 : 0) << 5 /* Constants.CollapseOnReplaceEditOffset */));
}
class IntervalNode {
    constructor(id, start, end) {
        this.metadata = 0;
        this.parent = this;
        this.left = this;
        this.right = this;
        setNodeColor(this, 1 /* NodeColor.Red */);
        this.start = start;
        this.end = end;
        // FORCE_OVERFLOWING_TEST: this.delta = start;
        this.delta = 0;
        this.maxEnd = end;
        this.id = id;
        this.ownerId = 0;
        this.options = null;
        setNodeIsForValidation(this, false);
        setNodeIsInGlyphMargin(this, false);
        _setNodeStickiness(this, 1 /* TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges */);
        setCollapseOnReplaceEdit(this, false);
        this.cachedVersionId = 0;
        this.cachedAbsoluteStart = start;
        this.cachedAbsoluteEnd = end;
        this.range = null;
        setNodeIsVisited(this, false);
    }
    reset(versionId, start, end, range) {
        this.start = start;
        this.end = end;
        this.maxEnd = end;
        this.cachedVersionId = versionId;
        this.cachedAbsoluteStart = start;
        this.cachedAbsoluteEnd = end;
        this.range = range;
    }
    setOptions(options) {
        this.options = options;
        const className = this.options.className;
        setNodeIsForValidation(this, (className === "squiggly-error" /* ClassName.EditorErrorDecoration */
            || className === "squiggly-warning" /* ClassName.EditorWarningDecoration */
            || className === "squiggly-info" /* ClassName.EditorInfoDecoration */));
        setNodeIsInGlyphMargin(this, this.options.glyphMarginClassName !== null);
        _setNodeStickiness(this, this.options.stickiness);
        setCollapseOnReplaceEdit(this, this.options.collapseOnReplaceEdit);
    }
    setCachedOffsets(absoluteStart, absoluteEnd, cachedVersionId) {
        if (this.cachedVersionId !== cachedVersionId) {
            this.range = null;
        }
        this.cachedVersionId = cachedVersionId;
        this.cachedAbsoluteStart = absoluteStart;
        this.cachedAbsoluteEnd = absoluteEnd;
    }
    detach() {
        this.parent = null;
        this.left = null;
        this.right = null;
    }
}
const SENTINEL = new IntervalNode(null, 0, 0);
SENTINEL.parent = SENTINEL;
SENTINEL.left = SENTINEL;
SENTINEL.right = SENTINEL;
setNodeColor(SENTINEL, 0 /* NodeColor.Black */);
class IntervalTree {
    constructor() {
        this.root = SENTINEL;
        this.requestNormalizeDelta = false;
    }
    intervalSearch(start, end, filterOwnerId, filterOutValidation, cachedVersionId, onlyMarginDecorations) {
        if (this.root === SENTINEL) {
            return [];
        }
        return intervalSearch(this, start, end, filterOwnerId, filterOutValidation, cachedVersionId, onlyMarginDecorations);
    }
    search(filterOwnerId, filterOutValidation, cachedVersionId, onlyMarginDecorations) {
        if (this.root === SENTINEL) {
            return [];
        }
        return search(this, filterOwnerId, filterOutValidation, cachedVersionId, onlyMarginDecorations);
    }
    /**
     * Will not set `cachedAbsoluteStart` nor `cachedAbsoluteEnd` on the returned nodes!
     */
    collectNodesFromOwner(ownerId) {
        return collectNodesFromOwner(this, ownerId);
    }
    /**
     * Will not set `cachedAbsoluteStart` nor `cachedAbsoluteEnd` on the returned nodes!
     */
    collectNodesPostOrder() {
        return collectNodesPostOrder(this);
    }
    insert(node) {
        rbTreeInsert(this, node);
        this._normalizeDeltaIfNecessary();
    }
    delete(node) {
        rbTreeDelete(this, node);
        this._normalizeDeltaIfNecessary();
    }
    resolveNode(node, cachedVersionId) {
        const initialNode = node;
        let delta = 0;
        while (node !== this.root) {
            if (node === node.parent.right) {
                delta += node.parent.delta;
            }
            node = node.parent;
        }
        const nodeStart = initialNode.start + delta;
        const nodeEnd = initialNode.end + delta;
        initialNode.setCachedOffsets(nodeStart, nodeEnd, cachedVersionId);
    }
    acceptReplace(offset, length, textLength, forceMoveMarkers) {
        // Our strategy is to remove all directly impacted nodes, and then add them back to the tree.
        // (1) collect all nodes that are intersecting this edit as nodes of interest
        const nodesOfInterest = searchForEditing(this, offset, offset + length);
        // (2) remove all nodes that are intersecting this edit
        for (let i = 0, len = nodesOfInterest.length; i < len; i++) {
            const node = nodesOfInterest[i];
            rbTreeDelete(this, node);
        }
        this._normalizeDeltaIfNecessary();
        // (3) edit all tree nodes except the nodes of interest
        noOverlapReplace(this, offset, offset + length, textLength);
        this._normalizeDeltaIfNecessary();
        // (4) edit the nodes of interest and insert them back in the tree
        for (let i = 0, len = nodesOfInterest.length; i < len; i++) {
            const node = nodesOfInterest[i];
            node.start = node.cachedAbsoluteStart;
            node.end = node.cachedAbsoluteEnd;
            nodeAcceptEdit(node, offset, (offset + length), textLength, forceMoveMarkers);
            node.maxEnd = node.end;
            rbTreeInsert(this, node);
        }
        this._normalizeDeltaIfNecessary();
    }
    _normalizeDeltaIfNecessary() {
        if (!this.requestNormalizeDelta) {
            return;
        }
        this.requestNormalizeDelta = false;
        normalizeDelta(this);
    }
}
//#region Delta Normalization
function normalizeDelta(T) {
    let node = T.root;
    let delta = 0;
    while (node !== SENTINEL) {
        if (node.left !== SENTINEL && !getNodeIsVisited(node.left)) {
            // go left
            node = node.left;
            continue;
        }
        if (node.right !== SENTINEL && !getNodeIsVisited(node.right)) {
            // go right
            delta += node.delta;
            node = node.right;
            continue;
        }
        // handle current node
        node.start = delta + node.start;
        node.end = delta + node.end;
        node.delta = 0;
        recomputeMaxEnd(node);
        setNodeIsVisited(node, true);
        // going up from this node
        setNodeIsVisited(node.left, false);
        setNodeIsVisited(node.right, false);
        if (node === node.parent.right) {
            delta -= node.parent.delta;
        }
        node = node.parent;
    }
    setNodeIsVisited(T.root, false);
}
function adjustMarkerBeforeColumn(markerOffset, markerStickToPreviousCharacter, checkOffset, moveSemantics) {
    if (markerOffset < checkOffset) {
        return true;
    }
    if (markerOffset > checkOffset) {
        return false;
    }
    if (moveSemantics === 1 /* MarkerMoveSemantics.ForceMove */) {
        return false;
    }
    if (moveSemantics === 2 /* MarkerMoveSemantics.ForceStay */) {
        return true;
    }
    return markerStickToPreviousCharacter;
}
/**
 * This is a lot more complicated than strictly necessary to maintain the same behaviour
 * as when decorations were implemented using two markers.
 */
function nodeAcceptEdit(node, start, end, textLength, forceMoveMarkers) {
    const nodeStickiness = getNodeStickiness(node);
    const startStickToPreviousCharacter = (nodeStickiness === 0 /* TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges */
        || nodeStickiness === 2 /* TrackedRangeStickiness.GrowsOnlyWhenTypingBefore */);
    const endStickToPreviousCharacter = (nodeStickiness === 1 /* TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges */
        || nodeStickiness === 2 /* TrackedRangeStickiness.GrowsOnlyWhenTypingBefore */);
    const deletingCnt = (end - start);
    const insertingCnt = textLength;
    const commonLength = Math.min(deletingCnt, insertingCnt);
    const nodeStart = node.start;
    let startDone = false;
    const nodeEnd = node.end;
    let endDone = false;
    if (start <= nodeStart && nodeEnd <= end && getCollapseOnReplaceEdit(node)) {
        // This edit encompasses the entire decoration range
        // and the decoration has asked to become collapsed
        node.start = start;
        startDone = true;
        node.end = start;
        endDone = true;
    }
    {
        const moveSemantics = forceMoveMarkers ? 1 /* MarkerMoveSemantics.ForceMove */ : (deletingCnt > 0 ? 2 /* MarkerMoveSemantics.ForceStay */ : 0 /* MarkerMoveSemantics.MarkerDefined */);
        if (!startDone && adjustMarkerBeforeColumn(nodeStart, startStickToPreviousCharacter, start, moveSemantics)) {
            startDone = true;
        }
        if (!endDone && adjustMarkerBeforeColumn(nodeEnd, endStickToPreviousCharacter, start, moveSemantics)) {
            endDone = true;
        }
    }
    if (commonLength > 0 && !forceMoveMarkers) {
        const moveSemantics = (deletingCnt > insertingCnt ? 2 /* MarkerMoveSemantics.ForceStay */ : 0 /* MarkerMoveSemantics.MarkerDefined */);
        if (!startDone && adjustMarkerBeforeColumn(nodeStart, startStickToPreviousCharacter, start + commonLength, moveSemantics)) {
            startDone = true;
        }
        if (!endDone && adjustMarkerBeforeColumn(nodeEnd, endStickToPreviousCharacter, start + commonLength, moveSemantics)) {
            endDone = true;
        }
    }
    {
        const moveSemantics = forceMoveMarkers ? 1 /* MarkerMoveSemantics.ForceMove */ : 0 /* MarkerMoveSemantics.MarkerDefined */;
        if (!startDone && adjustMarkerBeforeColumn(nodeStart, startStickToPreviousCharacter, end, moveSemantics)) {
            node.start = start + insertingCnt;
            startDone = true;
        }
        if (!endDone && adjustMarkerBeforeColumn(nodeEnd, endStickToPreviousCharacter, end, moveSemantics)) {
            node.end = start + insertingCnt;
            endDone = true;
        }
    }
    // Finish
    const deltaColumn = (insertingCnt - deletingCnt);
    if (!startDone) {
        node.start = Math.max(0, nodeStart + deltaColumn);
    }
    if (!endDone) {
        node.end = Math.max(0, nodeEnd + deltaColumn);
    }
    if (node.start > node.end) {
        node.end = node.start;
    }
}
function searchForEditing(T, start, end) {
    // https://en.wikipedia.org/wiki/Interval_tree#Augmented_tree
    // Now, it is known that two intervals A and B overlap only when both
    // A.low <= B.high and A.high >= B.low. When searching the trees for
    // nodes overlapping with a given interval, you can immediately skip:
    //  a) all nodes to the right of nodes whose low value is past the end of the given interval.
    //  b) all nodes that have their maximum 'high' value below the start of the given interval.
    let node = T.root;
    let delta = 0;
    let nodeMaxEnd = 0;
    let nodeStart = 0;
    let nodeEnd = 0;
    const result = [];
    let resultLen = 0;
    while (node !== SENTINEL) {
        if (getNodeIsVisited(node)) {
            // going up from this node
            setNodeIsVisited(node.left, false);
            setNodeIsVisited(node.right, false);
            if (node === node.parent.right) {
                delta -= node.parent.delta;
            }
            node = node.parent;
            continue;
        }
        if (!getNodeIsVisited(node.left)) {
            // first time seeing this node
            nodeMaxEnd = delta + node.maxEnd;
            if (nodeMaxEnd < start) {
                // cover case b) from above
                // there is no need to search this node or its children
                setNodeIsVisited(node, true);
                continue;
            }
            if (node.left !== SENTINEL) {
                // go left
                node = node.left;
                continue;
            }
        }
        // handle current node
        nodeStart = delta + node.start;
        if (nodeStart > end) {
            // cover case a) from above
            // there is no need to search this node or its right subtree
            setNodeIsVisited(node, true);
            continue;
        }
        nodeEnd = delta + node.end;
        if (nodeEnd >= start) {
            node.setCachedOffsets(nodeStart, nodeEnd, 0);
            result[resultLen++] = node;
        }
        setNodeIsVisited(node, true);
        if (node.right !== SENTINEL && !getNodeIsVisited(node.right)) {
            // go right
            delta += node.delta;
            node = node.right;
            continue;
        }
    }
    setNodeIsVisited(T.root, false);
    return result;
}
function noOverlapReplace(T, start, end, textLength) {
    // https://en.wikipedia.org/wiki/Interval_tree#Augmented_tree
    // Now, it is known that two intervals A and B overlap only when both
    // A.low <= B.high and A.high >= B.low. When searching the trees for
    // nodes overlapping with a given interval, you can immediately skip:
    //  a) all nodes to the right of nodes whose low value is past the end of the given interval.
    //  b) all nodes that have their maximum 'high' value below the start of the given interval.
    let node = T.root;
    let delta = 0;
    let nodeMaxEnd = 0;
    let nodeStart = 0;
    const editDelta = (textLength - (end - start));
    while (node !== SENTINEL) {
        if (getNodeIsVisited(node)) {
            // going up from this node
            setNodeIsVisited(node.left, false);
            setNodeIsVisited(node.right, false);
            if (node === node.parent.right) {
                delta -= node.parent.delta;
            }
            recomputeMaxEnd(node);
            node = node.parent;
            continue;
        }
        if (!getNodeIsVisited(node.left)) {
            // first time seeing this node
            nodeMaxEnd = delta + node.maxEnd;
            if (nodeMaxEnd < start) {
                // cover case b) from above
                // there is no need to search this node or its children
                setNodeIsVisited(node, true);
                continue;
            }
            if (node.left !== SENTINEL) {
                // go left
                node = node.left;
                continue;
            }
        }
        // handle current node
        nodeStart = delta + node.start;
        if (nodeStart > end) {
            node.start += editDelta;
            node.end += editDelta;
            node.delta += editDelta;
            if (node.delta < -1073741824 /* Constants.MIN_SAFE_DELTA */ || node.delta > 1073741824 /* Constants.MAX_SAFE_DELTA */) {
                T.requestNormalizeDelta = true;
            }
            // cover case a) from above
            // there is no need to search this node or its right subtree
            setNodeIsVisited(node, true);
            continue;
        }
        setNodeIsVisited(node, true);
        if (node.right !== SENTINEL && !getNodeIsVisited(node.right)) {
            // go right
            delta += node.delta;
            node = node.right;
            continue;
        }
    }
    setNodeIsVisited(T.root, false);
}
//#endregion
//#region Searching
function collectNodesFromOwner(T, ownerId) {
    let node = T.root;
    const result = [];
    let resultLen = 0;
    while (node !== SENTINEL) {
        if (getNodeIsVisited(node)) {
            // going up from this node
            setNodeIsVisited(node.left, false);
            setNodeIsVisited(node.right, false);
            node = node.parent;
            continue;
        }
        if (node.left !== SENTINEL && !getNodeIsVisited(node.left)) {
            // go left
            node = node.left;
            continue;
        }
        // handle current node
        if (node.ownerId === ownerId) {
            result[resultLen++] = node;
        }
        setNodeIsVisited(node, true);
        if (node.right !== SENTINEL && !getNodeIsVisited(node.right)) {
            // go right
            node = node.right;
            continue;
        }
    }
    setNodeIsVisited(T.root, false);
    return result;
}
function collectNodesPostOrder(T) {
    let node = T.root;
    const result = [];
    let resultLen = 0;
    while (node !== SENTINEL) {
        if (getNodeIsVisited(node)) {
            // going up from this node
            setNodeIsVisited(node.left, false);
            setNodeIsVisited(node.right, false);
            node = node.parent;
            continue;
        }
        if (node.left !== SENTINEL && !getNodeIsVisited(node.left)) {
            // go left
            node = node.left;
            continue;
        }
        if (node.right !== SENTINEL && !getNodeIsVisited(node.right)) {
            // go right
            node = node.right;
            continue;
        }
        // handle current node
        result[resultLen++] = node;
        setNodeIsVisited(node, true);
    }
    setNodeIsVisited(T.root, false);
    return result;
}
function search(T, filterOwnerId, filterOutValidation, cachedVersionId, onlyMarginDecorations) {
    let node = T.root;
    let delta = 0;
    let nodeStart = 0;
    let nodeEnd = 0;
    const result = [];
    let resultLen = 0;
    while (node !== SENTINEL) {
        if (getNodeIsVisited(node)) {
            // going up from this node
            setNodeIsVisited(node.left, false);
            setNodeIsVisited(node.right, false);
            if (node === node.parent.right) {
                delta -= node.parent.delta;
            }
            node = node.parent;
            continue;
        }
        if (node.left !== SENTINEL && !getNodeIsVisited(node.left)) {
            // go left
            node = node.left;
            continue;
        }
        // handle current node
        nodeStart = delta + node.start;
        nodeEnd = delta + node.end;
        node.setCachedOffsets(nodeStart, nodeEnd, cachedVersionId);
        let include = true;
        if (filterOwnerId && node.ownerId && node.ownerId !== filterOwnerId) {
            include = false;
        }
        if (filterOutValidation && getNodeIsForValidation(node)) {
            include = false;
        }
        if (onlyMarginDecorations && !getNodeIsInGlyphMargin(node)) {
            include = false;
        }
        if (include) {
            result[resultLen++] = node;
        }
        setNodeIsVisited(node, true);
        if (node.right !== SENTINEL && !getNodeIsVisited(node.right)) {
            // go right
            delta += node.delta;
            node = node.right;
            continue;
        }
    }
    setNodeIsVisited(T.root, false);
    return result;
}
function intervalSearch(T, intervalStart, intervalEnd, filterOwnerId, filterOutValidation, cachedVersionId, onlyMarginDecorations) {
    // https://en.wikipedia.org/wiki/Interval_tree#Augmented_tree
    // Now, it is known that two intervals A and B overlap only when both
    // A.low <= B.high and A.high >= B.low. When searching the trees for
    // nodes overlapping with a given interval, you can immediately skip:
    //  a) all nodes to the right of nodes whose low value is past the end of the given interval.
    //  b) all nodes that have their maximum 'high' value below the start of the given interval.
    let node = T.root;
    let delta = 0;
    let nodeMaxEnd = 0;
    let nodeStart = 0;
    let nodeEnd = 0;
    const result = [];
    let resultLen = 0;
    while (node !== SENTINEL) {
        if (getNodeIsVisited(node)) {
            // going up from this node
            setNodeIsVisited(node.left, false);
            setNodeIsVisited(node.right, false);
            if (node === node.parent.right) {
                delta -= node.parent.delta;
            }
            node = node.parent;
            continue;
        }
        if (!getNodeIsVisited(node.left)) {
            // first time seeing this node
            nodeMaxEnd = delta + node.maxEnd;
            if (nodeMaxEnd < intervalStart) {
                // cover case b) from above
                // there is no need to search this node or its children
                setNodeIsVisited(node, true);
                continue;
            }
            if (node.left !== SENTINEL) {
                // go left
                node = node.left;
                continue;
            }
        }
        // handle current node
        nodeStart = delta + node.start;
        if (nodeStart > intervalEnd) {
            // cover case a) from above
            // there is no need to search this node or its right subtree
            setNodeIsVisited(node, true);
            continue;
        }
        nodeEnd = delta + node.end;
        if (nodeEnd >= intervalStart) {
            // There is overlap
            node.setCachedOffsets(nodeStart, nodeEnd, cachedVersionId);
            let include = true;
            if (filterOwnerId && node.ownerId && node.ownerId !== filterOwnerId) {
                include = false;
            }
            if (filterOutValidation && getNodeIsForValidation(node)) {
                include = false;
            }
            if (onlyMarginDecorations && !getNodeIsInGlyphMargin(node)) {
                include = false;
            }
            if (include) {
                result[resultLen++] = node;
            }
        }
        setNodeIsVisited(node, true);
        if (node.right !== SENTINEL && !getNodeIsVisited(node.right)) {
            // go right
            delta += node.delta;
            node = node.right;
            continue;
        }
    }
    setNodeIsVisited(T.root, false);
    return result;
}
//#endregion
//#region Insertion
function rbTreeInsert(T, newNode) {
    if (T.root === SENTINEL) {
        newNode.parent = SENTINEL;
        newNode.left = SENTINEL;
        newNode.right = SENTINEL;
        setNodeColor(newNode, 0 /* NodeColor.Black */);
        T.root = newNode;
        return T.root;
    }
    treeInsert(T, newNode);
    recomputeMaxEndWalkToRoot(newNode.parent);
    // repair tree
    let x = newNode;
    while (x !== T.root && getNodeColor(x.parent) === 1 /* NodeColor.Red */) {
        if (x.parent === x.parent.parent.left) {
            const y = x.parent.parent.right;
            if (getNodeColor(y) === 1 /* NodeColor.Red */) {
                setNodeColor(x.parent, 0 /* NodeColor.Black */);
                setNodeColor(y, 0 /* NodeColor.Black */);
                setNodeColor(x.parent.parent, 1 /* NodeColor.Red */);
                x = x.parent.parent;
            }
            else {
                if (x === x.parent.right) {
                    x = x.parent;
                    leftRotate(T, x);
                }
                setNodeColor(x.parent, 0 /* NodeColor.Black */);
                setNodeColor(x.parent.parent, 1 /* NodeColor.Red */);
                rightRotate(T, x.parent.parent);
            }
        }
        else {
            const y = x.parent.parent.left;
            if (getNodeColor(y) === 1 /* NodeColor.Red */) {
                setNodeColor(x.parent, 0 /* NodeColor.Black */);
                setNodeColor(y, 0 /* NodeColor.Black */);
                setNodeColor(x.parent.parent, 1 /* NodeColor.Red */);
                x = x.parent.parent;
            }
            else {
                if (x === x.parent.left) {
                    x = x.parent;
                    rightRotate(T, x);
                }
                setNodeColor(x.parent, 0 /* NodeColor.Black */);
                setNodeColor(x.parent.parent, 1 /* NodeColor.Red */);
                leftRotate(T, x.parent.parent);
            }
        }
    }
    setNodeColor(T.root, 0 /* NodeColor.Black */);
    return newNode;
}
function treeInsert(T, z) {
    let delta = 0;
    let x = T.root;
    const zAbsoluteStart = z.start;
    const zAbsoluteEnd = z.end;
    while (true) {
        const cmp = intervalCompare(zAbsoluteStart, zAbsoluteEnd, x.start + delta, x.end + delta);
        if (cmp < 0) {
            // this node should be inserted to the left
            // => it is not affected by the node's delta
            if (x.left === SENTINEL) {
                z.start -= delta;
                z.end -= delta;
                z.maxEnd -= delta;
                x.left = z;
                break;
            }
            else {
                x = x.left;
            }
        }
        else {
            // this node should be inserted to the right
            // => it is not affected by the node's delta
            if (x.right === SENTINEL) {
                z.start -= (delta + x.delta);
                z.end -= (delta + x.delta);
                z.maxEnd -= (delta + x.delta);
                x.right = z;
                break;
            }
            else {
                delta += x.delta;
                x = x.right;
            }
        }
    }
    z.parent = x;
    z.left = SENTINEL;
    z.right = SENTINEL;
    setNodeColor(z, 1 /* NodeColor.Red */);
}
//#endregion
//#region Deletion
function rbTreeDelete(T, z) {
    let x;
    let y;
    // RB-DELETE except we don't swap z and y in case c)
    // i.e. we always delete what's pointed at by z.
    if (z.left === SENTINEL) {
        x = z.right;
        y = z;
        // x's delta is no longer influenced by z's delta
        x.delta += z.delta;
        if (x.delta < -1073741824 /* Constants.MIN_SAFE_DELTA */ || x.delta > 1073741824 /* Constants.MAX_SAFE_DELTA */) {
            T.requestNormalizeDelta = true;
        }
        x.start += z.delta;
        x.end += z.delta;
    }
    else if (z.right === SENTINEL) {
        x = z.left;
        y = z;
    }
    else {
        y = leftest(z.right);
        x = y.right;
        // y's delta is no longer influenced by z's delta,
        // but we don't want to walk the entire right-hand-side subtree of x.
        // we therefore maintain z's delta in y, and adjust only x
        x.start += y.delta;
        x.end += y.delta;
        x.delta += y.delta;
        if (x.delta < -1073741824 /* Constants.MIN_SAFE_DELTA */ || x.delta > 1073741824 /* Constants.MAX_SAFE_DELTA */) {
            T.requestNormalizeDelta = true;
        }
        y.start += z.delta;
        y.end += z.delta;
        y.delta = z.delta;
        if (y.delta < -1073741824 /* Constants.MIN_SAFE_DELTA */ || y.delta > 1073741824 /* Constants.MAX_SAFE_DELTA */) {
            T.requestNormalizeDelta = true;
        }
    }
    if (y === T.root) {
        T.root = x;
        setNodeColor(x, 0 /* NodeColor.Black */);
        z.detach();
        resetSentinel();
        recomputeMaxEnd(x);
        T.root.parent = SENTINEL;
        return;
    }
    const yWasRed = (getNodeColor(y) === 1 /* NodeColor.Red */);
    if (y === y.parent.left) {
        y.parent.left = x;
    }
    else {
        y.parent.right = x;
    }
    if (y === z) {
        x.parent = y.parent;
    }
    else {
        if (y.parent === z) {
            x.parent = y;
        }
        else {
            x.parent = y.parent;
        }
        y.left = z.left;
        y.right = z.right;
        y.parent = z.parent;
        setNodeColor(y, getNodeColor(z));
        if (z === T.root) {
            T.root = y;
        }
        else {
            if (z === z.parent.left) {
                z.parent.left = y;
            }
            else {
                z.parent.right = y;
            }
        }
        if (y.left !== SENTINEL) {
            y.left.parent = y;
        }
        if (y.right !== SENTINEL) {
            y.right.parent = y;
        }
    }
    z.detach();
    if (yWasRed) {
        recomputeMaxEndWalkToRoot(x.parent);
        if (y !== z) {
            recomputeMaxEndWalkToRoot(y);
            recomputeMaxEndWalkToRoot(y.parent);
        }
        resetSentinel();
        return;
    }
    recomputeMaxEndWalkToRoot(x);
    recomputeMaxEndWalkToRoot(x.parent);
    if (y !== z) {
        recomputeMaxEndWalkToRoot(y);
        recomputeMaxEndWalkToRoot(y.parent);
    }
    // RB-DELETE-FIXUP
    let w;
    while (x !== T.root && getNodeColor(x) === 0 /* NodeColor.Black */) {
        if (x === x.parent.left) {
            w = x.parent.right;
            if (getNodeColor(w) === 1 /* NodeColor.Red */) {
                setNodeColor(w, 0 /* NodeColor.Black */);
                setNodeColor(x.parent, 1 /* NodeColor.Red */);
                leftRotate(T, x.parent);
                w = x.parent.right;
            }
            if (getNodeColor(w.left) === 0 /* NodeColor.Black */ && getNodeColor(w.right) === 0 /* NodeColor.Black */) {
                setNodeColor(w, 1 /* NodeColor.Red */);
                x = x.parent;
            }
            else {
                if (getNodeColor(w.right) === 0 /* NodeColor.Black */) {
                    setNodeColor(w.left, 0 /* NodeColor.Black */);
                    setNodeColor(w, 1 /* NodeColor.Red */);
                    rightRotate(T, w);
                    w = x.parent.right;
                }
                setNodeColor(w, getNodeColor(x.parent));
                setNodeColor(x.parent, 0 /* NodeColor.Black */);
                setNodeColor(w.right, 0 /* NodeColor.Black */);
                leftRotate(T, x.parent);
                x = T.root;
            }
        }
        else {
            w = x.parent.left;
            if (getNodeColor(w) === 1 /* NodeColor.Red */) {
                setNodeColor(w, 0 /* NodeColor.Black */);
                setNodeColor(x.parent, 1 /* NodeColor.Red */);
                rightRotate(T, x.parent);
                w = x.parent.left;
            }
            if (getNodeColor(w.left) === 0 /* NodeColor.Black */ && getNodeColor(w.right) === 0 /* NodeColor.Black */) {
                setNodeColor(w, 1 /* NodeColor.Red */);
                x = x.parent;
            }
            else {
                if (getNodeColor(w.left) === 0 /* NodeColor.Black */) {
                    setNodeColor(w.right, 0 /* NodeColor.Black */);
                    setNodeColor(w, 1 /* NodeColor.Red */);
                    leftRotate(T, w);
                    w = x.parent.left;
                }
                setNodeColor(w, getNodeColor(x.parent));
                setNodeColor(x.parent, 0 /* NodeColor.Black */);
                setNodeColor(w.left, 0 /* NodeColor.Black */);
                rightRotate(T, x.parent);
                x = T.root;
            }
        }
    }
    setNodeColor(x, 0 /* NodeColor.Black */);
    resetSentinel();
}
function leftest(node) {
    while (node.left !== SENTINEL) {
        node = node.left;
    }
    return node;
}
function resetSentinel() {
    SENTINEL.parent = SENTINEL;
    SENTINEL.delta = 0; // optional
    SENTINEL.start = 0; // optional
    SENTINEL.end = 0; // optional
}
//#endregion
//#region Rotations
function leftRotate(T, x) {
    const y = x.right; // set y.
    y.delta += x.delta; // y's delta is no longer influenced by x's delta
    if (y.delta < -1073741824 /* Constants.MIN_SAFE_DELTA */ || y.delta > 1073741824 /* Constants.MAX_SAFE_DELTA */) {
        T.requestNormalizeDelta = true;
    }
    y.start += x.delta;
    y.end += x.delta;
    x.right = y.left; // turn y's left subtree into x's right subtree.
    if (y.left !== SENTINEL) {
        y.left.parent = x;
    }
    y.parent = x.parent; // link x's parent to y.
    if (x.parent === SENTINEL) {
        T.root = y;
    }
    else if (x === x.parent.left) {
        x.parent.left = y;
    }
    else {
        x.parent.right = y;
    }
    y.left = x; // put x on y's left.
    x.parent = y;
    recomputeMaxEnd(x);
    recomputeMaxEnd(y);
}
function rightRotate(T, y) {
    const x = y.left;
    y.delta -= x.delta;
    if (y.delta < -1073741824 /* Constants.MIN_SAFE_DELTA */ || y.delta > 1073741824 /* Constants.MAX_SAFE_DELTA */) {
        T.requestNormalizeDelta = true;
    }
    y.start -= x.delta;
    y.end -= x.delta;
    y.left = x.right;
    if (x.right !== SENTINEL) {
        x.right.parent = y;
    }
    x.parent = y.parent;
    if (y.parent === SENTINEL) {
        T.root = x;
    }
    else if (y === y.parent.right) {
        y.parent.right = x;
    }
    else {
        y.parent.left = x;
    }
    x.right = y;
    y.parent = x;
    recomputeMaxEnd(y);
    recomputeMaxEnd(x);
}
//#endregion
//#region max end computation
function computeMaxEnd(node) {
    let maxEnd = node.end;
    if (node.left !== SENTINEL) {
        const leftMaxEnd = node.left.maxEnd;
        if (leftMaxEnd > maxEnd) {
            maxEnd = leftMaxEnd;
        }
    }
    if (node.right !== SENTINEL) {
        const rightMaxEnd = node.right.maxEnd + node.delta;
        if (rightMaxEnd > maxEnd) {
            maxEnd = rightMaxEnd;
        }
    }
    return maxEnd;
}
function recomputeMaxEnd(node) {
    node.maxEnd = computeMaxEnd(node);
}
function recomputeMaxEndWalkToRoot(node) {
    while (node !== SENTINEL) {
        const maxEnd = computeMaxEnd(node);
        if (node.maxEnd === maxEnd) {
            // no need to go further
            return;
        }
        node.maxEnd = maxEnd;
        node = node.parent;
    }
}
//#endregion
//#region utils
function intervalCompare(aStart, aEnd, bStart, bEnd) {
    if (aStart === bStart) {
        return aEnd - bEnd;
    }
    return aStart - bStart;
}
//#endregion

;// ./node_modules/monaco-editor/esm/vs/editor/common/model/pieceTreeTextBuffer/rbTreeBase.js
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
class TreeNode {
    constructor(piece, color) {
        this.piece = piece;
        this.color = color;
        this.size_left = 0;
        this.lf_left = 0;
        this.parent = this;
        this.left = this;
        this.right = this;
    }
    next() {
        if (this.right !== rbTreeBase_SENTINEL) {
            return rbTreeBase_leftest(this.right);
        }
        let node = this;
        while (node.parent !== rbTreeBase_SENTINEL) {
            if (node.parent.left === node) {
                break;
            }
            node = node.parent;
        }
        if (node.parent === rbTreeBase_SENTINEL) {
            return rbTreeBase_SENTINEL;
        }
        else {
            return node.parent;
        }
    }
    prev() {
        if (this.left !== rbTreeBase_SENTINEL) {
            return righttest(this.left);
        }
        let node = this;
        while (node.parent !== rbTreeBase_SENTINEL) {
            if (node.parent.right === node) {
                break;
            }
            node = node.parent;
        }
        if (node.parent === rbTreeBase_SENTINEL) {
            return rbTreeBase_SENTINEL;
        }
        else {
            return node.parent;
        }
    }
    detach() {
        this.parent = null;
        this.left = null;
        this.right = null;
    }
}
const rbTreeBase_SENTINEL = new TreeNode(null, 0 /* NodeColor.Black */);
rbTreeBase_SENTINEL.parent = rbTreeBase_SENTINEL;
rbTreeBase_SENTINEL.left = rbTreeBase_SENTINEL;
rbTreeBase_SENTINEL.right = rbTreeBase_SENTINEL;
rbTreeBase_SENTINEL.color = 0 /* NodeColor.Black */;
function rbTreeBase_leftest(node) {
    while (node.left !== rbTreeBase_SENTINEL) {
        node = node.left;
    }
    return node;
}
function righttest(node) {
    while (node.right !== rbTreeBase_SENTINEL) {
        node = node.right;
    }
    return node;
}
function calculateSize(node) {
    if (node === rbTreeBase_SENTINEL) {
        return 0;
    }
    return node.size_left + node.piece.length + calculateSize(node.right);
}
function calculateLF(node) {
    if (node === rbTreeBase_SENTINEL) {
        return 0;
    }
    return node.lf_left + node.piece.lineFeedCnt + calculateLF(node.right);
}
function rbTreeBase_resetSentinel() {
    rbTreeBase_SENTINEL.parent = rbTreeBase_SENTINEL;
}
function rbTreeBase_leftRotate(tree, x) {
    const y = x.right;
    // fix size_left
    y.size_left += x.size_left + (x.piece ? x.piece.length : 0);
    y.lf_left += x.lf_left + (x.piece ? x.piece.lineFeedCnt : 0);
    x.right = y.left;
    if (y.left !== rbTreeBase_SENTINEL) {
        y.left.parent = x;
    }
    y.parent = x.parent;
    if (x.parent === rbTreeBase_SENTINEL) {
        tree.root = y;
    }
    else if (x.parent.left === x) {
        x.parent.left = y;
    }
    else {
        x.parent.right = y;
    }
    y.left = x;
    x.parent = y;
}
function rbTreeBase_rightRotate(tree, y) {
    const x = y.left;
    y.left = x.right;
    if (x.right !== rbTreeBase_SENTINEL) {
        x.right.parent = y;
    }
    x.parent = y.parent;
    // fix size_left
    y.size_left -= x.size_left + (x.piece ? x.piece.length : 0);
    y.lf_left -= x.lf_left + (x.piece ? x.piece.lineFeedCnt : 0);
    if (y.parent === rbTreeBase_SENTINEL) {
        tree.root = x;
    }
    else if (y === y.parent.right) {
        y.parent.right = x;
    }
    else {
        y.parent.left = x;
    }
    x.right = y;
    y.parent = x;
}
function rbDelete(tree, z) {
    let x;
    let y;
    if (z.left === rbTreeBase_SENTINEL) {
        y = z;
        x = y.right;
    }
    else if (z.right === rbTreeBase_SENTINEL) {
        y = z;
        x = y.left;
    }
    else {
        y = rbTreeBase_leftest(z.right);
        x = y.right;
    }
    if (y === tree.root) {
        tree.root = x;
        // if x is null, we are removing the only node
        x.color = 0 /* NodeColor.Black */;
        z.detach();
        rbTreeBase_resetSentinel();
        tree.root.parent = rbTreeBase_SENTINEL;
        return;
    }
    const yWasRed = (y.color === 1 /* NodeColor.Red */);
    if (y === y.parent.left) {
        y.parent.left = x;
    }
    else {
        y.parent.right = x;
    }
    if (y === z) {
        x.parent = y.parent;
        recomputeTreeMetadata(tree, x);
    }
    else {
        if (y.parent === z) {
            x.parent = y;
        }
        else {
            x.parent = y.parent;
        }
        // as we make changes to x's hierarchy, update size_left of subtree first
        recomputeTreeMetadata(tree, x);
        y.left = z.left;
        y.right = z.right;
        y.parent = z.parent;
        y.color = z.color;
        if (z === tree.root) {
            tree.root = y;
        }
        else {
            if (z === z.parent.left) {
                z.parent.left = y;
            }
            else {
                z.parent.right = y;
            }
        }
        if (y.left !== rbTreeBase_SENTINEL) {
            y.left.parent = y;
        }
        if (y.right !== rbTreeBase_SENTINEL) {
            y.right.parent = y;
        }
        // update metadata
        // we replace z with y, so in this sub tree, the length change is z.item.length
        y.size_left = z.size_left;
        y.lf_left = z.lf_left;
        recomputeTreeMetadata(tree, y);
    }
    z.detach();
    if (x.parent.left === x) {
        const newSizeLeft = calculateSize(x);
        const newLFLeft = calculateLF(x);
        if (newSizeLeft !== x.parent.size_left || newLFLeft !== x.parent.lf_left) {
            const delta = newSizeLeft - x.parent.size_left;
            const lf_delta = newLFLeft - x.parent.lf_left;
            x.parent.size_left = newSizeLeft;
            x.parent.lf_left = newLFLeft;
            updateTreeMetadata(tree, x.parent, delta, lf_delta);
        }
    }
    recomputeTreeMetadata(tree, x.parent);
    if (yWasRed) {
        rbTreeBase_resetSentinel();
        return;
    }
    // RB-DELETE-FIXUP
    let w;
    while (x !== tree.root && x.color === 0 /* NodeColor.Black */) {
        if (x === x.parent.left) {
            w = x.parent.right;
            if (w.color === 1 /* NodeColor.Red */) {
                w.color = 0 /* NodeColor.Black */;
                x.parent.color = 1 /* NodeColor.Red */;
                rbTreeBase_leftRotate(tree, x.parent);
                w = x.parent.right;
            }
            if (w.left.color === 0 /* NodeColor.Black */ && w.right.color === 0 /* NodeColor.Black */) {
                w.color = 1 /* NodeColor.Red */;
                x = x.parent;
            }
            else {
                if (w.right.color === 0 /* NodeColor.Black */) {
                    w.left.color = 0 /* NodeColor.Black */;
                    w.color = 1 /* NodeColor.Red */;
                    rbTreeBase_rightRotate(tree, w);
                    w = x.parent.right;
                }
                w.color = x.parent.color;
                x.parent.color = 0 /* NodeColor.Black */;
                w.right.color = 0 /* NodeColor.Black */;
                rbTreeBase_leftRotate(tree, x.parent);
                x = tree.root;
            }
        }
        else {
            w = x.parent.left;
            if (w.color === 1 /* NodeColor.Red */) {
                w.color = 0 /* NodeColor.Black */;
                x.parent.color = 1 /* NodeColor.Red */;
                rbTreeBase_rightRotate(tree, x.parent);
                w = x.parent.left;
            }
            if (w.left.color === 0 /* NodeColor.Black */ && w.right.color === 0 /* NodeColor.Black */) {
                w.color = 1 /* NodeColor.Red */;
                x = x.parent;
            }
            else {
                if (w.left.color === 0 /* NodeColor.Black */) {
                    w.right.color = 0 /* NodeColor.Black */;
                    w.color = 1 /* NodeColor.Red */;
                    rbTreeBase_leftRotate(tree, w);
                    w = x.parent.left;
                }
                w.color = x.parent.color;
                x.parent.color = 0 /* NodeColor.Black */;
                w.left.color = 0 /* NodeColor.Black */;
                rbTreeBase_rightRotate(tree, x.parent);
                x = tree.root;
            }
        }
    }
    x.color = 0 /* NodeColor.Black */;
    rbTreeBase_resetSentinel();
}
function fixInsert(tree, x) {
    recomputeTreeMetadata(tree, x);
    while (x !== tree.root && x.parent.color === 1 /* NodeColor.Red */) {
        if (x.parent === x.parent.parent.left) {
            const y = x.parent.parent.right;
            if (y.color === 1 /* NodeColor.Red */) {
                x.parent.color = 0 /* NodeColor.Black */;
                y.color = 0 /* NodeColor.Black */;
                x.parent.parent.color = 1 /* NodeColor.Red */;
                x = x.parent.parent;
            }
            else {
                if (x === x.parent.right) {
                    x = x.parent;
                    rbTreeBase_leftRotate(tree, x);
                }
                x.parent.color = 0 /* NodeColor.Black */;
                x.parent.parent.color = 1 /* NodeColor.Red */;
                rbTreeBase_rightRotate(tree, x.parent.parent);
            }
        }
        else {
            const y = x.parent.parent.left;
            if (y.color === 1 /* NodeColor.Red */) {
                x.parent.color = 0 /* NodeColor.Black */;
                y.color = 0 /* NodeColor.Black */;
                x.parent.parent.color = 1 /* NodeColor.Red */;
                x = x.parent.parent;
            }
            else {
                if (x === x.parent.left) {
                    x = x.parent;
                    rbTreeBase_rightRotate(tree, x);
                }
                x.parent.color = 0 /* NodeColor.Black */;
                x.parent.parent.color = 1 /* NodeColor.Red */;
                rbTreeBase_leftRotate(tree, x.parent.parent);
            }
        }
    }
    tree.root.color = 0 /* NodeColor.Black */;
}
function updateTreeMetadata(tree, x, delta, lineFeedCntDelta) {
    // node length change or line feed count change
    while (x !== tree.root && x !== rbTreeBase_SENTINEL) {
        if (x.parent.left === x) {
            x.parent.size_left += delta;
            x.parent.lf_left += lineFeedCntDelta;
        }
        x = x.parent;
    }
}
function recomputeTreeMetadata(tree, x) {
    let delta = 0;
    let lf_delta = 0;
    if (x === tree.root) {
        return;
    }
    // go upwards till the node whose left subtree is changed.
    while (x !== tree.root && x === x.parent.right) {
        x = x.parent;
    }
    if (x === tree.root) {
        // well, it means we add a node to the end (inorder)
        return;
    }
    // x is the node whose right subtree is changed.
    x = x.parent;
    delta = calculateSize(x.left) - x.size_left;
    lf_delta = calculateLF(x.left) - x.lf_left;
    x.size_left += delta;
    x.lf_left += lf_delta;
    // go upwards till root. O(logN)
    while (x !== tree.root && (delta !== 0 || lf_delta !== 0)) {
        if (x.parent.left === x) {
            x.parent.size_left += delta;
            x.parent.lf_left += lf_delta;
        }
        x = x.parent;
    }
}

// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/editor/common/model/textModelSearch.js
var textModelSearch = __webpack_require__(104);
;// ./node_modules/monaco-editor/esm/vs/editor/common/model/pieceTreeTextBuffer/pieceTreeBase.js
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/





// const lfRegex = new RegExp(/\r\n|\r|\n/g);
const AverageBufferSize = 65535;
function createUintArray(arr) {
    let r;
    if (arr[arr.length - 1] < 65536) {
        r = new Uint16Array(arr.length);
    }
    else {
        r = new Uint32Array(arr.length);
    }
    r.set(arr, 0);
    return r;
}
class LineStarts {
    constructor(lineStarts, cr, lf, crlf, isBasicASCII) {
        this.lineStarts = lineStarts;
        this.cr = cr;
        this.lf = lf;
        this.crlf = crlf;
        this.isBasicASCII = isBasicASCII;
    }
}
function createLineStartsFast(str, readonly = true) {
    const r = [0];
    let rLength = 1;
    for (let i = 0, len = str.length; i < len; i++) {
        const chr = str.charCodeAt(i);
        if (chr === 13 /* CharCode.CarriageReturn */) {
            if (i + 1 < len && str.charCodeAt(i + 1) === 10 /* CharCode.LineFeed */) {
                // \r\n... case
                r[rLength++] = i + 2;
                i++; // skip \n
            }
            else {
                // \r... case
                r[rLength++] = i + 1;
            }
        }
        else if (chr === 10 /* CharCode.LineFeed */) {
            r[rLength++] = i + 1;
        }
    }
    if (readonly) {
        return createUintArray(r);
    }
    else {
        return r;
    }
}
function createLineStarts(r, str) {
    r.length = 0;
    r[0] = 0;
    let rLength = 1;
    let cr = 0, lf = 0, crlf = 0;
    let isBasicASCII = true;
    for (let i = 0, len = str.length; i < len; i++) {
        const chr = str.charCodeAt(i);
        if (chr === 13 /* CharCode.CarriageReturn */) {
            if (i + 1 < len && str.charCodeAt(i + 1) === 10 /* CharCode.LineFeed */) {
                // \r\n... case
                crlf++;
                r[rLength++] = i + 2;
                i++; // skip \n
            }
            else {
                cr++;
                // \r... case
                r[rLength++] = i + 1;
            }
        }
        else if (chr === 10 /* CharCode.LineFeed */) {
            lf++;
            r[rLength++] = i + 1;
        }
        else {
            if (isBasicASCII) {
                if (chr !== 9 /* CharCode.Tab */ && (chr < 32 || chr > 126)) {
                    isBasicASCII = false;
                }
            }
        }
    }
    const result = new LineStarts(createUintArray(r), cr, lf, crlf, isBasicASCII);
    r.length = 0;
    return result;
}
class Piece {
    constructor(bufferIndex, start, end, lineFeedCnt, length) {
        this.bufferIndex = bufferIndex;
        this.start = start;
        this.end = end;
        this.lineFeedCnt = lineFeedCnt;
        this.length = length;
    }
}
class StringBuffer {
    constructor(buffer, lineStarts) {
        this.buffer = buffer;
        this.lineStarts = lineStarts;
    }
}
/**
 * Readonly snapshot for piece tree.
 * In a real multiple thread environment, to make snapshot reading always work correctly, we need to
 * 1. Make TreeNode.piece immutable, then reading and writing can run in parallel.
 * 2. TreeNode/Buffers normalization should not happen during snapshot reading.
 */
class PieceTreeSnapshot {
    constructor(tree, BOM) {
        this._pieces = [];
        this._tree = tree;
        this._BOM = BOM;
        this._index = 0;
        if (tree.root !== rbTreeBase_SENTINEL) {
            tree.iterate(tree.root, node => {
                if (node !== rbTreeBase_SENTINEL) {
                    this._pieces.push(node.piece);
                }
                return true;
            });
        }
    }
    read() {
        if (this._pieces.length === 0) {
            if (this._index === 0) {
                this._index++;
                return this._BOM;
            }
            else {
                return null;
            }
        }
        if (this._index > this._pieces.length - 1) {
            return null;
        }
        if (this._index === 0) {
            return this._BOM + this._tree.getPieceContent(this._pieces[this._index++]);
        }
        return this._tree.getPieceContent(this._pieces[this._index++]);
    }
}
class PieceTreeSearchCache {
    constructor(limit) {
        this._limit = limit;
        this._cache = [];
    }
    get(offset) {
        for (let i = this._cache.length - 1; i >= 0; i--) {
            const nodePos = this._cache[i];
            if (nodePos.nodeStartOffset <= offset && nodePos.nodeStartOffset + nodePos.node.piece.length >= offset) {
                return nodePos;
            }
        }
        return null;
    }
    get2(lineNumber) {
        for (let i = this._cache.length - 1; i >= 0; i--) {
            const nodePos = this._cache[i];
            if (nodePos.nodeStartLineNumber && nodePos.nodeStartLineNumber < lineNumber && nodePos.nodeStartLineNumber + nodePos.node.piece.lineFeedCnt >= lineNumber) {
                return nodePos;
            }
        }
        return null;
    }
    set(nodePosition) {
        if (this._cache.length >= this._limit) {
            this._cache.shift();
        }
        this._cache.push(nodePosition);
    }
    validate(offset) {
        let hasInvalidVal = false;
        const tmp = this._cache;
        for (let i = 0; i < tmp.length; i++) {
            const nodePos = tmp[i];
            if (nodePos.node.parent === null || nodePos.nodeStartOffset >= offset) {
                tmp[i] = null;
                hasInvalidVal = true;
                continue;
            }
        }
        if (hasInvalidVal) {
            const newArr = [];
            for (const entry of tmp) {
                if (entry !== null) {
                    newArr.push(entry);
                }
            }
            this._cache = newArr;
        }
    }
}
class PieceTreeBase {
    constructor(chunks, eol, eolNormalized) {
        this.create(chunks, eol, eolNormalized);
    }
    create(chunks, eol, eolNormalized) {
        this._buffers = [
            new StringBuffer('', [0])
        ];
        this._lastChangeBufferPos = { line: 0, column: 0 };
        this.root = rbTreeBase_SENTINEL;
        this._lineCnt = 1;
        this._length = 0;
        this._EOL = eol;
        this._EOLLength = eol.length;
        this._EOLNormalized = eolNormalized;
        let lastNode = null;
        for (let i = 0, len = chunks.length; i < len; i++) {
            if (chunks[i].buffer.length > 0) {
                if (!chunks[i].lineStarts) {
                    chunks[i].lineStarts = createLineStartsFast(chunks[i].buffer);
                }
                const piece = new Piece(i + 1, { line: 0, column: 0 }, { line: chunks[i].lineStarts.length - 1, column: chunks[i].buffer.length - chunks[i].lineStarts[chunks[i].lineStarts.length - 1] }, chunks[i].lineStarts.length - 1, chunks[i].buffer.length);
                this._buffers.push(chunks[i]);
                lastNode = this.rbInsertRight(lastNode, piece);
            }
        }
        this._searchCache = new PieceTreeSearchCache(1);
        this._lastVisitedLine = { lineNumber: 0, value: '' };
        this.computeBufferMetadata();
    }
    normalizeEOL(eol) {
        const averageBufferSize = AverageBufferSize;
        const min = averageBufferSize - Math.floor(averageBufferSize / 3);
        const max = min * 2;
        let tempChunk = '';
        let tempChunkLen = 0;
        const chunks = [];
        this.iterate(this.root, node => {
            const str = this.getNodeContent(node);
            const len = str.length;
            if (tempChunkLen <= min || tempChunkLen + len < max) {
                tempChunk += str;
                tempChunkLen += len;
                return true;
            }
            // flush anyways
            const text = tempChunk.replace(/\r\n|\r|\n/g, eol);
            chunks.push(new StringBuffer(text, createLineStartsFast(text)));
            tempChunk = str;
            tempChunkLen = len;
            return true;
        });
        if (tempChunkLen > 0) {
            const text = tempChunk.replace(/\r\n|\r|\n/g, eol);
            chunks.push(new StringBuffer(text, createLineStartsFast(text)));
        }
        this.create(chunks, eol, true);
    }
    // #region Buffer API
    getEOL() {
        return this._EOL;
    }
    setEOL(newEOL) {
        this._EOL = newEOL;
        this._EOLLength = this._EOL.length;
        this.normalizeEOL(newEOL);
    }
    createSnapshot(BOM) {
        return new PieceTreeSnapshot(this, BOM);
    }
    getOffsetAt(lineNumber, column) {
        let leftLen = 0; // inorder
        let x = this.root;
        while (x !== rbTreeBase_SENTINEL) {
            if (x.left !== rbTreeBase_SENTINEL && x.lf_left + 1 >= lineNumber) {
                x = x.left;
            }
            else if (x.lf_left + x.piece.lineFeedCnt + 1 >= lineNumber) {
                leftLen += x.size_left;
                // lineNumber >= 2
                const accumualtedValInCurrentIndex = this.getAccumulatedValue(x, lineNumber - x.lf_left - 2);
                return leftLen += accumualtedValInCurrentIndex + column - 1;
            }
            else {
                lineNumber -= x.lf_left + x.piece.lineFeedCnt;
                leftLen += x.size_left + x.piece.length;
                x = x.right;
            }
        }
        return leftLen;
    }
    getPositionAt(offset) {
        offset = Math.floor(offset);
        offset = Math.max(0, offset);
        let x = this.root;
        let lfCnt = 0;
        const originalOffset = offset;
        while (x !== rbTreeBase_SENTINEL) {
            if (x.size_left !== 0 && x.size_left >= offset) {
                x = x.left;
            }
            else if (x.size_left + x.piece.length >= offset) {
                const out = this.getIndexOf(x, offset - x.size_left);
                lfCnt += x.lf_left + out.index;
                if (out.index === 0) {
                    const lineStartOffset = this.getOffsetAt(lfCnt + 1, 1);
                    const column = originalOffset - lineStartOffset;
                    return new core_position/* Position */.y(lfCnt + 1, column + 1);
                }
                return new core_position/* Position */.y(lfCnt + 1, out.remainder + 1);
            }
            else {
                offset -= x.size_left + x.piece.length;
                lfCnt += x.lf_left + x.piece.lineFeedCnt;
                if (x.right === rbTreeBase_SENTINEL) {
                    // last node
                    const lineStartOffset = this.getOffsetAt(lfCnt + 1, 1);
                    const column = originalOffset - offset - lineStartOffset;
                    return new core_position/* Position */.y(lfCnt + 1, column + 1);
                }
                else {
                    x = x.right;
                }
            }
        }
        return new core_position/* Position */.y(1, 1);
    }
    getValueInRange(range, eol) {
        if (range.startLineNumber === range.endLineNumber && range.startColumn === range.endColumn) {
            return '';
        }
        const startPosition = this.nodeAt2(range.startLineNumber, range.startColumn);
        const endPosition = this.nodeAt2(range.endLineNumber, range.endColumn);
        const value = this.getValueInRange2(startPosition, endPosition);
        if (eol) {
            if (eol !== this._EOL || !this._EOLNormalized) {
                return value.replace(/\r\n|\r|\n/g, eol);
            }
            if (eol === this.getEOL() && this._EOLNormalized) {
                if (eol === '\r\n') {
                }
                return value;
            }
            return value.replace(/\r\n|\r|\n/g, eol);
        }
        return value;
    }
    getValueInRange2(startPosition, endPosition) {
        if (startPosition.node === endPosition.node) {
            const node = startPosition.node;
            const buffer = this._buffers[node.piece.bufferIndex].buffer;
            const startOffset = this.offsetInBuffer(node.piece.bufferIndex, node.piece.start);
            return buffer.substring(startOffset + startPosition.remainder, startOffset + endPosition.remainder);
        }
        let x = startPosition.node;
        const buffer = this._buffers[x.piece.bufferIndex].buffer;
        const startOffset = this.offsetInBuffer(x.piece.bufferIndex, x.piece.start);
        let ret = buffer.substring(startOffset + startPosition.remainder, startOffset + x.piece.length);
        x = x.next();
        while (x !== rbTreeBase_SENTINEL) {
            const buffer = this._buffers[x.piece.bufferIndex].buffer;
            const startOffset = this.offsetInBuffer(x.piece.bufferIndex, x.piece.start);
            if (x === endPosition.node) {
                ret += buffer.substring(startOffset, startOffset + endPosition.remainder);
                break;
            }
            else {
                ret += buffer.substr(startOffset, x.piece.length);
            }
            x = x.next();
        }
        return ret;
    }
    getLinesContent() {
        const lines = [];
        let linesLength = 0;
        let currentLine = '';
        let danglingCR = false;
        this.iterate(this.root, node => {
            if (node === rbTreeBase_SENTINEL) {
                return true;
            }
            const piece = node.piece;
            let pieceLength = piece.length;
            if (pieceLength === 0) {
                return true;
            }
            const buffer = this._buffers[piece.bufferIndex].buffer;
            const lineStarts = this._buffers[piece.bufferIndex].lineStarts;
            const pieceStartLine = piece.start.line;
            const pieceEndLine = piece.end.line;
            let pieceStartOffset = lineStarts[pieceStartLine] + piece.start.column;
            if (danglingCR) {
                if (buffer.charCodeAt(pieceStartOffset) === 10 /* CharCode.LineFeed */) {
                    // pretend the \n was in the previous piece..
                    pieceStartOffset++;
                    pieceLength--;
                }
                lines[linesLength++] = currentLine;
                currentLine = '';
                danglingCR = false;
                if (pieceLength === 0) {
                    return true;
                }
            }
            if (pieceStartLine === pieceEndLine) {
                // this piece has no new lines
                if (!this._EOLNormalized && buffer.charCodeAt(pieceStartOffset + pieceLength - 1) === 13 /* CharCode.CarriageReturn */) {
                    danglingCR = true;
                    currentLine += buffer.substr(pieceStartOffset, pieceLength - 1);
                }
                else {
                    currentLine += buffer.substr(pieceStartOffset, pieceLength);
                }
                return true;
            }
            // add the text before the first line start in this piece
            currentLine += (this._EOLNormalized
                ? buffer.substring(pieceStartOffset, Math.max(pieceStartOffset, lineStarts[pieceStartLine + 1] - this._EOLLength))
                : buffer.substring(pieceStartOffset, lineStarts[pieceStartLine + 1]).replace(/(\r\n|\r|\n)$/, ''));
            lines[linesLength++] = currentLine;
            for (let line = pieceStartLine + 1; line < pieceEndLine; line++) {
                currentLine = (this._EOLNormalized
                    ? buffer.substring(lineStarts[line], lineStarts[line + 1] - this._EOLLength)
                    : buffer.substring(lineStarts[line], lineStarts[line + 1]).replace(/(\r\n|\r|\n)$/, ''));
                lines[linesLength++] = currentLine;
            }
            if (!this._EOLNormalized && buffer.charCodeAt(lineStarts[pieceEndLine] + piece.end.column - 1) === 13 /* CharCode.CarriageReturn */) {
                danglingCR = true;
                if (piece.end.column === 0) {
                    // The last line ended with a \r, let's undo the push, it will be pushed by next iteration
                    linesLength--;
                }
                else {
                    currentLine = buffer.substr(lineStarts[pieceEndLine], piece.end.column - 1);
                }
            }
            else {
                currentLine = buffer.substr(lineStarts[pieceEndLine], piece.end.column);
            }
            return true;
        });
        if (danglingCR) {
            lines[linesLength++] = currentLine;
            currentLine = '';
        }
        lines[linesLength++] = currentLine;
        return lines;
    }
    getLength() {
        return this._length;
    }
    getLineCount() {
        return this._lineCnt;
    }
    getLineContent(lineNumber) {
        if (this._lastVisitedLine.lineNumber === lineNumber) {
            return this._lastVisitedLine.value;
        }
        this._lastVisitedLine.lineNumber = lineNumber;
        if (lineNumber === this._lineCnt) {
            this._lastVisitedLine.value = this.getLineRawContent(lineNumber);
        }
        else if (this._EOLNormalized) {
            this._lastVisitedLine.value = this.getLineRawContent(lineNumber, this._EOLLength);
        }
        else {
            this._lastVisitedLine.value = this.getLineRawContent(lineNumber).replace(/(\r\n|\r|\n)$/, '');
        }
        return this._lastVisitedLine.value;
    }
    _getCharCode(nodePos) {
        if (nodePos.remainder === nodePos.node.piece.length) {
            // the char we want to fetch is at the head of next node.
            const matchingNode = nodePos.node.next();
            if (!matchingNode) {
                return 0;
            }
            const buffer = this._buffers[matchingNode.piece.bufferIndex];
            const startOffset = this.offsetInBuffer(matchingNode.piece.bufferIndex, matchingNode.piece.start);
            return buffer.buffer.charCodeAt(startOffset);
        }
        else {
            const buffer = this._buffers[nodePos.node.piece.bufferIndex];
            const startOffset = this.offsetInBuffer(nodePos.node.piece.bufferIndex, nodePos.node.piece.start);
            const targetOffset = startOffset + nodePos.remainder;
            return buffer.buffer.charCodeAt(targetOffset);
        }
    }
    getLineCharCode(lineNumber, index) {
        const nodePos = this.nodeAt2(lineNumber, index + 1);
        return this._getCharCode(nodePos);
    }
    getLineLength(lineNumber) {
        if (lineNumber === this.getLineCount()) {
            const startOffset = this.getOffsetAt(lineNumber, 1);
            return this.getLength() - startOffset;
        }
        return this.getOffsetAt(lineNumber + 1, 1) - this.getOffsetAt(lineNumber, 1) - this._EOLLength;
    }
    findMatchesInNode(node, searcher, startLineNumber, startColumn, startCursor, endCursor, searchData, captureMatches, limitResultCount, resultLen, result) {
        const buffer = this._buffers[node.piece.bufferIndex];
        const startOffsetInBuffer = this.offsetInBuffer(node.piece.bufferIndex, node.piece.start);
        const start = this.offsetInBuffer(node.piece.bufferIndex, startCursor);
        const end = this.offsetInBuffer(node.piece.bufferIndex, endCursor);
        let m;
        // Reset regex to search from the beginning
        const ret = { line: 0, column: 0 };
        let searchText;
        let offsetInBuffer;
        if (searcher._wordSeparators) {
            searchText = buffer.buffer.substring(start, end);
            offsetInBuffer = (offset) => offset + start;
            searcher.reset(0);
        }
        else {
            searchText = buffer.buffer;
            offsetInBuffer = (offset) => offset;
            searcher.reset(start);
        }
        do {
            m = searcher.next(searchText);
            if (m) {
                if (offsetInBuffer(m.index) >= end) {
                    return resultLen;
                }
                this.positionInBuffer(node, offsetInBuffer(m.index) - startOffsetInBuffer, ret);
                const lineFeedCnt = this.getLineFeedCnt(node.piece.bufferIndex, startCursor, ret);
                const retStartColumn = ret.line === startCursor.line ? ret.column - startCursor.column + startColumn : ret.column + 1;
                const retEndColumn = retStartColumn + m[0].length;
                result[resultLen++] = (0,textModelSearch/* createFindMatch */.dr)(new core_range/* Range */.Q(startLineNumber + lineFeedCnt, retStartColumn, startLineNumber + lineFeedCnt, retEndColumn), m, captureMatches);
                if (offsetInBuffer(m.index) + m[0].length >= end) {
                    return resultLen;
                }
                if (resultLen >= limitResultCount) {
                    return resultLen;
                }
            }
        } while (m);
        return resultLen;
    }
    findMatchesLineByLine(searchRange, searchData, captureMatches, limitResultCount) {
        const result = [];
        let resultLen = 0;
        const searcher = new textModelSearch/* Searcher */.W5(searchData.wordSeparators, searchData.regex);
        let startPosition = this.nodeAt2(searchRange.startLineNumber, searchRange.startColumn);
        if (startPosition === null) {
            return [];
        }
        const endPosition = this.nodeAt2(searchRange.endLineNumber, searchRange.endColumn);
        if (endPosition === null) {
            return [];
        }
        let start = this.positionInBuffer(startPosition.node, startPosition.remainder);
        const end = this.positionInBuffer(endPosition.node, endPosition.remainder);
        if (startPosition.node === endPosition.node) {
            this.findMatchesInNode(startPosition.node, searcher, searchRange.startLineNumber, searchRange.startColumn, start, end, searchData, captureMatches, limitResultCount, resultLen, result);
            return result;
        }
        let startLineNumber = searchRange.startLineNumber;
        let currentNode = startPosition.node;
        while (currentNode !== endPosition.node) {
            const lineBreakCnt = this.getLineFeedCnt(currentNode.piece.bufferIndex, start, currentNode.piece.end);
            if (lineBreakCnt >= 1) {
                // last line break position
                const lineStarts = this._buffers[currentNode.piece.bufferIndex].lineStarts;
                const startOffsetInBuffer = this.offsetInBuffer(currentNode.piece.bufferIndex, currentNode.piece.start);
                const nextLineStartOffset = lineStarts[start.line + lineBreakCnt];
                const startColumn = startLineNumber === searchRange.startLineNumber ? searchRange.startColumn : 1;
                resultLen = this.findMatchesInNode(currentNode, searcher, startLineNumber, startColumn, start, this.positionInBuffer(currentNode, nextLineStartOffset - startOffsetInBuffer), searchData, captureMatches, limitResultCount, resultLen, result);
                if (resultLen >= limitResultCount) {
                    return result;
                }
                startLineNumber += lineBreakCnt;
            }
            const startColumn = startLineNumber === searchRange.startLineNumber ? searchRange.startColumn - 1 : 0;
            // search for the remaining content
            if (startLineNumber === searchRange.endLineNumber) {
                const text = this.getLineContent(startLineNumber).substring(startColumn, searchRange.endColumn - 1);
                resultLen = this._findMatchesInLine(searchData, searcher, text, searchRange.endLineNumber, startColumn, resultLen, result, captureMatches, limitResultCount);
                return result;
            }
            resultLen = this._findMatchesInLine(searchData, searcher, this.getLineContent(startLineNumber).substr(startColumn), startLineNumber, startColumn, resultLen, result, captureMatches, limitResultCount);
            if (resultLen >= limitResultCount) {
                return result;
            }
            startLineNumber++;
            startPosition = this.nodeAt2(startLineNumber, 1);
            currentNode = startPosition.node;
            start = this.positionInBuffer(startPosition.node, startPosition.remainder);
        }
        if (startLineNumber === searchRange.endLineNumber) {
            const startColumn = startLineNumber === searchRange.startLineNumber ? searchRange.startColumn - 1 : 0;
            const text = this.getLineContent(startLineNumber).substring(startColumn, searchRange.endColumn - 1);
            resultLen = this._findMatchesInLine(searchData, searcher, text, searchRange.endLineNumber, startColumn, resultLen, result, captureMatches, limitResultCount);
            return result;
        }
        const startColumn = startLineNumber === searchRange.startLineNumber ? searchRange.startColumn : 1;
        resultLen = this.findMatchesInNode(endPosition.node, searcher, startLineNumber, startColumn, start, end, searchData, captureMatches, limitResultCount, resultLen, result);
        return result;
    }
    _findMatchesInLine(searchData, searcher, text, lineNumber, deltaOffset, resultLen, result, captureMatches, limitResultCount) {
        const wordSeparators = searchData.wordSeparators;
        if (!captureMatches && searchData.simpleSearch) {
            const searchString = searchData.simpleSearch;
            const searchStringLen = searchString.length;
            const textLength = text.length;
            let lastMatchIndex = -searchStringLen;
            while ((lastMatchIndex = text.indexOf(searchString, lastMatchIndex + searchStringLen)) !== -1) {
                if (!wordSeparators || (0,textModelSearch/* isValidMatch */.wC)(wordSeparators, text, textLength, lastMatchIndex, searchStringLen)) {
                    result[resultLen++] = new model/* FindMatch */.Dg(new core_range/* Range */.Q(lineNumber, lastMatchIndex + 1 + deltaOffset, lineNumber, lastMatchIndex + 1 + searchStringLen + deltaOffset), null);
                    if (resultLen >= limitResultCount) {
                        return resultLen;
                    }
                }
            }
            return resultLen;
        }
        let m;
        // Reset regex to search from the beginning
        searcher.reset(0);
        do {
            m = searcher.next(text);
            if (m) {
                result[resultLen++] = (0,textModelSearch/* createFindMatch */.dr)(new core_range/* Range */.Q(lineNumber, m.index + 1 + deltaOffset, lineNumber, m.index + 1 + m[0].length + deltaOffset), m, captureMatches);
                if (resultLen >= limitResultCount) {
                    return resultLen;
                }
            }
        } while (m);
        return resultLen;
    }
    // #endregion
    // #region Piece Table
    insert(offset, value, eolNormalized = false) {
        this._EOLNormalized = this._EOLNormalized && eolNormalized;
        this._lastVisitedLine.lineNumber = 0;
        this._lastVisitedLine.value = '';
        if (this.root !== rbTreeBase_SENTINEL) {
            const { node, remainder, nodeStartOffset } = this.nodeAt(offset);
            const piece = node.piece;
            const bufferIndex = piece.bufferIndex;
            const insertPosInBuffer = this.positionInBuffer(node, remainder);
            if (node.piece.bufferIndex === 0 &&
                piece.end.line === this._lastChangeBufferPos.line &&
                piece.end.column === this._lastChangeBufferPos.column &&
                (nodeStartOffset + piece.length === offset) &&
                value.length < AverageBufferSize) {
                // changed buffer
                this.appendToNode(node, value);
                this.computeBufferMetadata();
                return;
            }
            if (nodeStartOffset === offset) {
                this.insertContentToNodeLeft(value, node);
                this._searchCache.validate(offset);
            }
            else if (nodeStartOffset + node.piece.length > offset) {
                // we are inserting into the middle of a node.
                const nodesToDel = [];
                let newRightPiece = new Piece(piece.bufferIndex, insertPosInBuffer, piece.end, this.getLineFeedCnt(piece.bufferIndex, insertPosInBuffer, piece.end), this.offsetInBuffer(bufferIndex, piece.end) - this.offsetInBuffer(bufferIndex, insertPosInBuffer));
                if (this.shouldCheckCRLF() && this.endWithCR(value)) {
                    const headOfRight = this.nodeCharCodeAt(node, remainder);
                    if (headOfRight === 10 /** \n */) {
                        const newStart = { line: newRightPiece.start.line + 1, column: 0 };
                        newRightPiece = new Piece(newRightPiece.bufferIndex, newStart, newRightPiece.end, this.getLineFeedCnt(newRightPiece.bufferIndex, newStart, newRightPiece.end), newRightPiece.length - 1);
                        value += '\n';
                    }
                }
                // reuse node for content before insertion point.
                if (this.shouldCheckCRLF() && this.startWithLF(value)) {
                    const tailOfLeft = this.nodeCharCodeAt(node, remainder - 1);
                    if (tailOfLeft === 13 /** \r */) {
                        const previousPos = this.positionInBuffer(node, remainder - 1);
                        this.deleteNodeTail(node, previousPos);
                        value = '\r' + value;
                        if (node.piece.length === 0) {
                            nodesToDel.push(node);
                        }
                    }
                    else {
                        this.deleteNodeTail(node, insertPosInBuffer);
                    }
                }
                else {
                    this.deleteNodeTail(node, insertPosInBuffer);
                }
                const newPieces = this.createNewPieces(value);
                if (newRightPiece.length > 0) {
                    this.rbInsertRight(node, newRightPiece);
                }
                let tmpNode = node;
                for (let k = 0; k < newPieces.length; k++) {
                    tmpNode = this.rbInsertRight(tmpNode, newPieces[k]);
                }
                this.deleteNodes(nodesToDel);
            }
            else {
                this.insertContentToNodeRight(value, node);
            }
        }
        else {
            // insert new node
            const pieces = this.createNewPieces(value);
            let node = this.rbInsertLeft(null, pieces[0]);
            for (let k = 1; k < pieces.length; k++) {
                node = this.rbInsertRight(node, pieces[k]);
            }
        }
        // todo, this is too brutal. Total line feed count should be updated the same way as lf_left.
        this.computeBufferMetadata();
    }
    delete(offset, cnt) {
        this._lastVisitedLine.lineNumber = 0;
        this._lastVisitedLine.value = '';
        if (cnt <= 0 || this.root === rbTreeBase_SENTINEL) {
            return;
        }
        const startPosition = this.nodeAt(offset);
        const endPosition = this.nodeAt(offset + cnt);
        const startNode = startPosition.node;
        const endNode = endPosition.node;
        if (startNode === endNode) {
            const startSplitPosInBuffer = this.positionInBuffer(startNode, startPosition.remainder);
            const endSplitPosInBuffer = this.positionInBuffer(startNode, endPosition.remainder);
            if (startPosition.nodeStartOffset === offset) {
                if (cnt === startNode.piece.length) { // delete node
                    const next = startNode.next();
                    rbDelete(this, startNode);
                    this.validateCRLFWithPrevNode(next);
                    this.computeBufferMetadata();
                    return;
                }
                this.deleteNodeHead(startNode, endSplitPosInBuffer);
                this._searchCache.validate(offset);
                this.validateCRLFWithPrevNode(startNode);
                this.computeBufferMetadata();
                return;
            }
            if (startPosition.nodeStartOffset + startNode.piece.length === offset + cnt) {
                this.deleteNodeTail(startNode, startSplitPosInBuffer);
                this.validateCRLFWithNextNode(startNode);
                this.computeBufferMetadata();
                return;
            }
            // delete content in the middle, this node will be splitted to nodes
            this.shrinkNode(startNode, startSplitPosInBuffer, endSplitPosInBuffer);
            this.computeBufferMetadata();
            return;
        }
        const nodesToDel = [];
        const startSplitPosInBuffer = this.positionInBuffer(startNode, startPosition.remainder);
        this.deleteNodeTail(startNode, startSplitPosInBuffer);
        this._searchCache.validate(offset);
        if (startNode.piece.length === 0) {
            nodesToDel.push(startNode);
        }
        // update last touched node
        const endSplitPosInBuffer = this.positionInBuffer(endNode, endPosition.remainder);
        this.deleteNodeHead(endNode, endSplitPosInBuffer);
        if (endNode.piece.length === 0) {
            nodesToDel.push(endNode);
        }
        // delete nodes in between
        const secondNode = startNode.next();
        for (let node = secondNode; node !== rbTreeBase_SENTINEL && node !== endNode; node = node.next()) {
            nodesToDel.push(node);
        }
        const prev = startNode.piece.length === 0 ? startNode.prev() : startNode;
        this.deleteNodes(nodesToDel);
        this.validateCRLFWithNextNode(prev);
        this.computeBufferMetadata();
    }
    insertContentToNodeLeft(value, node) {
        // we are inserting content to the beginning of node
        const nodesToDel = [];
        if (this.shouldCheckCRLF() && this.endWithCR(value) && this.startWithLF(node)) {
            // move `\n` to new node.
            const piece = node.piece;
            const newStart = { line: piece.start.line + 1, column: 0 };
            const nPiece = new Piece(piece.bufferIndex, newStart, piece.end, this.getLineFeedCnt(piece.bufferIndex, newStart, piece.end), piece.length - 1);
            node.piece = nPiece;
            value += '\n';
            updateTreeMetadata(this, node, -1, -1);
            if (node.piece.length === 0) {
                nodesToDel.push(node);
            }
        }
        const newPieces = this.createNewPieces(value);
        let newNode = this.rbInsertLeft(node, newPieces[newPieces.length - 1]);
        for (let k = newPieces.length - 2; k >= 0; k--) {
            newNode = this.rbInsertLeft(newNode, newPieces[k]);
        }
        this.validateCRLFWithPrevNode(newNode);
        this.deleteNodes(nodesToDel);
    }
    insertContentToNodeRight(value, node) {
        // we are inserting to the right of this node.
        if (this.adjustCarriageReturnFromNext(value, node)) {
            // move \n to the new node.
            value += '\n';
        }
        const newPieces = this.createNewPieces(value);
        const newNode = this.rbInsertRight(node, newPieces[0]);
        let tmpNode = newNode;
        for (let k = 1; k < newPieces.length; k++) {
            tmpNode = this.rbInsertRight(tmpNode, newPieces[k]);
        }
        this.validateCRLFWithPrevNode(newNode);
    }
    positionInBuffer(node, remainder, ret) {
        const piece = node.piece;
        const bufferIndex = node.piece.bufferIndex;
        const lineStarts = this._buffers[bufferIndex].lineStarts;
        const startOffset = lineStarts[piece.start.line] + piece.start.column;
        const offset = startOffset + remainder;
        // binary search offset between startOffset and endOffset
        let low = piece.start.line;
        let high = piece.end.line;
        let mid = 0;
        let midStop = 0;
        let midStart = 0;
        while (low <= high) {
            mid = low + ((high - low) / 2) | 0;
            midStart = lineStarts[mid];
            if (mid === high) {
                break;
            }
            midStop = lineStarts[mid + 1];
            if (offset < midStart) {
                high = mid - 1;
            }
            else if (offset >= midStop) {
                low = mid + 1;
            }
            else {
                break;
            }
        }
        if (ret) {
            ret.line = mid;
            ret.column = offset - midStart;
            return null;
        }
        return {
            line: mid,
            column: offset - midStart
        };
    }
    getLineFeedCnt(bufferIndex, start, end) {
        // we don't need to worry about start: abc\r|\n, or abc|\r, or abc|\n, or abc|\r\n doesn't change the fact that, there is one line break after start.
        // now let's take care of end: abc\r|\n, if end is in between \r and \n, we need to add line feed count by 1
        if (end.column === 0) {
            return end.line - start.line;
        }
        const lineStarts = this._buffers[bufferIndex].lineStarts;
        if (end.line === lineStarts.length - 1) { // it means, there is no \n after end, otherwise, there will be one more lineStart.
            return end.line - start.line;
        }
        const nextLineStartOffset = lineStarts[end.line + 1];
        const endOffset = lineStarts[end.line] + end.column;
        if (nextLineStartOffset > endOffset + 1) { // there are more than 1 character after end, which means it can't be \n
            return end.line - start.line;
        }
        // endOffset + 1 === nextLineStartOffset
        // character at endOffset is \n, so we check the character before first
        // if character at endOffset is \r, end.column is 0 and we can't get here.
        const previousCharOffset = endOffset - 1; // end.column > 0 so it's okay.
        const buffer = this._buffers[bufferIndex].buffer;
        if (buffer.charCodeAt(previousCharOffset) === 13) {
            return end.line - start.line + 1;
        }
        else {
            return end.line - start.line;
        }
    }
    offsetInBuffer(bufferIndex, cursor) {
        const lineStarts = this._buffers[bufferIndex].lineStarts;
        return lineStarts[cursor.line] + cursor.column;
    }
    deleteNodes(nodes) {
        for (let i = 0; i < nodes.length; i++) {
            rbDelete(this, nodes[i]);
        }
    }
    createNewPieces(text) {
        if (text.length > AverageBufferSize) {
            // the content is large, operations like substring, charCode becomes slow
            // so here we split it into smaller chunks, just like what we did for CR/LF normalization
            const newPieces = [];
            while (text.length > AverageBufferSize) {
                const lastChar = text.charCodeAt(AverageBufferSize - 1);
                let splitText;
                if (lastChar === 13 /* CharCode.CarriageReturn */ || (lastChar >= 0xD800 && lastChar <= 0xDBFF)) {
                    // last character is \r or a high surrogate => keep it back
                    splitText = text.substring(0, AverageBufferSize - 1);
                    text = text.substring(AverageBufferSize - 1);
                }
                else {
                    splitText = text.substring(0, AverageBufferSize);
                    text = text.substring(AverageBufferSize);
                }
                const lineStarts = createLineStartsFast(splitText);
                newPieces.push(new Piece(this._buffers.length, /* buffer index */ { line: 0, column: 0 }, { line: lineStarts.length - 1, column: splitText.length - lineStarts[lineStarts.length - 1] }, lineStarts.length - 1, splitText.length));
                this._buffers.push(new StringBuffer(splitText, lineStarts));
            }
            const lineStarts = createLineStartsFast(text);
            newPieces.push(new Piece(this._buffers.length, /* buffer index */ { line: 0, column: 0 }, { line: lineStarts.length - 1, column: text.length - lineStarts[lineStarts.length - 1] }, lineStarts.length - 1, text.length));
            this._buffers.push(new StringBuffer(text, lineStarts));
            return newPieces;
        }
        let startOffset = this._buffers[0].buffer.length;
        const lineStarts = createLineStartsFast(text, false);
        let start = this._lastChangeBufferPos;
        if (this._buffers[0].lineStarts[this._buffers[0].lineStarts.length - 1] === startOffset
            && startOffset !== 0
            && this.startWithLF(text)
            && this.endWithCR(this._buffers[0].buffer) // todo, we can check this._lastChangeBufferPos's column as it's the last one
        ) {
            this._lastChangeBufferPos = { line: this._lastChangeBufferPos.line, column: this._lastChangeBufferPos.column + 1 };
            start = this._lastChangeBufferPos;
            for (let i = 0; i < lineStarts.length; i++) {
                lineStarts[i] += startOffset + 1;
            }
            this._buffers[0].lineStarts = this._buffers[0].lineStarts.concat(lineStarts.slice(1));
            this._buffers[0].buffer += '_' + text;
            startOffset += 1;
        }
        else {
            if (startOffset !== 0) {
                for (let i = 0; i < lineStarts.length; i++) {
                    lineStarts[i] += startOffset;
                }
            }
            this._buffers[0].lineStarts = this._buffers[0].lineStarts.concat(lineStarts.slice(1));
            this._buffers[0].buffer += text;
        }
        const endOffset = this._buffers[0].buffer.length;
        const endIndex = this._buffers[0].lineStarts.length - 1;
        const endColumn = endOffset - this._buffers[0].lineStarts[endIndex];
        const endPos = { line: endIndex, column: endColumn };
        const newPiece = new Piece(0, /** todo@peng */ start, endPos, this.getLineFeedCnt(0, start, endPos), endOffset - startOffset);
        this._lastChangeBufferPos = endPos;
        return [newPiece];
    }
    getLineRawContent(lineNumber, endOffset = 0) {
        let x = this.root;
        let ret = '';
        const cache = this._searchCache.get2(lineNumber);
        if (cache) {
            x = cache.node;
            const prevAccumulatedValue = this.getAccumulatedValue(x, lineNumber - cache.nodeStartLineNumber - 1);
            const buffer = this._buffers[x.piece.bufferIndex].buffer;
            const startOffset = this.offsetInBuffer(x.piece.bufferIndex, x.piece.start);
            if (cache.nodeStartLineNumber + x.piece.lineFeedCnt === lineNumber) {
                ret = buffer.substring(startOffset + prevAccumulatedValue, startOffset + x.piece.length);
            }
            else {
                const accumulatedValue = this.getAccumulatedValue(x, lineNumber - cache.nodeStartLineNumber);
                return buffer.substring(startOffset + prevAccumulatedValue, startOffset + accumulatedValue - endOffset);
            }
        }
        else {
            let nodeStartOffset = 0;
            const originalLineNumber = lineNumber;
            while (x !== rbTreeBase_SENTINEL) {
                if (x.left !== rbTreeBase_SENTINEL && x.lf_left >= lineNumber - 1) {
                    x = x.left;
                }
                else if (x.lf_left + x.piece.lineFeedCnt > lineNumber - 1) {
                    const prevAccumulatedValue = this.getAccumulatedValue(x, lineNumber - x.lf_left - 2);
                    const accumulatedValue = this.getAccumulatedValue(x, lineNumber - x.lf_left - 1);
                    const buffer = this._buffers[x.piece.bufferIndex].buffer;
                    const startOffset = this.offsetInBuffer(x.piece.bufferIndex, x.piece.start);
                    nodeStartOffset += x.size_left;
                    this._searchCache.set({
                        node: x,
                        nodeStartOffset,
                        nodeStartLineNumber: originalLineNumber - (lineNumber - 1 - x.lf_left)
                    });
                    return buffer.substring(startOffset + prevAccumulatedValue, startOffset + accumulatedValue - endOffset);
                }
                else if (x.lf_left + x.piece.lineFeedCnt === lineNumber - 1) {
                    const prevAccumulatedValue = this.getAccumulatedValue(x, lineNumber - x.lf_left - 2);
                    const buffer = this._buffers[x.piece.bufferIndex].buffer;
                    const startOffset = this.offsetInBuffer(x.piece.bufferIndex, x.piece.start);
                    ret = buffer.substring(startOffset + prevAccumulatedValue, startOffset + x.piece.length);
                    break;
                }
                else {
                    lineNumber -= x.lf_left + x.piece.lineFeedCnt;
                    nodeStartOffset += x.size_left + x.piece.length;
                    x = x.right;
                }
            }
        }
        // search in order, to find the node contains end column
        x = x.next();
        while (x !== rbTreeBase_SENTINEL) {
            const buffer = this._buffers[x.piece.bufferIndex].buffer;
            if (x.piece.lineFeedCnt > 0) {
                const accumulatedValue = this.getAccumulatedValue(x, 0);
                const startOffset = this.offsetInBuffer(x.piece.bufferIndex, x.piece.start);
                ret += buffer.substring(startOffset, startOffset + accumulatedValue - endOffset);
                return ret;
            }
            else {
                const startOffset = this.offsetInBuffer(x.piece.bufferIndex, x.piece.start);
                ret += buffer.substr(startOffset, x.piece.length);
            }
            x = x.next();
        }
        return ret;
    }
    computeBufferMetadata() {
        let x = this.root;
        let lfCnt = 1;
        let len = 0;
        while (x !== rbTreeBase_SENTINEL) {
            lfCnt += x.lf_left + x.piece.lineFeedCnt;
            len += x.size_left + x.piece.length;
            x = x.right;
        }
        this._lineCnt = lfCnt;
        this._length = len;
        this._searchCache.validate(this._length);
    }
    // #region node operations
    getIndexOf(node, accumulatedValue) {
        const piece = node.piece;
        const pos = this.positionInBuffer(node, accumulatedValue);
        const lineCnt = pos.line - piece.start.line;
        if (this.offsetInBuffer(piece.bufferIndex, piece.end) - this.offsetInBuffer(piece.bufferIndex, piece.start) === accumulatedValue) {
            // we are checking the end of this node, so a CRLF check is necessary.
            const realLineCnt = this.getLineFeedCnt(node.piece.bufferIndex, piece.start, pos);
            if (realLineCnt !== lineCnt) {
                // aha yes, CRLF
                return { index: realLineCnt, remainder: 0 };
            }
        }
        return { index: lineCnt, remainder: pos.column };
    }
    getAccumulatedValue(node, index) {
        if (index < 0) {
            return 0;
        }
        const piece = node.piece;
        const lineStarts = this._buffers[piece.bufferIndex].lineStarts;
        const expectedLineStartIndex = piece.start.line + index + 1;
        if (expectedLineStartIndex > piece.end.line) {
            return lineStarts[piece.end.line] + piece.end.column - lineStarts[piece.start.line] - piece.start.column;
        }
        else {
            return lineStarts[expectedLineStartIndex] - lineStarts[piece.start.line] - piece.start.column;
        }
    }
    deleteNodeTail(node, pos) {
        const piece = node.piece;
        const originalLFCnt = piece.lineFeedCnt;
        const originalEndOffset = this.offsetInBuffer(piece.bufferIndex, piece.end);
        const newEnd = pos;
        const newEndOffset = this.offsetInBuffer(piece.bufferIndex, newEnd);
        const newLineFeedCnt = this.getLineFeedCnt(piece.bufferIndex, piece.start, newEnd);
        const lf_delta = newLineFeedCnt - originalLFCnt;
        const size_delta = newEndOffset - originalEndOffset;
        const newLength = piece.length + size_delta;
        node.piece = new Piece(piece.bufferIndex, piece.start, newEnd, newLineFeedCnt, newLength);
        updateTreeMetadata(this, node, size_delta, lf_delta);
    }
    deleteNodeHead(node, pos) {
        const piece = node.piece;
        const originalLFCnt = piece.lineFeedCnt;
        const originalStartOffset = this.offsetInBuffer(piece.bufferIndex, piece.start);
        const newStart = pos;
        const newLineFeedCnt = this.getLineFeedCnt(piece.bufferIndex, newStart, piece.end);
        const newStartOffset = this.offsetInBuffer(piece.bufferIndex, newStart);
        const lf_delta = newLineFeedCnt - originalLFCnt;
        const size_delta = originalStartOffset - newStartOffset;
        const newLength = piece.length + size_delta;
        node.piece = new Piece(piece.bufferIndex, newStart, piece.end, newLineFeedCnt, newLength);
        updateTreeMetadata(this, node, size_delta, lf_delta);
    }
    shrinkNode(node, start, end) {
        const piece = node.piece;
        const originalStartPos = piece.start;
        const originalEndPos = piece.end;
        // old piece, originalStartPos, start
        const oldLength = piece.length;
        const oldLFCnt = piece.lineFeedCnt;
        const newEnd = start;
        const newLineFeedCnt = this.getLineFeedCnt(piece.bufferIndex, piece.start, newEnd);
        const newLength = this.offsetInBuffer(piece.bufferIndex, start) - this.offsetInBuffer(piece.bufferIndex, originalStartPos);
        node.piece = new Piece(piece.bufferIndex, piece.start, newEnd, newLineFeedCnt, newLength);
        updateTreeMetadata(this, node, newLength - oldLength, newLineFeedCnt - oldLFCnt);
        // new right piece, end, originalEndPos
        const newPiece = new Piece(piece.bufferIndex, end, originalEndPos, this.getLineFeedCnt(piece.bufferIndex, end, originalEndPos), this.offsetInBuffer(piece.bufferIndex, originalEndPos) - this.offsetInBuffer(piece.bufferIndex, end));
        const newNode = this.rbInsertRight(node, newPiece);
        this.validateCRLFWithPrevNode(newNode);
    }
    appendToNode(node, value) {
        if (this.adjustCarriageReturnFromNext(value, node)) {
            value += '\n';
        }
        const hitCRLF = this.shouldCheckCRLF() && this.startWithLF(value) && this.endWithCR(node);
        const startOffset = this._buffers[0].buffer.length;
        this._buffers[0].buffer += value;
        const lineStarts = createLineStartsFast(value, false);
        for (let i = 0; i < lineStarts.length; i++) {
            lineStarts[i] += startOffset;
        }
        if (hitCRLF) {
            const prevStartOffset = this._buffers[0].lineStarts[this._buffers[0].lineStarts.length - 2];
            this._buffers[0].lineStarts.pop();
            // _lastChangeBufferPos is already wrong
            this._lastChangeBufferPos = { line: this._lastChangeBufferPos.line - 1, column: startOffset - prevStartOffset };
        }
        this._buffers[0].lineStarts = this._buffers[0].lineStarts.concat(lineStarts.slice(1));
        const endIndex = this._buffers[0].lineStarts.length - 1;
        const endColumn = this._buffers[0].buffer.length - this._buffers[0].lineStarts[endIndex];
        const newEnd = { line: endIndex, column: endColumn };
        const newLength = node.piece.length + value.length;
        const oldLineFeedCnt = node.piece.lineFeedCnt;
        const newLineFeedCnt = this.getLineFeedCnt(0, node.piece.start, newEnd);
        const lf_delta = newLineFeedCnt - oldLineFeedCnt;
        node.piece = new Piece(node.piece.bufferIndex, node.piece.start, newEnd, newLineFeedCnt, newLength);
        this._lastChangeBufferPos = newEnd;
        updateTreeMetadata(this, node, value.length, lf_delta);
    }
    nodeAt(offset) {
        let x = this.root;
        const cache = this._searchCache.get(offset);
        if (cache) {
            return {
                node: cache.node,
                nodeStartOffset: cache.nodeStartOffset,
                remainder: offset - cache.nodeStartOffset
            };
        }
        let nodeStartOffset = 0;
        while (x !== rbTreeBase_SENTINEL) {
            if (x.size_left > offset) {
                x = x.left;
            }
            else if (x.size_left + x.piece.length >= offset) {
                nodeStartOffset += x.size_left;
                const ret = {
                    node: x,
                    remainder: offset - x.size_left,
                    nodeStartOffset
                };
                this._searchCache.set(ret);
                return ret;
            }
            else {
                offset -= x.size_left + x.piece.length;
                nodeStartOffset += x.size_left + x.piece.length;
                x = x.right;
            }
        }
        return null;
    }
    nodeAt2(lineNumber, column) {
        let x = this.root;
        let nodeStartOffset = 0;
        while (x !== rbTreeBase_SENTINEL) {
            if (x.left !== rbTreeBase_SENTINEL && x.lf_left >= lineNumber - 1) {
                x = x.left;
            }
            else if (x.lf_left + x.piece.lineFeedCnt > lineNumber - 1) {
                const prevAccumualtedValue = this.getAccumulatedValue(x, lineNumber - x.lf_left - 2);
                const accumulatedValue = this.getAccumulatedValue(x, lineNumber - x.lf_left - 1);
                nodeStartOffset += x.size_left;
                return {
                    node: x,
                    remainder: Math.min(prevAccumualtedValue + column - 1, accumulatedValue),
                    nodeStartOffset
                };
            }
            else if (x.lf_left + x.piece.lineFeedCnt === lineNumber - 1) {
                const prevAccumualtedValue = this.getAccumulatedValue(x, lineNumber - x.lf_left - 2);
                if (prevAccumualtedValue + column - 1 <= x.piece.length) {
                    return {
                        node: x,
                        remainder: prevAccumualtedValue + column - 1,
                        nodeStartOffset
                    };
                }
                else {
                    column -= x.piece.length - prevAccumualtedValue;
                    break;
                }
            }
            else {
                lineNumber -= x.lf_left + x.piece.lineFeedCnt;
                nodeStartOffset += x.size_left + x.piece.length;
                x = x.right;
            }
        }
        // search in order, to find the node contains position.column
        x = x.next();
        while (x !== rbTreeBase_SENTINEL) {
            if (x.piece.lineFeedCnt > 0) {
                const accumulatedValue = this.getAccumulatedValue(x, 0);
                const nodeStartOffset = this.offsetOfNode(x);
                return {
                    node: x,
                    remainder: Math.min(column - 1, accumulatedValue),
                    nodeStartOffset
                };
            }
            else {
                if (x.piece.length >= column - 1) {
                    const nodeStartOffset = this.offsetOfNode(x);
                    return {
                        node: x,
                        remainder: column - 1,
                        nodeStartOffset
                    };
                }
                else {
                    column -= x.piece.length;
                }
            }
            x = x.next();
        }
        return null;
    }
    nodeCharCodeAt(node, offset) {
        if (node.piece.lineFeedCnt < 1) {
            return -1;
        }
        const buffer = this._buffers[node.piece.bufferIndex];
        const newOffset = this.offsetInBuffer(node.piece.bufferIndex, node.piece.start) + offset;
        return buffer.buffer.charCodeAt(newOffset);
    }
    offsetOfNode(node) {
        if (!node) {
            return 0;
        }
        let pos = node.size_left;
        while (node !== this.root) {
            if (node.parent.right === node) {
                pos += node.parent.size_left + node.parent.piece.length;
            }
            node = node.parent;
        }
        return pos;
    }
    // #endregion
    // #region CRLF
    shouldCheckCRLF() {
        return !(this._EOLNormalized && this._EOL === '\n');
    }
    startWithLF(val) {
        if (typeof val === 'string') {
            return val.charCodeAt(0) === 10;
        }
        if (val === rbTreeBase_SENTINEL || val.piece.lineFeedCnt === 0) {
            return false;
        }
        const piece = val.piece;
        const lineStarts = this._buffers[piece.bufferIndex].lineStarts;
        const line = piece.start.line;
        const startOffset = lineStarts[line] + piece.start.column;
        if (line === lineStarts.length - 1) {
            // last line, so there is no line feed at the end of this line
            return false;
        }
        const nextLineOffset = lineStarts[line + 1];
        if (nextLineOffset > startOffset + 1) {
            return false;
        }
        return this._buffers[piece.bufferIndex].buffer.charCodeAt(startOffset) === 10;
    }
    endWithCR(val) {
        if (typeof val === 'string') {
            return val.charCodeAt(val.length - 1) === 13;
        }
        if (val === rbTreeBase_SENTINEL || val.piece.lineFeedCnt === 0) {
            return false;
        }
        return this.nodeCharCodeAt(val, val.piece.length - 1) === 13;
    }
    validateCRLFWithPrevNode(nextNode) {
        if (this.shouldCheckCRLF() && this.startWithLF(nextNode)) {
            const node = nextNode.prev();
            if (this.endWithCR(node)) {
                this.fixCRLF(node, nextNode);
            }
        }
    }
    validateCRLFWithNextNode(node) {
        if (this.shouldCheckCRLF() && this.endWithCR(node)) {
            const nextNode = node.next();
            if (this.startWithLF(nextNode)) {
                this.fixCRLF(node, nextNode);
            }
        }
    }
    fixCRLF(prev, next) {
        const nodesToDel = [];
        // update node
        const lineStarts = this._buffers[prev.piece.bufferIndex].lineStarts;
        let newEnd;
        if (prev.piece.end.column === 0) {
            // it means, last line ends with \r, not \r\n
            newEnd = { line: prev.piece.end.line - 1, column: lineStarts[prev.piece.end.line] - lineStarts[prev.piece.end.line - 1] - 1 };
        }
        else {
            // \r\n
            newEnd = { line: prev.piece.end.line, column: prev.piece.end.column - 1 };
        }
        const prevNewLength = prev.piece.length - 1;
        const prevNewLFCnt = prev.piece.lineFeedCnt - 1;
        prev.piece = new Piece(prev.piece.bufferIndex, prev.piece.start, newEnd, prevNewLFCnt, prevNewLength);
        updateTreeMetadata(this, prev, -1, -1);
        if (prev.piece.length === 0) {
            nodesToDel.push(prev);
        }
        // update nextNode
        const newStart = { line: next.piece.start.line + 1, column: 0 };
        const newLength = next.piece.length - 1;
        const newLineFeedCnt = this.getLineFeedCnt(next.piece.bufferIndex, newStart, next.piece.end);
        next.piece = new Piece(next.piece.bufferIndex, newStart, next.piece.end, newLineFeedCnt, newLength);
        updateTreeMetadata(this, next, -1, -1);
        if (next.piece.length === 0) {
            nodesToDel.push(next);
        }
        // create new piece which contains \r\n
        const pieces = this.createNewPieces('\r\n');
        this.rbInsertRight(prev, pieces[0]);
        // delete empty nodes
        for (let i = 0; i < nodesToDel.length; i++) {
            rbDelete(this, nodesToDel[i]);
        }
    }
    adjustCarriageReturnFromNext(value, node) {
        if (this.shouldCheckCRLF() && this.endWithCR(value)) {
            const nextNode = node.next();
            if (this.startWithLF(nextNode)) {
                // move `\n` forward
                value += '\n';
                if (nextNode.piece.length === 1) {
                    rbDelete(this, nextNode);
                }
                else {
                    const piece = nextNode.piece;
                    const newStart = { line: piece.start.line + 1, column: 0 };
                    const newLength = piece.length - 1;
                    const newLineFeedCnt = this.getLineFeedCnt(piece.bufferIndex, newStart, piece.end);
                    nextNode.piece = new Piece(piece.bufferIndex, newStart, piece.end, newLineFeedCnt, newLength);
                    updateTreeMetadata(this, nextNode, -1, -1);
                }
                return true;
            }
        }
        return false;
    }
    // #endregion
    // #endregion
    // #region Tree operations
    iterate(node, callback) {
        if (node === rbTreeBase_SENTINEL) {
            return callback(rbTreeBase_SENTINEL);
        }
        const leftRet = this.iterate(node.left, callback);
        if (!leftRet) {
            return leftRet;
        }
        return callback(node) && this.iterate(node.right, callback);
    }
    getNodeContent(node) {
        if (node === rbTreeBase_SENTINEL) {
            return '';
        }
        const buffer = this._buffers[node.piece.bufferIndex];
        const piece = node.piece;
        const startOffset = this.offsetInBuffer(piece.bufferIndex, piece.start);
        const endOffset = this.offsetInBuffer(piece.bufferIndex, piece.end);
        const currentContent = buffer.buffer.substring(startOffset, endOffset);
        return currentContent;
    }
    getPieceContent(piece) {
        const buffer = this._buffers[piece.bufferIndex];
        const startOffset = this.offsetInBuffer(piece.bufferIndex, piece.start);
        const endOffset = this.offsetInBuffer(piece.bufferIndex, piece.end);
        const currentContent = buffer.buffer.substring(startOffset, endOffset);
        return currentContent;
    }
    /**
     *      node              node
     *     /  \              /  \
     *    a   b    <----   a    b
     *                         /
     *                        z
     */
    rbInsertRight(node, p) {
        const z = new TreeNode(p, 1 /* NodeColor.Red */);
        z.left = rbTreeBase_SENTINEL;
        z.right = rbTreeBase_SENTINEL;
        z.parent = rbTreeBase_SENTINEL;
        z.size_left = 0;
        z.lf_left = 0;
        const x = this.root;
        if (x === rbTreeBase_SENTINEL) {
            this.root = z;
            z.color = 0 /* NodeColor.Black */;
        }
        else if (node.right === rbTreeBase_SENTINEL) {
            node.right = z;
            z.parent = node;
        }
        else {
            const nextNode = rbTreeBase_leftest(node.right);
            nextNode.left = z;
            z.parent = nextNode;
        }
        fixInsert(this, z);
        return z;
    }
    /**
     *      node              node
     *     /  \              /  \
     *    a   b     ---->   a    b
     *                       \
     *                        z
     */
    rbInsertLeft(node, p) {
        const z = new TreeNode(p, 1 /* NodeColor.Red */);
        z.left = rbTreeBase_SENTINEL;
        z.right = rbTreeBase_SENTINEL;
        z.parent = rbTreeBase_SENTINEL;
        z.size_left = 0;
        z.lf_left = 0;
        if (this.root === rbTreeBase_SENTINEL) {
            this.root = z;
            z.color = 0 /* NodeColor.Black */;
        }
        else if (node.left === rbTreeBase_SENTINEL) {
            node.left = z;
            z.parent = node;
        }
        else {
            const prevNode = righttest(node.left); // a
            prevNode.right = z;
            z.parent = prevNode;
        }
        fixInsert(this, z);
        return z;
    }
}

// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/editor/common/core/textChange.js
var textChange = __webpack_require__(6949);
;// ./node_modules/monaco-editor/esm/vs/editor/common/model/pieceTreeTextBuffer/pieceTreeTextBuffer.js
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/








class PieceTreeTextBuffer extends lifecycle/* Disposable */.jG {
    constructor(chunks, BOM, eol, containsRTL, containsUnusualLineTerminators, isBasicASCII, eolNormalized) {
        super();
        this._onDidChangeContent = this._register(new common_event/* Emitter */.vl());
        this._BOM = BOM;
        this._mightContainNonBasicASCII = !isBasicASCII;
        this._mightContainRTL = containsRTL;
        this._mightContainUnusualLineTerminators = containsUnusualLineTerminators;
        this._pieceTree = new PieceTreeBase(chunks, eol, eolNormalized);
    }
    mightContainRTL() {
        return this._mightContainRTL;
    }
    mightContainUnusualLineTerminators() {
        return this._mightContainUnusualLineTerminators;
    }
    resetMightContainUnusualLineTerminators() {
        this._mightContainUnusualLineTerminators = false;
    }
    mightContainNonBasicASCII() {
        return this._mightContainNonBasicASCII;
    }
    getBOM() {
        return this._BOM;
    }
    getEOL() {
        return this._pieceTree.getEOL();
    }
    createSnapshot(preserveBOM) {
        return this._pieceTree.createSnapshot(preserveBOM ? this._BOM : '');
    }
    getOffsetAt(lineNumber, column) {
        return this._pieceTree.getOffsetAt(lineNumber, column);
    }
    getPositionAt(offset) {
        return this._pieceTree.getPositionAt(offset);
    }
    getRangeAt(start, length) {
        const end = start + length;
        const startPosition = this.getPositionAt(start);
        const endPosition = this.getPositionAt(end);
        return new core_range/* Range */.Q(startPosition.lineNumber, startPosition.column, endPosition.lineNumber, endPosition.column);
    }
    getValueInRange(range, eol = 0 /* EndOfLinePreference.TextDefined */) {
        if (range.isEmpty()) {
            return '';
        }
        const lineEnding = this._getEndOfLine(eol);
        return this._pieceTree.getValueInRange(range, lineEnding);
    }
    getValueLengthInRange(range, eol = 0 /* EndOfLinePreference.TextDefined */) {
        if (range.isEmpty()) {
            return 0;
        }
        if (range.startLineNumber === range.endLineNumber) {
            return (range.endColumn - range.startColumn);
        }
        const startOffset = this.getOffsetAt(range.startLineNumber, range.startColumn);
        const endOffset = this.getOffsetAt(range.endLineNumber, range.endColumn);
        // offsets use the text EOL, so we need to compensate for length differences
        // if the requested EOL doesn't match the text EOL
        let eolOffsetCompensation = 0;
        const desiredEOL = this._getEndOfLine(eol);
        const actualEOL = this.getEOL();
        if (desiredEOL.length !== actualEOL.length) {
            const delta = desiredEOL.length - actualEOL.length;
            const eolCount = range.endLineNumber - range.startLineNumber;
            eolOffsetCompensation = delta * eolCount;
        }
        return endOffset - startOffset + eolOffsetCompensation;
    }
    getCharacterCountInRange(range, eol = 0 /* EndOfLinePreference.TextDefined */) {
        if (this._mightContainNonBasicASCII) {
            // we must count by iterating
            let result = 0;
            const fromLineNumber = range.startLineNumber;
            const toLineNumber = range.endLineNumber;
            for (let lineNumber = fromLineNumber; lineNumber <= toLineNumber; lineNumber++) {
                const lineContent = this.getLineContent(lineNumber);
                const fromOffset = (lineNumber === fromLineNumber ? range.startColumn - 1 : 0);
                const toOffset = (lineNumber === toLineNumber ? range.endColumn - 1 : lineContent.length);
                for (let offset = fromOffset; offset < toOffset; offset++) {
                    if (strings/* isHighSurrogate */.pc(lineContent.charCodeAt(offset))) {
                        result = result + 1;
                        offset = offset + 1;
                    }
                    else {
                        result = result + 1;
                    }
                }
            }
            result += this._getEndOfLine(eol).length * (toLineNumber - fromLineNumber);
            return result;
        }
        return this.getValueLengthInRange(range, eol);
    }
    getLength() {
        return this._pieceTree.getLength();
    }
    getLineCount() {
        return this._pieceTree.getLineCount();
    }
    getLinesContent() {
        return this._pieceTree.getLinesContent();
    }
    getLineContent(lineNumber) {
        return this._pieceTree.getLineContent(lineNumber);
    }
    getLineCharCode(lineNumber, index) {
        return this._pieceTree.getLineCharCode(lineNumber, index);
    }
    getLineLength(lineNumber) {
        return this._pieceTree.getLineLength(lineNumber);
    }
    getLineFirstNonWhitespaceColumn(lineNumber) {
        const result = strings/* firstNonWhitespaceIndex */.HG(this.getLineContent(lineNumber));
        if (result === -1) {
            return 0;
        }
        return result + 1;
    }
    getLineLastNonWhitespaceColumn(lineNumber) {
        const result = strings/* lastNonWhitespaceIndex */.lT(this.getLineContent(lineNumber));
        if (result === -1) {
            return 0;
        }
        return result + 2;
    }
    _getEndOfLine(eol) {
        switch (eol) {
            case 1 /* EndOfLinePreference.LF */:
                return '\n';
            case 2 /* EndOfLinePreference.CRLF */:
                return '\r\n';
            case 0 /* EndOfLinePreference.TextDefined */:
                return this.getEOL();
            default:
                throw new Error('Unknown EOL preference');
        }
    }
    setEOL(newEOL) {
        this._pieceTree.setEOL(newEOL);
    }
    applyEdits(rawOperations, recordTrimAutoWhitespace, computeUndoEdits) {
        let mightContainRTL = this._mightContainRTL;
        let mightContainUnusualLineTerminators = this._mightContainUnusualLineTerminators;
        let mightContainNonBasicASCII = this._mightContainNonBasicASCII;
        let canReduceOperations = true;
        let operations = [];
        for (let i = 0; i < rawOperations.length; i++) {
            const op = rawOperations[i];
            if (canReduceOperations && op._isTracked) {
                canReduceOperations = false;
            }
            const validatedRange = op.range;
            if (op.text) {
                let textMightContainNonBasicASCII = true;
                if (!mightContainNonBasicASCII) {
                    textMightContainNonBasicASCII = !strings/* isBasicASCII */.aC(op.text);
                    mightContainNonBasicASCII = textMightContainNonBasicASCII;
                }
                if (!mightContainRTL && textMightContainNonBasicASCII) {
                    // check if the new inserted text contains RTL
                    mightContainRTL = strings/* containsRTL */.E_(op.text);
                }
                if (!mightContainUnusualLineTerminators && textMightContainNonBasicASCII) {
                    // check if the new inserted text contains unusual line terminators
                    mightContainUnusualLineTerminators = strings/* containsUnusualLineTerminators */.$X(op.text);
                }
            }
            let validText = '';
            let eolCount = 0;
            let firstLineLength = 0;
            let lastLineLength = 0;
            if (op.text) {
                let strEOL;
                [eolCount, firstLineLength, lastLineLength, strEOL] = (0,eolCounter/* countEOL */.W)(op.text);
                const bufferEOL = this.getEOL();
                const expectedStrEOL = (bufferEOL === '\r\n' ? 2 /* StringEOL.CRLF */ : 1 /* StringEOL.LF */);
                if (strEOL === 0 /* StringEOL.Unknown */ || strEOL === expectedStrEOL) {
                    validText = op.text;
                }
                else {
                    validText = op.text.replace(/\r\n|\r|\n/g, bufferEOL);
                }
            }
            operations[i] = {
                sortIndex: i,
                identifier: op.identifier || null,
                range: validatedRange,
                rangeOffset: this.getOffsetAt(validatedRange.startLineNumber, validatedRange.startColumn),
                rangeLength: this.getValueLengthInRange(validatedRange),
                text: validText,
                eolCount: eolCount,
                firstLineLength: firstLineLength,
                lastLineLength: lastLineLength,
                forceMoveMarkers: Boolean(op.forceMoveMarkers),
                isAutoWhitespaceEdit: op.isAutoWhitespaceEdit || false
            };
        }
        // Sort operations ascending
        operations.sort(PieceTreeTextBuffer._sortOpsAscending);
        let hasTouchingRanges = false;
        for (let i = 0, count = operations.length - 1; i < count; i++) {
            const rangeEnd = operations[i].range.getEndPosition();
            const nextRangeStart = operations[i + 1].range.getStartPosition();
            if (nextRangeStart.isBeforeOrEqual(rangeEnd)) {
                if (nextRangeStart.isBefore(rangeEnd)) {
                    // overlapping ranges
                    throw new Error('Overlapping ranges are not allowed!');
                }
                hasTouchingRanges = true;
            }
        }
        if (canReduceOperations) {
            operations = this._reduceOperations(operations);
        }
        // Delta encode operations
        const reverseRanges = (computeUndoEdits || recordTrimAutoWhitespace ? PieceTreeTextBuffer._getInverseEditRanges(operations) : []);
        const newTrimAutoWhitespaceCandidates = [];
        if (recordTrimAutoWhitespace) {
            for (let i = 0; i < operations.length; i++) {
                const op = operations[i];
                const reverseRange = reverseRanges[i];
                if (op.isAutoWhitespaceEdit && op.range.isEmpty()) {
                    // Record already the future line numbers that might be auto whitespace removal candidates on next edit
                    for (let lineNumber = reverseRange.startLineNumber; lineNumber <= reverseRange.endLineNumber; lineNumber++) {
                        let currentLineContent = '';
                        if (lineNumber === reverseRange.startLineNumber) {
                            currentLineContent = this.getLineContent(op.range.startLineNumber);
                            if (strings/* firstNonWhitespaceIndex */.HG(currentLineContent) !== -1) {
                                continue;
                            }
                        }
                        newTrimAutoWhitespaceCandidates.push({ lineNumber: lineNumber, oldContent: currentLineContent });
                    }
                }
            }
        }
        let reverseOperations = null;
        if (computeUndoEdits) {
            let reverseRangeDeltaOffset = 0;
            reverseOperations = [];
            for (let i = 0; i < operations.length; i++) {
                const op = operations[i];
                const reverseRange = reverseRanges[i];
                const bufferText = this.getValueInRange(op.range);
                const reverseRangeOffset = op.rangeOffset + reverseRangeDeltaOffset;
                reverseRangeDeltaOffset += (op.text.length - bufferText.length);
                reverseOperations[i] = {
                    sortIndex: op.sortIndex,
                    identifier: op.identifier,
                    range: reverseRange,
                    text: bufferText,
                    textChange: new textChange/* TextChange */.k(op.rangeOffset, bufferText, reverseRangeOffset, op.text)
                };
            }
            // Can only sort reverse operations when the order is not significant
            if (!hasTouchingRanges) {
                reverseOperations.sort((a, b) => a.sortIndex - b.sortIndex);
            }
        }
        this._mightContainRTL = mightContainRTL;
        this._mightContainUnusualLineTerminators = mightContainUnusualLineTerminators;
        this._mightContainNonBasicASCII = mightContainNonBasicASCII;
        const contentChanges = this._doApplyEdits(operations);
        let trimAutoWhitespaceLineNumbers = null;
        if (recordTrimAutoWhitespace && newTrimAutoWhitespaceCandidates.length > 0) {
            // sort line numbers auto whitespace removal candidates for next edit descending
            newTrimAutoWhitespaceCandidates.sort((a, b) => b.lineNumber - a.lineNumber);
            trimAutoWhitespaceLineNumbers = [];
            for (let i = 0, len = newTrimAutoWhitespaceCandidates.length; i < len; i++) {
                const lineNumber = newTrimAutoWhitespaceCandidates[i].lineNumber;
                if (i > 0 && newTrimAutoWhitespaceCandidates[i - 1].lineNumber === lineNumber) {
                    // Do not have the same line number twice
                    continue;
                }
                const prevContent = newTrimAutoWhitespaceCandidates[i].oldContent;
                const lineContent = this.getLineContent(lineNumber);
                if (lineContent.length === 0 || lineContent === prevContent || strings/* firstNonWhitespaceIndex */.HG(lineContent) !== -1) {
                    continue;
                }
                trimAutoWhitespaceLineNumbers.push(lineNumber);
            }
        }
        this._onDidChangeContent.fire();
        return new model/* ApplyEditsResult */.F4(reverseOperations, contentChanges, trimAutoWhitespaceLineNumbers);
    }
    /**
     * Transform operations such that they represent the same logic edit,
     * but that they also do not cause OOM crashes.
     */
    _reduceOperations(operations) {
        if (operations.length < 1000) {
            // We know from empirical testing that a thousand edits work fine regardless of their shape.
            return operations;
        }
        // At one point, due to how events are emitted and how each operation is handled,
        // some operations can trigger a high amount of temporary string allocations,
        // that will immediately get edited again.
        // e.g. a formatter inserting ridiculous ammounts of \n on a model with a single line
        // Therefore, the strategy is to collapse all the operations into a huge single edit operation
        return [this._toSingleEditOperation(operations)];
    }
    _toSingleEditOperation(operations) {
        let forceMoveMarkers = false;
        const firstEditRange = operations[0].range;
        const lastEditRange = operations[operations.length - 1].range;
        const entireEditRange = new core_range/* Range */.Q(firstEditRange.startLineNumber, firstEditRange.startColumn, lastEditRange.endLineNumber, lastEditRange.endColumn);
        let lastEndLineNumber = firstEditRange.startLineNumber;
        let lastEndColumn = firstEditRange.startColumn;
        const result = [];
        for (let i = 0, len = operations.length; i < len; i++) {
            const operation = operations[i];
            const range = operation.range;
            forceMoveMarkers = forceMoveMarkers || operation.forceMoveMarkers;
            // (1) -- Push old text
            result.push(this.getValueInRange(new core_range/* Range */.Q(lastEndLineNumber, lastEndColumn, range.startLineNumber, range.startColumn)));
            // (2) -- Push new text
            if (operation.text.length > 0) {
                result.push(operation.text);
            }
            lastEndLineNumber = range.endLineNumber;
            lastEndColumn = range.endColumn;
        }
        const text = result.join('');
        const [eolCount, firstLineLength, lastLineLength] = (0,eolCounter/* countEOL */.W)(text);
        return {
            sortIndex: 0,
            identifier: operations[0].identifier,
            range: entireEditRange,
            rangeOffset: this.getOffsetAt(entireEditRange.startLineNumber, entireEditRange.startColumn),
            rangeLength: this.getValueLengthInRange(entireEditRange, 0 /* EndOfLinePreference.TextDefined */),
            text: text,
            eolCount: eolCount,
            firstLineLength: firstLineLength,
            lastLineLength: lastLineLength,
            forceMoveMarkers: forceMoveMarkers,
            isAutoWhitespaceEdit: false
        };
    }
    _doApplyEdits(operations) {
        operations.sort(PieceTreeTextBuffer._sortOpsDescending);
        const contentChanges = [];
        // operations are from bottom to top
        for (let i = 0; i < operations.length; i++) {
            const op = operations[i];
            const startLineNumber = op.range.startLineNumber;
            const startColumn = op.range.startColumn;
            const endLineNumber = op.range.endLineNumber;
            const endColumn = op.range.endColumn;
            if (startLineNumber === endLineNumber && startColumn === endColumn && op.text.length === 0) {
                // no-op
                continue;
            }
            if (op.text) {
                // replacement
                this._pieceTree.delete(op.rangeOffset, op.rangeLength);
                this._pieceTree.insert(op.rangeOffset, op.text, true);
            }
            else {
                // deletion
                this._pieceTree.delete(op.rangeOffset, op.rangeLength);
            }
            const contentChangeRange = new core_range/* Range */.Q(startLineNumber, startColumn, endLineNumber, endColumn);
            contentChanges.push({
                range: contentChangeRange,
                rangeLength: op.rangeLength,
                text: op.text,
                rangeOffset: op.rangeOffset,
                forceMoveMarkers: op.forceMoveMarkers
            });
        }
        return contentChanges;
    }
    findMatchesLineByLine(searchRange, searchData, captureMatches, limitResultCount) {
        return this._pieceTree.findMatchesLineByLine(searchRange, searchData, captureMatches, limitResultCount);
    }
    /**
     * Assumes `operations` are validated and sorted ascending
     */
    static _getInverseEditRanges(operations) {
        const result = [];
        let prevOpEndLineNumber = 0;
        let prevOpEndColumn = 0;
        let prevOp = null;
        for (let i = 0, len = operations.length; i < len; i++) {
            const op = operations[i];
            let startLineNumber;
            let startColumn;
            if (prevOp) {
                if (prevOp.range.endLineNumber === op.range.startLineNumber) {
                    startLineNumber = prevOpEndLineNumber;
                    startColumn = prevOpEndColumn + (op.range.startColumn - prevOp.range.endColumn);
                }
                else {
                    startLineNumber = prevOpEndLineNumber + (op.range.startLineNumber - prevOp.range.endLineNumber);
                    startColumn = op.range.startColumn;
                }
            }
            else {
                startLineNumber = op.range.startLineNumber;
                startColumn = op.range.startColumn;
            }
            let resultRange;
            if (op.text.length > 0) {
                // the operation inserts something
                const lineCount = op.eolCount + 1;
                if (lineCount === 1) {
                    // single line insert
                    resultRange = new core_range/* Range */.Q(startLineNumber, startColumn, startLineNumber, startColumn + op.firstLineLength);
                }
                else {
                    // multi line insert
                    resultRange = new core_range/* Range */.Q(startLineNumber, startColumn, startLineNumber + lineCount - 1, op.lastLineLength + 1);
                }
            }
            else {
                // There is nothing to insert
                resultRange = new core_range/* Range */.Q(startLineNumber, startColumn, startLineNumber, startColumn);
            }
            prevOpEndLineNumber = resultRange.endLineNumber;
            prevOpEndColumn = resultRange.endColumn;
            result.push(resultRange);
            prevOp = op;
        }
        return result;
    }
    static _sortOpsAscending(a, b) {
        const r = core_range/* Range */.Q.compareRangesUsingEnds(a.range, b.range);
        if (r === 0) {
            return a.sortIndex - b.sortIndex;
        }
        return r;
    }
    static _sortOpsDescending(a, b) {
        const r = core_range/* Range */.Q.compareRangesUsingEnds(a.range, b.range);
        if (r === 0) {
            return b.sortIndex - a.sortIndex;
        }
        return -r;
    }
}

;// ./node_modules/monaco-editor/esm/vs/editor/common/model/pieceTreeTextBuffer/pieceTreeTextBufferBuilder.js
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/



class PieceTreeTextBufferFactory {
    constructor(_chunks, _bom, _cr, _lf, _crlf, _containsRTL, _containsUnusualLineTerminators, _isBasicASCII, _normalizeEOL) {
        this._chunks = _chunks;
        this._bom = _bom;
        this._cr = _cr;
        this._lf = _lf;
        this._crlf = _crlf;
        this._containsRTL = _containsRTL;
        this._containsUnusualLineTerminators = _containsUnusualLineTerminators;
        this._isBasicASCII = _isBasicASCII;
        this._normalizeEOL = _normalizeEOL;
    }
    _getEOL(defaultEOL) {
        const totalEOLCount = this._cr + this._lf + this._crlf;
        const totalCRCount = this._cr + this._crlf;
        if (totalEOLCount === 0) {
            // This is an empty file or a file with precisely one line
            return (defaultEOL === 1 /* DefaultEndOfLine.LF */ ? '\n' : '\r\n');
        }
        if (totalCRCount > totalEOLCount / 2) {
            // More than half of the file contains \r\n ending lines
            return '\r\n';
        }
        // At least one line more ends in \n
        return '\n';
    }
    create(defaultEOL) {
        const eol = this._getEOL(defaultEOL);
        const chunks = this._chunks;
        if (this._normalizeEOL &&
            ((eol === '\r\n' && (this._cr > 0 || this._lf > 0))
                || (eol === '\n' && (this._cr > 0 || this._crlf > 0)))) {
            // Normalize pieces
            for (let i = 0, len = chunks.length; i < len; i++) {
                const str = chunks[i].buffer.replace(/\r\n|\r|\n/g, eol);
                const newLineStart = createLineStartsFast(str);
                chunks[i] = new StringBuffer(str, newLineStart);
            }
        }
        const textBuffer = new PieceTreeTextBuffer(chunks, this._bom, eol, this._containsRTL, this._containsUnusualLineTerminators, this._isBasicASCII, this._normalizeEOL);
        return { textBuffer: textBuffer, disposable: textBuffer };
    }
}
class PieceTreeTextBufferBuilder {
    constructor() {
        this.chunks = [];
        this.BOM = '';
        this._hasPreviousChar = false;
        this._previousChar = 0;
        this._tmpLineStarts = [];
        this.cr = 0;
        this.lf = 0;
        this.crlf = 0;
        this.containsRTL = false;
        this.containsUnusualLineTerminators = false;
        this.isBasicASCII = true;
    }
    acceptChunk(chunk) {
        if (chunk.length === 0) {
            return;
        }
        if (this.chunks.length === 0) {
            if (strings/* startsWithUTF8BOM */.LU(chunk)) {
                this.BOM = strings/* UTF8_BOM_CHARACTER */.r_;
                chunk = chunk.substr(1);
            }
        }
        const lastChar = chunk.charCodeAt(chunk.length - 1);
        if (lastChar === 13 /* CharCode.CarriageReturn */ || (lastChar >= 0xD800 && lastChar <= 0xDBFF)) {
            // last character is \r or a high surrogate => keep it back
            this._acceptChunk1(chunk.substr(0, chunk.length - 1), false);
            this._hasPreviousChar = true;
            this._previousChar = lastChar;
        }
        else {
            this._acceptChunk1(chunk, false);
            this._hasPreviousChar = false;
            this._previousChar = lastChar;
        }
    }
    _acceptChunk1(chunk, allowEmptyStrings) {
        if (!allowEmptyStrings && chunk.length === 0) {
            // Nothing to do
            return;
        }
        if (this._hasPreviousChar) {
            this._acceptChunk2(String.fromCharCode(this._previousChar) + chunk);
        }
        else {
            this._acceptChunk2(chunk);
        }
    }
    _acceptChunk2(chunk) {
        const lineStarts = createLineStarts(this._tmpLineStarts, chunk);
        this.chunks.push(new StringBuffer(chunk, lineStarts.lineStarts));
        this.cr += lineStarts.cr;
        this.lf += lineStarts.lf;
        this.crlf += lineStarts.crlf;
        if (!lineStarts.isBasicASCII) {
            // this chunk contains non basic ASCII characters
            this.isBasicASCII = false;
            if (!this.containsRTL) {
                this.containsRTL = strings/* containsRTL */.E_(chunk);
            }
            if (!this.containsUnusualLineTerminators) {
                this.containsUnusualLineTerminators = strings/* containsUnusualLineTerminators */.$X(chunk);
            }
        }
    }
    finish(normalizeEOL = true) {
        this._finish();
        return new PieceTreeTextBufferFactory(this.chunks, this.BOM, this.cr, this.lf, this.crlf, this.containsRTL, this.containsUnusualLineTerminators, this.isBasicASCII, normalizeEOL);
    }
    _finish() {
        if (this.chunks.length === 0) {
            this._acceptChunk1('', true);
        }
        if (this._hasPreviousChar) {
            this._hasPreviousChar = false;
            // recreate last chunk
            const lastChunk = this.chunks[this.chunks.length - 1];
            lastChunk.buffer += String.fromCharCode(this._previousChar);
            const newLineStarts = createLineStartsFast(lastChunk.buffer);
            lastChunk.lineStarts = newLineStarts;
            if (this._previousChar === 13 /* CharCode.CarriageReturn */) {
                this.cr++;
            }
        }
    }
}

// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/editor/common/core/lineRange.js
var lineRange = __webpack_require__(79955);
// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/editor/common/core/wordHelper.js
var wordHelper = __webpack_require__(18782);
// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/editor/common/languages.js + 1 modules
var languages = __webpack_require__(44364);
// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/editor/common/model/textModelPart.js
var textModelPart = __webpack_require__(32177);
// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/base/common/async.js
var common_async = __webpack_require__(65958);
// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/base/common/platform.js
var platform = __webpack_require__(63339);
// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/base/common/stopwatch.js
var stopwatch = __webpack_require__(23013);
// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/editor/common/core/offsetRange.js
var offsetRange = __webpack_require__(72532);
// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/editor/common/languages/nullTokenize.js
var nullTokenize = __webpack_require__(97036);
;// ./node_modules/monaco-editor/esm/vs/editor/common/model/fixedArray.js
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * An array that avoids being sparse by always
 * filling up unused indices with a default value.
 */
class FixedArray {
    constructor(_default) {
        this._default = _default;
        this._store = [];
    }
    get(index) {
        if (index < this._store.length) {
            return this._store[index];
        }
        return this._default;
    }
    set(index, value) {
        while (index >= this._store.length) {
            this._store[this._store.length] = this._default;
        }
        this._store[index] = value;
    }
    replace(index, oldLength, newLength) {
        if (index >= this._store.length) {
            return;
        }
        if (oldLength === 0) {
            this.insert(index, newLength);
            return;
        }
        else if (newLength === 0) {
            this.delete(index, oldLength);
            return;
        }
        const before = this._store.slice(0, index);
        const after = this._store.slice(index + oldLength);
        const insertArr = arrayFill(newLength, this._default);
        this._store = before.concat(insertArr, after);
    }
    delete(deleteIndex, deleteCount) {
        if (deleteCount === 0 || deleteIndex >= this._store.length) {
            return;
        }
        this._store.splice(deleteIndex, deleteCount);
    }
    insert(insertIndex, insertCount) {
        if (insertCount === 0 || insertIndex >= this._store.length) {
            return;
        }
        const arr = [];
        for (let i = 0; i < insertCount; i++) {
            arr[i] = this._default;
        }
        this._store = (0,arrays/* arrayInsert */.nK)(this._store, insertIndex, arr);
    }
}
function arrayFill(length, value) {
    const arr = [];
    for (let i = 0; i < length; i++) {
        arr[i] = value;
    }
    return arr;
}

;// ./node_modules/monaco-editor/esm/vs/editor/common/tokens/contiguousMultilineTokens.js
/**
 * Represents contiguous tokens over a contiguous range of lines.
 */
class ContiguousMultilineTokens {
    /**
     * (Inclusive) start line number for these tokens.
     */
    get startLineNumber() {
        return this._startLineNumber;
    }
    /**
     * (Inclusive) end line number for these tokens.
     */
    get endLineNumber() {
        return this._startLineNumber + this._tokens.length - 1;
    }
    constructor(startLineNumber, tokens) {
        this._startLineNumber = startLineNumber;
        this._tokens = tokens;
    }
    /**
     * @see {@link _tokens}
     */
    getLineTokens(lineNumber) {
        return this._tokens[lineNumber - this._startLineNumber];
    }
    appendLineTokens(lineTokens) {
        this._tokens.push(lineTokens);
    }
}

;// ./node_modules/monaco-editor/esm/vs/editor/common/tokens/contiguousMultilineTokensBuilder.js

class ContiguousMultilineTokensBuilder {
    constructor() {
        this._tokens = [];
    }
    add(lineNumber, lineTokens) {
        if (this._tokens.length > 0) {
            const last = this._tokens[this._tokens.length - 1];
            if (last.endLineNumber + 1 === lineNumber) {
                // append
                last.appendLineTokens(lineTokens);
                return;
            }
        }
        this._tokens.push(new ContiguousMultilineTokens(lineNumber, [lineTokens]));
    }
    finalize() {
        return this._tokens;
    }
}

// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/editor/common/tokens/lineTokens.js
var tokens_lineTokens = __webpack_require__(57445);
;// ./node_modules/monaco-editor/esm/vs/editor/common/model/textModelTokens.js
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/











class TokenizerWithStateStore {
    constructor(lineCount, tokenizationSupport) {
        this.tokenizationSupport = tokenizationSupport;
        this.initialState = this.tokenizationSupport.getInitialState();
        this.store = new TrackingTokenizationStateStore(lineCount);
    }
    getStartState(lineNumber) {
        return this.store.getStartState(lineNumber, this.initialState);
    }
    getFirstInvalidLine() {
        return this.store.getFirstInvalidLine(this.initialState);
    }
}
class TokenizerWithStateStoreAndTextModel extends TokenizerWithStateStore {
    constructor(lineCount, tokenizationSupport, _textModel, _languageIdCodec) {
        super(lineCount, tokenizationSupport);
        this._textModel = _textModel;
        this._languageIdCodec = _languageIdCodec;
    }
    updateTokensUntilLine(builder, lineNumber) {
        const languageId = this._textModel.getLanguageId();
        while (true) {
            const lineToTokenize = this.getFirstInvalidLine();
            if (!lineToTokenize || lineToTokenize.lineNumber > lineNumber) {
                break;
            }
            const text = this._textModel.getLineContent(lineToTokenize.lineNumber);
            const r = safeTokenize(this._languageIdCodec, languageId, this.tokenizationSupport, text, true, lineToTokenize.startState);
            builder.add(lineToTokenize.lineNumber, r.tokens);
            this.store.setEndState(lineToTokenize.lineNumber, r.endState);
        }
    }
    /** assumes state is up to date */
    getTokenTypeIfInsertingCharacter(position, character) {
        // TODO@hediet: use tokenizeLineWithEdit
        const lineStartState = this.getStartState(position.lineNumber);
        if (!lineStartState) {
            return 0 /* StandardTokenType.Other */;
        }
        const languageId = this._textModel.getLanguageId();
        const lineContent = this._textModel.getLineContent(position.lineNumber);
        // Create the text as if `character` was inserted
        const text = (lineContent.substring(0, position.column - 1)
            + character
            + lineContent.substring(position.column - 1));
        const r = safeTokenize(this._languageIdCodec, languageId, this.tokenizationSupport, text, true, lineStartState);
        const lineTokens = new tokens_lineTokens/* LineTokens */.f(r.tokens, text, this._languageIdCodec);
        if (lineTokens.getCount() === 0) {
            return 0 /* StandardTokenType.Other */;
        }
        const tokenIndex = lineTokens.findTokenIndexAtOffset(position.column - 1);
        return lineTokens.getStandardTokenType(tokenIndex);
    }
    /** assumes state is up to date */
    tokenizeLineWithEdit(position, length, newText) {
        const lineNumber = position.lineNumber;
        const column = position.column;
        const lineStartState = this.getStartState(lineNumber);
        if (!lineStartState) {
            return null;
        }
        const curLineContent = this._textModel.getLineContent(lineNumber);
        const newLineContent = curLineContent.substring(0, column - 1)
            + newText + curLineContent.substring(column - 1 + length);
        const languageId = this._textModel.getLanguageIdAtPosition(lineNumber, 0);
        const result = safeTokenize(this._languageIdCodec, languageId, this.tokenizationSupport, newLineContent, true, lineStartState);
        const lineTokens = new tokens_lineTokens/* LineTokens */.f(result.tokens, newLineContent, this._languageIdCodec);
        return lineTokens;
    }
    hasAccurateTokensForLine(lineNumber) {
        const firstInvalidLineNumber = this.store.getFirstInvalidEndStateLineNumberOrMax();
        return (lineNumber < firstInvalidLineNumber);
    }
    isCheapToTokenize(lineNumber) {
        const firstInvalidLineNumber = this.store.getFirstInvalidEndStateLineNumberOrMax();
        if (lineNumber < firstInvalidLineNumber) {
            return true;
        }
        if (lineNumber === firstInvalidLineNumber
            && this._textModel.getLineLength(lineNumber) < 2048 /* Constants.CHEAP_TOKENIZATION_LENGTH_LIMIT */) {
            return true;
        }
        return false;
    }
    /**
     * The result is not cached.
     */
    tokenizeHeuristically(builder, startLineNumber, endLineNumber) {
        if (endLineNumber <= this.store.getFirstInvalidEndStateLineNumberOrMax()) {
            // nothing to do
            return { heuristicTokens: false };
        }
        if (startLineNumber <= this.store.getFirstInvalidEndStateLineNumberOrMax()) {
            // tokenization has reached the viewport start...
            this.updateTokensUntilLine(builder, endLineNumber);
            return { heuristicTokens: false };
        }
        let state = this.guessStartState(startLineNumber);
        const languageId = this._textModel.getLanguageId();
        for (let lineNumber = startLineNumber; lineNumber <= endLineNumber; lineNumber++) {
            const text = this._textModel.getLineContent(lineNumber);
            const r = safeTokenize(this._languageIdCodec, languageId, this.tokenizationSupport, text, true, state);
            builder.add(lineNumber, r.tokens);
            state = r.endState;
        }
        return { heuristicTokens: true };
    }
    guessStartState(lineNumber) {
        let nonWhitespaceColumn = this._textModel.getLineFirstNonWhitespaceColumn(lineNumber);
        const likelyRelevantLines = [];
        let initialState = null;
        for (let i = lineNumber - 1; nonWhitespaceColumn > 1 && i >= 1; i--) {
            const newNonWhitespaceIndex = this._textModel.getLineFirstNonWhitespaceColumn(i);
            // Ignore lines full of whitespace
            if (newNonWhitespaceIndex === 0) {
                continue;
            }
            if (newNonWhitespaceIndex < nonWhitespaceColumn) {
                likelyRelevantLines.push(this._textModel.getLineContent(i));
                nonWhitespaceColumn = newNonWhitespaceIndex;
                initialState = this.getStartState(i);
                if (initialState) {
                    break;
                }
            }
        }
        if (!initialState) {
            initialState = this.tokenizationSupport.getInitialState();
        }
        likelyRelevantLines.reverse();
        const languageId = this._textModel.getLanguageId();
        let state = initialState;
        for (const line of likelyRelevantLines) {
            const r = safeTokenize(this._languageIdCodec, languageId, this.tokenizationSupport, line, false, state);
            state = r.endState;
        }
        return state;
    }
}
/**
 * **Invariant:**
 * If the text model is retokenized from line 1 to {@link getFirstInvalidEndStateLineNumber}() - 1,
 * then the recomputed end state for line l will be equal to {@link getEndState}(l).
 */
class TrackingTokenizationStateStore {
    constructor(lineCount) {
        this.lineCount = lineCount;
        this._tokenizationStateStore = new TokenizationStateStore();
        this._invalidEndStatesLineNumbers = new RangePriorityQueueImpl();
        this._invalidEndStatesLineNumbers.addRange(new offsetRange/* OffsetRange */.L(1, lineCount + 1));
    }
    getEndState(lineNumber) {
        return this._tokenizationStateStore.getEndState(lineNumber);
    }
    /**
     * @returns if the end state has changed.
     */
    setEndState(lineNumber, state) {
        if (!state) {
            throw new errors/* BugIndicatingError */.D7('Cannot set null/undefined state');
        }
        this._invalidEndStatesLineNumbers.delete(lineNumber);
        const r = this._tokenizationStateStore.setEndState(lineNumber, state);
        if (r && lineNumber < this.lineCount) {
            // because the state changed, we cannot trust the next state anymore and have to invalidate it.
            this._invalidEndStatesLineNumbers.addRange(new offsetRange/* OffsetRange */.L(lineNumber + 1, lineNumber + 2));
        }
        return r;
    }
    acceptChange(range, newLineCount) {
        this.lineCount += newLineCount - range.length;
        this._tokenizationStateStore.acceptChange(range, newLineCount);
        this._invalidEndStatesLineNumbers.addRangeAndResize(new offsetRange/* OffsetRange */.L(range.startLineNumber, range.endLineNumberExclusive), newLineCount);
    }
    acceptChanges(changes) {
        for (const c of changes) {
            const [eolCount] = (0,eolCounter/* countEOL */.W)(c.text);
            this.acceptChange(new lineRange/* LineRange */.M(c.range.startLineNumber, c.range.endLineNumber + 1), eolCount + 1);
        }
    }
    invalidateEndStateRange(range) {
        this._invalidEndStatesLineNumbers.addRange(new offsetRange/* OffsetRange */.L(range.startLineNumber, range.endLineNumberExclusive));
    }
    getFirstInvalidEndStateLineNumber() { return this._invalidEndStatesLineNumbers.min; }
    getFirstInvalidEndStateLineNumberOrMax() {
        return this.getFirstInvalidEndStateLineNumber() || Number.MAX_SAFE_INTEGER;
    }
    allStatesValid() { return this._invalidEndStatesLineNumbers.min === null; }
    getStartState(lineNumber, initialState) {
        if (lineNumber === 1) {
            return initialState;
        }
        return this.getEndState(lineNumber - 1);
    }
    getFirstInvalidLine(initialState) {
        const lineNumber = this.getFirstInvalidEndStateLineNumber();
        if (lineNumber === null) {
            return null;
        }
        const startState = this.getStartState(lineNumber, initialState);
        if (!startState) {
            throw new errors/* BugIndicatingError */.D7('Start state must be defined');
        }
        return { lineNumber, startState };
    }
}
class TokenizationStateStore {
    constructor() {
        this._lineEndStates = new FixedArray(null);
    }
    getEndState(lineNumber) {
        return this._lineEndStates.get(lineNumber);
    }
    setEndState(lineNumber, state) {
        const oldState = this._lineEndStates.get(lineNumber);
        if (oldState && oldState.equals(state)) {
            return false;
        }
        this._lineEndStates.set(lineNumber, state);
        return true;
    }
    acceptChange(range, newLineCount) {
        let length = range.length;
        if (newLineCount > 0 && length > 0) {
            // Keep the last state, even though it is unrelated.
            // But if the new state happens to agree with this last state, then we know we can stop tokenizing.
            length--;
            newLineCount--;
        }
        this._lineEndStates.replace(range.startLineNumber, length, newLineCount);
    }
}
class RangePriorityQueueImpl {
    constructor() {
        this._ranges = [];
    }
    get min() {
        if (this._ranges.length === 0) {
            return null;
        }
        return this._ranges[0].start;
    }
    delete(value) {
        const idx = this._ranges.findIndex(r => r.contains(value));
        if (idx !== -1) {
            const range = this._ranges[idx];
            if (range.start === value) {
                if (range.endExclusive === value + 1) {
                    this._ranges.splice(idx, 1);
                }
                else {
                    this._ranges[idx] = new offsetRange/* OffsetRange */.L(value + 1, range.endExclusive);
                }
            }
            else {
                if (range.endExclusive === value + 1) {
                    this._ranges[idx] = new offsetRange/* OffsetRange */.L(range.start, value);
                }
                else {
                    this._ranges.splice(idx, 1, new offsetRange/* OffsetRange */.L(range.start, value), new offsetRange/* OffsetRange */.L(value + 1, range.endExclusive));
                }
            }
        }
    }
    addRange(range) {
        offsetRange/* OffsetRange */.L.addRange(range, this._ranges);
    }
    addRangeAndResize(range, newLength) {
        let idxFirstMightBeIntersecting = 0;
        while (!(idxFirstMightBeIntersecting >= this._ranges.length || range.start <= this._ranges[idxFirstMightBeIntersecting].endExclusive)) {
            idxFirstMightBeIntersecting++;
        }
        let idxFirstIsAfter = idxFirstMightBeIntersecting;
        while (!(idxFirstIsAfter >= this._ranges.length || range.endExclusive < this._ranges[idxFirstIsAfter].start)) {
            idxFirstIsAfter++;
        }
        const delta = newLength - range.length;
        for (let i = idxFirstIsAfter; i < this._ranges.length; i++) {
            this._ranges[i] = this._ranges[i].delta(delta);
        }
        if (idxFirstMightBeIntersecting === idxFirstIsAfter) {
            const newRange = new offsetRange/* OffsetRange */.L(range.start, range.start + newLength);
            if (!newRange.isEmpty) {
                this._ranges.splice(idxFirstMightBeIntersecting, 0, newRange);
            }
        }
        else {
            const start = Math.min(range.start, this._ranges[idxFirstMightBeIntersecting].start);
            const endEx = Math.max(range.endExclusive, this._ranges[idxFirstIsAfter - 1].endExclusive);
            const newRange = new offsetRange/* OffsetRange */.L(start, endEx + delta);
            if (!newRange.isEmpty) {
                this._ranges.splice(idxFirstMightBeIntersecting, idxFirstIsAfter - idxFirstMightBeIntersecting, newRange);
            }
            else {
                this._ranges.splice(idxFirstMightBeIntersecting, idxFirstIsAfter - idxFirstMightBeIntersecting);
            }
        }
    }
    toString() {
        return this._ranges.map(r => r.toString()).join(' + ');
    }
}
function safeTokenize(languageIdCodec, languageId, tokenizationSupport, text, hasEOL, state) {
    let r = null;
    if (tokenizationSupport) {
        try {
            r = tokenizationSupport.tokenizeEncoded(text, hasEOL, state.clone());
        }
        catch (e) {
            (0,errors/* onUnexpectedError */.dz)(e);
        }
    }
    if (!r) {
        r = (0,nullTokenize/* nullTokenizeEncoded */.Lh)(languageIdCodec.encodeLanguageId(languageId), state);
    }
    tokens_lineTokens/* LineTokens */.f.convertToEndOffset(r.tokens, text.length);
    return r;
}
class DefaultBackgroundTokenizer {
    constructor(_tokenizerWithStateStore, _backgroundTokenStore) {
        this._tokenizerWithStateStore = _tokenizerWithStateStore;
        this._backgroundTokenStore = _backgroundTokenStore;
        this._isDisposed = false;
        this._isScheduled = false;
    }
    dispose() {
        this._isDisposed = true;
    }
    handleChanges() {
        this._beginBackgroundTokenization();
    }
    _beginBackgroundTokenization() {
        if (this._isScheduled || !this._tokenizerWithStateStore._textModel.isAttachedToEditor() || !this._hasLinesToTokenize()) {
            return;
        }
        this._isScheduled = true;
        (0,common_async/* runWhenGlobalIdle */.$6)((deadline) => {
            this._isScheduled = false;
            this._backgroundTokenizeWithDeadline(deadline);
        });
    }
    /**
     * Tokenize until the deadline occurs, but try to yield every 1-2ms.
     */
    _backgroundTokenizeWithDeadline(deadline) {
        // Read the time remaining from the `deadline` immediately because it is unclear
        // if the `deadline` object will be valid after execution leaves this function.
        const endTime = Date.now() + deadline.timeRemaining();
        const execute = () => {
            if (this._isDisposed || !this._tokenizerWithStateStore._textModel.isAttachedToEditor() || !this._hasLinesToTokenize()) {
                // disposed in the meantime or detached or finished
                return;
            }
            this._backgroundTokenizeForAtLeast1ms();
            if (Date.now() < endTime) {
                // There is still time before reaching the deadline, so yield to the browser and then
                // continue execution
                (0,platform/* setTimeout0 */._p)(execute);
            }
            else {
                // The deadline has been reached, so schedule a new idle callback if necessary
                this._beginBackgroundTokenization();
            }
        };
        execute();
    }
    /**
     * Tokenize for at least 1ms.
     */
    _backgroundTokenizeForAtLeast1ms() {
        const lineCount = this._tokenizerWithStateStore._textModel.getLineCount();
        const builder = new ContiguousMultilineTokensBuilder();
        const sw = stopwatch/* StopWatch */.W.create(false);
        do {
            if (sw.elapsed() > 1) {
                // the comparison is intentionally > 1 and not >= 1 to ensure that
                // a full millisecond has elapsed, given how microseconds are rounded
                // to milliseconds
                break;
            }
            const tokenizedLineNumber = this._tokenizeOneInvalidLine(builder);
            if (tokenizedLineNumber >= lineCount) {
                break;
            }
        } while (this._hasLinesToTokenize());
        this._backgroundTokenStore.setTokens(builder.finalize());
        this.checkFinished();
    }
    _hasLinesToTokenize() {
        if (!this._tokenizerWithStateStore) {
            return false;
        }
        return !this._tokenizerWithStateStore.store.allStatesValid();
    }
    _tokenizeOneInvalidLine(builder) {
        const firstInvalidLine = this._tokenizerWithStateStore?.getFirstInvalidLine();
        if (!firstInvalidLine) {
            return this._tokenizerWithStateStore._textModel.getLineCount() + 1;
        }
        this._tokenizerWithStateStore.updateTokensUntilLine(builder, firstInvalidLine.lineNumber);
        return firstInvalidLine.lineNumber;
    }
    checkFinished() {
        if (this._isDisposed) {
            return;
        }
        if (this._tokenizerWithStateStore.store.allStatesValid()) {
            this._backgroundTokenStore.backgroundTokenizationFinished();
        }
    }
    requestTokens(startLineNumber, endLineNumberExclusive) {
        this._tokenizerWithStateStore.store.invalidateEndStateRange(new lineRange/* LineRange */.M(startLineNumber, endLineNumberExclusive));
    }
}

;// ./node_modules/monaco-editor/esm/vs/editor/common/model/tokens.js
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/





/**
 * @internal
 */
class AttachedViews {
    constructor() {
        this._onDidChangeVisibleRanges = new common_event/* Emitter */.vl();
        this.onDidChangeVisibleRanges = this._onDidChangeVisibleRanges.event;
        this._views = new Set();
    }
    attachView() {
        const view = new AttachedViewImpl((state) => {
            this._onDidChangeVisibleRanges.fire({ view, state });
        });
        this._views.add(view);
        return view;
    }
    detachView(view) {
        this._views.delete(view);
        this._onDidChangeVisibleRanges.fire({ view, state: undefined });
    }
}
class AttachedViewImpl {
    constructor(handleStateChange) {
        this.handleStateChange = handleStateChange;
    }
    setVisibleLines(visibleLines, stabilized) {
        const visibleLineRanges = visibleLines.map((line) => new lineRange/* LineRange */.M(line.startLineNumber, line.endLineNumber + 1));
        this.handleStateChange({ visibleLineRanges, stabilized });
    }
}
class AttachedViewHandler extends lifecycle/* Disposable */.jG {
    get lineRanges() { return this._lineRanges; }
    constructor(_refreshTokens) {
        super();
        this._refreshTokens = _refreshTokens;
        this.runner = this._register(new common_async/* RunOnceScheduler */.uC(() => this.update(), 50));
        this._computedLineRanges = [];
        this._lineRanges = [];
    }
    update() {
        if ((0,arrays/* equals */.aI)(this._computedLineRanges, this._lineRanges, (a, b) => a.equals(b))) {
            return;
        }
        this._computedLineRanges = this._lineRanges;
        this._refreshTokens();
    }
    handleStateChange(state) {
        this._lineRanges = state.visibleLineRanges;
        if (state.stabilized) {
            this.runner.cancel();
            this.update();
        }
        else {
            this.runner.schedule();
        }
    }
}
class AbstractTokens extends lifecycle/* Disposable */.jG {
    get backgroundTokenizationState() {
        return this._backgroundTokenizationState;
    }
    constructor(_languageIdCodec, _textModel, getLanguageId) {
        super();
        this._languageIdCodec = _languageIdCodec;
        this._textModel = _textModel;
        this.getLanguageId = getLanguageId;
        this._backgroundTokenizationState = 1 /* BackgroundTokenizationState.InProgress */;
        this._onDidChangeBackgroundTokenizationState = this._register(new common_event/* Emitter */.vl());
        /** @internal, should not be exposed by the text model! */
        this.onDidChangeBackgroundTokenizationState = this._onDidChangeBackgroundTokenizationState.event;
        this._onDidChangeTokens = this._register(new common_event/* Emitter */.vl());
        /** @internal, should not be exposed by the text model! */
        this.onDidChangeTokens = this._onDidChangeTokens.event;
    }
    tokenizeIfCheap(lineNumber) {
        if (this.isCheapToTokenize(lineNumber)) {
            this.forceTokenization(lineNumber);
        }
    }
}

;// ./node_modules/monaco-editor/esm/vs/editor/common/model/treeSitterTokens.js
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/



class TreeSitterTokens extends AbstractTokens {
    constructor(_treeSitterService, languageIdCodec, textModel, languageId) {
        super(languageIdCodec, textModel, languageId);
        this._treeSitterService = _treeSitterService;
        this._tokenizationSupport = null;
        this._initialize();
    }
    _initialize() {
        const newLanguage = this.getLanguageId();
        if (!this._tokenizationSupport || this._lastLanguageId !== newLanguage) {
            this._lastLanguageId = newLanguage;
            this._tokenizationSupport = languages/* TreeSitterTokenizationRegistry */.OB.get(newLanguage);
        }
    }
    getLineTokens(lineNumber) {
        const content = this._textModel.getLineContent(lineNumber);
        if (this._tokenizationSupport) {
            const rawTokens = this._tokenizationSupport.tokenizeEncoded(lineNumber, this._textModel);
            if (rawTokens) {
                return new tokens_lineTokens/* LineTokens */.f(rawTokens, content, this._languageIdCodec);
            }
        }
        return tokens_lineTokens/* LineTokens */.f.createEmpty(content, this._languageIdCodec);
    }
    resetTokenization(fireTokenChangeEvent = true) {
        if (fireTokenChangeEvent) {
            this._onDidChangeTokens.fire({
                semanticTokensApplied: false,
                ranges: [
                    {
                        fromLineNumber: 1,
                        toLineNumber: this._textModel.getLineCount(),
                    },
                ],
            });
        }
        this._initialize();
    }
    handleDidChangeAttached() {
        // TODO @alexr00 implement for background tokenization
    }
    handleDidChangeContent(e) {
        if (e.isFlush) {
            // Don't fire the event, as the view might not have got the text change event yet
            this.resetTokenization(false);
        }
    }
    forceTokenization(lineNumber) {
        // TODO @alexr00 implement
    }
    hasAccurateTokensForLine(lineNumber) {
        // TODO @alexr00 update for background tokenization
        return true;
    }
    isCheapToTokenize(lineNumber) {
        // TODO @alexr00 update for background tokenization
        return true;
    }
    getTokenTypeIfInsertingCharacter(lineNumber, column, character) {
        // TODO @alexr00 implement once we have custom parsing and don't just feed in the whole text model value
        return 0 /* StandardTokenType.Other */;
    }
    tokenizeLineWithEdit(position, length, newText) {
        // TODO @alexr00 understand what this is for and implement
        return null;
    }
    get hasTokens() {
        // TODO @alexr00 once we have a token store, implement properly
        const hasTree = this._treeSitterService.getParseResult(this._textModel) !== undefined;
        return hasTree;
    }
}

// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/editor/common/services/treeSitterParserService.js
var treeSitterParserService = __webpack_require__(35320);
;// ./node_modules/monaco-editor/esm/vs/editor/common/tokens/contiguousTokensEditing.js
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const EMPTY_LINE_TOKENS = (new Uint32Array(0)).buffer;
class ContiguousTokensEditing {
    static deleteBeginning(lineTokens, toChIndex) {
        if (lineTokens === null || lineTokens === EMPTY_LINE_TOKENS) {
            return lineTokens;
        }
        return ContiguousTokensEditing.delete(lineTokens, 0, toChIndex);
    }
    static deleteEnding(lineTokens, fromChIndex) {
        if (lineTokens === null || lineTokens === EMPTY_LINE_TOKENS) {
            return lineTokens;
        }
        const tokens = toUint32Array(lineTokens);
        const lineTextLength = tokens[tokens.length - 2];
        return ContiguousTokensEditing.delete(lineTokens, fromChIndex, lineTextLength);
    }
    static delete(lineTokens, fromChIndex, toChIndex) {
        if (lineTokens === null || lineTokens === EMPTY_LINE_TOKENS || fromChIndex === toChIndex) {
            return lineTokens;
        }
        const tokens = toUint32Array(lineTokens);
        const tokensCount = (tokens.length >>> 1);
        // special case: deleting everything
        if (fromChIndex === 0 && tokens[tokens.length - 2] === toChIndex) {
            return EMPTY_LINE_TOKENS;
        }
        const fromTokenIndex = tokens_lineTokens/* LineTokens */.f.findIndexInTokensArray(tokens, fromChIndex);
        const fromTokenStartOffset = (fromTokenIndex > 0 ? tokens[(fromTokenIndex - 1) << 1] : 0);
        const fromTokenEndOffset = tokens[fromTokenIndex << 1];
        if (toChIndex < fromTokenEndOffset) {
            // the delete range is inside a single token
            const delta = (toChIndex - fromChIndex);
            for (let i = fromTokenIndex; i < tokensCount; i++) {
                tokens[i << 1] -= delta;
            }
            return lineTokens;
        }
        let dest;
        let lastEnd;
        if (fromTokenStartOffset !== fromChIndex) {
            tokens[fromTokenIndex << 1] = fromChIndex;
            dest = ((fromTokenIndex + 1) << 1);
            lastEnd = fromChIndex;
        }
        else {
            dest = (fromTokenIndex << 1);
            lastEnd = fromTokenStartOffset;
        }
        const delta = (toChIndex - fromChIndex);
        for (let tokenIndex = fromTokenIndex + 1; tokenIndex < tokensCount; tokenIndex++) {
            const tokenEndOffset = tokens[tokenIndex << 1] - delta;
            if (tokenEndOffset > lastEnd) {
                tokens[dest++] = tokenEndOffset;
                tokens[dest++] = tokens[(tokenIndex << 1) + 1];
                lastEnd = tokenEndOffset;
            }
        }
        if (dest === tokens.length) {
            // nothing to trim
            return lineTokens;
        }
        const tmp = new Uint32Array(dest);
        tmp.set(tokens.subarray(0, dest), 0);
        return tmp.buffer;
    }
    static append(lineTokens, _otherTokens) {
        if (_otherTokens === EMPTY_LINE_TOKENS) {
            return lineTokens;
        }
        if (lineTokens === EMPTY_LINE_TOKENS) {
            return _otherTokens;
        }
        if (lineTokens === null) {
            return lineTokens;
        }
        if (_otherTokens === null) {
            // cannot determine combined line length...
            return null;
        }
        const myTokens = toUint32Array(lineTokens);
        const otherTokens = toUint32Array(_otherTokens);
        const otherTokensCount = (otherTokens.length >>> 1);
        const result = new Uint32Array(myTokens.length + otherTokens.length);
        result.set(myTokens, 0);
        let dest = myTokens.length;
        const delta = myTokens[myTokens.length - 2];
        for (let i = 0; i < otherTokensCount; i++) {
            result[dest++] = otherTokens[(i << 1)] + delta;
            result[dest++] = otherTokens[(i << 1) + 1];
        }
        return result.buffer;
    }
    static insert(lineTokens, chIndex, textLength) {
        if (lineTokens === null || lineTokens === EMPTY_LINE_TOKENS) {
            // nothing to do
            return lineTokens;
        }
        const tokens = toUint32Array(lineTokens);
        const tokensCount = (tokens.length >>> 1);
        let fromTokenIndex = tokens_lineTokens/* LineTokens */.f.findIndexInTokensArray(tokens, chIndex);
        if (fromTokenIndex > 0) {
            const fromTokenStartOffset = tokens[(fromTokenIndex - 1) << 1];
            if (fromTokenStartOffset === chIndex) {
                fromTokenIndex--;
            }
        }
        for (let tokenIndex = fromTokenIndex; tokenIndex < tokensCount; tokenIndex++) {
            tokens[tokenIndex << 1] += textLength;
        }
        return lineTokens;
    }
}
function toUint32Array(arr) {
    if (arr instanceof Uint32Array) {
        return arr;
    }
    else {
        return new Uint32Array(arr);
    }
}

// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/editor/common/encodedTokenAttributes.js
var encodedTokenAttributes = __webpack_require__(15910);
;// ./node_modules/monaco-editor/esm/vs/editor/common/tokens/contiguousTokensStore.js
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/





/**
 * Represents contiguous tokens in a text model.
 */
class ContiguousTokensStore {
    constructor(languageIdCodec) {
        this._lineTokens = [];
        this._len = 0;
        this._languageIdCodec = languageIdCodec;
    }
    flush() {
        this._lineTokens = [];
        this._len = 0;
    }
    get hasTokens() {
        return this._lineTokens.length > 0;
    }
    getTokens(topLevelLanguageId, lineIndex, lineText) {
        let rawLineTokens = null;
        if (lineIndex < this._len) {
            rawLineTokens = this._lineTokens[lineIndex];
        }
        if (rawLineTokens !== null && rawLineTokens !== EMPTY_LINE_TOKENS) {
            return new tokens_lineTokens/* LineTokens */.f(toUint32Array(rawLineTokens), lineText, this._languageIdCodec);
        }
        const lineTokens = new Uint32Array(2);
        lineTokens[0] = lineText.length;
        lineTokens[1] = getDefaultMetadata(this._languageIdCodec.encodeLanguageId(topLevelLanguageId));
        return new tokens_lineTokens/* LineTokens */.f(lineTokens, lineText, this._languageIdCodec);
    }
    static _massageTokens(topLevelLanguageId, lineTextLength, _tokens) {
        const tokens = _tokens ? toUint32Array(_tokens) : null;
        if (lineTextLength === 0) {
            let hasDifferentLanguageId = false;
            if (tokens && tokens.length > 1) {
                hasDifferentLanguageId = (encodedTokenAttributes/* TokenMetadata */.x.getLanguageId(tokens[1]) !== topLevelLanguageId);
            }
            if (!hasDifferentLanguageId) {
                return EMPTY_LINE_TOKENS;
            }
        }
        if (!tokens || tokens.length === 0) {
            const tokens = new Uint32Array(2);
            tokens[0] = lineTextLength;
            tokens[1] = getDefaultMetadata(topLevelLanguageId);
            return tokens.buffer;
        }
        // Ensure the last token covers the end of the text
        tokens[tokens.length - 2] = lineTextLength;
        if (tokens.byteOffset === 0 && tokens.byteLength === tokens.buffer.byteLength) {
            // Store directly the ArrayBuffer pointer to save an object
            return tokens.buffer;
        }
        return tokens;
    }
    _ensureLine(lineIndex) {
        while (lineIndex >= this._len) {
            this._lineTokens[this._len] = null;
            this._len++;
        }
    }
    _deleteLines(start, deleteCount) {
        if (deleteCount === 0) {
            return;
        }
        if (start + deleteCount > this._len) {
            deleteCount = this._len - start;
        }
        this._lineTokens.splice(start, deleteCount);
        this._len -= deleteCount;
    }
    _insertLines(insertIndex, insertCount) {
        if (insertCount === 0) {
            return;
        }
        const lineTokens = [];
        for (let i = 0; i < insertCount; i++) {
            lineTokens[i] = null;
        }
        this._lineTokens = arrays/* arrayInsert */.nK(this._lineTokens, insertIndex, lineTokens);
        this._len += insertCount;
    }
    setTokens(topLevelLanguageId, lineIndex, lineTextLength, _tokens, checkEquality) {
        const tokens = ContiguousTokensStore._massageTokens(this._languageIdCodec.encodeLanguageId(topLevelLanguageId), lineTextLength, _tokens);
        this._ensureLine(lineIndex);
        const oldTokens = this._lineTokens[lineIndex];
        this._lineTokens[lineIndex] = tokens;
        if (checkEquality) {
            return !ContiguousTokensStore._equals(oldTokens, tokens);
        }
        return false;
    }
    static _equals(_a, _b) {
        if (!_a || !_b) {
            return !_a && !_b;
        }
        const a = toUint32Array(_a);
        const b = toUint32Array(_b);
        if (a.length !== b.length) {
            return false;
        }
        for (let i = 0, len = a.length; i < len; i++) {
            if (a[i] !== b[i]) {
                return false;
            }
        }
        return true;
    }
    //#region Editing
    acceptEdit(range, eolCount, firstLineLength) {
        this._acceptDeleteRange(range);
        this._acceptInsertText(new core_position/* Position */.y(range.startLineNumber, range.startColumn), eolCount, firstLineLength);
    }
    _acceptDeleteRange(range) {
        const firstLineIndex = range.startLineNumber - 1;
        if (firstLineIndex >= this._len) {
            return;
        }
        if (range.startLineNumber === range.endLineNumber) {
            if (range.startColumn === range.endColumn) {
                // Nothing to delete
                return;
            }
            this._lineTokens[firstLineIndex] = ContiguousTokensEditing.delete(this._lineTokens[firstLineIndex], range.startColumn - 1, range.endColumn - 1);
            return;
        }
        this._lineTokens[firstLineIndex] = ContiguousTokensEditing.deleteEnding(this._lineTokens[firstLineIndex], range.startColumn - 1);
        const lastLineIndex = range.endLineNumber - 1;
        let lastLineTokens = null;
        if (lastLineIndex < this._len) {
            lastLineTokens = ContiguousTokensEditing.deleteBeginning(this._lineTokens[lastLineIndex], range.endColumn - 1);
        }
        // Take remaining text on last line and append it to remaining text on first line
        this._lineTokens[firstLineIndex] = ContiguousTokensEditing.append(this._lineTokens[firstLineIndex], lastLineTokens);
        // Delete middle lines
        this._deleteLines(range.startLineNumber, range.endLineNumber - range.startLineNumber);
    }
    _acceptInsertText(position, eolCount, firstLineLength) {
        if (eolCount === 0 && firstLineLength === 0) {
            // Nothing to insert
            return;
        }
        const lineIndex = position.lineNumber - 1;
        if (lineIndex >= this._len) {
            return;
        }
        if (eolCount === 0) {
            // Inserting text on one line
            this._lineTokens[lineIndex] = ContiguousTokensEditing.insert(this._lineTokens[lineIndex], position.column - 1, firstLineLength);
            return;
        }
        this._lineTokens[lineIndex] = ContiguousTokensEditing.deleteEnding(this._lineTokens[lineIndex], position.column - 1);
        this._lineTokens[lineIndex] = ContiguousTokensEditing.insert(this._lineTokens[lineIndex], position.column - 1, firstLineLength);
        this._insertLines(position.lineNumber, eolCount);
    }
    //#endregion
    setMultilineTokens(tokens, textModel) {
        if (tokens.length === 0) {
            return { changes: [] };
        }
        const ranges = [];
        for (let i = 0, len = tokens.length; i < len; i++) {
            const element = tokens[i];
            let minChangedLineNumber = 0;
            let maxChangedLineNumber = 0;
            let hasChange = false;
            for (let lineNumber = element.startLineNumber; lineNumber <= element.endLineNumber; lineNumber++) {
                if (hasChange) {
                    this.setTokens(textModel.getLanguageId(), lineNumber - 1, textModel.getLineLength(lineNumber), element.getLineTokens(lineNumber), false);
                    maxChangedLineNumber = lineNumber;
                }
                else {
                    const lineHasChange = this.setTokens(textModel.getLanguageId(), lineNumber - 1, textModel.getLineLength(lineNumber), element.getLineTokens(lineNumber), true);
                    if (lineHasChange) {
                        hasChange = true;
                        minChangedLineNumber = lineNumber;
                        maxChangedLineNumber = lineNumber;
                    }
                }
            }
            if (hasChange) {
                ranges.push({ fromLineNumber: minChangedLineNumber, toLineNumber: maxChangedLineNumber, });
            }
        }
        return { changes: ranges };
    }
}
function getDefaultMetadata(topLevelLanguageId) {
    return ((topLevelLanguageId << 0 /* MetadataConsts.LANGUAGEID_OFFSET */)
        | (0 /* StandardTokenType.Other */ << 8 /* MetadataConsts.TOKEN_TYPE_OFFSET */)
        | (0 /* FontStyle.None */ << 11 /* MetadataConsts.FONT_STYLE_OFFSET */)
        | (1 /* ColorId.DefaultForeground */ << 15 /* MetadataConsts.FOREGROUND_OFFSET */)
        | (2 /* ColorId.DefaultBackground */ << 24 /* MetadataConsts.BACKGROUND_OFFSET */)
        // If there is no grammar, we just take a guess and try to match brackets.
        | (1024 /* MetadataConsts.BALANCED_BRACKETS_MASK */)) >>> 0;
}

;// ./node_modules/monaco-editor/esm/vs/editor/common/tokens/sparseTokensStore.js
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/


/**
 * Represents sparse tokens in a text model.
 */
class SparseTokensStore {
    constructor(languageIdCodec) {
        this._pieces = [];
        this._isComplete = false;
        this._languageIdCodec = languageIdCodec;
    }
    flush() {
        this._pieces = [];
        this._isComplete = false;
    }
    isEmpty() {
        return (this._pieces.length === 0);
    }
    set(pieces, isComplete) {
        this._pieces = pieces || [];
        this._isComplete = isComplete;
    }
    setPartial(_range, pieces) {
        // console.log(`setPartial ${_range} ${pieces.map(p => p.toString()).join(', ')}`);
        let range = _range;
        if (pieces.length > 0) {
            const _firstRange = pieces[0].getRange();
            const _lastRange = pieces[pieces.length - 1].getRange();
            if (!_firstRange || !_lastRange) {
                return _range;
            }
            range = _range.plusRange(_firstRange).plusRange(_lastRange);
        }
        let insertPosition = null;
        for (let i = 0, len = this._pieces.length; i < len; i++) {
            const piece = this._pieces[i];
            if (piece.endLineNumber < range.startLineNumber) {
                // this piece is before the range
                continue;
            }
            if (piece.startLineNumber > range.endLineNumber) {
                // this piece is after the range, so mark the spot before this piece
                // as a good insertion position and stop looping
                insertPosition = insertPosition || { index: i };
                break;
            }
            // this piece might intersect with the range
            piece.removeTokens(range);
            if (piece.isEmpty()) {
                // remove the piece if it became empty
                this._pieces.splice(i, 1);
                i--;
                len--;
                continue;
            }
            if (piece.endLineNumber < range.startLineNumber) {
                // after removal, this piece is before the range
                continue;
            }
            if (piece.startLineNumber > range.endLineNumber) {
                // after removal, this piece is after the range
                insertPosition = insertPosition || { index: i };
                continue;
            }
            // after removal, this piece contains the range
            const [a, b] = piece.split(range);
            if (a.isEmpty()) {
                // this piece is actually after the range
                insertPosition = insertPosition || { index: i };
                continue;
            }
            if (b.isEmpty()) {
                // this piece is actually before the range
                continue;
            }
            this._pieces.splice(i, 1, a, b);
            i++;
            len++;
            insertPosition = insertPosition || { index: i };
        }
        insertPosition = insertPosition || { index: this._pieces.length };
        if (pieces.length > 0) {
            this._pieces = arrays/* arrayInsert */.nK(this._pieces, insertPosition.index, pieces);
        }
        // console.log(`I HAVE ${this._pieces.length} pieces`);
        // console.log(`${this._pieces.map(p => p.toString()).join('\n')}`);
        return range;
    }
    isComplete() {
        return this._isComplete;
    }
    addSparseTokens(lineNumber, aTokens) {
        if (aTokens.getLineContent().length === 0) {
            // Don't do anything for empty lines
            return aTokens;
        }
        const pieces = this._pieces;
        if (pieces.length === 0) {
            return aTokens;
        }
        const pieceIndex = SparseTokensStore._findFirstPieceWithLine(pieces, lineNumber);
        const bTokens = pieces[pieceIndex].getLineTokens(lineNumber);
        if (!bTokens) {
            return aTokens;
        }
        const aLen = aTokens.getCount();
        const bLen = bTokens.getCount();
        let aIndex = 0;
        const result = [];
        let resultLen = 0;
        let lastEndOffset = 0;
        const emitToken = (endOffset, metadata) => {
            if (endOffset === lastEndOffset) {
                return;
            }
            lastEndOffset = endOffset;
            result[resultLen++] = endOffset;
            result[resultLen++] = metadata;
        };
        for (let bIndex = 0; bIndex < bLen; bIndex++) {
            const bStartCharacter = bTokens.getStartCharacter(bIndex);
            const bEndCharacter = bTokens.getEndCharacter(bIndex);
            const bMetadata = bTokens.getMetadata(bIndex);
            const bMask = (((bMetadata & 1 /* MetadataConsts.SEMANTIC_USE_ITALIC */) ? 2048 /* MetadataConsts.ITALIC_MASK */ : 0)
                | ((bMetadata & 2 /* MetadataConsts.SEMANTIC_USE_BOLD */) ? 4096 /* MetadataConsts.BOLD_MASK */ : 0)
                | ((bMetadata & 4 /* MetadataConsts.SEMANTIC_USE_UNDERLINE */) ? 8192 /* MetadataConsts.UNDERLINE_MASK */ : 0)
                | ((bMetadata & 8 /* MetadataConsts.SEMANTIC_USE_STRIKETHROUGH */) ? 16384 /* MetadataConsts.STRIKETHROUGH_MASK */ : 0)
                | ((bMetadata & 16 /* MetadataConsts.SEMANTIC_USE_FOREGROUND */) ? 16744448 /* MetadataConsts.FOREGROUND_MASK */ : 0)
                | ((bMetadata & 32 /* MetadataConsts.SEMANTIC_USE_BACKGROUND */) ? 4278190080 /* MetadataConsts.BACKGROUND_MASK */ : 0)) >>> 0;
            const aMask = (~bMask) >>> 0;
            // push any token from `a` that is before `b`
            while (aIndex < aLen && aTokens.getEndOffset(aIndex) <= bStartCharacter) {
                emitToken(aTokens.getEndOffset(aIndex), aTokens.getMetadata(aIndex));
                aIndex++;
            }
            // push the token from `a` if it intersects the token from `b`
            if (aIndex < aLen && aTokens.getStartOffset(aIndex) < bStartCharacter) {
                emitToken(bStartCharacter, aTokens.getMetadata(aIndex));
            }
            // skip any tokens from `a` that are contained inside `b`
            while (aIndex < aLen && aTokens.getEndOffset(aIndex) < bEndCharacter) {
                emitToken(aTokens.getEndOffset(aIndex), (aTokens.getMetadata(aIndex) & aMask) | (bMetadata & bMask));
                aIndex++;
            }
            if (aIndex < aLen) {
                emitToken(bEndCharacter, (aTokens.getMetadata(aIndex) & aMask) | (bMetadata & bMask));
                if (aTokens.getEndOffset(aIndex) === bEndCharacter) {
                    // `a` ends exactly at the same spot as `b`!
                    aIndex++;
                }
            }
            else {
                const aMergeIndex = Math.min(Math.max(0, aIndex - 1), aLen - 1);
                // push the token from `b`
                emitToken(bEndCharacter, (aTokens.getMetadata(aMergeIndex) & aMask) | (bMetadata & bMask));
            }
        }
        // push the remaining tokens from `a`
        while (aIndex < aLen) {
            emitToken(aTokens.getEndOffset(aIndex), aTokens.getMetadata(aIndex));
            aIndex++;
        }
        return new tokens_lineTokens/* LineTokens */.f(new Uint32Array(result), aTokens.getLineContent(), this._languageIdCodec);
    }
    static _findFirstPieceWithLine(pieces, lineNumber) {
        let low = 0;
        let high = pieces.length - 1;
        while (low < high) {
            let mid = low + Math.floor((high - low) / 2);
            if (pieces[mid].endLineNumber < lineNumber) {
                low = mid + 1;
            }
            else if (pieces[mid].startLineNumber > lineNumber) {
                high = mid - 1;
            }
            else {
                while (mid > low && pieces[mid - 1].startLineNumber <= lineNumber && lineNumber <= pieces[mid - 1].endLineNumber) {
                    mid--;
                }
                return mid;
            }
        }
        return low;
    }
    acceptEdit(range, eolCount, firstLineLength, lastLineLength, firstCharCode) {
        for (const piece of this._pieces) {
            piece.acceptEdit(range, eolCount, firstLineLength, lastLineLength, firstCharCode);
        }
    }
}

;// ./node_modules/monaco-editor/esm/vs/editor/common/model/tokenizationTextModelPart.js
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
var TokenizationTextModelPart_1;


















let TokenizationTextModelPart = TokenizationTextModelPart_1 = class TokenizationTextModelPart extends textModelPart/* TextModelPart */._ {
    constructor(_textModel, _bracketPairsTextModelPart, _languageId, _attachedViews, _languageService, _languageConfigurationService, _treeSitterService) {
        super();
        this._textModel = _textModel;
        this._bracketPairsTextModelPart = _bracketPairsTextModelPart;
        this._languageId = _languageId;
        this._attachedViews = _attachedViews;
        this._languageService = _languageService;
        this._languageConfigurationService = _languageConfigurationService;
        this._treeSitterService = _treeSitterService;
        this._semanticTokens = new SparseTokensStore(this._languageService.languageIdCodec);
        this._onDidChangeLanguage = this._register(new common_event/* Emitter */.vl());
        this.onDidChangeLanguage = this._onDidChangeLanguage.event;
        this._onDidChangeLanguageConfiguration = this._register(new common_event/* Emitter */.vl());
        this.onDidChangeLanguageConfiguration = this._onDidChangeLanguageConfiguration.event;
        this._onDidChangeTokens = this._register(new common_event/* Emitter */.vl());
        this.onDidChangeTokens = this._onDidChangeTokens.event;
        this._tokensDisposables = this._register(new lifecycle/* DisposableStore */.Cm());
        this._register(this._languageConfigurationService.onDidChange(e => {
            if (e.affects(this._languageId)) {
                this._onDidChangeLanguageConfiguration.fire({});
            }
        }));
        // We just look at registry changes to determine whether to use tree sitter.
        // This means that removing a language from the setting will not cause a switch to textmate and will require a reload.
        // Adding a language to the setting will not need a reload, however.
        this._register(common_event/* Event */.Jh.filter(languages/* TreeSitterTokenizationRegistry */.OB.onDidChange, (e) => e.changedLanguages.includes(this._languageId))(() => {
            this.createPreferredTokenProvider();
        }));
        this.createPreferredTokenProvider();
    }
    createGrammarTokens() {
        return this._register(new GrammarTokens(this._languageService.languageIdCodec, this._textModel, () => this._languageId, this._attachedViews));
    }
    createTreeSitterTokens() {
        return this._register(new TreeSitterTokens(this._treeSitterService, this._languageService.languageIdCodec, this._textModel, () => this._languageId));
    }
    createTokens(useTreeSitter) {
        const needsReset = this._tokens !== undefined;
        this._tokens?.dispose();
        this._tokens = useTreeSitter ? this.createTreeSitterTokens() : this.createGrammarTokens();
        this._tokensDisposables.clear();
        this._tokensDisposables.add(this._tokens.onDidChangeTokens(e => {
            this._emitModelTokensChangedEvent(e);
        }));
        this._tokensDisposables.add(this._tokens.onDidChangeBackgroundTokenizationState(e => {
            this._bracketPairsTextModelPart.handleDidChangeBackgroundTokenizationState();
        }));
        if (needsReset) {
            // We need to reset the tokenization, as the new token provider otherwise won't have a chance to provide tokens until some action happens in the editor.
            this._tokens.resetTokenization();
        }
    }
    createPreferredTokenProvider() {
        if (languages/* TreeSitterTokenizationRegistry */.OB.get(this._languageId)) {
            if (!(this._tokens instanceof TreeSitterTokens)) {
                this.createTokens(true);
            }
        }
        else {
            if (!(this._tokens instanceof GrammarTokens)) {
                this.createTokens(false);
            }
        }
    }
    handleLanguageConfigurationServiceChange(e) {
        if (e.affects(this._languageId)) {
            this._onDidChangeLanguageConfiguration.fire({});
        }
    }
    handleDidChangeContent(e) {
        if (e.isFlush) {
            this._semanticTokens.flush();
        }
        else if (!e.isEolChange) { // We don't have to do anything on an EOL change
            for (const c of e.changes) {
                const [eolCount, firstLineLength, lastLineLength] = (0,eolCounter/* countEOL */.W)(c.text);
                this._semanticTokens.acceptEdit(c.range, eolCount, firstLineLength, lastLineLength, c.text.length > 0 ? c.text.charCodeAt(0) : 0 /* CharCode.Null */);
            }
        }
        this._tokens.handleDidChangeContent(e);
    }
    handleDidChangeAttached() {
        this._tokens.handleDidChangeAttached();
    }
    /**
     * Includes grammar and semantic tokens.
     */
    getLineTokens(lineNumber) {
        this.validateLineNumber(lineNumber);
        const syntacticTokens = this._tokens.getLineTokens(lineNumber);
        return this._semanticTokens.addSparseTokens(lineNumber, syntacticTokens);
    }
    _emitModelTokensChangedEvent(e) {
        if (!this._textModel._isDisposing()) {
            this._bracketPairsTextModelPart.handleDidChangeTokens(e);
            this._onDidChangeTokens.fire(e);
        }
    }
    // #region Grammar Tokens
    validateLineNumber(lineNumber) {
        if (lineNumber < 1 || lineNumber > this._textModel.getLineCount()) {
            throw new errors/* BugIndicatingError */.D7('Illegal value for lineNumber');
        }
    }
    get hasTokens() {
        return this._tokens.hasTokens;
    }
    resetTokenization() {
        this._tokens.resetTokenization();
    }
    get backgroundTokenizationState() {
        return this._tokens.backgroundTokenizationState;
    }
    forceTokenization(lineNumber) {
        this.validateLineNumber(lineNumber);
        this._tokens.forceTokenization(lineNumber);
    }
    hasAccurateTokensForLine(lineNumber) {
        this.validateLineNumber(lineNumber);
        return this._tokens.hasAccurateTokensForLine(lineNumber);
    }
    isCheapToTokenize(lineNumber) {
        this.validateLineNumber(lineNumber);
        return this._tokens.isCheapToTokenize(lineNumber);
    }
    tokenizeIfCheap(lineNumber) {
        this.validateLineNumber(lineNumber);
        this._tokens.tokenizeIfCheap(lineNumber);
    }
    getTokenTypeIfInsertingCharacter(lineNumber, column, character) {
        return this._tokens.getTokenTypeIfInsertingCharacter(lineNumber, column, character);
    }
    tokenizeLineWithEdit(position, length, newText) {
        return this._tokens.tokenizeLineWithEdit(position, length, newText);
    }
    // #endregion
    // #region Semantic Tokens
    setSemanticTokens(tokens, isComplete) {
        this._semanticTokens.set(tokens, isComplete);
        this._emitModelTokensChangedEvent({
            semanticTokensApplied: tokens !== null,
            ranges: [{ fromLineNumber: 1, toLineNumber: this._textModel.getLineCount() }],
        });
    }
    hasCompleteSemanticTokens() {
        return this._semanticTokens.isComplete();
    }
    hasSomeSemanticTokens() {
        return !this._semanticTokens.isEmpty();
    }
    setPartialSemanticTokens(range, tokens) {
        if (this.hasCompleteSemanticTokens()) {
            return;
        }
        const changedRange = this._textModel.validateRange(this._semanticTokens.setPartial(range, tokens));
        this._emitModelTokensChangedEvent({
            semanticTokensApplied: true,
            ranges: [
                {
                    fromLineNumber: changedRange.startLineNumber,
                    toLineNumber: changedRange.endLineNumber,
                },
            ],
        });
    }
    // #endregion
    // #region Utility Methods
    getWordAtPosition(_position) {
        this.assertNotDisposed();
        const position = this._textModel.validatePosition(_position);
        const lineContent = this._textModel.getLineContent(position.lineNumber);
        const lineTokens = this.getLineTokens(position.lineNumber);
        const tokenIndex = lineTokens.findTokenIndexAtOffset(position.column - 1);
        // (1). First try checking right biased word
        const [rbStartOffset, rbEndOffset] = TokenizationTextModelPart_1._findLanguageBoundaries(lineTokens, tokenIndex);
        const rightBiasedWord = (0,wordHelper/* getWordAtText */.Th)(position.column, this.getLanguageConfiguration(lineTokens.getLanguageId(tokenIndex)).getWordDefinition(), lineContent.substring(rbStartOffset, rbEndOffset), rbStartOffset);
        // Make sure the result touches the original passed in position
        if (rightBiasedWord &&
            rightBiasedWord.startColumn <= _position.column &&
            _position.column <= rightBiasedWord.endColumn) {
            return rightBiasedWord;
        }
        // (2). Else, if we were at a language boundary, check the left biased word
        if (tokenIndex > 0 && rbStartOffset === position.column - 1) {
            // edge case, where `position` sits between two tokens belonging to two different languages
            const [lbStartOffset, lbEndOffset] = TokenizationTextModelPart_1._findLanguageBoundaries(lineTokens, tokenIndex - 1);
            const leftBiasedWord = (0,wordHelper/* getWordAtText */.Th)(position.column, this.getLanguageConfiguration(lineTokens.getLanguageId(tokenIndex - 1)).getWordDefinition(), lineContent.substring(lbStartOffset, lbEndOffset), lbStartOffset);
            // Make sure the result touches the original passed in position
            if (leftBiasedWord &&
                leftBiasedWord.startColumn <= _position.column &&
                _position.column <= leftBiasedWord.endColumn) {
                return leftBiasedWord;
            }
        }
        return null;
    }
    getLanguageConfiguration(languageId) {
        return this._languageConfigurationService.getLanguageConfiguration(languageId);
    }
    static _findLanguageBoundaries(lineTokens, tokenIndex) {
        const languageId = lineTokens.getLanguageId(tokenIndex);
        // go left until a different language is hit
        let startOffset = 0;
        for (let i = tokenIndex; i >= 0 && lineTokens.getLanguageId(i) === languageId; i--) {
            startOffset = lineTokens.getStartOffset(i);
        }
        // go right until a different language is hit
        let endOffset = lineTokens.getLineContent().length;
        for (let i = tokenIndex, tokenCount = lineTokens.getCount(); i < tokenCount && lineTokens.getLanguageId(i) === languageId; i++) {
            endOffset = lineTokens.getEndOffset(i);
        }
        return [startOffset, endOffset];
    }
    getWordUntilPosition(position) {
        const wordAtPosition = this.getWordAtPosition(position);
        if (!wordAtPosition) {
            return { word: '', startColumn: position.column, endColumn: position.column, };
        }
        return {
            word: wordAtPosition.word.substr(0, position.column - wordAtPosition.startColumn),
            startColumn: wordAtPosition.startColumn,
            endColumn: position.column,
        };
    }
    // #endregion
    // #region Language Id handling
    getLanguageId() {
        return this._languageId;
    }
    getLanguageIdAtPosition(lineNumber, column) {
        const position = this._textModel.validatePosition(new core_position/* Position */.y(lineNumber, column));
        const lineTokens = this.getLineTokens(position.lineNumber);
        return lineTokens.getLanguageId(lineTokens.findTokenIndexAtOffset(position.column - 1));
    }
    setLanguageId(languageId, source = 'api') {
        if (this._languageId === languageId) {
            // There's nothing to do
            return;
        }
        const e = {
            oldLanguage: this._languageId,
            newLanguage: languageId,
            source
        };
        this._languageId = languageId;
        this._bracketPairsTextModelPart.handleDidChangeLanguage(e);
        this._tokens.resetTokenization();
        this.createPreferredTokenProvider();
        this._onDidChangeLanguage.fire(e);
        this._onDidChangeLanguageConfiguration.fire({});
    }
};
TokenizationTextModelPart = TokenizationTextModelPart_1 = __decorate([
    __param(4, language/* ILanguageService */.L),
    __param(5, languageConfigurationRegistry/* ILanguageConfigurationService */.JZ),
    __param(6, treeSitterParserService.ITreeSitterParserService)
], TokenizationTextModelPart);

class GrammarTokens extends AbstractTokens {
    constructor(languageIdCodec, textModel, getLanguageId, attachedViews) {
        super(languageIdCodec, textModel, getLanguageId);
        this._tokenizer = null;
        this._defaultBackgroundTokenizer = null;
        this._backgroundTokenizer = this._register(new lifecycle/* MutableDisposable */.HE());
        this._tokens = new ContiguousTokensStore(this._languageIdCodec);
        this._debugBackgroundTokenizer = this._register(new lifecycle/* MutableDisposable */.HE());
        this._attachedViewStates = this._register(new lifecycle/* DisposableMap */.$w());
        this._register(languages/* TokenizationRegistry */.dG.onDidChange((e) => {
            const languageId = this.getLanguageId();
            if (e.changedLanguages.indexOf(languageId) === -1) {
                return;
            }
            this.resetTokenization();
        }));
        this.resetTokenization();
        this._register(attachedViews.onDidChangeVisibleRanges(({ view, state }) => {
            if (state) {
                let existing = this._attachedViewStates.get(view);
                if (!existing) {
                    existing = new AttachedViewHandler(() => this.refreshRanges(existing.lineRanges));
                    this._attachedViewStates.set(view, existing);
                }
                existing.handleStateChange(state);
            }
            else {
                this._attachedViewStates.deleteAndDispose(view);
            }
        }));
    }
    resetTokenization(fireTokenChangeEvent = true) {
        this._tokens.flush();
        this._debugBackgroundTokens?.flush();
        if (this._debugBackgroundStates) {
            this._debugBackgroundStates = new TrackingTokenizationStateStore(this._textModel.getLineCount());
        }
        if (fireTokenChangeEvent) {
            this._onDidChangeTokens.fire({
                semanticTokensApplied: false,
                ranges: [
                    {
                        fromLineNumber: 1,
                        toLineNumber: this._textModel.getLineCount(),
                    },
                ],
            });
        }
        const initializeTokenization = () => {
            if (this._textModel.isTooLargeForTokenization()) {
                return [null, null];
            }
            const tokenizationSupport = languages/* TokenizationRegistry */.dG.get(this.getLanguageId());
            if (!tokenizationSupport) {
                return [null, null];
            }
            let initialState;
            try {
                initialState = tokenizationSupport.getInitialState();
            }
            catch (e) {
                (0,errors/* onUnexpectedError */.dz)(e);
                return [null, null];
            }
            return [tokenizationSupport, initialState];
        };
        const [tokenizationSupport, initialState] = initializeTokenization();
        if (tokenizationSupport && initialState) {
            this._tokenizer = new TokenizerWithStateStoreAndTextModel(this._textModel.getLineCount(), tokenizationSupport, this._textModel, this._languageIdCodec);
        }
        else {
            this._tokenizer = null;
        }
        this._backgroundTokenizer.clear();
        this._defaultBackgroundTokenizer = null;
        if (this._tokenizer) {
            const b = {
                setTokens: (tokens) => {
                    this.setTokens(tokens);
                },
                backgroundTokenizationFinished: () => {
                    if (this._backgroundTokenizationState === 2 /* BackgroundTokenizationState.Completed */) {
                        // We already did a full tokenization and don't go back to progressing.
                        return;
                    }
                    const newState = 2 /* BackgroundTokenizationState.Completed */;
                    this._backgroundTokenizationState = newState;
                    this._onDidChangeBackgroundTokenizationState.fire();
                },
                setEndState: (lineNumber, state) => {
                    if (!this._tokenizer) {
                        return;
                    }
                    const firstInvalidEndStateLineNumber = this._tokenizer.store.getFirstInvalidEndStateLineNumber();
                    // Don't accept states for definitely valid states, the renderer is ahead of the worker!
                    if (firstInvalidEndStateLineNumber !== null && lineNumber >= firstInvalidEndStateLineNumber) {
                        this._tokenizer?.store.setEndState(lineNumber, state);
                    }
                },
            };
            if (tokenizationSupport && tokenizationSupport.createBackgroundTokenizer && !tokenizationSupport.backgroundTokenizerShouldOnlyVerifyTokens) {
                this._backgroundTokenizer.value = tokenizationSupport.createBackgroundTokenizer(this._textModel, b);
            }
            if (!this._backgroundTokenizer.value && !this._textModel.isTooLargeForTokenization()) {
                this._backgroundTokenizer.value = this._defaultBackgroundTokenizer =
                    new DefaultBackgroundTokenizer(this._tokenizer, b);
                this._defaultBackgroundTokenizer.handleChanges();
            }
            if (tokenizationSupport?.backgroundTokenizerShouldOnlyVerifyTokens && tokenizationSupport.createBackgroundTokenizer) {
                this._debugBackgroundTokens = new ContiguousTokensStore(this._languageIdCodec);
                this._debugBackgroundStates = new TrackingTokenizationStateStore(this._textModel.getLineCount());
                this._debugBackgroundTokenizer.clear();
                this._debugBackgroundTokenizer.value = tokenizationSupport.createBackgroundTokenizer(this._textModel, {
                    setTokens: (tokens) => {
                        this._debugBackgroundTokens?.setMultilineTokens(tokens, this._textModel);
                    },
                    backgroundTokenizationFinished() {
                        // NO OP
                    },
                    setEndState: (lineNumber, state) => {
                        this._debugBackgroundStates?.setEndState(lineNumber, state);
                    },
                });
            }
            else {
                this._debugBackgroundTokens = undefined;
                this._debugBackgroundStates = undefined;
                this._debugBackgroundTokenizer.value = undefined;
            }
        }
        this.refreshAllVisibleLineTokens();
    }
    handleDidChangeAttached() {
        this._defaultBackgroundTokenizer?.handleChanges();
    }
    handleDidChangeContent(e) {
        if (e.isFlush) {
            // Don't fire the event, as the view might not have got the text change event yet
            this.resetTokenization(false);
        }
        else if (!e.isEolChange) { // We don't have to do anything on an EOL change
            for (const c of e.changes) {
                const [eolCount, firstLineLength] = (0,eolCounter/* countEOL */.W)(c.text);
                this._tokens.acceptEdit(c.range, eolCount, firstLineLength);
                this._debugBackgroundTokens?.acceptEdit(c.range, eolCount, firstLineLength);
            }
            this._debugBackgroundStates?.acceptChanges(e.changes);
            if (this._tokenizer) {
                this._tokenizer.store.acceptChanges(e.changes);
            }
            this._defaultBackgroundTokenizer?.handleChanges();
        }
    }
    setTokens(tokens) {
        const { changes } = this._tokens.setMultilineTokens(tokens, this._textModel);
        if (changes.length > 0) {
            this._onDidChangeTokens.fire({ semanticTokensApplied: false, ranges: changes, });
        }
        return { changes: changes };
    }
    refreshAllVisibleLineTokens() {
        const ranges = lineRange/* LineRange */.M.joinMany([...this._attachedViewStates].map(([_, s]) => s.lineRanges));
        this.refreshRanges(ranges);
    }
    refreshRanges(ranges) {
        for (const range of ranges) {
            this.refreshRange(range.startLineNumber, range.endLineNumberExclusive - 1);
        }
    }
    refreshRange(startLineNumber, endLineNumber) {
        if (!this._tokenizer) {
            return;
        }
        startLineNumber = Math.max(1, Math.min(this._textModel.getLineCount(), startLineNumber));
        endLineNumber = Math.min(this._textModel.getLineCount(), endLineNumber);
        const builder = new ContiguousMultilineTokensBuilder();
        const { heuristicTokens } = this._tokenizer.tokenizeHeuristically(builder, startLineNumber, endLineNumber);
        const changedTokens = this.setTokens(builder.finalize());
        if (heuristicTokens) {
            // We overrode tokens with heuristically computed ones.
            // Because old states might get reused (thus stopping invalidation),
            // we have to explicitly request the tokens for the changed ranges again.
            for (const c of changedTokens.changes) {
                this._backgroundTokenizer.value?.requestTokens(c.fromLineNumber, c.toLineNumber + 1);
            }
        }
        this._defaultBackgroundTokenizer?.checkFinished();
    }
    forceTokenization(lineNumber) {
        const builder = new ContiguousMultilineTokensBuilder();
        this._tokenizer?.updateTokensUntilLine(builder, lineNumber);
        this.setTokens(builder.finalize());
        this._defaultBackgroundTokenizer?.checkFinished();
    }
    hasAccurateTokensForLine(lineNumber) {
        if (!this._tokenizer) {
            return true;
        }
        return this._tokenizer.hasAccurateTokensForLine(lineNumber);
    }
    isCheapToTokenize(lineNumber) {
        if (!this._tokenizer) {
            return true;
        }
        return this._tokenizer.isCheapToTokenize(lineNumber);
    }
    getLineTokens(lineNumber) {
        const lineText = this._textModel.getLineContent(lineNumber);
        const result = this._tokens.getTokens(this._textModel.getLanguageId(), lineNumber - 1, lineText);
        if (this._debugBackgroundTokens && this._debugBackgroundStates && this._tokenizer) {
            if (this._debugBackgroundStates.getFirstInvalidEndStateLineNumberOrMax() > lineNumber && this._tokenizer.store.getFirstInvalidEndStateLineNumberOrMax() > lineNumber) {
                const backgroundResult = this._debugBackgroundTokens.getTokens(this._textModel.getLanguageId(), lineNumber - 1, lineText);
                if (!result.equals(backgroundResult) && this._debugBackgroundTokenizer.value?.reportMismatchingTokens) {
                    this._debugBackgroundTokenizer.value.reportMismatchingTokens(lineNumber);
                }
            }
        }
        return result;
    }
    getTokenTypeIfInsertingCharacter(lineNumber, column, character) {
        if (!this._tokenizer) {
            return 0 /* StandardTokenType.Other */;
        }
        const position = this._textModel.validatePosition(new core_position/* Position */.y(lineNumber, column));
        this.forceTokenization(position.lineNumber);
        return this._tokenizer.getTokenTypeIfInsertingCharacter(position, character);
    }
    tokenizeLineWithEdit(position, length, newText) {
        if (!this._tokenizer) {
            return null;
        }
        const validatedPosition = this._textModel.validatePosition(position);
        this.forceTokenization(validatedPosition.lineNumber);
        return this._tokenizer.tokenizeLineWithEdit(validatedPosition, length, newText);
    }
    get hasTokens() {
        return this._tokens.hasTokens;
    }
}

// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/editor/common/textModelEvents.js
var textModelEvents = __webpack_require__(83455);
// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/platform/instantiation/common/instantiation.js
var instantiation = __webpack_require__(82399);
// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/platform/undoRedo/common/undoRedo.js
var undoRedo = __webpack_require__(38803);
;// ./node_modules/monaco-editor/esm/vs/editor/common/model/textModel.js
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var textModel_decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var textModel_param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var TextModel_1;






























function createTextBufferFactory(text) {
    const builder = new PieceTreeTextBufferBuilder();
    builder.acceptChunk(text);
    return builder.finish();
}
function createTextBufferFactoryFromSnapshot(snapshot) {
    const builder = new PieceTreeTextBufferBuilder();
    let chunk;
    while (typeof (chunk = snapshot.read()) === 'string') {
        builder.acceptChunk(chunk);
    }
    return builder.finish();
}
function createTextBuffer(value, defaultEOL) {
    let factory;
    if (typeof value === 'string') {
        factory = createTextBufferFactory(value);
    }
    else if (model/* isITextSnapshot */.nk(value)) {
        factory = createTextBufferFactoryFromSnapshot(value);
    }
    else {
        factory = value;
    }
    return factory.create(defaultEOL);
}
let MODEL_ID = 0;
const LIMIT_FIND_COUNT = 999;
const LONG_LINE_BOUNDARY = 10000;
class TextModelSnapshot {
    constructor(source) {
        this._source = source;
        this._eos = false;
    }
    read() {
        if (this._eos) {
            return null;
        }
        const result = [];
        let resultCnt = 0;
        let resultLength = 0;
        do {
            const tmp = this._source.read();
            if (tmp === null) {
                // end-of-stream
                this._eos = true;
                if (resultCnt === 0) {
                    return null;
                }
                else {
                    return result.join('');
                }
            }
            if (tmp.length > 0) {
                result[resultCnt++] = tmp;
                resultLength += tmp.length;
            }
            if (resultLength >= 64 * 1024) {
                return result.join('');
            }
        } while (true);
    }
}
const invalidFunc = () => { throw new Error(`Invalid change accessor`); };
let TextModel = class TextModel extends lifecycle/* Disposable */.jG {
    static { TextModel_1 = this; }
    static { this._MODEL_SYNC_LIMIT = 50 * 1024 * 1024; } // 50 MB,  // used in tests
    static { this.LARGE_FILE_SIZE_THRESHOLD = 20 * 1024 * 1024; } // 20 MB;
    static { this.LARGE_FILE_LINE_COUNT_THRESHOLD = 300 * 1000; } // 300K lines
    static { this.LARGE_FILE_HEAP_OPERATION_THRESHOLD = 256 * 1024 * 1024; } // 256M characters, usually ~> 512MB memory usage
    static { this.DEFAULT_CREATION_OPTIONS = {
        isForSimpleWidget: false,
        tabSize: textModelDefaults/* EDITOR_MODEL_DEFAULTS */.R.tabSize,
        indentSize: textModelDefaults/* EDITOR_MODEL_DEFAULTS */.R.indentSize,
        insertSpaces: textModelDefaults/* EDITOR_MODEL_DEFAULTS */.R.insertSpaces,
        detectIndentation: false,
        defaultEOL: 1 /* model.DefaultEndOfLine.LF */,
        trimAutoWhitespace: textModelDefaults/* EDITOR_MODEL_DEFAULTS */.R.trimAutoWhitespace,
        largeFileOptimizations: textModelDefaults/* EDITOR_MODEL_DEFAULTS */.R.largeFileOptimizations,
        bracketPairColorizationOptions: textModelDefaults/* EDITOR_MODEL_DEFAULTS */.R.bracketPairColorizationOptions,
    }; }
    static resolveOptions(textBuffer, options) {
        if (options.detectIndentation) {
            const guessedIndentation = guessIndentation(textBuffer, options.tabSize, options.insertSpaces);
            return new model/* TextModelResolvedOptions */.X2({
                tabSize: guessedIndentation.tabSize,
                indentSize: 'tabSize', // TODO@Alex: guess indentSize independent of tabSize
                insertSpaces: guessedIndentation.insertSpaces,
                trimAutoWhitespace: options.trimAutoWhitespace,
                defaultEOL: options.defaultEOL,
                bracketPairColorizationOptions: options.bracketPairColorizationOptions,
            });
        }
        return new model/* TextModelResolvedOptions */.X2(options);
    }
    get onDidChangeLanguage() { return this._tokenizationTextModelPart.onDidChangeLanguage; }
    get onDidChangeLanguageConfiguration() { return this._tokenizationTextModelPart.onDidChangeLanguageConfiguration; }
    get onDidChangeTokens() { return this._tokenizationTextModelPart.onDidChangeTokens; }
    onDidChangeContent(listener) {
        return this._eventEmitter.slowEvent((e) => listener(e.contentChangedEvent));
    }
    onDidChangeContentOrInjectedText(listener) {
        return (0,lifecycle/* combinedDisposable */.qE)(this._eventEmitter.fastEvent(e => listener(e)), this._onDidChangeInjectedText.event(e => listener(e)));
    }
    _isDisposing() { return this.__isDisposing; }
    get tokenization() { return this._tokenizationTextModelPart; }
    get bracketPairs() { return this._bracketPairs; }
    get guides() { return this._guidesTextModelPart; }
    constructor(source, languageIdOrSelection, creationOptions, associatedResource = null, _undoRedoService, _languageService, _languageConfigurationService, instantiationService) {
        super();
        this._undoRedoService = _undoRedoService;
        this._languageService = _languageService;
        this._languageConfigurationService = _languageConfigurationService;
        this.instantiationService = instantiationService;
        //#region Events
        this._onWillDispose = this._register(new common_event/* Emitter */.vl());
        this.onWillDispose = this._onWillDispose.event;
        this._onDidChangeDecorations = this._register(new DidChangeDecorationsEmitter(affectedInjectedTextLines => this.handleBeforeFireDecorationsChangedEvent(affectedInjectedTextLines)));
        this.onDidChangeDecorations = this._onDidChangeDecorations.event;
        this._onDidChangeOptions = this._register(new common_event/* Emitter */.vl());
        this.onDidChangeOptions = this._onDidChangeOptions.event;
        this._onDidChangeAttached = this._register(new common_event/* Emitter */.vl());
        this.onDidChangeAttached = this._onDidChangeAttached.event;
        this._onDidChangeInjectedText = this._register(new common_event/* Emitter */.vl());
        this._eventEmitter = this._register(new DidChangeContentEmitter());
        this._languageSelectionListener = this._register(new lifecycle/* MutableDisposable */.HE());
        this._deltaDecorationCallCnt = 0;
        this._attachedViews = new AttachedViews();
        // Generate a new unique model id
        MODEL_ID++;
        this.id = '$model' + MODEL_ID;
        this.isForSimpleWidget = creationOptions.isForSimpleWidget;
        if (typeof associatedResource === 'undefined' || associatedResource === null) {
            this._associatedResource = uri/* URI */.r.parse('inmemory://model/' + MODEL_ID);
        }
        else {
            this._associatedResource = associatedResource;
        }
        this._attachedEditorCount = 0;
        const { textBuffer, disposable } = createTextBuffer(source, creationOptions.defaultEOL);
        this._buffer = textBuffer;
        this._bufferDisposable = disposable;
        this._options = TextModel_1.resolveOptions(this._buffer, creationOptions);
        const languageId = (typeof languageIdOrSelection === 'string' ? languageIdOrSelection : languageIdOrSelection.languageId);
        if (typeof languageIdOrSelection !== 'string') {
            this._languageSelectionListener.value = languageIdOrSelection.onDidChange(() => this._setLanguage(languageIdOrSelection.languageId));
        }
        this._bracketPairs = this._register(new BracketPairsTextModelPart(this, this._languageConfigurationService));
        this._guidesTextModelPart = this._register(new guidesTextModelPart/* GuidesTextModelPart */.P(this, this._languageConfigurationService));
        this._decorationProvider = this._register(new ColorizedBracketPairsDecorationProvider(this));
        this._tokenizationTextModelPart = this.instantiationService.createInstance(TokenizationTextModelPart, this, this._bracketPairs, languageId, this._attachedViews);
        const bufferLineCount = this._buffer.getLineCount();
        const bufferTextLength = this._buffer.getValueLengthInRange(new core_range/* Range */.Q(1, 1, bufferLineCount, this._buffer.getLineLength(bufferLineCount) + 1), 0 /* model.EndOfLinePreference.TextDefined */);
        // !!! Make a decision in the ctor and permanently respect this decision !!!
        // If a model is too large at construction time, it will never get tokenized,
        // under no circumstances.
        if (creationOptions.largeFileOptimizations) {
            this._isTooLargeForTokenization = ((bufferTextLength > TextModel_1.LARGE_FILE_SIZE_THRESHOLD)
                || (bufferLineCount > TextModel_1.LARGE_FILE_LINE_COUNT_THRESHOLD));
            this._isTooLargeForHeapOperation = bufferTextLength > TextModel_1.LARGE_FILE_HEAP_OPERATION_THRESHOLD;
        }
        else {
            this._isTooLargeForTokenization = false;
            this._isTooLargeForHeapOperation = false;
        }
        this._isTooLargeForSyncing = (bufferTextLength > TextModel_1._MODEL_SYNC_LIMIT);
        this._versionId = 1;
        this._alternativeVersionId = 1;
        this._initialUndoRedoSnapshot = null;
        this._isDisposed = false;
        this.__isDisposing = false;
        this._instanceId = strings/* singleLetterHash */.tk(MODEL_ID);
        this._lastDecorationId = 0;
        this._decorations = Object.create(null);
        this._decorationsTree = new DecorationsTrees();
        this._commandManager = new editStack/* EditStack */.z8(this, this._undoRedoService);
        this._isUndoing = false;
        this._isRedoing = false;
        this._trimAutoWhitespaceLines = null;
        this._register(this._decorationProvider.onDidChange(() => {
            this._onDidChangeDecorations.beginDeferredEmit();
            this._onDidChangeDecorations.fire();
            this._onDidChangeDecorations.endDeferredEmit();
        }));
        this._languageService.requestRichLanguageFeatures(languageId);
        this._register(this._languageConfigurationService.onDidChange(e => {
            this._bracketPairs.handleLanguageConfigurationServiceChange(e);
            this._tokenizationTextModelPart.handleLanguageConfigurationServiceChange(e);
        }));
    }
    dispose() {
        this.__isDisposing = true;
        this._onWillDispose.fire();
        this._tokenizationTextModelPart.dispose();
        this._isDisposed = true;
        super.dispose();
        this._bufferDisposable.dispose();
        this.__isDisposing = false;
        // Manually release reference to previous text buffer to avoid large leaks
        // in case someone leaks a TextModel reference
        const emptyDisposedTextBuffer = new PieceTreeTextBuffer([], '', '\n', false, false, true, true);
        emptyDisposedTextBuffer.dispose();
        this._buffer = emptyDisposedTextBuffer;
        this._bufferDisposable = lifecycle/* Disposable */.jG.None;
    }
    _assertNotDisposed() {
        if (this._isDisposed) {
            throw new errors/* BugIndicatingError */.D7('Model is disposed!');
        }
    }
    _emitContentChangedEvent(rawChange, change) {
        if (this.__isDisposing) {
            // Do not confuse listeners by emitting any event after disposing
            return;
        }
        this._tokenizationTextModelPart.handleDidChangeContent(change);
        this._bracketPairs.handleDidChangeContent(change);
        this._eventEmitter.fire(new textModelEvents/* InternalModelContentChangeEvent */.Ic(rawChange, change));
    }
    setValue(value) {
        this._assertNotDisposed();
        if (value === null || value === undefined) {
            throw (0,errors/* illegalArgument */.Qg)();
        }
        const { textBuffer, disposable } = createTextBuffer(value, this._options.defaultEOL);
        this._setValueFromTextBuffer(textBuffer, disposable);
    }
    _createContentChanged2(range, rangeOffset, rangeLength, text, isUndoing, isRedoing, isFlush, isEolChange) {
        return {
            changes: [{
                    range: range,
                    rangeOffset: rangeOffset,
                    rangeLength: rangeLength,
                    text: text,
                }],
            eol: this._buffer.getEOL(),
            isEolChange: isEolChange,
            versionId: this.getVersionId(),
            isUndoing: isUndoing,
            isRedoing: isRedoing,
            isFlush: isFlush
        };
    }
    _setValueFromTextBuffer(textBuffer, textBufferDisposable) {
        this._assertNotDisposed();
        const oldFullModelRange = this.getFullModelRange();
        const oldModelValueLength = this.getValueLengthInRange(oldFullModelRange);
        const endLineNumber = this.getLineCount();
        const endColumn = this.getLineMaxColumn(endLineNumber);
        this._buffer = textBuffer;
        this._bufferDisposable.dispose();
        this._bufferDisposable = textBufferDisposable;
        this._increaseVersionId();
        // Destroy all my decorations
        this._decorations = Object.create(null);
        this._decorationsTree = new DecorationsTrees();
        // Destroy my edit history and settings
        this._commandManager.clear();
        this._trimAutoWhitespaceLines = null;
        this._emitContentChangedEvent(new textModelEvents/* ModelRawContentChangedEvent */.HP([
            new textModelEvents/* ModelRawFlush */.Wn()
        ], this._versionId, false, false), this._createContentChanged2(new core_range/* Range */.Q(1, 1, endLineNumber, endColumn), 0, oldModelValueLength, this.getValue(), false, false, true, false));
    }
    setEOL(eol) {
        this._assertNotDisposed();
        const newEOL = (eol === 1 /* model.EndOfLineSequence.CRLF */ ? '\r\n' : '\n');
        if (this._buffer.getEOL() === newEOL) {
            // Nothing to do
            return;
        }
        const oldFullModelRange = this.getFullModelRange();
        const oldModelValueLength = this.getValueLengthInRange(oldFullModelRange);
        const endLineNumber = this.getLineCount();
        const endColumn = this.getLineMaxColumn(endLineNumber);
        this._onBeforeEOLChange();
        this._buffer.setEOL(newEOL);
        this._increaseVersionId();
        this._onAfterEOLChange();
        this._emitContentChangedEvent(new textModelEvents/* ModelRawContentChangedEvent */.HP([
            new textModelEvents/* ModelRawEOLChanged */.mS()
        ], this._versionId, false, false), this._createContentChanged2(new core_range/* Range */.Q(1, 1, endLineNumber, endColumn), 0, oldModelValueLength, this.getValue(), false, false, false, true));
    }
    _onBeforeEOLChange() {
        // Ensure all decorations get their `range` set.
        this._decorationsTree.ensureAllNodesHaveRanges(this);
    }
    _onAfterEOLChange() {
        // Transform back `range` to offsets
        const versionId = this.getVersionId();
        const allDecorations = this._decorationsTree.collectNodesPostOrder();
        for (let i = 0, len = allDecorations.length; i < len; i++) {
            const node = allDecorations[i];
            const range = node.range; // the range is defined due to `_onBeforeEOLChange`
            const delta = node.cachedAbsoluteStart - node.start;
            const startOffset = this._buffer.getOffsetAt(range.startLineNumber, range.startColumn);
            const endOffset = this._buffer.getOffsetAt(range.endLineNumber, range.endColumn);
            node.cachedAbsoluteStart = startOffset;
            node.cachedAbsoluteEnd = endOffset;
            node.cachedVersionId = versionId;
            node.start = startOffset - delta;
            node.end = endOffset - delta;
            recomputeMaxEnd(node);
        }
    }
    onBeforeAttached() {
        this._attachedEditorCount++;
        if (this._attachedEditorCount === 1) {
            this._tokenizationTextModelPart.handleDidChangeAttached();
            this._onDidChangeAttached.fire(undefined);
        }
        return this._attachedViews.attachView();
    }
    onBeforeDetached(view) {
        this._attachedEditorCount--;
        if (this._attachedEditorCount === 0) {
            this._tokenizationTextModelPart.handleDidChangeAttached();
            this._onDidChangeAttached.fire(undefined);
        }
        this._attachedViews.detachView(view);
    }
    isAttachedToEditor() {
        return this._attachedEditorCount > 0;
    }
    getAttachedEditorCount() {
        return this._attachedEditorCount;
    }
    isTooLargeForSyncing() {
        return this._isTooLargeForSyncing;
    }
    isTooLargeForTokenization() {
        return this._isTooLargeForTokenization;
    }
    isTooLargeForHeapOperation() {
        return this._isTooLargeForHeapOperation;
    }
    isDisposed() {
        return this._isDisposed;
    }
    isDominatedByLongLines() {
        this._assertNotDisposed();
        if (this.isTooLargeForTokenization()) {
            // Cannot word wrap huge files anyways, so it doesn't really matter
            return false;
        }
        let smallLineCharCount = 0;
        let longLineCharCount = 0;
        const lineCount = this._buffer.getLineCount();
        for (let lineNumber = 1; lineNumber <= lineCount; lineNumber++) {
            const lineLength = this._buffer.getLineLength(lineNumber);
            if (lineLength >= LONG_LINE_BOUNDARY) {
                longLineCharCount += lineLength;
            }
            else {
                smallLineCharCount += lineLength;
            }
        }
        return (longLineCharCount > smallLineCharCount);
    }
    get uri() {
        return this._associatedResource;
    }
    //#region Options
    getOptions() {
        this._assertNotDisposed();
        return this._options;
    }
    getFormattingOptions() {
        return {
            tabSize: this._options.indentSize,
            insertSpaces: this._options.insertSpaces
        };
    }
    updateOptions(_newOpts) {
        this._assertNotDisposed();
        const tabSize = (typeof _newOpts.tabSize !== 'undefined') ? _newOpts.tabSize : this._options.tabSize;
        const indentSize = (typeof _newOpts.indentSize !== 'undefined') ? _newOpts.indentSize : this._options.originalIndentSize;
        const insertSpaces = (typeof _newOpts.insertSpaces !== 'undefined') ? _newOpts.insertSpaces : this._options.insertSpaces;
        const trimAutoWhitespace = (typeof _newOpts.trimAutoWhitespace !== 'undefined') ? _newOpts.trimAutoWhitespace : this._options.trimAutoWhitespace;
        const bracketPairColorizationOptions = (typeof _newOpts.bracketColorizationOptions !== 'undefined') ? _newOpts.bracketColorizationOptions : this._options.bracketPairColorizationOptions;
        const newOpts = new model/* TextModelResolvedOptions */.X2({
            tabSize: tabSize,
            indentSize: indentSize,
            insertSpaces: insertSpaces,
            defaultEOL: this._options.defaultEOL,
            trimAutoWhitespace: trimAutoWhitespace,
            bracketPairColorizationOptions,
        });
        if (this._options.equals(newOpts)) {
            return;
        }
        const e = this._options.createChangeEvent(newOpts);
        this._options = newOpts;
        this._bracketPairs.handleDidChangeOptions(e);
        this._decorationProvider.handleDidChangeOptions(e);
        this._onDidChangeOptions.fire(e);
    }
    detectIndentation(defaultInsertSpaces, defaultTabSize) {
        this._assertNotDisposed();
        const guessedIndentation = guessIndentation(this._buffer, defaultTabSize, defaultInsertSpaces);
        this.updateOptions({
            insertSpaces: guessedIndentation.insertSpaces,
            tabSize: guessedIndentation.tabSize,
            indentSize: guessedIndentation.tabSize, // TODO@Alex: guess indentSize independent of tabSize
        });
    }
    normalizeIndentation(str) {
        this._assertNotDisposed();
        return (0,indentation/* normalizeIndentation */.P)(str, this._options.indentSize, this._options.insertSpaces);
    }
    //#endregion
    //#region Reading
    getVersionId() {
        this._assertNotDisposed();
        return this._versionId;
    }
    mightContainRTL() {
        return this._buffer.mightContainRTL();
    }
    mightContainUnusualLineTerminators() {
        return this._buffer.mightContainUnusualLineTerminators();
    }
    removeUnusualLineTerminators(selections = null) {
        const matches = this.findMatches(strings/* UNUSUAL_LINE_TERMINATORS */._J.source, false, true, false, null, false, 1073741824 /* Constants.MAX_SAFE_SMALL_INTEGER */);
        this._buffer.resetMightContainUnusualLineTerminators();
        this.pushEditOperations(selections, matches.map(m => ({ range: m.range, text: null })), () => null);
    }
    mightContainNonBasicASCII() {
        return this._buffer.mightContainNonBasicASCII();
    }
    getAlternativeVersionId() {
        this._assertNotDisposed();
        return this._alternativeVersionId;
    }
    getInitialUndoRedoSnapshot() {
        this._assertNotDisposed();
        return this._initialUndoRedoSnapshot;
    }
    getOffsetAt(rawPosition) {
        this._assertNotDisposed();
        const position = this._validatePosition(rawPosition.lineNumber, rawPosition.column, 0 /* StringOffsetValidationType.Relaxed */);
        return this._buffer.getOffsetAt(position.lineNumber, position.column);
    }
    getPositionAt(rawOffset) {
        this._assertNotDisposed();
        const offset = (Math.min(this._buffer.getLength(), Math.max(0, rawOffset)));
        return this._buffer.getPositionAt(offset);
    }
    _increaseVersionId() {
        this._versionId = this._versionId + 1;
        this._alternativeVersionId = this._versionId;
    }
    _overwriteVersionId(versionId) {
        this._versionId = versionId;
    }
    _overwriteAlternativeVersionId(newAlternativeVersionId) {
        this._alternativeVersionId = newAlternativeVersionId;
    }
    _overwriteInitialUndoRedoSnapshot(newInitialUndoRedoSnapshot) {
        this._initialUndoRedoSnapshot = newInitialUndoRedoSnapshot;
    }
    getValue(eol, preserveBOM = false) {
        this._assertNotDisposed();
        if (this.isTooLargeForHeapOperation()) {
            throw new errors/* BugIndicatingError */.D7('Operation would exceed heap memory limits');
        }
        const fullModelRange = this.getFullModelRange();
        const fullModelValue = this.getValueInRange(fullModelRange, eol);
        if (preserveBOM) {
            return this._buffer.getBOM() + fullModelValue;
        }
        return fullModelValue;
    }
    createSnapshot(preserveBOM = false) {
        return new TextModelSnapshot(this._buffer.createSnapshot(preserveBOM));
    }
    getValueLength(eol, preserveBOM = false) {
        this._assertNotDisposed();
        const fullModelRange = this.getFullModelRange();
        const fullModelValue = this.getValueLengthInRange(fullModelRange, eol);
        if (preserveBOM) {
            return this._buffer.getBOM().length + fullModelValue;
        }
        return fullModelValue;
    }
    getValueInRange(rawRange, eol = 0 /* model.EndOfLinePreference.TextDefined */) {
        this._assertNotDisposed();
        return this._buffer.getValueInRange(this.validateRange(rawRange), eol);
    }
    getValueLengthInRange(rawRange, eol = 0 /* model.EndOfLinePreference.TextDefined */) {
        this._assertNotDisposed();
        return this._buffer.getValueLengthInRange(this.validateRange(rawRange), eol);
    }
    getCharacterCountInRange(rawRange, eol = 0 /* model.EndOfLinePreference.TextDefined */) {
        this._assertNotDisposed();
        return this._buffer.getCharacterCountInRange(this.validateRange(rawRange), eol);
    }
    getLineCount() {
        this._assertNotDisposed();
        return this._buffer.getLineCount();
    }
    getLineContent(lineNumber) {
        this._assertNotDisposed();
        if (lineNumber < 1 || lineNumber > this.getLineCount()) {
            throw new errors/* BugIndicatingError */.D7('Illegal value for lineNumber');
        }
        return this._buffer.getLineContent(lineNumber);
    }
    getLineLength(lineNumber) {
        this._assertNotDisposed();
        if (lineNumber < 1 || lineNumber > this.getLineCount()) {
            throw new errors/* BugIndicatingError */.D7('Illegal value for lineNumber');
        }
        return this._buffer.getLineLength(lineNumber);
    }
    getLinesContent() {
        this._assertNotDisposed();
        if (this.isTooLargeForHeapOperation()) {
            throw new errors/* BugIndicatingError */.D7('Operation would exceed heap memory limits');
        }
        return this._buffer.getLinesContent();
    }
    getEOL() {
        this._assertNotDisposed();
        return this._buffer.getEOL();
    }
    getEndOfLineSequence() {
        this._assertNotDisposed();
        return (this._buffer.getEOL() === '\n'
            ? 0 /* model.EndOfLineSequence.LF */
            : 1 /* model.EndOfLineSequence.CRLF */);
    }
    getLineMinColumn(lineNumber) {
        this._assertNotDisposed();
        return 1;
    }
    getLineMaxColumn(lineNumber) {
        this._assertNotDisposed();
        if (lineNumber < 1 || lineNumber > this.getLineCount()) {
            throw new errors/* BugIndicatingError */.D7('Illegal value for lineNumber');
        }
        return this._buffer.getLineLength(lineNumber) + 1;
    }
    getLineFirstNonWhitespaceColumn(lineNumber) {
        this._assertNotDisposed();
        if (lineNumber < 1 || lineNumber > this.getLineCount()) {
            throw new errors/* BugIndicatingError */.D7('Illegal value for lineNumber');
        }
        return this._buffer.getLineFirstNonWhitespaceColumn(lineNumber);
    }
    getLineLastNonWhitespaceColumn(lineNumber) {
        this._assertNotDisposed();
        if (lineNumber < 1 || lineNumber > this.getLineCount()) {
            throw new errors/* BugIndicatingError */.D7('Illegal value for lineNumber');
        }
        return this._buffer.getLineLastNonWhitespaceColumn(lineNumber);
    }
    /**
     * Validates `range` is within buffer bounds, but allows it to sit in between surrogate pairs, etc.
     * Will try to not allocate if possible.
     */
    _validateRangeRelaxedNoAllocations(range) {
        const linesCount = this._buffer.getLineCount();
        const initialStartLineNumber = range.startLineNumber;
        const initialStartColumn = range.startColumn;
        let startLineNumber = Math.floor((typeof initialStartLineNumber === 'number' && !isNaN(initialStartLineNumber)) ? initialStartLineNumber : 1);
        let startColumn = Math.floor((typeof initialStartColumn === 'number' && !isNaN(initialStartColumn)) ? initialStartColumn : 1);
        if (startLineNumber < 1) {
            startLineNumber = 1;
            startColumn = 1;
        }
        else if (startLineNumber > linesCount) {
            startLineNumber = linesCount;
            startColumn = this.getLineMaxColumn(startLineNumber);
        }
        else {
            if (startColumn <= 1) {
                startColumn = 1;
            }
            else {
                const maxColumn = this.getLineMaxColumn(startLineNumber);
                if (startColumn >= maxColumn) {
                    startColumn = maxColumn;
                }
            }
        }
        const initialEndLineNumber = range.endLineNumber;
        const initialEndColumn = range.endColumn;
        let endLineNumber = Math.floor((typeof initialEndLineNumber === 'number' && !isNaN(initialEndLineNumber)) ? initialEndLineNumber : 1);
        let endColumn = Math.floor((typeof initialEndColumn === 'number' && !isNaN(initialEndColumn)) ? initialEndColumn : 1);
        if (endLineNumber < 1) {
            endLineNumber = 1;
            endColumn = 1;
        }
        else if (endLineNumber > linesCount) {
            endLineNumber = linesCount;
            endColumn = this.getLineMaxColumn(endLineNumber);
        }
        else {
            if (endColumn <= 1) {
                endColumn = 1;
            }
            else {
                const maxColumn = this.getLineMaxColumn(endLineNumber);
                if (endColumn >= maxColumn) {
                    endColumn = maxColumn;
                }
            }
        }
        if (initialStartLineNumber === startLineNumber
            && initialStartColumn === startColumn
            && initialEndLineNumber === endLineNumber
            && initialEndColumn === endColumn
            && range instanceof core_range/* Range */.Q
            && !(range instanceof selection/* Selection */.L)) {
            return range;
        }
        return new core_range/* Range */.Q(startLineNumber, startColumn, endLineNumber, endColumn);
    }
    _isValidPosition(lineNumber, column, validationType) {
        if (typeof lineNumber !== 'number' || typeof column !== 'number') {
            return false;
        }
        if (isNaN(lineNumber) || isNaN(column)) {
            return false;
        }
        if (lineNumber < 1 || column < 1) {
            return false;
        }
        if ((lineNumber | 0) !== lineNumber || (column | 0) !== column) {
            return false;
        }
        const lineCount = this._buffer.getLineCount();
        if (lineNumber > lineCount) {
            return false;
        }
        if (column === 1) {
            return true;
        }
        const maxColumn = this.getLineMaxColumn(lineNumber);
        if (column > maxColumn) {
            return false;
        }
        if (validationType === 1 /* StringOffsetValidationType.SurrogatePairs */) {
            // !!At this point, column > 1
            const charCodeBefore = this._buffer.getLineCharCode(lineNumber, column - 2);
            if (strings/* isHighSurrogate */.pc(charCodeBefore)) {
                return false;
            }
        }
        return true;
    }
    _validatePosition(_lineNumber, _column, validationType) {
        const lineNumber = Math.floor((typeof _lineNumber === 'number' && !isNaN(_lineNumber)) ? _lineNumber : 1);
        const column = Math.floor((typeof _column === 'number' && !isNaN(_column)) ? _column : 1);
        const lineCount = this._buffer.getLineCount();
        if (lineNumber < 1) {
            return new core_position/* Position */.y(1, 1);
        }
        if (lineNumber > lineCount) {
            return new core_position/* Position */.y(lineCount, this.getLineMaxColumn(lineCount));
        }
        if (column <= 1) {
            return new core_position/* Position */.y(lineNumber, 1);
        }
        const maxColumn = this.getLineMaxColumn(lineNumber);
        if (column >= maxColumn) {
            return new core_position/* Position */.y(lineNumber, maxColumn);
        }
        if (validationType === 1 /* StringOffsetValidationType.SurrogatePairs */) {
            // If the position would end up in the middle of a high-low surrogate pair,
            // we move it to before the pair
            // !!At this point, column > 1
            const charCodeBefore = this._buffer.getLineCharCode(lineNumber, column - 2);
            if (strings/* isHighSurrogate */.pc(charCodeBefore)) {
                return new core_position/* Position */.y(lineNumber, column - 1);
            }
        }
        return new core_position/* Position */.y(lineNumber, column);
    }
    validatePosition(position) {
        const validationType = 1 /* StringOffsetValidationType.SurrogatePairs */;
        this._assertNotDisposed();
        // Avoid object allocation and cover most likely case
        if (position instanceof core_position/* Position */.y) {
            if (this._isValidPosition(position.lineNumber, position.column, validationType)) {
                return position;
            }
        }
        return this._validatePosition(position.lineNumber, position.column, validationType);
    }
    _isValidRange(range, validationType) {
        const startLineNumber = range.startLineNumber;
        const startColumn = range.startColumn;
        const endLineNumber = range.endLineNumber;
        const endColumn = range.endColumn;
        if (!this._isValidPosition(startLineNumber, startColumn, 0 /* StringOffsetValidationType.Relaxed */)) {
            return false;
        }
        if (!this._isValidPosition(endLineNumber, endColumn, 0 /* StringOffsetValidationType.Relaxed */)) {
            return false;
        }
        if (validationType === 1 /* StringOffsetValidationType.SurrogatePairs */) {
            const charCodeBeforeStart = (startColumn > 1 ? this._buffer.getLineCharCode(startLineNumber, startColumn - 2) : 0);
            const charCodeBeforeEnd = (endColumn > 1 && endColumn <= this._buffer.getLineLength(endLineNumber) ? this._buffer.getLineCharCode(endLineNumber, endColumn - 2) : 0);
            const startInsideSurrogatePair = strings/* isHighSurrogate */.pc(charCodeBeforeStart);
            const endInsideSurrogatePair = strings/* isHighSurrogate */.pc(charCodeBeforeEnd);
            if (!startInsideSurrogatePair && !endInsideSurrogatePair) {
                return true;
            }
            return false;
        }
        return true;
    }
    validateRange(_range) {
        const validationType = 1 /* StringOffsetValidationType.SurrogatePairs */;
        this._assertNotDisposed();
        // Avoid object allocation and cover most likely case
        if ((_range instanceof core_range/* Range */.Q) && !(_range instanceof selection/* Selection */.L)) {
            if (this._isValidRange(_range, validationType)) {
                return _range;
            }
        }
        const start = this._validatePosition(_range.startLineNumber, _range.startColumn, 0 /* StringOffsetValidationType.Relaxed */);
        const end = this._validatePosition(_range.endLineNumber, _range.endColumn, 0 /* StringOffsetValidationType.Relaxed */);
        const startLineNumber = start.lineNumber;
        const startColumn = start.column;
        const endLineNumber = end.lineNumber;
        const endColumn = end.column;
        if (validationType === 1 /* StringOffsetValidationType.SurrogatePairs */) {
            const charCodeBeforeStart = (startColumn > 1 ? this._buffer.getLineCharCode(startLineNumber, startColumn - 2) : 0);
            const charCodeBeforeEnd = (endColumn > 1 && endColumn <= this._buffer.getLineLength(endLineNumber) ? this._buffer.getLineCharCode(endLineNumber, endColumn - 2) : 0);
            const startInsideSurrogatePair = strings/* isHighSurrogate */.pc(charCodeBeforeStart);
            const endInsideSurrogatePair = strings/* isHighSurrogate */.pc(charCodeBeforeEnd);
            if (!startInsideSurrogatePair && !endInsideSurrogatePair) {
                return new core_range/* Range */.Q(startLineNumber, startColumn, endLineNumber, endColumn);
            }
            if (startLineNumber === endLineNumber && startColumn === endColumn) {
                // do not expand a collapsed range, simply move it to a valid location
                return new core_range/* Range */.Q(startLineNumber, startColumn - 1, endLineNumber, endColumn - 1);
            }
            if (startInsideSurrogatePair && endInsideSurrogatePair) {
                // expand range at both ends
                return new core_range/* Range */.Q(startLineNumber, startColumn - 1, endLineNumber, endColumn + 1);
            }
            if (startInsideSurrogatePair) {
                // only expand range at the start
                return new core_range/* Range */.Q(startLineNumber, startColumn - 1, endLineNumber, endColumn);
            }
            // only expand range at the end
            return new core_range/* Range */.Q(startLineNumber, startColumn, endLineNumber, endColumn + 1);
        }
        return new core_range/* Range */.Q(startLineNumber, startColumn, endLineNumber, endColumn);
    }
    modifyPosition(rawPosition, offset) {
        this._assertNotDisposed();
        const candidate = this.getOffsetAt(rawPosition) + offset;
        return this.getPositionAt(Math.min(this._buffer.getLength(), Math.max(0, candidate)));
    }
    getFullModelRange() {
        this._assertNotDisposed();
        const lineCount = this.getLineCount();
        return new core_range/* Range */.Q(1, 1, lineCount, this.getLineMaxColumn(lineCount));
    }
    findMatchesLineByLine(searchRange, searchData, captureMatches, limitResultCount) {
        return this._buffer.findMatchesLineByLine(searchRange, searchData, captureMatches, limitResultCount);
    }
    findMatches(searchString, rawSearchScope, isRegex, matchCase, wordSeparators, captureMatches, limitResultCount = LIMIT_FIND_COUNT) {
        this._assertNotDisposed();
        let searchRanges = null;
        if (rawSearchScope !== null) {
            if (!Array.isArray(rawSearchScope)) {
                rawSearchScope = [rawSearchScope];
            }
            if (rawSearchScope.every((searchScope) => core_range/* Range */.Q.isIRange(searchScope))) {
                searchRanges = rawSearchScope.map((searchScope) => this.validateRange(searchScope));
            }
        }
        if (searchRanges === null) {
            searchRanges = [this.getFullModelRange()];
        }
        searchRanges = searchRanges.sort((d1, d2) => d1.startLineNumber - d2.startLineNumber || d1.startColumn - d2.startColumn);
        const uniqueSearchRanges = [];
        uniqueSearchRanges.push(searchRanges.reduce((prev, curr) => {
            if (core_range/* Range */.Q.areIntersecting(prev, curr)) {
                return prev.plusRange(curr);
            }
            uniqueSearchRanges.push(prev);
            return curr;
        }));
        let matchMapper;
        if (!isRegex && searchString.indexOf('\n') < 0) {
            // not regex, not multi line
            const searchParams = new textModelSearch/* SearchParams */.lt(searchString, isRegex, matchCase, wordSeparators);
            const searchData = searchParams.parseSearchRequest();
            if (!searchData) {
                return [];
            }
            matchMapper = (searchRange) => this.findMatchesLineByLine(searchRange, searchData, captureMatches, limitResultCount);
        }
        else {
            matchMapper = (searchRange) => textModelSearch/* TextModelSearch */.hB.findMatches(this, new textModelSearch/* SearchParams */.lt(searchString, isRegex, matchCase, wordSeparators), searchRange, captureMatches, limitResultCount);
        }
        return uniqueSearchRanges.map(matchMapper).reduce((arr, matches) => arr.concat(matches), []);
    }
    findNextMatch(searchString, rawSearchStart, isRegex, matchCase, wordSeparators, captureMatches) {
        this._assertNotDisposed();
        const searchStart = this.validatePosition(rawSearchStart);
        if (!isRegex && searchString.indexOf('\n') < 0) {
            const searchParams = new textModelSearch/* SearchParams */.lt(searchString, isRegex, matchCase, wordSeparators);
            const searchData = searchParams.parseSearchRequest();
            if (!searchData) {
                return null;
            }
            const lineCount = this.getLineCount();
            let searchRange = new core_range/* Range */.Q(searchStart.lineNumber, searchStart.column, lineCount, this.getLineMaxColumn(lineCount));
            let ret = this.findMatchesLineByLine(searchRange, searchData, captureMatches, 1);
            textModelSearch/* TextModelSearch */.hB.findNextMatch(this, new textModelSearch/* SearchParams */.lt(searchString, isRegex, matchCase, wordSeparators), searchStart, captureMatches);
            if (ret.length > 0) {
                return ret[0];
            }
            searchRange = new core_range/* Range */.Q(1, 1, searchStart.lineNumber, this.getLineMaxColumn(searchStart.lineNumber));
            ret = this.findMatchesLineByLine(searchRange, searchData, captureMatches, 1);
            if (ret.length > 0) {
                return ret[0];
            }
            return null;
        }
        return textModelSearch/* TextModelSearch */.hB.findNextMatch(this, new textModelSearch/* SearchParams */.lt(searchString, isRegex, matchCase, wordSeparators), searchStart, captureMatches);
    }
    findPreviousMatch(searchString, rawSearchStart, isRegex, matchCase, wordSeparators, captureMatches) {
        this._assertNotDisposed();
        const searchStart = this.validatePosition(rawSearchStart);
        return textModelSearch/* TextModelSearch */.hB.findPreviousMatch(this, new textModelSearch/* SearchParams */.lt(searchString, isRegex, matchCase, wordSeparators), searchStart, captureMatches);
    }
    //#endregion
    //#region Editing
    pushStackElement() {
        this._commandManager.pushStackElement();
    }
    popStackElement() {
        this._commandManager.popStackElement();
    }
    pushEOL(eol) {
        const currentEOL = (this.getEOL() === '\n' ? 0 /* model.EndOfLineSequence.LF */ : 1 /* model.EndOfLineSequence.CRLF */);
        if (currentEOL === eol) {
            return;
        }
        try {
            this._onDidChangeDecorations.beginDeferredEmit();
            this._eventEmitter.beginDeferredEmit();
            if (this._initialUndoRedoSnapshot === null) {
                this._initialUndoRedoSnapshot = this._undoRedoService.createSnapshot(this.uri);
            }
            this._commandManager.pushEOL(eol);
        }
        finally {
            this._eventEmitter.endDeferredEmit();
            this._onDidChangeDecorations.endDeferredEmit();
        }
    }
    _validateEditOperation(rawOperation) {
        if (rawOperation instanceof model/* ValidAnnotatedEditOperation */.Wo) {
            return rawOperation;
        }
        return new model/* ValidAnnotatedEditOperation */.Wo(rawOperation.identifier || null, this.validateRange(rawOperation.range), rawOperation.text, rawOperation.forceMoveMarkers || false, rawOperation.isAutoWhitespaceEdit || false, rawOperation._isTracked || false);
    }
    _validateEditOperations(rawOperations) {
        const result = [];
        for (let i = 0, len = rawOperations.length; i < len; i++) {
            result[i] = this._validateEditOperation(rawOperations[i]);
        }
        return result;
    }
    pushEditOperations(beforeCursorState, editOperations, cursorStateComputer, group) {
        try {
            this._onDidChangeDecorations.beginDeferredEmit();
            this._eventEmitter.beginDeferredEmit();
            return this._pushEditOperations(beforeCursorState, this._validateEditOperations(editOperations), cursorStateComputer, group);
        }
        finally {
            this._eventEmitter.endDeferredEmit();
            this._onDidChangeDecorations.endDeferredEmit();
        }
    }
    _pushEditOperations(beforeCursorState, editOperations, cursorStateComputer, group) {
        if (this._options.trimAutoWhitespace && this._trimAutoWhitespaceLines) {
            // Go through each saved line number and insert a trim whitespace edit
            // if it is safe to do so (no conflicts with other edits).
            const incomingEdits = editOperations.map((op) => {
                return {
                    range: this.validateRange(op.range),
                    text: op.text
                };
            });
            // Sometimes, auto-formatters change ranges automatically which can cause undesired auto whitespace trimming near the cursor
            // We'll use the following heuristic: if the edits occur near the cursor, then it's ok to trim auto whitespace
            let editsAreNearCursors = true;
            if (beforeCursorState) {
                for (let i = 0, len = beforeCursorState.length; i < len; i++) {
                    const sel = beforeCursorState[i];
                    let foundEditNearSel = false;
                    for (let j = 0, lenJ = incomingEdits.length; j < lenJ; j++) {
                        const editRange = incomingEdits[j].range;
                        const selIsAbove = editRange.startLineNumber > sel.endLineNumber;
                        const selIsBelow = sel.startLineNumber > editRange.endLineNumber;
                        if (!selIsAbove && !selIsBelow) {
                            foundEditNearSel = true;
                            break;
                        }
                    }
                    if (!foundEditNearSel) {
                        editsAreNearCursors = false;
                        break;
                    }
                }
            }
            if (editsAreNearCursors) {
                for (let i = 0, len = this._trimAutoWhitespaceLines.length; i < len; i++) {
                    const trimLineNumber = this._trimAutoWhitespaceLines[i];
                    const maxLineColumn = this.getLineMaxColumn(trimLineNumber);
                    let allowTrimLine = true;
                    for (let j = 0, lenJ = incomingEdits.length; j < lenJ; j++) {
                        const editRange = incomingEdits[j].range;
                        const editText = incomingEdits[j].text;
                        if (trimLineNumber < editRange.startLineNumber || trimLineNumber > editRange.endLineNumber) {
                            // `trimLine` is completely outside this edit
                            continue;
                        }
                        // At this point:
                        //   editRange.startLineNumber <= trimLine <= editRange.endLineNumber
                        if (trimLineNumber === editRange.startLineNumber && editRange.startColumn === maxLineColumn
                            && editRange.isEmpty() && editText && editText.length > 0 && editText.charAt(0) === '\n') {
                            // This edit inserts a new line (and maybe other text) after `trimLine`
                            continue;
                        }
                        if (trimLineNumber === editRange.startLineNumber && editRange.startColumn === 1
                            && editRange.isEmpty() && editText && editText.length > 0 && editText.charAt(editText.length - 1) === '\n') {
                            // This edit inserts a new line (and maybe other text) before `trimLine`
                            continue;
                        }
                        // Looks like we can't trim this line as it would interfere with an incoming edit
                        allowTrimLine = false;
                        break;
                    }
                    if (allowTrimLine) {
                        const trimRange = new core_range/* Range */.Q(trimLineNumber, 1, trimLineNumber, maxLineColumn);
                        editOperations.push(new model/* ValidAnnotatedEditOperation */.Wo(null, trimRange, null, false, false, false));
                    }
                }
            }
            this._trimAutoWhitespaceLines = null;
        }
        if (this._initialUndoRedoSnapshot === null) {
            this._initialUndoRedoSnapshot = this._undoRedoService.createSnapshot(this.uri);
        }
        return this._commandManager.pushEditOperation(beforeCursorState, editOperations, cursorStateComputer, group);
    }
    _applyUndo(changes, eol, resultingAlternativeVersionId, resultingSelection) {
        const edits = changes.map((change) => {
            const rangeStart = this.getPositionAt(change.newPosition);
            const rangeEnd = this.getPositionAt(change.newEnd);
            return {
                range: new core_range/* Range */.Q(rangeStart.lineNumber, rangeStart.column, rangeEnd.lineNumber, rangeEnd.column),
                text: change.oldText
            };
        });
        this._applyUndoRedoEdits(edits, eol, true, false, resultingAlternativeVersionId, resultingSelection);
    }
    _applyRedo(changes, eol, resultingAlternativeVersionId, resultingSelection) {
        const edits = changes.map((change) => {
            const rangeStart = this.getPositionAt(change.oldPosition);
            const rangeEnd = this.getPositionAt(change.oldEnd);
            return {
                range: new core_range/* Range */.Q(rangeStart.lineNumber, rangeStart.column, rangeEnd.lineNumber, rangeEnd.column),
                text: change.newText
            };
        });
        this._applyUndoRedoEdits(edits, eol, false, true, resultingAlternativeVersionId, resultingSelection);
    }
    _applyUndoRedoEdits(edits, eol, isUndoing, isRedoing, resultingAlternativeVersionId, resultingSelection) {
        try {
            this._onDidChangeDecorations.beginDeferredEmit();
            this._eventEmitter.beginDeferredEmit();
            this._isUndoing = isUndoing;
            this._isRedoing = isRedoing;
            this.applyEdits(edits, false);
            this.setEOL(eol);
            this._overwriteAlternativeVersionId(resultingAlternativeVersionId);
        }
        finally {
            this._isUndoing = false;
            this._isRedoing = false;
            this._eventEmitter.endDeferredEmit(resultingSelection);
            this._onDidChangeDecorations.endDeferredEmit();
        }
    }
    applyEdits(rawOperations, computeUndoEdits = false) {
        try {
            this._onDidChangeDecorations.beginDeferredEmit();
            this._eventEmitter.beginDeferredEmit();
            const operations = this._validateEditOperations(rawOperations);
            return this._doApplyEdits(operations, computeUndoEdits);
        }
        finally {
            this._eventEmitter.endDeferredEmit();
            this._onDidChangeDecorations.endDeferredEmit();
        }
    }
    _doApplyEdits(rawOperations, computeUndoEdits) {
        const oldLineCount = this._buffer.getLineCount();
        const result = this._buffer.applyEdits(rawOperations, this._options.trimAutoWhitespace, computeUndoEdits);
        const newLineCount = this._buffer.getLineCount();
        const contentChanges = result.changes;
        this._trimAutoWhitespaceLines = result.trimAutoWhitespaceLineNumbers;
        if (contentChanges.length !== 0) {
            // We do a first pass to update decorations
            // because we want to read decorations in the second pass
            // where we will emit content change events
            // and we want to read the final decorations
            for (let i = 0, len = contentChanges.length; i < len; i++) {
                const change = contentChanges[i];
                this._decorationsTree.acceptReplace(change.rangeOffset, change.rangeLength, change.text.length, change.forceMoveMarkers);
            }
            const rawContentChanges = [];
            this._increaseVersionId();
            let lineCount = oldLineCount;
            for (let i = 0, len = contentChanges.length; i < len; i++) {
                const change = contentChanges[i];
                const [eolCount] = (0,eolCounter/* countEOL */.W)(change.text);
                this._onDidChangeDecorations.fire();
                const startLineNumber = change.range.startLineNumber;
                const endLineNumber = change.range.endLineNumber;
                const deletingLinesCnt = endLineNumber - startLineNumber;
                const insertingLinesCnt = eolCount;
                const editingLinesCnt = Math.min(deletingLinesCnt, insertingLinesCnt);
                const changeLineCountDelta = (insertingLinesCnt - deletingLinesCnt);
                const currentEditStartLineNumber = newLineCount - lineCount - changeLineCountDelta + startLineNumber;
                const firstEditLineNumber = currentEditStartLineNumber;
                const lastInsertedLineNumber = currentEditStartLineNumber + insertingLinesCnt;
                const decorationsWithInjectedTextInEditedRange = this._decorationsTree.getInjectedTextInInterval(this, this.getOffsetAt(new core_position/* Position */.y(firstEditLineNumber, 1)), this.getOffsetAt(new core_position/* Position */.y(lastInsertedLineNumber, this.getLineMaxColumn(lastInsertedLineNumber))), 0);
                const injectedTextInEditedRange = textModelEvents/* LineInjectedText */.uK.fromDecorations(decorationsWithInjectedTextInEditedRange);
                const injectedTextInEditedRangeQueue = new arrays/* ArrayQueue */.j3(injectedTextInEditedRange);
                for (let j = editingLinesCnt; j >= 0; j--) {
                    const editLineNumber = startLineNumber + j;
                    const currentEditLineNumber = currentEditStartLineNumber + j;
                    injectedTextInEditedRangeQueue.takeFromEndWhile(r => r.lineNumber > currentEditLineNumber);
                    const decorationsInCurrentLine = injectedTextInEditedRangeQueue.takeFromEndWhile(r => r.lineNumber === currentEditLineNumber);
                    rawContentChanges.push(new textModelEvents/* ModelRawLineChanged */.U0(editLineNumber, this.getLineContent(currentEditLineNumber), decorationsInCurrentLine));
                }
                if (editingLinesCnt < deletingLinesCnt) {
                    // Must delete some lines
                    const spliceStartLineNumber = startLineNumber + editingLinesCnt;
                    rawContentChanges.push(new textModelEvents/* ModelRawLinesDeleted */.E$(spliceStartLineNumber + 1, endLineNumber));
                }
                if (editingLinesCnt < insertingLinesCnt) {
                    const injectedTextInEditedRangeQueue = new arrays/* ArrayQueue */.j3(injectedTextInEditedRange);
                    // Must insert some lines
                    const spliceLineNumber = startLineNumber + editingLinesCnt;
                    const cnt = insertingLinesCnt - editingLinesCnt;
                    const fromLineNumber = newLineCount - lineCount - cnt + spliceLineNumber + 1;
                    const injectedTexts = [];
                    const newLines = [];
                    for (let i = 0; i < cnt; i++) {
                        const lineNumber = fromLineNumber + i;
                        newLines[i] = this.getLineContent(lineNumber);
                        injectedTextInEditedRangeQueue.takeWhile(r => r.lineNumber < lineNumber);
                        injectedTexts[i] = injectedTextInEditedRangeQueue.takeWhile(r => r.lineNumber === lineNumber);
                    }
                    rawContentChanges.push(new textModelEvents/* ModelRawLinesInserted */.bg(spliceLineNumber + 1, startLineNumber + insertingLinesCnt, newLines, injectedTexts));
                }
                lineCount += changeLineCountDelta;
            }
            this._emitContentChangedEvent(new textModelEvents/* ModelRawContentChangedEvent */.HP(rawContentChanges, this.getVersionId(), this._isUndoing, this._isRedoing), {
                changes: contentChanges,
                eol: this._buffer.getEOL(),
                isEolChange: false,
                versionId: this.getVersionId(),
                isUndoing: this._isUndoing,
                isRedoing: this._isRedoing,
                isFlush: false
            });
        }
        return (result.reverseEdits === null ? undefined : result.reverseEdits);
    }
    undo() {
        return this._undoRedoService.undo(this.uri);
    }
    canUndo() {
        return this._undoRedoService.canUndo(this.uri);
    }
    redo() {
        return this._undoRedoService.redo(this.uri);
    }
    canRedo() {
        return this._undoRedoService.canRedo(this.uri);
    }
    //#endregion
    //#region Decorations
    handleBeforeFireDecorationsChangedEvent(affectedInjectedTextLines) {
        // This is called before the decoration changed event is fired.
        if (affectedInjectedTextLines === null || affectedInjectedTextLines.size === 0) {
            return;
        }
        const affectedLines = Array.from(affectedInjectedTextLines);
        const lineChangeEvents = affectedLines.map(lineNumber => new textModelEvents/* ModelRawLineChanged */.U0(lineNumber, this.getLineContent(lineNumber), this._getInjectedTextInLine(lineNumber)));
        this._onDidChangeInjectedText.fire(new textModelEvents/* ModelInjectedTextChangedEvent */.vn(lineChangeEvents));
    }
    changeDecorations(callback, ownerId = 0) {
        this._assertNotDisposed();
        try {
            this._onDidChangeDecorations.beginDeferredEmit();
            return this._changeDecorations(ownerId, callback);
        }
        finally {
            this._onDidChangeDecorations.endDeferredEmit();
        }
    }
    _changeDecorations(ownerId, callback) {
        const changeAccessor = {
            addDecoration: (range, options) => {
                return this._deltaDecorationsImpl(ownerId, [], [{ range: range, options: options }])[0];
            },
            changeDecoration: (id, newRange) => {
                this._changeDecorationImpl(id, newRange);
            },
            changeDecorationOptions: (id, options) => {
                this._changeDecorationOptionsImpl(id, _normalizeOptions(options));
            },
            removeDecoration: (id) => {
                this._deltaDecorationsImpl(ownerId, [id], []);
            },
            deltaDecorations: (oldDecorations, newDecorations) => {
                if (oldDecorations.length === 0 && newDecorations.length === 0) {
                    // nothing to do
                    return [];
                }
                return this._deltaDecorationsImpl(ownerId, oldDecorations, newDecorations);
            }
        };
        let result = null;
        try {
            result = callback(changeAccessor);
        }
        catch (e) {
            (0,errors/* onUnexpectedError */.dz)(e);
        }
        // Invalidate change accessor
        changeAccessor.addDecoration = invalidFunc;
        changeAccessor.changeDecoration = invalidFunc;
        changeAccessor.changeDecorationOptions = invalidFunc;
        changeAccessor.removeDecoration = invalidFunc;
        changeAccessor.deltaDecorations = invalidFunc;
        return result;
    }
    deltaDecorations(oldDecorations, newDecorations, ownerId = 0) {
        this._assertNotDisposed();
        if (!oldDecorations) {
            oldDecorations = [];
        }
        if (oldDecorations.length === 0 && newDecorations.length === 0) {
            // nothing to do
            return [];
        }
        try {
            this._deltaDecorationCallCnt++;
            if (this._deltaDecorationCallCnt > 1) {
                console.warn(`Invoking deltaDecorations recursively could lead to leaking decorations.`);
                (0,errors/* onUnexpectedError */.dz)(new Error(`Invoking deltaDecorations recursively could lead to leaking decorations.`));
            }
            this._onDidChangeDecorations.beginDeferredEmit();
            return this._deltaDecorationsImpl(ownerId, oldDecorations, newDecorations);
        }
        finally {
            this._onDidChangeDecorations.endDeferredEmit();
            this._deltaDecorationCallCnt--;
        }
    }
    _getTrackedRange(id) {
        return this.getDecorationRange(id);
    }
    _setTrackedRange(id, newRange, newStickiness) {
        const node = (id ? this._decorations[id] : null);
        if (!node) {
            if (!newRange) {
                // node doesn't exist, the request is to delete => nothing to do
                return null;
            }
            // node doesn't exist, the request is to set => add the tracked range
            return this._deltaDecorationsImpl(0, [], [{ range: newRange, options: TRACKED_RANGE_OPTIONS[newStickiness] }], true)[0];
        }
        if (!newRange) {
            // node exists, the request is to delete => delete node
            this._decorationsTree.delete(node);
            delete this._decorations[node.id];
            return null;
        }
        // node exists, the request is to set => change the tracked range and its options
        const range = this._validateRangeRelaxedNoAllocations(newRange);
        const startOffset = this._buffer.getOffsetAt(range.startLineNumber, range.startColumn);
        const endOffset = this._buffer.getOffsetAt(range.endLineNumber, range.endColumn);
        this._decorationsTree.delete(node);
        node.reset(this.getVersionId(), startOffset, endOffset, range);
        node.setOptions(TRACKED_RANGE_OPTIONS[newStickiness]);
        this._decorationsTree.insert(node);
        return node.id;
    }
    removeAllDecorationsWithOwnerId(ownerId) {
        if (this._isDisposed) {
            return;
        }
        const nodes = this._decorationsTree.collectNodesFromOwner(ownerId);
        for (let i = 0, len = nodes.length; i < len; i++) {
            const node = nodes[i];
            this._decorationsTree.delete(node);
            delete this._decorations[node.id];
        }
    }
    getDecorationOptions(decorationId) {
        const node = this._decorations[decorationId];
        if (!node) {
            return null;
        }
        return node.options;
    }
    getDecorationRange(decorationId) {
        const node = this._decorations[decorationId];
        if (!node) {
            return null;
        }
        return this._decorationsTree.getNodeRange(this, node);
    }
    getLineDecorations(lineNumber, ownerId = 0, filterOutValidation = false) {
        if (lineNumber < 1 || lineNumber > this.getLineCount()) {
            return [];
        }
        return this.getLinesDecorations(lineNumber, lineNumber, ownerId, filterOutValidation);
    }
    getLinesDecorations(_startLineNumber, _endLineNumber, ownerId = 0, filterOutValidation = false, onlyMarginDecorations = false) {
        const lineCount = this.getLineCount();
        const startLineNumber = Math.min(lineCount, Math.max(1, _startLineNumber));
        const endLineNumber = Math.min(lineCount, Math.max(1, _endLineNumber));
        const endColumn = this.getLineMaxColumn(endLineNumber);
        const range = new core_range/* Range */.Q(startLineNumber, 1, endLineNumber, endColumn);
        const decorations = this._getDecorationsInRange(range, ownerId, filterOutValidation, onlyMarginDecorations);
        (0,arrays/* pushMany */.E4)(decorations, this._decorationProvider.getDecorationsInRange(range, ownerId, filterOutValidation));
        return decorations;
    }
    getDecorationsInRange(range, ownerId = 0, filterOutValidation = false, onlyMinimapDecorations = false, onlyMarginDecorations = false) {
        const validatedRange = this.validateRange(range);
        const decorations = this._getDecorationsInRange(validatedRange, ownerId, filterOutValidation, onlyMarginDecorations);
        (0,arrays/* pushMany */.E4)(decorations, this._decorationProvider.getDecorationsInRange(validatedRange, ownerId, filterOutValidation, onlyMinimapDecorations));
        return decorations;
    }
    getOverviewRulerDecorations(ownerId = 0, filterOutValidation = false) {
        return this._decorationsTree.getAll(this, ownerId, filterOutValidation, true, false);
    }
    getInjectedTextDecorations(ownerId = 0) {
        return this._decorationsTree.getAllInjectedText(this, ownerId);
    }
    _getInjectedTextInLine(lineNumber) {
        const startOffset = this._buffer.getOffsetAt(lineNumber, 1);
        const endOffset = startOffset + this._buffer.getLineLength(lineNumber);
        const result = this._decorationsTree.getInjectedTextInInterval(this, startOffset, endOffset, 0);
        return textModelEvents/* LineInjectedText */.uK.fromDecorations(result).filter(t => t.lineNumber === lineNumber);
    }
    getAllDecorations(ownerId = 0, filterOutValidation = false) {
        let result = this._decorationsTree.getAll(this, ownerId, filterOutValidation, false, false);
        result = result.concat(this._decorationProvider.getAllDecorations(ownerId, filterOutValidation));
        return result;
    }
    getAllMarginDecorations(ownerId = 0) {
        return this._decorationsTree.getAll(this, ownerId, false, false, true);
    }
    _getDecorationsInRange(filterRange, filterOwnerId, filterOutValidation, onlyMarginDecorations) {
        const startOffset = this._buffer.getOffsetAt(filterRange.startLineNumber, filterRange.startColumn);
        const endOffset = this._buffer.getOffsetAt(filterRange.endLineNumber, filterRange.endColumn);
        return this._decorationsTree.getAllInInterval(this, startOffset, endOffset, filterOwnerId, filterOutValidation, onlyMarginDecorations);
    }
    getRangeAt(start, end) {
        return this._buffer.getRangeAt(start, end - start);
    }
    _changeDecorationImpl(decorationId, _range) {
        const node = this._decorations[decorationId];
        if (!node) {
            return;
        }
        if (node.options.after) {
            const oldRange = this.getDecorationRange(decorationId);
            this._onDidChangeDecorations.recordLineAffectedByInjectedText(oldRange.endLineNumber);
        }
        if (node.options.before) {
            const oldRange = this.getDecorationRange(decorationId);
            this._onDidChangeDecorations.recordLineAffectedByInjectedText(oldRange.startLineNumber);
        }
        const range = this._validateRangeRelaxedNoAllocations(_range);
        const startOffset = this._buffer.getOffsetAt(range.startLineNumber, range.startColumn);
        const endOffset = this._buffer.getOffsetAt(range.endLineNumber, range.endColumn);
        this._decorationsTree.delete(node);
        node.reset(this.getVersionId(), startOffset, endOffset, range);
        this._decorationsTree.insert(node);
        this._onDidChangeDecorations.checkAffectedAndFire(node.options);
        if (node.options.after) {
            this._onDidChangeDecorations.recordLineAffectedByInjectedText(range.endLineNumber);
        }
        if (node.options.before) {
            this._onDidChangeDecorations.recordLineAffectedByInjectedText(range.startLineNumber);
        }
    }
    _changeDecorationOptionsImpl(decorationId, options) {
        const node = this._decorations[decorationId];
        if (!node) {
            return;
        }
        const nodeWasInOverviewRuler = (node.options.overviewRuler && node.options.overviewRuler.color ? true : false);
        const nodeIsInOverviewRuler = (options.overviewRuler && options.overviewRuler.color ? true : false);
        this._onDidChangeDecorations.checkAffectedAndFire(node.options);
        this._onDidChangeDecorations.checkAffectedAndFire(options);
        if (node.options.after || options.after) {
            const nodeRange = this._decorationsTree.getNodeRange(this, node);
            this._onDidChangeDecorations.recordLineAffectedByInjectedText(nodeRange.endLineNumber);
        }
        if (node.options.before || options.before) {
            const nodeRange = this._decorationsTree.getNodeRange(this, node);
            this._onDidChangeDecorations.recordLineAffectedByInjectedText(nodeRange.startLineNumber);
        }
        const movedInOverviewRuler = nodeWasInOverviewRuler !== nodeIsInOverviewRuler;
        const changedWhetherInjectedText = isOptionsInjectedText(options) !== isNodeInjectedText(node);
        if (movedInOverviewRuler || changedWhetherInjectedText) {
            this._decorationsTree.delete(node);
            node.setOptions(options);
            this._decorationsTree.insert(node);
        }
        else {
            node.setOptions(options);
        }
    }
    _deltaDecorationsImpl(ownerId, oldDecorationsIds, newDecorations, suppressEvents = false) {
        const versionId = this.getVersionId();
        const oldDecorationsLen = oldDecorationsIds.length;
        let oldDecorationIndex = 0;
        const newDecorationsLen = newDecorations.length;
        let newDecorationIndex = 0;
        this._onDidChangeDecorations.beginDeferredEmit();
        try {
            const result = new Array(newDecorationsLen);
            while (oldDecorationIndex < oldDecorationsLen || newDecorationIndex < newDecorationsLen) {
                let node = null;
                if (oldDecorationIndex < oldDecorationsLen) {
                    // (1) get ourselves an old node
                    do {
                        node = this._decorations[oldDecorationsIds[oldDecorationIndex++]];
                    } while (!node && oldDecorationIndex < oldDecorationsLen);
                    // (2) remove the node from the tree (if it exists)
                    if (node) {
                        if (node.options.after) {
                            const nodeRange = this._decorationsTree.getNodeRange(this, node);
                            this._onDidChangeDecorations.recordLineAffectedByInjectedText(nodeRange.endLineNumber);
                        }
                        if (node.options.before) {
                            const nodeRange = this._decorationsTree.getNodeRange(this, node);
                            this._onDidChangeDecorations.recordLineAffectedByInjectedText(nodeRange.startLineNumber);
                        }
                        this._decorationsTree.delete(node);
                        if (!suppressEvents) {
                            this._onDidChangeDecorations.checkAffectedAndFire(node.options);
                        }
                    }
                }
                if (newDecorationIndex < newDecorationsLen) {
                    // (3) create a new node if necessary
                    if (!node) {
                        const internalDecorationId = (++this._lastDecorationId);
                        const decorationId = `${this._instanceId};${internalDecorationId}`;
                        node = new IntervalNode(decorationId, 0, 0);
                        this._decorations[decorationId] = node;
                    }
                    // (4) initialize node
                    const newDecoration = newDecorations[newDecorationIndex];
                    const range = this._validateRangeRelaxedNoAllocations(newDecoration.range);
                    const options = _normalizeOptions(newDecoration.options);
                    const startOffset = this._buffer.getOffsetAt(range.startLineNumber, range.startColumn);
                    const endOffset = this._buffer.getOffsetAt(range.endLineNumber, range.endColumn);
                    node.ownerId = ownerId;
                    node.reset(versionId, startOffset, endOffset, range);
                    node.setOptions(options);
                    if (node.options.after) {
                        this._onDidChangeDecorations.recordLineAffectedByInjectedText(range.endLineNumber);
                    }
                    if (node.options.before) {
                        this._onDidChangeDecorations.recordLineAffectedByInjectedText(range.startLineNumber);
                    }
                    if (!suppressEvents) {
                        this._onDidChangeDecorations.checkAffectedAndFire(options);
                    }
                    this._decorationsTree.insert(node);
                    result[newDecorationIndex] = node.id;
                    newDecorationIndex++;
                }
                else {
                    if (node) {
                        delete this._decorations[node.id];
                    }
                }
            }
            return result;
        }
        finally {
            this._onDidChangeDecorations.endDeferredEmit();
        }
    }
    //#endregion
    //#region Tokenization
    // TODO move them to the tokenization part.
    getLanguageId() {
        return this.tokenization.getLanguageId();
    }
    setLanguage(languageIdOrSelection, source) {
        if (typeof languageIdOrSelection === 'string') {
            this._languageSelectionListener.clear();
            this._setLanguage(languageIdOrSelection, source);
        }
        else {
            this._languageSelectionListener.value = languageIdOrSelection.onDidChange(() => this._setLanguage(languageIdOrSelection.languageId, source));
            this._setLanguage(languageIdOrSelection.languageId, source);
        }
    }
    _setLanguage(languageId, source) {
        this.tokenization.setLanguageId(languageId, source);
        this._languageService.requestRichLanguageFeatures(languageId);
    }
    getLanguageIdAtPosition(lineNumber, column) {
        return this.tokenization.getLanguageIdAtPosition(lineNumber, column);
    }
    getWordAtPosition(position) {
        return this._tokenizationTextModelPart.getWordAtPosition(position);
    }
    getWordUntilPosition(position) {
        return this._tokenizationTextModelPart.getWordUntilPosition(position);
    }
    //#endregion
    normalizePosition(position, affinity) {
        return position;
    }
    /**
     * Gets the column at which indentation stops at a given line.
     * @internal
    */
    getLineIndentColumn(lineNumber) {
        // Columns start with 1.
        return indentOfLine(this.getLineContent(lineNumber)) + 1;
    }
};
TextModel = TextModel_1 = textModel_decorate([
    textModel_param(4, undoRedo/* IUndoRedoService */.$D),
    textModel_param(5, language/* ILanguageService */.L),
    textModel_param(6, languageConfigurationRegistry/* ILanguageConfigurationService */.JZ),
    textModel_param(7, instantiation/* IInstantiationService */._Y)
], TextModel);

function indentOfLine(line) {
    let indent = 0;
    for (const c of line) {
        if (c === ' ' || c === '\t') {
            indent++;
        }
        else {
            break;
        }
    }
    return indent;
}
//#region Decorations
function isNodeInOverviewRuler(node) {
    return (node.options.overviewRuler && node.options.overviewRuler.color ? true : false);
}
function isOptionsInjectedText(options) {
    return !!options.after || !!options.before;
}
function isNodeInjectedText(node) {
    return !!node.options.after || !!node.options.before;
}
class DecorationsTrees {
    constructor() {
        this._decorationsTree0 = new IntervalTree();
        this._decorationsTree1 = new IntervalTree();
        this._injectedTextDecorationsTree = new IntervalTree();
    }
    ensureAllNodesHaveRanges(host) {
        this.getAll(host, 0, false, false, false);
    }
    _ensureNodesHaveRanges(host, nodes) {
        for (const node of nodes) {
            if (node.range === null) {
                node.range = host.getRangeAt(node.cachedAbsoluteStart, node.cachedAbsoluteEnd);
            }
        }
        return nodes;
    }
    getAllInInterval(host, start, end, filterOwnerId, filterOutValidation, onlyMarginDecorations) {
        const versionId = host.getVersionId();
        const result = this._intervalSearch(start, end, filterOwnerId, filterOutValidation, versionId, onlyMarginDecorations);
        return this._ensureNodesHaveRanges(host, result);
    }
    _intervalSearch(start, end, filterOwnerId, filterOutValidation, cachedVersionId, onlyMarginDecorations) {
        const r0 = this._decorationsTree0.intervalSearch(start, end, filterOwnerId, filterOutValidation, cachedVersionId, onlyMarginDecorations);
        const r1 = this._decorationsTree1.intervalSearch(start, end, filterOwnerId, filterOutValidation, cachedVersionId, onlyMarginDecorations);
        const r2 = this._injectedTextDecorationsTree.intervalSearch(start, end, filterOwnerId, filterOutValidation, cachedVersionId, onlyMarginDecorations);
        return r0.concat(r1).concat(r2);
    }
    getInjectedTextInInterval(host, start, end, filterOwnerId) {
        const versionId = host.getVersionId();
        const result = this._injectedTextDecorationsTree.intervalSearch(start, end, filterOwnerId, false, versionId, false);
        return this._ensureNodesHaveRanges(host, result).filter((i) => i.options.showIfCollapsed || !i.range.isEmpty());
    }
    getAllInjectedText(host, filterOwnerId) {
        const versionId = host.getVersionId();
        const result = this._injectedTextDecorationsTree.search(filterOwnerId, false, versionId, false);
        return this._ensureNodesHaveRanges(host, result).filter((i) => i.options.showIfCollapsed || !i.range.isEmpty());
    }
    getAll(host, filterOwnerId, filterOutValidation, overviewRulerOnly, onlyMarginDecorations) {
        const versionId = host.getVersionId();
        const result = this._search(filterOwnerId, filterOutValidation, overviewRulerOnly, versionId, onlyMarginDecorations);
        return this._ensureNodesHaveRanges(host, result);
    }
    _search(filterOwnerId, filterOutValidation, overviewRulerOnly, cachedVersionId, onlyMarginDecorations) {
        if (overviewRulerOnly) {
            return this._decorationsTree1.search(filterOwnerId, filterOutValidation, cachedVersionId, onlyMarginDecorations);
        }
        else {
            const r0 = this._decorationsTree0.search(filterOwnerId, filterOutValidation, cachedVersionId, onlyMarginDecorations);
            const r1 = this._decorationsTree1.search(filterOwnerId, filterOutValidation, cachedVersionId, onlyMarginDecorations);
            const r2 = this._injectedTextDecorationsTree.search(filterOwnerId, filterOutValidation, cachedVersionId, onlyMarginDecorations);
            return r0.concat(r1).concat(r2);
        }
    }
    collectNodesFromOwner(ownerId) {
        const r0 = this._decorationsTree0.collectNodesFromOwner(ownerId);
        const r1 = this._decorationsTree1.collectNodesFromOwner(ownerId);
        const r2 = this._injectedTextDecorationsTree.collectNodesFromOwner(ownerId);
        return r0.concat(r1).concat(r2);
    }
    collectNodesPostOrder() {
        const r0 = this._decorationsTree0.collectNodesPostOrder();
        const r1 = this._decorationsTree1.collectNodesPostOrder();
        const r2 = this._injectedTextDecorationsTree.collectNodesPostOrder();
        return r0.concat(r1).concat(r2);
    }
    insert(node) {
        if (isNodeInjectedText(node)) {
            this._injectedTextDecorationsTree.insert(node);
        }
        else if (isNodeInOverviewRuler(node)) {
            this._decorationsTree1.insert(node);
        }
        else {
            this._decorationsTree0.insert(node);
        }
    }
    delete(node) {
        if (isNodeInjectedText(node)) {
            this._injectedTextDecorationsTree.delete(node);
        }
        else if (isNodeInOverviewRuler(node)) {
            this._decorationsTree1.delete(node);
        }
        else {
            this._decorationsTree0.delete(node);
        }
    }
    getNodeRange(host, node) {
        const versionId = host.getVersionId();
        if (node.cachedVersionId !== versionId) {
            this._resolveNode(node, versionId);
        }
        if (node.range === null) {
            node.range = host.getRangeAt(node.cachedAbsoluteStart, node.cachedAbsoluteEnd);
        }
        return node.range;
    }
    _resolveNode(node, cachedVersionId) {
        if (isNodeInjectedText(node)) {
            this._injectedTextDecorationsTree.resolveNode(node, cachedVersionId);
        }
        else if (isNodeInOverviewRuler(node)) {
            this._decorationsTree1.resolveNode(node, cachedVersionId);
        }
        else {
            this._decorationsTree0.resolveNode(node, cachedVersionId);
        }
    }
    acceptReplace(offset, length, textLength, forceMoveMarkers) {
        this._decorationsTree0.acceptReplace(offset, length, textLength, forceMoveMarkers);
        this._decorationsTree1.acceptReplace(offset, length, textLength, forceMoveMarkers);
        this._injectedTextDecorationsTree.acceptReplace(offset, length, textLength, forceMoveMarkers);
    }
}
function cleanClassName(className) {
    return className.replace(/[^a-z0-9\-_]/gi, ' ');
}
class DecorationOptions {
    constructor(options) {
        this.color = options.color || '';
        this.darkColor = options.darkColor || '';
    }
}
class ModelDecorationOverviewRulerOptions extends DecorationOptions {
    constructor(options) {
        super(options);
        this._resolvedColor = null;
        this.position = (typeof options.position === 'number' ? options.position : model/* OverviewRulerLane */.A5.Center);
    }
    getColor(theme) {
        if (!this._resolvedColor) {
            if (theme.type !== 'light' && this.darkColor) {
                this._resolvedColor = this._resolveColor(this.darkColor, theme);
            }
            else {
                this._resolvedColor = this._resolveColor(this.color, theme);
            }
        }
        return this._resolvedColor;
    }
    invalidateCachedColor() {
        this._resolvedColor = null;
    }
    _resolveColor(color, theme) {
        if (typeof color === 'string') {
            return color;
        }
        const c = color ? theme.getColor(color.id) : null;
        if (!c) {
            return '';
        }
        return c.toString();
    }
}
class ModelDecorationGlyphMarginOptions {
    constructor(options) {
        this.position = options?.position ?? model/* GlyphMarginLane */.ZS.Center;
        this.persistLane = options?.persistLane;
    }
}
class ModelDecorationMinimapOptions extends DecorationOptions {
    constructor(options) {
        super(options);
        this.position = options.position;
        this.sectionHeaderStyle = options.sectionHeaderStyle ?? null;
        this.sectionHeaderText = options.sectionHeaderText ?? null;
    }
    getColor(theme) {
        if (!this._resolvedColor) {
            if (theme.type !== 'light' && this.darkColor) {
                this._resolvedColor = this._resolveColor(this.darkColor, theme);
            }
            else {
                this._resolvedColor = this._resolveColor(this.color, theme);
            }
        }
        return this._resolvedColor;
    }
    invalidateCachedColor() {
        this._resolvedColor = undefined;
    }
    _resolveColor(color, theme) {
        if (typeof color === 'string') {
            return common_color/* Color */.Q1.fromHex(color);
        }
        return theme.getColor(color.id);
    }
}
class ModelDecorationInjectedTextOptions {
    static from(options) {
        if (options instanceof ModelDecorationInjectedTextOptions) {
            return options;
        }
        return new ModelDecorationInjectedTextOptions(options);
    }
    constructor(options) {
        this.content = options.content || '';
        this.inlineClassName = options.inlineClassName || null;
        this.inlineClassNameAffectsLetterSpacing = options.inlineClassNameAffectsLetterSpacing || false;
        this.attachedData = options.attachedData || null;
        this.cursorStops = options.cursorStops || null;
    }
}
class ModelDecorationOptions {
    static register(options) {
        return new ModelDecorationOptions(options);
    }
    static createDynamic(options) {
        return new ModelDecorationOptions(options);
    }
    constructor(options) {
        this.description = options.description;
        this.blockClassName = options.blockClassName ? cleanClassName(options.blockClassName) : null;
        this.blockDoesNotCollapse = options.blockDoesNotCollapse ?? null;
        this.blockIsAfterEnd = options.blockIsAfterEnd ?? null;
        this.blockPadding = options.blockPadding ?? null;
        this.stickiness = options.stickiness || 0 /* model.TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges */;
        this.zIndex = options.zIndex || 0;
        this.className = options.className ? cleanClassName(options.className) : null;
        this.shouldFillLineOnLineBreak = options.shouldFillLineOnLineBreak ?? null;
        this.hoverMessage = options.hoverMessage || null;
        this.glyphMarginHoverMessage = options.glyphMarginHoverMessage || null;
        this.lineNumberHoverMessage = options.lineNumberHoverMessage || null;
        this.isWholeLine = options.isWholeLine || false;
        this.showIfCollapsed = options.showIfCollapsed || false;
        this.collapseOnReplaceEdit = options.collapseOnReplaceEdit || false;
        this.overviewRuler = options.overviewRuler ? new ModelDecorationOverviewRulerOptions(options.overviewRuler) : null;
        this.minimap = options.minimap ? new ModelDecorationMinimapOptions(options.minimap) : null;
        this.glyphMargin = options.glyphMarginClassName ? new ModelDecorationGlyphMarginOptions(options.glyphMargin) : null;
        this.glyphMarginClassName = options.glyphMarginClassName ? cleanClassName(options.glyphMarginClassName) : null;
        this.linesDecorationsClassName = options.linesDecorationsClassName ? cleanClassName(options.linesDecorationsClassName) : null;
        this.lineNumberClassName = options.lineNumberClassName ? cleanClassName(options.lineNumberClassName) : null;
        this.linesDecorationsTooltip = options.linesDecorationsTooltip ? strings/* htmlAttributeEncodeValue */.jy(options.linesDecorationsTooltip) : null;
        this.firstLineDecorationClassName = options.firstLineDecorationClassName ? cleanClassName(options.firstLineDecorationClassName) : null;
        this.marginClassName = options.marginClassName ? cleanClassName(options.marginClassName) : null;
        this.inlineClassName = options.inlineClassName ? cleanClassName(options.inlineClassName) : null;
        this.inlineClassNameAffectsLetterSpacing = options.inlineClassNameAffectsLetterSpacing || false;
        this.beforeContentClassName = options.beforeContentClassName ? cleanClassName(options.beforeContentClassName) : null;
        this.afterContentClassName = options.afterContentClassName ? cleanClassName(options.afterContentClassName) : null;
        this.after = options.after ? ModelDecorationInjectedTextOptions.from(options.after) : null;
        this.before = options.before ? ModelDecorationInjectedTextOptions.from(options.before) : null;
        this.hideInCommentTokens = options.hideInCommentTokens ?? false;
        this.hideInStringTokens = options.hideInStringTokens ?? false;
    }
}
ModelDecorationOptions.EMPTY = ModelDecorationOptions.register({ description: 'empty' });
/**
 * The order carefully matches the values of the enum.
 */
const TRACKED_RANGE_OPTIONS = [
    ModelDecorationOptions.register({ description: 'tracked-range-always-grows-when-typing-at-edges', stickiness: 0 /* model.TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges */ }),
    ModelDecorationOptions.register({ description: 'tracked-range-never-grows-when-typing-at-edges', stickiness: 1 /* model.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges */ }),
    ModelDecorationOptions.register({ description: 'tracked-range-grows-only-when-typing-before', stickiness: 2 /* model.TrackedRangeStickiness.GrowsOnlyWhenTypingBefore */ }),
    ModelDecorationOptions.register({ description: 'tracked-range-grows-only-when-typing-after', stickiness: 3 /* model.TrackedRangeStickiness.GrowsOnlyWhenTypingAfter */ }),
];
function _normalizeOptions(options) {
    if (options instanceof ModelDecorationOptions) {
        return options;
    }
    return ModelDecorationOptions.createDynamic(options);
}
class DidChangeDecorationsEmitter extends lifecycle/* Disposable */.jG {
    constructor(handleBeforeFire) {
        super();
        this.handleBeforeFire = handleBeforeFire;
        this._actual = this._register(new common_event/* Emitter */.vl());
        this.event = this._actual.event;
        this._affectedInjectedTextLines = null;
        this._deferredCnt = 0;
        this._shouldFireDeferred = false;
        this._affectsMinimap = false;
        this._affectsOverviewRuler = false;
        this._affectsGlyphMargin = false;
        this._affectsLineNumber = false;
    }
    beginDeferredEmit() {
        this._deferredCnt++;
    }
    endDeferredEmit() {
        this._deferredCnt--;
        if (this._deferredCnt === 0) {
            if (this._shouldFireDeferred) {
                this.doFire();
            }
            this._affectedInjectedTextLines?.clear();
            this._affectedInjectedTextLines = null;
        }
    }
    recordLineAffectedByInjectedText(lineNumber) {
        if (!this._affectedInjectedTextLines) {
            this._affectedInjectedTextLines = new Set();
        }
        this._affectedInjectedTextLines.add(lineNumber);
    }
    checkAffectedAndFire(options) {
        this._affectsMinimap ||= !!options.minimap?.position;
        this._affectsOverviewRuler ||= !!options.overviewRuler?.color;
        this._affectsGlyphMargin ||= !!options.glyphMarginClassName;
        this._affectsLineNumber ||= !!options.lineNumberClassName;
        this.tryFire();
    }
    fire() {
        this._affectsMinimap = true;
        this._affectsOverviewRuler = true;
        this._affectsGlyphMargin = true;
        this.tryFire();
    }
    tryFire() {
        if (this._deferredCnt === 0) {
            this.doFire();
        }
        else {
            this._shouldFireDeferred = true;
        }
    }
    doFire() {
        this.handleBeforeFire(this._affectedInjectedTextLines);
        const event = {
            affectsMinimap: this._affectsMinimap,
            affectsOverviewRuler: this._affectsOverviewRuler,
            affectsGlyphMargin: this._affectsGlyphMargin,
            affectsLineNumber: this._affectsLineNumber,
        };
        this._shouldFireDeferred = false;
        this._affectsMinimap = false;
        this._affectsOverviewRuler = false;
        this._affectsGlyphMargin = false;
        this._actual.fire(event);
    }
}
//#endregion
class DidChangeContentEmitter extends lifecycle/* Disposable */.jG {
    constructor() {
        super();
        /**
         * Both `fastEvent` and `slowEvent` work the same way and contain the same events, but first we invoke `fastEvent` and then `slowEvent`.
         */
        this._fastEmitter = this._register(new common_event/* Emitter */.vl());
        this.fastEvent = this._fastEmitter.event;
        this._slowEmitter = this._register(new common_event/* Emitter */.vl());
        this.slowEvent = this._slowEmitter.event;
        this._deferredCnt = 0;
        this._deferredEvent = null;
    }
    beginDeferredEmit() {
        this._deferredCnt++;
    }
    endDeferredEmit(resultingSelection = null) {
        this._deferredCnt--;
        if (this._deferredCnt === 0) {
            if (this._deferredEvent !== null) {
                this._deferredEvent.rawContentChangedEvent.resultingSelection = resultingSelection;
                const e = this._deferredEvent;
                this._deferredEvent = null;
                this._fastEmitter.fire(e);
                this._slowEmitter.fire(e);
            }
        }
    }
    fire(e) {
        if (this._deferredCnt > 0) {
            if (this._deferredEvent) {
                this._deferredEvent = this._deferredEvent.merge(e);
            }
            else {
                this._deferredEvent = e;
            }
            return;
        }
        this._fastEmitter.fire(e);
        this._slowEmitter.fire(e);
    }
}


/***/ },

/***/ 12590
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   R: () => (/* binding */ EDITOR_MODEL_DEFAULTS)
/* harmony export */ });
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
const EDITOR_MODEL_DEFAULTS = {
    tabSize: 4,
    indentSize: 4,
    insertSpaces: true,
    detectIndentation: true,
    trimAutoWhitespace: true,
    largeFileOptimizations: true,
    bracketPairColorizationOptions: {
        enabled: true,
        independentColorPoolPerBracketType: false,
    },
};


/***/ },

/***/ 15910
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   x: () => (/* binding */ TokenMetadata)
/* harmony export */ });
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
/**
 */
class TokenMetadata {
    static getLanguageId(metadata) {
        return (metadata & 255 /* MetadataConsts.LANGUAGEID_MASK */) >>> 0 /* MetadataConsts.LANGUAGEID_OFFSET */;
    }
    static getTokenType(metadata) {
        return (metadata & 768 /* MetadataConsts.TOKEN_TYPE_MASK */) >>> 8 /* MetadataConsts.TOKEN_TYPE_OFFSET */;
    }
    static containsBalancedBrackets(metadata) {
        return (metadata & 1024 /* MetadataConsts.BALANCED_BRACKETS_MASK */) !== 0;
    }
    static getFontStyle(metadata) {
        return (metadata & 30720 /* MetadataConsts.FONT_STYLE_MASK */) >>> 11 /* MetadataConsts.FONT_STYLE_OFFSET */;
    }
    static getForeground(metadata) {
        return (metadata & 16744448 /* MetadataConsts.FOREGROUND_MASK */) >>> 15 /* MetadataConsts.FOREGROUND_OFFSET */;
    }
    static getBackground(metadata) {
        return (metadata & 4278190080 /* MetadataConsts.BACKGROUND_MASK */) >>> 24 /* MetadataConsts.BACKGROUND_OFFSET */;
    }
    static getClassNameFromMetadata(metadata) {
        const foreground = this.getForeground(metadata);
        let className = 'mtk' + foreground;
        const fontStyle = this.getFontStyle(metadata);
        if (fontStyle & 1 /* FontStyle.Italic */) {
            className += ' mtki';
        }
        if (fontStyle & 2 /* FontStyle.Bold */) {
            className += ' mtkb';
        }
        if (fontStyle & 4 /* FontStyle.Underline */) {
            className += ' mtku';
        }
        if (fontStyle & 8 /* FontStyle.Strikethrough */) {
            className += ' mtks';
        }
        return className;
    }
    static getInlineStyleFromMetadata(metadata, colorMap) {
        const foreground = this.getForeground(metadata);
        const fontStyle = this.getFontStyle(metadata);
        let result = `color: ${colorMap[foreground]};`;
        if (fontStyle & 1 /* FontStyle.Italic */) {
            result += 'font-style: italic;';
        }
        if (fontStyle & 2 /* FontStyle.Bold */) {
            result += 'font-weight: bold;';
        }
        let textDecoration = '';
        if (fontStyle & 4 /* FontStyle.Underline */) {
            textDecoration += ' underline';
        }
        if (fontStyle & 8 /* FontStyle.Strikethrough */) {
            textDecoration += ' line-through';
        }
        if (textDecoration) {
            result += `text-decoration:${textDecoration};`;
        }
        return result;
    }
    static getPresentationFromMetadata(metadata) {
        const foreground = this.getForeground(metadata);
        const fontStyle = this.getFontStyle(metadata);
        return {
            foreground: foreground,
            italic: Boolean(fontStyle & 1 /* FontStyle.Italic */),
            bold: Boolean(fontStyle & 2 /* FontStyle.Bold */),
            underline: Boolean(fontStyle & 4 /* FontStyle.Underline */),
            strikethrough: Boolean(fontStyle & 8 /* FontStyle.Strikethrough */),
        };
    }
}


/***/ },

/***/ 19184
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BQ: () => (/* binding */ createScopedLineTokens),
/* harmony export */   Yo: () => (/* binding */ ignoreBracketsInToken)
/* harmony export */ });
/* unused harmony export ScopedLineTokens */
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
function createScopedLineTokens(context, offset) {
    const tokenCount = context.getCount();
    const tokenIndex = context.findTokenIndexAtOffset(offset);
    const desiredLanguageId = context.getLanguageId(tokenIndex);
    let lastTokenIndex = tokenIndex;
    while (lastTokenIndex + 1 < tokenCount && context.getLanguageId(lastTokenIndex + 1) === desiredLanguageId) {
        lastTokenIndex++;
    }
    let firstTokenIndex = tokenIndex;
    while (firstTokenIndex > 0 && context.getLanguageId(firstTokenIndex - 1) === desiredLanguageId) {
        firstTokenIndex--;
    }
    return new ScopedLineTokens(context, desiredLanguageId, firstTokenIndex, lastTokenIndex + 1, context.getStartOffset(firstTokenIndex), context.getEndOffset(lastTokenIndex));
}
class ScopedLineTokens {
    constructor(actual, languageId, firstTokenIndex, lastTokenIndex, firstCharOffset, lastCharOffset) {
        this._scopedLineTokensBrand = undefined;
        this._actual = actual;
        this.languageId = languageId;
        this._firstTokenIndex = firstTokenIndex;
        this._lastTokenIndex = lastTokenIndex;
        this.firstCharOffset = firstCharOffset;
        this._lastCharOffset = lastCharOffset;
        this.languageIdCodec = actual.languageIdCodec;
    }
    getLineContent() {
        const actualLineContent = this._actual.getLineContent();
        return actualLineContent.substring(this.firstCharOffset, this._lastCharOffset);
    }
    getLineLength() {
        return this._lastCharOffset - this.firstCharOffset;
    }
    getActualLineContentBefore(offset) {
        const actualLineContent = this._actual.getLineContent();
        return actualLineContent.substring(0, this.firstCharOffset + offset);
    }
    getTokenCount() {
        return this._lastTokenIndex - this._firstTokenIndex;
    }
    findTokenIndexAtOffset(offset) {
        return this._actual.findTokenIndexAtOffset(offset + this.firstCharOffset) - this._firstTokenIndex;
    }
    getStandardTokenType(tokenIndex) {
        return this._actual.getStandardTokenType(tokenIndex + this._firstTokenIndex);
    }
    toIViewLineTokens() {
        return this._actual.sliceAndInflate(this.firstCharOffset, this._lastCharOffset, 0);
    }
}
function ignoreBracketsInToken(standardTokenType) {
    return (standardTokenType & 3 /* IgnoreBracketsInTokens.value */) !== 0;
}


/***/ },

/***/ 22467
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
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

/***/ 22994
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   W: () => (/* binding */ BeforeEditPositionMapper),
/* harmony export */   c: () => (/* binding */ TextEditInfo)
/* harmony export */ });
/* harmony import */ var _core_range_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(28061);
/* harmony import */ var _length_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(34883);
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/


class TextEditInfo {
    static fromModelContentChanges(changes) {
        // Must be sorted in ascending order
        const edits = changes.map(c => {
            const range = _core_range_js__WEBPACK_IMPORTED_MODULE_0__/* .Range */ .Q.lift(c.range);
            return new TextEditInfo((0,_length_js__WEBPACK_IMPORTED_MODULE_1__/* .positionToLength */ .VL)(range.getStartPosition()), (0,_length_js__WEBPACK_IMPORTED_MODULE_1__/* .positionToLength */ .VL)(range.getEndPosition()), (0,_length_js__WEBPACK_IMPORTED_MODULE_1__/* .lengthOfString */ .rR)(c.text));
        }).reverse();
        return edits;
    }
    constructor(startOffset, endOffset, newLength) {
        this.startOffset = startOffset;
        this.endOffset = endOffset;
        this.newLength = newLength;
    }
    toString() {
        return `[${(0,_length_js__WEBPACK_IMPORTED_MODULE_1__/* .lengthToObj */ .l4)(this.startOffset)}...${(0,_length_js__WEBPACK_IMPORTED_MODULE_1__/* .lengthToObj */ .l4)(this.endOffset)}) -> ${(0,_length_js__WEBPACK_IMPORTED_MODULE_1__/* .lengthToObj */ .l4)(this.newLength)}`;
    }
}
class BeforeEditPositionMapper {
    /**
     * @param edits Must be sorted by offset in ascending order.
    */
    constructor(edits) {
        this.nextEditIdx = 0;
        this.deltaOldToNewLineCount = 0;
        this.deltaOldToNewColumnCount = 0;
        this.deltaLineIdxInOld = -1;
        this.edits = edits.map(edit => TextEditInfoCache.from(edit));
    }
    /**
     * @param offset Must be equal to or greater than the last offset this method has been called with.
    */
    getOffsetBeforeChange(offset) {
        this.adjustNextEdit(offset);
        return this.translateCurToOld(offset);
    }
    /**
     * @param offset Must be equal to or greater than the last offset this method has been called with.
     * Returns null if there is no edit anymore.
    */
    getDistanceToNextChange(offset) {
        this.adjustNextEdit(offset);
        const nextEdit = this.edits[this.nextEditIdx];
        const nextChangeOffset = nextEdit ? this.translateOldToCur(nextEdit.offsetObj) : null;
        if (nextChangeOffset === null) {
            return null;
        }
        return (0,_length_js__WEBPACK_IMPORTED_MODULE_1__/* .lengthDiffNonNegative */ .MS)(offset, nextChangeOffset);
    }
    translateOldToCur(oldOffsetObj) {
        if (oldOffsetObj.lineCount === this.deltaLineIdxInOld) {
            return (0,_length_js__WEBPACK_IMPORTED_MODULE_1__/* .toLength */ .qe)(oldOffsetObj.lineCount + this.deltaOldToNewLineCount, oldOffsetObj.columnCount + this.deltaOldToNewColumnCount);
        }
        else {
            return (0,_length_js__WEBPACK_IMPORTED_MODULE_1__/* .toLength */ .qe)(oldOffsetObj.lineCount + this.deltaOldToNewLineCount, oldOffsetObj.columnCount);
        }
    }
    translateCurToOld(newOffset) {
        const offsetObj = (0,_length_js__WEBPACK_IMPORTED_MODULE_1__/* .lengthToObj */ .l4)(newOffset);
        if (offsetObj.lineCount - this.deltaOldToNewLineCount === this.deltaLineIdxInOld) {
            return (0,_length_js__WEBPACK_IMPORTED_MODULE_1__/* .toLength */ .qe)(offsetObj.lineCount - this.deltaOldToNewLineCount, offsetObj.columnCount - this.deltaOldToNewColumnCount);
        }
        else {
            return (0,_length_js__WEBPACK_IMPORTED_MODULE_1__/* .toLength */ .qe)(offsetObj.lineCount - this.deltaOldToNewLineCount, offsetObj.columnCount);
        }
    }
    adjustNextEdit(offset) {
        while (this.nextEditIdx < this.edits.length) {
            const nextEdit = this.edits[this.nextEditIdx];
            // After applying the edit, what is its end offset (considering all previous edits)?
            const nextEditEndOffsetInCur = this.translateOldToCur(nextEdit.endOffsetAfterObj);
            if ((0,_length_js__WEBPACK_IMPORTED_MODULE_1__/* .lengthLessThanEqual */ .vr)(nextEditEndOffsetInCur, offset)) {
                // We are after the edit, skip it
                this.nextEditIdx++;
                const nextEditEndOffsetInCurObj = (0,_length_js__WEBPACK_IMPORTED_MODULE_1__/* .lengthToObj */ .l4)(nextEditEndOffsetInCur);
                // Before applying the edit, what is its end offset (considering all previous edits)?
                const nextEditEndOffsetBeforeInCurObj = (0,_length_js__WEBPACK_IMPORTED_MODULE_1__/* .lengthToObj */ .l4)(this.translateOldToCur(nextEdit.endOffsetBeforeObj));
                const lineDelta = nextEditEndOffsetInCurObj.lineCount - nextEditEndOffsetBeforeInCurObj.lineCount;
                this.deltaOldToNewLineCount += lineDelta;
                const previousColumnDelta = this.deltaLineIdxInOld === nextEdit.endOffsetBeforeObj.lineCount ? this.deltaOldToNewColumnCount : 0;
                const columnDelta = nextEditEndOffsetInCurObj.columnCount - nextEditEndOffsetBeforeInCurObj.columnCount;
                this.deltaOldToNewColumnCount = previousColumnDelta + columnDelta;
                this.deltaLineIdxInOld = nextEdit.endOffsetBeforeObj.lineCount;
            }
            else {
                // We are in or before the edit.
                break;
            }
        }
    }
}
class TextEditInfoCache {
    static from(edit) {
        return new TextEditInfoCache(edit.startOffset, edit.endOffset, edit.newLength);
    }
    constructor(startOffset, endOffset, textLength) {
        this.endOffsetBeforeObj = (0,_length_js__WEBPACK_IMPORTED_MODULE_1__/* .lengthToObj */ .l4)(endOffset);
        this.endOffsetAfterObj = (0,_length_js__WEBPACK_IMPORTED_MODULE_1__/* .lengthToObj */ .l4)((0,_length_js__WEBPACK_IMPORTED_MODULE_1__/* .lengthAdd */ .QB)(startOffset, textLength));
        this.offsetObj = (0,_length_js__WEBPACK_IMPORTED_MODULE_1__/* .lengthToObj */ .l4)(startOffset);
    }
}


/***/ },

/***/ 27142
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
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

/***/ 32177
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   _: () => (/* binding */ TextModelPart)
/* harmony export */ });
/* harmony import */ var _base_common_lifecycle_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(10998);
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

class TextModelPart extends _base_common_lifecycle_js__WEBPACK_IMPORTED_MODULE_0__/* .Disposable */ .jG {
    constructor() {
        super(...arguments);
        this._isDisposed = false;
    }
    dispose() {
        super.dispose();
        this._isDisposed = true;
    }
    assertNotDisposed() {
        if (this._isDisposed) {
            throw new Error('TextModelPart is disposed!');
        }
    }
}


/***/ },

/***/ 33206
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   _: () => (/* binding */ FastTokenizer),
/* harmony export */   ou: () => (/* binding */ Token),
/* harmony export */   tk: () => (/* binding */ TextBufferTokenizer)
/* harmony export */ });
/* harmony import */ var _base_common_errors_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(94327);
/* harmony import */ var _encodedTokenAttributes_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(15910);
/* harmony import */ var _ast_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(64651);
/* harmony import */ var _length_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(34883);
/* harmony import */ var _smallImmutableSet_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(60756);
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/





class Token {
    constructor(length, kind, 
    /**
     * If this token is an opening bracket, this is the id of the opening bracket.
     * If this token is a closing bracket, this is the id of the first opening bracket that is closed by this bracket.
     * Otherwise, it is -1.
     */
    bracketId, 
    /**
     * If this token is an opening bracket, this just contains `bracketId`.
     * If this token is a closing bracket, this lists all opening bracket ids, that it closes.
     * Otherwise, it is empty.
     */
    bracketIds, astNode) {
        this.length = length;
        this.kind = kind;
        this.bracketId = bracketId;
        this.bracketIds = bracketIds;
        this.astNode = astNode;
    }
}
class TextBufferTokenizer {
    constructor(textModel, bracketTokens) {
        this.textModel = textModel;
        this.bracketTokens = bracketTokens;
        this.reader = new NonPeekableTextBufferTokenizer(this.textModel, this.bracketTokens);
        this._offset = _length_js__WEBPACK_IMPORTED_MODULE_3__/* .lengthZero */ .Vp;
        this.didPeek = false;
        this.peeked = null;
        this.textBufferLineCount = textModel.getLineCount();
        this.textBufferLastLineLength = textModel.getLineLength(this.textBufferLineCount);
    }
    get offset() {
        return this._offset;
    }
    get length() {
        return (0,_length_js__WEBPACK_IMPORTED_MODULE_3__/* .toLength */ .qe)(this.textBufferLineCount - 1, this.textBufferLastLineLength);
    }
    skip(length) {
        this.didPeek = false;
        this._offset = (0,_length_js__WEBPACK_IMPORTED_MODULE_3__/* .lengthAdd */ .QB)(this._offset, length);
        const obj = (0,_length_js__WEBPACK_IMPORTED_MODULE_3__/* .lengthToObj */ .l4)(this._offset);
        this.reader.setPosition(obj.lineCount, obj.columnCount);
    }
    read() {
        let token;
        if (this.peeked) {
            this.didPeek = false;
            token = this.peeked;
        }
        else {
            token = this.reader.read();
        }
        if (token) {
            this._offset = (0,_length_js__WEBPACK_IMPORTED_MODULE_3__/* .lengthAdd */ .QB)(this._offset, token.length);
        }
        return token;
    }
    peek() {
        if (!this.didPeek) {
            this.peeked = this.reader.read();
            this.didPeek = true;
        }
        return this.peeked;
    }
}
/**
 * Does not support peek.
*/
class NonPeekableTextBufferTokenizer {
    constructor(textModel, bracketTokens) {
        this.textModel = textModel;
        this.bracketTokens = bracketTokens;
        this.lineIdx = 0;
        this.line = null;
        this.lineCharOffset = 0;
        this.lineTokens = null;
        this.lineTokenOffset = 0;
        /** Must be a zero line token. The end of the document cannot be peeked. */
        this.peekedToken = null;
        this.textBufferLineCount = textModel.getLineCount();
        this.textBufferLastLineLength = textModel.getLineLength(this.textBufferLineCount);
    }
    setPosition(lineIdx, column) {
        // We must not jump into a token!
        if (lineIdx === this.lineIdx) {
            this.lineCharOffset = column;
            if (this.line !== null) {
                this.lineTokenOffset = this.lineCharOffset === 0 ? 0 : this.lineTokens.findTokenIndexAtOffset(this.lineCharOffset);
            }
        }
        else {
            this.lineIdx = lineIdx;
            this.lineCharOffset = column;
            this.line = null;
        }
        this.peekedToken = null;
    }
    read() {
        if (this.peekedToken) {
            const token = this.peekedToken;
            this.peekedToken = null;
            this.lineCharOffset += (0,_length_js__WEBPACK_IMPORTED_MODULE_3__/* .lengthGetColumnCountIfZeroLineCount */ .sS)(token.length);
            return token;
        }
        if (this.lineIdx > this.textBufferLineCount - 1 || (this.lineIdx === this.textBufferLineCount - 1 && this.lineCharOffset >= this.textBufferLastLineLength)) {
            // We are after the end
            return null;
        }
        if (this.line === null) {
            this.lineTokens = this.textModel.tokenization.getLineTokens(this.lineIdx + 1);
            this.line = this.lineTokens.getLineContent();
            this.lineTokenOffset = this.lineCharOffset === 0 ? 0 : this.lineTokens.findTokenIndexAtOffset(this.lineCharOffset);
        }
        const startLineIdx = this.lineIdx;
        const startLineCharOffset = this.lineCharOffset;
        // limits the length of text tokens.
        // If text tokens get too long, incremental updates will be slow
        let lengthHeuristic = 0;
        while (true) {
            const lineTokens = this.lineTokens;
            const tokenCount = lineTokens.getCount();
            let peekedBracketToken = null;
            if (this.lineTokenOffset < tokenCount) {
                const tokenMetadata = lineTokens.getMetadata(this.lineTokenOffset);
                while (this.lineTokenOffset + 1 < tokenCount && tokenMetadata === lineTokens.getMetadata(this.lineTokenOffset + 1)) {
                    // Skip tokens that are identical.
                    // Sometimes, (bracket) identifiers are split up into multiple tokens.
                    this.lineTokenOffset++;
                }
                const isOther = _encodedTokenAttributes_js__WEBPACK_IMPORTED_MODULE_1__/* .TokenMetadata */ .x.getTokenType(tokenMetadata) === 0 /* StandardTokenType.Other */;
                const containsBracketType = _encodedTokenAttributes_js__WEBPACK_IMPORTED_MODULE_1__/* .TokenMetadata */ .x.containsBalancedBrackets(tokenMetadata);
                const endOffset = lineTokens.getEndOffset(this.lineTokenOffset);
                // Is there a bracket token next? Only consume text.
                if (containsBracketType && isOther && this.lineCharOffset < endOffset) {
                    const languageId = lineTokens.getLanguageId(this.lineTokenOffset);
                    const text = this.line.substring(this.lineCharOffset, endOffset);
                    const brackets = this.bracketTokens.getSingleLanguageBracketTokens(languageId);
                    const regexp = brackets.regExpGlobal;
                    if (regexp) {
                        regexp.lastIndex = 0;
                        const match = regexp.exec(text);
                        if (match) {
                            peekedBracketToken = brackets.getToken(match[0]);
                            if (peekedBracketToken) {
                                // Consume leading text of the token
                                this.lineCharOffset += match.index;
                            }
                        }
                    }
                }
                lengthHeuristic += endOffset - this.lineCharOffset;
                if (peekedBracketToken) {
                    // Don't skip the entire token, as a single token could contain multiple brackets.
                    if (startLineIdx !== this.lineIdx || startLineCharOffset !== this.lineCharOffset) {
                        // There is text before the bracket
                        this.peekedToken = peekedBracketToken;
                        break;
                    }
                    else {
                        // Consume the peeked token
                        this.lineCharOffset += (0,_length_js__WEBPACK_IMPORTED_MODULE_3__/* .lengthGetColumnCountIfZeroLineCount */ .sS)(peekedBracketToken.length);
                        return peekedBracketToken;
                    }
                }
                else {
                    // Skip the entire token, as the token contains no brackets at all.
                    this.lineTokenOffset++;
                    this.lineCharOffset = endOffset;
                }
            }
            else {
                if (this.lineIdx === this.textBufferLineCount - 1) {
                    break;
                }
                this.lineIdx++;
                this.lineTokens = this.textModel.tokenization.getLineTokens(this.lineIdx + 1);
                this.lineTokenOffset = 0;
                this.line = this.lineTokens.getLineContent();
                this.lineCharOffset = 0;
                lengthHeuristic += 33; // max 1000/33 = 30 lines
                // This limits the amount of work to recompute min-indentation
                if (lengthHeuristic > 1000) {
                    // only break (automatically) at the end of line.
                    break;
                }
            }
            if (lengthHeuristic > 1500) {
                // Eventually break regardless of the line length so that
                // very long lines do not cause bad performance.
                // This effective limits max indentation to 500, as
                // indentation is not computed across multiple text nodes.
                break;
            }
        }
        // If a token contains some proper indentation, it also contains \n{INDENTATION+}(?!{INDENTATION}),
        // unless the line is too long.
        // Thus, the min indentation of the document is the minimum min indentation of every text node.
        const length = (0,_length_js__WEBPACK_IMPORTED_MODULE_3__/* .lengthDiff */ .C7)(startLineIdx, startLineCharOffset, this.lineIdx, this.lineCharOffset);
        return new Token(length, 0 /* TokenKind.Text */, -1, _smallImmutableSet_js__WEBPACK_IMPORTED_MODULE_4__/* .SmallImmutableSet */ .gV.getEmpty(), new _ast_js__WEBPACK_IMPORTED_MODULE_2__/* .TextAstNode */ .yF(length));
    }
}
class FastTokenizer {
    constructor(text, brackets) {
        this.text = text;
        this._offset = _length_js__WEBPACK_IMPORTED_MODULE_3__/* .lengthZero */ .Vp;
        this.idx = 0;
        const regExpStr = brackets.getRegExpStr();
        const regexp = regExpStr ? new RegExp(regExpStr + '|\n', 'gi') : null;
        const tokens = [];
        let match;
        let curLineCount = 0;
        let lastLineBreakOffset = 0;
        let lastTokenEndOffset = 0;
        let lastTokenEndLine = 0;
        const smallTextTokens0Line = [];
        for (let i = 0; i < 60; i++) {
            smallTextTokens0Line.push(new Token((0,_length_js__WEBPACK_IMPORTED_MODULE_3__/* .toLength */ .qe)(0, i), 0 /* TokenKind.Text */, -1, _smallImmutableSet_js__WEBPACK_IMPORTED_MODULE_4__/* .SmallImmutableSet */ .gV.getEmpty(), new _ast_js__WEBPACK_IMPORTED_MODULE_2__/* .TextAstNode */ .yF((0,_length_js__WEBPACK_IMPORTED_MODULE_3__/* .toLength */ .qe)(0, i))));
        }
        const smallTextTokens1Line = [];
        for (let i = 0; i < 60; i++) {
            smallTextTokens1Line.push(new Token((0,_length_js__WEBPACK_IMPORTED_MODULE_3__/* .toLength */ .qe)(1, i), 0 /* TokenKind.Text */, -1, _smallImmutableSet_js__WEBPACK_IMPORTED_MODULE_4__/* .SmallImmutableSet */ .gV.getEmpty(), new _ast_js__WEBPACK_IMPORTED_MODULE_2__/* .TextAstNode */ .yF((0,_length_js__WEBPACK_IMPORTED_MODULE_3__/* .toLength */ .qe)(1, i))));
        }
        if (regexp) {
            regexp.lastIndex = 0;
            // If a token contains indentation, it also contains \n{INDENTATION+}(?!{INDENTATION})
            while ((match = regexp.exec(text)) !== null) {
                const curOffset = match.index;
                const value = match[0];
                if (value === '\n') {
                    curLineCount++;
                    lastLineBreakOffset = curOffset + 1;
                }
                else {
                    if (lastTokenEndOffset !== curOffset) {
                        let token;
                        if (lastTokenEndLine === curLineCount) {
                            const colCount = curOffset - lastTokenEndOffset;
                            if (colCount < smallTextTokens0Line.length) {
                                token = smallTextTokens0Line[colCount];
                            }
                            else {
                                const length = (0,_length_js__WEBPACK_IMPORTED_MODULE_3__/* .toLength */ .qe)(0, colCount);
                                token = new Token(length, 0 /* TokenKind.Text */, -1, _smallImmutableSet_js__WEBPACK_IMPORTED_MODULE_4__/* .SmallImmutableSet */ .gV.getEmpty(), new _ast_js__WEBPACK_IMPORTED_MODULE_2__/* .TextAstNode */ .yF(length));
                            }
                        }
                        else {
                            const lineCount = curLineCount - lastTokenEndLine;
                            const colCount = curOffset - lastLineBreakOffset;
                            if (lineCount === 1 && colCount < smallTextTokens1Line.length) {
                                token = smallTextTokens1Line[colCount];
                            }
                            else {
                                const length = (0,_length_js__WEBPACK_IMPORTED_MODULE_3__/* .toLength */ .qe)(lineCount, colCount);
                                token = new Token(length, 0 /* TokenKind.Text */, -1, _smallImmutableSet_js__WEBPACK_IMPORTED_MODULE_4__/* .SmallImmutableSet */ .gV.getEmpty(), new _ast_js__WEBPACK_IMPORTED_MODULE_2__/* .TextAstNode */ .yF(length));
                            }
                        }
                        tokens.push(token);
                    }
                    // value is matched by regexp, so the token must exist
                    tokens.push(brackets.getToken(value));
                    lastTokenEndOffset = curOffset + value.length;
                    lastTokenEndLine = curLineCount;
                }
            }
        }
        const offset = text.length;
        if (lastTokenEndOffset !== offset) {
            const length = (lastTokenEndLine === curLineCount)
                ? (0,_length_js__WEBPACK_IMPORTED_MODULE_3__/* .toLength */ .qe)(0, offset - lastTokenEndOffset)
                : (0,_length_js__WEBPACK_IMPORTED_MODULE_3__/* .toLength */ .qe)(curLineCount - lastTokenEndLine, offset - lastLineBreakOffset);
            tokens.push(new Token(length, 0 /* TokenKind.Text */, -1, _smallImmutableSet_js__WEBPACK_IMPORTED_MODULE_4__/* .SmallImmutableSet */ .gV.getEmpty(), new _ast_js__WEBPACK_IMPORTED_MODULE_2__/* .TextAstNode */ .yF(length)));
        }
        this.length = (0,_length_js__WEBPACK_IMPORTED_MODULE_3__/* .toLength */ .qe)(curLineCount, offset - lastLineBreakOffset);
        this.tokens = tokens;
    }
    get offset() {
        return this._offset;
    }
    read() {
        return this.tokens[this.idx++] || null;
    }
    peek() {
        return this.tokens[this.idx] || null;
    }
    skip(length) {
        throw new _base_common_errors_js__WEBPACK_IMPORTED_MODULE_0__/* .NotSupportedError */ .EM();
    }
}


/***/ },

/***/ 34883
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   C7: () => (/* binding */ lengthDiff),
/* harmony export */   MS: () => (/* binding */ lengthDiffNonNegative),
/* harmony export */   QB: () => (/* binding */ lengthAdd),
/* harmony export */   Qx: () => (/* binding */ lengthsToRange),
/* harmony export */   VL: () => (/* binding */ positionToLength),
/* harmony export */   Vh: () => (/* binding */ lengthIsZero),
/* harmony export */   Vp: () => (/* binding */ lengthZero),
/* harmony export */   eu: () => (/* binding */ lengthGetLineCount),
/* harmony export */   l4: () => (/* binding */ lengthToObj),
/* harmony export */   o0: () => (/* binding */ lengthGreaterThanEqual),
/* harmony export */   pW: () => (/* binding */ sumLengths),
/* harmony export */   qe: () => (/* binding */ toLength),
/* harmony export */   rR: () => (/* binding */ lengthOfString),
/* harmony export */   sS: () => (/* binding */ lengthGetColumnCountIfZeroLineCount),
/* harmony export */   vr: () => (/* binding */ lengthLessThanEqual),
/* harmony export */   wP: () => (/* binding */ lengthEquals),
/* harmony export */   zG: () => (/* binding */ lengthLessThan)
/* harmony export */ });
/* harmony import */ var _base_common_strings_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(16844);
/* harmony import */ var _core_range_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(28061);
/* harmony import */ var _core_textLength_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(58357);
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/



/**
 * The end must be greater than or equal to the start.
*/
function lengthDiff(startLineCount, startColumnCount, endLineCount, endColumnCount) {
    return (startLineCount !== endLineCount)
        ? toLength(endLineCount - startLineCount, endColumnCount)
        : toLength(0, endColumnCount - startColumnCount);
}
const lengthZero = 0;
function lengthIsZero(length) {
    return length === 0;
}
/*
 * We have 52 bits available in a JS number.
 * We use the upper 26 bits to store the line and the lower 26 bits to store the column.
 */
///*
const factor = 2 ** 26;
/*/
const factor = 1000000;
// */
function toLength(lineCount, columnCount) {
    // llllllllllllllllllllllllllcccccccccccccccccccccccccc (52 bits)
    //       line count (26 bits)    column count (26 bits)
    // If there is no overflow (all values/sums below 2^26 = 67108864),
    // we have `toLength(lns1, cols1) + toLength(lns2, cols2) = toLength(lns1 + lns2, cols1 + cols2)`.
    return (lineCount * factor + columnCount);
}
function lengthToObj(length) {
    const l = length;
    const lineCount = Math.floor(l / factor);
    const columnCount = l - lineCount * factor;
    return new _core_textLength_js__WEBPACK_IMPORTED_MODULE_2__/* .TextLength */ .W(lineCount, columnCount);
}
function lengthGetLineCount(length) {
    return Math.floor(length / factor);
}
/**
 * Returns the amount of columns of the given length, assuming that it does not span any line.
*/
function lengthGetColumnCountIfZeroLineCount(length) {
    return length;
}
function lengthAdd(l1, l2) {
    let r = l1 + l2;
    if (l2 >= factor) {
        r = r - (l1 % factor);
    }
    return r;
}
function sumLengths(items, lengthFn) {
    return items.reduce((a, b) => lengthAdd(a, lengthFn(b)), lengthZero);
}
function lengthEquals(length1, length2) {
    return length1 === length2;
}
/**
 * Returns a non negative length `result` such that `lengthAdd(length1, result) = length2`, or zero if such length does not exist.
 */
function lengthDiffNonNegative(length1, length2) {
    const l1 = length1;
    const l2 = length2;
    const diff = l2 - l1;
    if (diff <= 0) {
        // line-count of length1 is higher than line-count of length2
        // or they are equal and column-count of length1 is higher than column-count of length2
        return lengthZero;
    }
    const lineCount1 = Math.floor(l1 / factor);
    const lineCount2 = Math.floor(l2 / factor);
    const colCount2 = l2 - lineCount2 * factor;
    if (lineCount1 === lineCount2) {
        const colCount1 = l1 - lineCount1 * factor;
        return toLength(0, colCount2 - colCount1);
    }
    else {
        return toLength(lineCount2 - lineCount1, colCount2);
    }
}
function lengthLessThan(length1, length2) {
    // First, compare line counts, then column counts.
    return length1 < length2;
}
function lengthLessThanEqual(length1, length2) {
    return length1 <= length2;
}
function lengthGreaterThanEqual(length1, length2) {
    return length1 >= length2;
}
function positionToLength(position) {
    return toLength(position.lineNumber - 1, position.column - 1);
}
function lengthsToRange(lengthStart, lengthEnd) {
    const l = lengthStart;
    const lineCount = Math.floor(l / factor);
    const colCount = l - lineCount * factor;
    const l2 = lengthEnd;
    const lineCount2 = Math.floor(l2 / factor);
    const colCount2 = l2 - lineCount2 * factor;
    return new _core_range_js__WEBPACK_IMPORTED_MODULE_1__/* .Range */ .Q(lineCount + 1, colCount + 1, lineCount2 + 1, colCount2 + 1);
}
function lengthOfString(str) {
    const lines = (0,_base_common_strings_js__WEBPACK_IMPORTED_MODULE_0__/* .splitLines */ .uz)(str);
    return toLength(lines.length - 1, lines[lines.length - 1].length);
}


/***/ },

/***/ 35320
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ITreeSitterParserService: () => (/* binding */ ITreeSitterParserService)
/* harmony export */ });
/* harmony import */ var _platform_instantiation_common_instantiation_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(82399);

const ITreeSitterParserService = (0,_platform_instantiation_common_instantiation_js__WEBPACK_IMPORTED_MODULE_0__/* .createDecorator */ .u1)('treeSitterParserService');


/***/ },

/***/ 38803
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   $D: () => (/* binding */ IUndoRedoService),
/* harmony export */   I_: () => (/* binding */ UndoRedoGroup),
/* harmony export */   To: () => (/* binding */ ResourceEditStackSnapshot),
/* harmony export */   Ym: () => (/* binding */ UndoRedoSource)
/* harmony export */ });
/* harmony import */ var _instantiation_common_instantiation_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(82399);
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const IUndoRedoService = (0,_instantiation_common_instantiation_js__WEBPACK_IMPORTED_MODULE_0__/* .createDecorator */ .u1)('undoRedoService');
class ResourceEditStackSnapshot {
    constructor(resource, elements) {
        this.resource = resource;
        this.elements = elements;
    }
}
class UndoRedoGroup {
    static { this._ID = 0; }
    constructor() {
        this.id = UndoRedoGroup._ID++;
        this.order = 1;
    }
    nextOrder() {
        if (this.id === 0) {
            return 0;
        }
        return this.order++;
    }
    static { this.None = new UndoRedoGroup(); }
}
class UndoRedoSource {
    static { this._ID = 0; }
    constructor() {
        this.id = UndoRedoSource._ID++;
        this.order = 1;
    }
    nextOrder() {
        if (this.id === 0) {
            return 0;
        }
        return this.order++;
    }
    static { this.None = new UndoRedoSource(); }
}


/***/ },

/***/ 40931
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DefaultModelSHA1Computer: () => (/* binding */ DefaultModelSHA1Computer),
/* harmony export */   ModelService: () => (/* binding */ ModelService)
/* harmony export */ });
/* harmony import */ var _base_common_event_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2106);
/* harmony import */ var _base_common_lifecycle_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(10998);
/* harmony import */ var _base_common_platform_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(63339);
/* harmony import */ var _model_textModel_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(11907);
/* harmony import */ var _core_textModelDefaults_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(12590);
/* harmony import */ var _languages_modesRegistry_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(54957);
/* harmony import */ var _textResourceConfiguration_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(41504);
/* harmony import */ var _platform_configuration_common_configuration_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(85753);
/* harmony import */ var _platform_undoRedo_common_undoRedo_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(38803);
/* harmony import */ var _base_common_hash_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(22344);
/* harmony import */ var _model_editStack_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(54296);
/* harmony import */ var _base_common_network_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(13072);
/* harmony import */ var _base_common_objects_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(71386);
/* harmony import */ var _platform_instantiation_common_instantiation_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(82399);
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
var ModelService_1;














function MODEL_ID(resource) {
    return resource.toString();
}
class ModelData {
    constructor(model, onWillDispose, onDidChangeLanguage) {
        this.model = model;
        this._modelEventListeners = new _base_common_lifecycle_js__WEBPACK_IMPORTED_MODULE_1__/* .DisposableStore */ .Cm();
        this.model = model;
        this._modelEventListeners.add(model.onWillDispose(() => onWillDispose(model)));
        this._modelEventListeners.add(model.onDidChangeLanguage((e) => onDidChangeLanguage(model, e)));
    }
    dispose() {
        this._modelEventListeners.dispose();
    }
}
const DEFAULT_EOL = (_base_common_platform_js__WEBPACK_IMPORTED_MODULE_2__/* .isLinux */ .j9 || _base_common_platform_js__WEBPACK_IMPORTED_MODULE_2__/* .isMacintosh */ .zx) ? 1 /* DefaultEndOfLine.LF */ : 2 /* DefaultEndOfLine.CRLF */;
class DisposedModelInfo {
    constructor(uri, initialUndoRedoSnapshot, time, sharesUndoRedoStack, heapSize, sha1, versionId, alternativeVersionId) {
        this.uri = uri;
        this.initialUndoRedoSnapshot = initialUndoRedoSnapshot;
        this.time = time;
        this.sharesUndoRedoStack = sharesUndoRedoStack;
        this.heapSize = heapSize;
        this.sha1 = sha1;
        this.versionId = versionId;
        this.alternativeVersionId = alternativeVersionId;
    }
}
let ModelService = class ModelService extends _base_common_lifecycle_js__WEBPACK_IMPORTED_MODULE_1__/* .Disposable */ .jG {
    static { ModelService_1 = this; }
    static { this.MAX_MEMORY_FOR_CLOSED_FILES_UNDO_STACK = 20 * 1024 * 1024; }
    constructor(_configurationService, _resourcePropertiesService, _undoRedoService, _instantiationService) {
        super();
        this._configurationService = _configurationService;
        this._resourcePropertiesService = _resourcePropertiesService;
        this._undoRedoService = _undoRedoService;
        this._instantiationService = _instantiationService;
        this._onModelAdded = this._register(new _base_common_event_js__WEBPACK_IMPORTED_MODULE_0__/* .Emitter */ .vl());
        this.onModelAdded = this._onModelAdded.event;
        this._onModelRemoved = this._register(new _base_common_event_js__WEBPACK_IMPORTED_MODULE_0__/* .Emitter */ .vl());
        this.onModelRemoved = this._onModelRemoved.event;
        this._onModelModeChanged = this._register(new _base_common_event_js__WEBPACK_IMPORTED_MODULE_0__/* .Emitter */ .vl());
        this.onModelLanguageChanged = this._onModelModeChanged.event;
        this._modelCreationOptionsByLanguageAndResource = Object.create(null);
        this._models = {};
        this._disposedModels = new Map();
        this._disposedModelsHeapSize = 0;
        this._register(this._configurationService.onDidChangeConfiguration(e => this._updateModelOptions(e)));
        this._updateModelOptions(undefined);
    }
    static _readModelOptions(config, isForSimpleWidget) {
        let tabSize = _core_textModelDefaults_js__WEBPACK_IMPORTED_MODULE_4__/* .EDITOR_MODEL_DEFAULTS */ .R.tabSize;
        if (config.editor && typeof config.editor.tabSize !== 'undefined') {
            const parsedTabSize = parseInt(config.editor.tabSize, 10);
            if (!isNaN(parsedTabSize)) {
                tabSize = parsedTabSize;
            }
            if (tabSize < 1) {
                tabSize = 1;
            }
        }
        let indentSize = 'tabSize';
        if (config.editor && typeof config.editor.indentSize !== 'undefined' && config.editor.indentSize !== 'tabSize') {
            const parsedIndentSize = parseInt(config.editor.indentSize, 10);
            if (!isNaN(parsedIndentSize)) {
                indentSize = Math.max(parsedIndentSize, 1);
            }
        }
        let insertSpaces = _core_textModelDefaults_js__WEBPACK_IMPORTED_MODULE_4__/* .EDITOR_MODEL_DEFAULTS */ .R.insertSpaces;
        if (config.editor && typeof config.editor.insertSpaces !== 'undefined') {
            insertSpaces = (config.editor.insertSpaces === 'false' ? false : Boolean(config.editor.insertSpaces));
        }
        let newDefaultEOL = DEFAULT_EOL;
        const eol = config.eol;
        if (eol === '\r\n') {
            newDefaultEOL = 2 /* DefaultEndOfLine.CRLF */;
        }
        else if (eol === '\n') {
            newDefaultEOL = 1 /* DefaultEndOfLine.LF */;
        }
        let trimAutoWhitespace = _core_textModelDefaults_js__WEBPACK_IMPORTED_MODULE_4__/* .EDITOR_MODEL_DEFAULTS */ .R.trimAutoWhitespace;
        if (config.editor && typeof config.editor.trimAutoWhitespace !== 'undefined') {
            trimAutoWhitespace = (config.editor.trimAutoWhitespace === 'false' ? false : Boolean(config.editor.trimAutoWhitespace));
        }
        let detectIndentation = _core_textModelDefaults_js__WEBPACK_IMPORTED_MODULE_4__/* .EDITOR_MODEL_DEFAULTS */ .R.detectIndentation;
        if (config.editor && typeof config.editor.detectIndentation !== 'undefined') {
            detectIndentation = (config.editor.detectIndentation === 'false' ? false : Boolean(config.editor.detectIndentation));
        }
        let largeFileOptimizations = _core_textModelDefaults_js__WEBPACK_IMPORTED_MODULE_4__/* .EDITOR_MODEL_DEFAULTS */ .R.largeFileOptimizations;
        if (config.editor && typeof config.editor.largeFileOptimizations !== 'undefined') {
            largeFileOptimizations = (config.editor.largeFileOptimizations === 'false' ? false : Boolean(config.editor.largeFileOptimizations));
        }
        let bracketPairColorizationOptions = _core_textModelDefaults_js__WEBPACK_IMPORTED_MODULE_4__/* .EDITOR_MODEL_DEFAULTS */ .R.bracketPairColorizationOptions;
        if (config.editor?.bracketPairColorization && typeof config.editor.bracketPairColorization === 'object') {
            bracketPairColorizationOptions = {
                enabled: !!config.editor.bracketPairColorization.enabled,
                independentColorPoolPerBracketType: !!config.editor.bracketPairColorization.independentColorPoolPerBracketType
            };
        }
        return {
            isForSimpleWidget: isForSimpleWidget,
            tabSize: tabSize,
            indentSize: indentSize,
            insertSpaces: insertSpaces,
            detectIndentation: detectIndentation,
            defaultEOL: newDefaultEOL,
            trimAutoWhitespace: trimAutoWhitespace,
            largeFileOptimizations: largeFileOptimizations,
            bracketPairColorizationOptions
        };
    }
    _getEOL(resource, language) {
        if (resource) {
            return this._resourcePropertiesService.getEOL(resource, language);
        }
        const eol = this._configurationService.getValue('files.eol', { overrideIdentifier: language });
        if (eol && typeof eol === 'string' && eol !== 'auto') {
            return eol;
        }
        return _base_common_platform_js__WEBPACK_IMPORTED_MODULE_2__.OS === 3 /* platform.OperatingSystem.Linux */ || _base_common_platform_js__WEBPACK_IMPORTED_MODULE_2__.OS === 2 /* platform.OperatingSystem.Macintosh */ ? '\n' : '\r\n';
    }
    _shouldRestoreUndoStack() {
        const result = this._configurationService.getValue('files.restoreUndoStack');
        if (typeof result === 'boolean') {
            return result;
        }
        return true;
    }
    getCreationOptions(languageIdOrSelection, resource, isForSimpleWidget) {
        const language = (typeof languageIdOrSelection === 'string' ? languageIdOrSelection : languageIdOrSelection.languageId);
        let creationOptions = this._modelCreationOptionsByLanguageAndResource[language + resource];
        if (!creationOptions) {
            const editor = this._configurationService.getValue('editor', { overrideIdentifier: language, resource });
            const eol = this._getEOL(resource, language);
            creationOptions = ModelService_1._readModelOptions({ editor, eol }, isForSimpleWidget);
            this._modelCreationOptionsByLanguageAndResource[language + resource] = creationOptions;
        }
        return creationOptions;
    }
    _updateModelOptions(e) {
        const oldOptionsByLanguageAndResource = this._modelCreationOptionsByLanguageAndResource;
        this._modelCreationOptionsByLanguageAndResource = Object.create(null);
        // Update options on all models
        const keys = Object.keys(this._models);
        for (let i = 0, len = keys.length; i < len; i++) {
            const modelId = keys[i];
            const modelData = this._models[modelId];
            const language = modelData.model.getLanguageId();
            const uri = modelData.model.uri;
            if (e && !e.affectsConfiguration('editor', { overrideIdentifier: language, resource: uri }) && !e.affectsConfiguration('files.eol', { overrideIdentifier: language, resource: uri })) {
                continue; // perf: skip if this model is not affected by configuration change
            }
            const oldOptions = oldOptionsByLanguageAndResource[language + uri];
            const newOptions = this.getCreationOptions(language, uri, modelData.model.isForSimpleWidget);
            ModelService_1._setModelOptionsForModel(modelData.model, newOptions, oldOptions);
        }
    }
    static _setModelOptionsForModel(model, newOptions, currentOptions) {
        if (currentOptions && currentOptions.defaultEOL !== newOptions.defaultEOL && model.getLineCount() === 1) {
            model.setEOL(newOptions.defaultEOL === 1 /* DefaultEndOfLine.LF */ ? 0 /* EndOfLineSequence.LF */ : 1 /* EndOfLineSequence.CRLF */);
        }
        if (currentOptions
            && (currentOptions.detectIndentation === newOptions.detectIndentation)
            && (currentOptions.insertSpaces === newOptions.insertSpaces)
            && (currentOptions.tabSize === newOptions.tabSize)
            && (currentOptions.indentSize === newOptions.indentSize)
            && (currentOptions.trimAutoWhitespace === newOptions.trimAutoWhitespace)
            && (0,_base_common_objects_js__WEBPACK_IMPORTED_MODULE_12__/* .equals */ .aI)(currentOptions.bracketPairColorizationOptions, newOptions.bracketPairColorizationOptions)) {
            // Same indent opts, no need to touch the model
            return;
        }
        if (newOptions.detectIndentation) {
            model.detectIndentation(newOptions.insertSpaces, newOptions.tabSize);
            model.updateOptions({
                trimAutoWhitespace: newOptions.trimAutoWhitespace,
                bracketColorizationOptions: newOptions.bracketPairColorizationOptions
            });
        }
        else {
            model.updateOptions({
                insertSpaces: newOptions.insertSpaces,
                tabSize: newOptions.tabSize,
                indentSize: newOptions.indentSize,
                trimAutoWhitespace: newOptions.trimAutoWhitespace,
                bracketColorizationOptions: newOptions.bracketPairColorizationOptions
            });
        }
    }
    // --- begin IModelService
    _insertDisposedModel(disposedModelData) {
        this._disposedModels.set(MODEL_ID(disposedModelData.uri), disposedModelData);
        this._disposedModelsHeapSize += disposedModelData.heapSize;
    }
    _removeDisposedModel(resource) {
        const disposedModelData = this._disposedModels.get(MODEL_ID(resource));
        if (disposedModelData) {
            this._disposedModelsHeapSize -= disposedModelData.heapSize;
        }
        this._disposedModels.delete(MODEL_ID(resource));
        return disposedModelData;
    }
    _ensureDisposedModelsHeapSize(maxModelsHeapSize) {
        if (this._disposedModelsHeapSize > maxModelsHeapSize) {
            // we must remove some old undo stack elements to free up some memory
            const disposedModels = [];
            this._disposedModels.forEach(entry => {
                if (!entry.sharesUndoRedoStack) {
                    disposedModels.push(entry);
                }
            });
            disposedModels.sort((a, b) => a.time - b.time);
            while (disposedModels.length > 0 && this._disposedModelsHeapSize > maxModelsHeapSize) {
                const disposedModel = disposedModels.shift();
                this._removeDisposedModel(disposedModel.uri);
                if (disposedModel.initialUndoRedoSnapshot !== null) {
                    this._undoRedoService.restoreSnapshot(disposedModel.initialUndoRedoSnapshot);
                }
            }
        }
    }
    _createModelData(value, languageIdOrSelection, resource, isForSimpleWidget) {
        // create & save the model
        const options = this.getCreationOptions(languageIdOrSelection, resource, isForSimpleWidget);
        const model = this._instantiationService.createInstance(_model_textModel_js__WEBPACK_IMPORTED_MODULE_3__/* .TextModel */ .Bz, value, languageIdOrSelection, options, resource);
        if (resource && this._disposedModels.has(MODEL_ID(resource))) {
            const disposedModelData = this._removeDisposedModel(resource);
            const elements = this._undoRedoService.getElements(resource);
            const sha1Computer = this._getSHA1Computer();
            const sha1IsEqual = (sha1Computer.canComputeSHA1(model)
                ? sha1Computer.computeSHA1(model) === disposedModelData.sha1
                : false);
            if (sha1IsEqual || disposedModelData.sharesUndoRedoStack) {
                for (const element of elements.past) {
                    if ((0,_model_editStack_js__WEBPACK_IMPORTED_MODULE_10__/* .isEditStackElement */ .Th)(element) && element.matchesResource(resource)) {
                        element.setModel(model);
                    }
                }
                for (const element of elements.future) {
                    if ((0,_model_editStack_js__WEBPACK_IMPORTED_MODULE_10__/* .isEditStackElement */ .Th)(element) && element.matchesResource(resource)) {
                        element.setModel(model);
                    }
                }
                this._undoRedoService.setElementsValidFlag(resource, true, (element) => ((0,_model_editStack_js__WEBPACK_IMPORTED_MODULE_10__/* .isEditStackElement */ .Th)(element) && element.matchesResource(resource)));
                if (sha1IsEqual) {
                    model._overwriteVersionId(disposedModelData.versionId);
                    model._overwriteAlternativeVersionId(disposedModelData.alternativeVersionId);
                    model._overwriteInitialUndoRedoSnapshot(disposedModelData.initialUndoRedoSnapshot);
                }
            }
            else {
                if (disposedModelData.initialUndoRedoSnapshot !== null) {
                    this._undoRedoService.restoreSnapshot(disposedModelData.initialUndoRedoSnapshot);
                }
            }
        }
        const modelId = MODEL_ID(model.uri);
        if (this._models[modelId]) {
            // There already exists a model with this id => this is a programmer error
            throw new Error('ModelService: Cannot add model because it already exists!');
        }
        const modelData = new ModelData(model, (model) => this._onWillDispose(model), (model, e) => this._onDidChangeLanguage(model, e));
        this._models[modelId] = modelData;
        return modelData;
    }
    createModel(value, languageSelection, resource, isForSimpleWidget = false) {
        let modelData;
        if (languageSelection) {
            modelData = this._createModelData(value, languageSelection, resource, isForSimpleWidget);
        }
        else {
            modelData = this._createModelData(value, _languages_modesRegistry_js__WEBPACK_IMPORTED_MODULE_5__/* .PLAINTEXT_LANGUAGE_ID */ .vH, resource, isForSimpleWidget);
        }
        this._onModelAdded.fire(modelData.model);
        return modelData.model;
    }
    getModels() {
        const ret = [];
        const keys = Object.keys(this._models);
        for (let i = 0, len = keys.length; i < len; i++) {
            const modelId = keys[i];
            ret.push(this._models[modelId].model);
        }
        return ret;
    }
    getModel(resource) {
        const modelId = MODEL_ID(resource);
        const modelData = this._models[modelId];
        if (!modelData) {
            return null;
        }
        return modelData.model;
    }
    // --- end IModelService
    _schemaShouldMaintainUndoRedoElements(resource) {
        return (resource.scheme === _base_common_network_js__WEBPACK_IMPORTED_MODULE_11__/* .Schemas */ .ny.file
            || resource.scheme === _base_common_network_js__WEBPACK_IMPORTED_MODULE_11__/* .Schemas */ .ny.vscodeRemote
            || resource.scheme === _base_common_network_js__WEBPACK_IMPORTED_MODULE_11__/* .Schemas */ .ny.vscodeUserData
            || resource.scheme === _base_common_network_js__WEBPACK_IMPORTED_MODULE_11__/* .Schemas */ .ny.vscodeNotebookCell
            || resource.scheme === 'fake-fs' // for tests
        );
    }
    _onWillDispose(model) {
        const modelId = MODEL_ID(model.uri);
        const modelData = this._models[modelId];
        const sharesUndoRedoStack = (this._undoRedoService.getUriComparisonKey(model.uri) !== model.uri.toString());
        let maintainUndoRedoStack = false;
        let heapSize = 0;
        if (sharesUndoRedoStack || (this._shouldRestoreUndoStack() && this._schemaShouldMaintainUndoRedoElements(model.uri))) {
            const elements = this._undoRedoService.getElements(model.uri);
            if (elements.past.length > 0 || elements.future.length > 0) {
                for (const element of elements.past) {
                    if ((0,_model_editStack_js__WEBPACK_IMPORTED_MODULE_10__/* .isEditStackElement */ .Th)(element) && element.matchesResource(model.uri)) {
                        maintainUndoRedoStack = true;
                        heapSize += element.heapSize(model.uri);
                        element.setModel(model.uri); // remove reference from text buffer instance
                    }
                }
                for (const element of elements.future) {
                    if ((0,_model_editStack_js__WEBPACK_IMPORTED_MODULE_10__/* .isEditStackElement */ .Th)(element) && element.matchesResource(model.uri)) {
                        maintainUndoRedoStack = true;
                        heapSize += element.heapSize(model.uri);
                        element.setModel(model.uri); // remove reference from text buffer instance
                    }
                }
            }
        }
        const maxMemory = ModelService_1.MAX_MEMORY_FOR_CLOSED_FILES_UNDO_STACK;
        const sha1Computer = this._getSHA1Computer();
        if (!maintainUndoRedoStack) {
            if (!sharesUndoRedoStack) {
                const initialUndoRedoSnapshot = modelData.model.getInitialUndoRedoSnapshot();
                if (initialUndoRedoSnapshot !== null) {
                    this._undoRedoService.restoreSnapshot(initialUndoRedoSnapshot);
                }
            }
        }
        else if (!sharesUndoRedoStack && (heapSize > maxMemory || !sha1Computer.canComputeSHA1(model))) {
            // the undo stack for this file would never fit in the configured memory or the file is very large, so don't bother with it.
            const initialUndoRedoSnapshot = modelData.model.getInitialUndoRedoSnapshot();
            if (initialUndoRedoSnapshot !== null) {
                this._undoRedoService.restoreSnapshot(initialUndoRedoSnapshot);
            }
        }
        else {
            this._ensureDisposedModelsHeapSize(maxMemory - heapSize);
            // We only invalidate the elements, but they remain in the undo-redo service.
            this._undoRedoService.setElementsValidFlag(model.uri, false, (element) => ((0,_model_editStack_js__WEBPACK_IMPORTED_MODULE_10__/* .isEditStackElement */ .Th)(element) && element.matchesResource(model.uri)));
            this._insertDisposedModel(new DisposedModelInfo(model.uri, modelData.model.getInitialUndoRedoSnapshot(), Date.now(), sharesUndoRedoStack, heapSize, sha1Computer.computeSHA1(model), model.getVersionId(), model.getAlternativeVersionId()));
        }
        delete this._models[modelId];
        modelData.dispose();
        // clean up cache
        delete this._modelCreationOptionsByLanguageAndResource[model.getLanguageId() + model.uri];
        this._onModelRemoved.fire(model);
    }
    _onDidChangeLanguage(model, e) {
        const oldLanguageId = e.oldLanguage;
        const newLanguageId = model.getLanguageId();
        const oldOptions = this.getCreationOptions(oldLanguageId, model.uri, model.isForSimpleWidget);
        const newOptions = this.getCreationOptions(newLanguageId, model.uri, model.isForSimpleWidget);
        ModelService_1._setModelOptionsForModel(model, newOptions, oldOptions);
        this._onModelModeChanged.fire({ model, oldLanguageId: oldLanguageId });
    }
    _getSHA1Computer() {
        return new DefaultModelSHA1Computer();
    }
};
ModelService = ModelService_1 = __decorate([
    __param(0, _platform_configuration_common_configuration_js__WEBPACK_IMPORTED_MODULE_7__/* .IConfigurationService */ .pG),
    __param(1, _textResourceConfiguration_js__WEBPACK_IMPORTED_MODULE_6__.ITextResourcePropertiesService),
    __param(2, _platform_undoRedo_common_undoRedo_js__WEBPACK_IMPORTED_MODULE_8__/* .IUndoRedoService */ .$D),
    __param(3, _platform_instantiation_common_instantiation_js__WEBPACK_IMPORTED_MODULE_13__/* .IInstantiationService */ ._Y)
], ModelService);

class DefaultModelSHA1Computer {
    static { this.MAX_MODEL_SIZE = 10 * 1024 * 1024; } // takes 200ms to compute a sha1 on a 10MB model on a new machine
    canComputeSHA1(model) {
        return (model.getValueLength() <= DefaultModelSHA1Computer.MAX_MODEL_SIZE);
    }
    computeSHA1(model) {
        // compute the sha1
        const shaComputer = new _base_common_hash_js__WEBPACK_IMPORTED_MODULE_9__/* .StringSHA1 */ .v7();
        const snapshot = model.createSnapshot();
        let text;
        while ((text = snapshot.read())) {
            shaComputer.update(text);
        }
        return shaComputer.digest();
    }
}


/***/ },

/***/ 41504
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ITextResourceConfigurationService: () => (/* binding */ ITextResourceConfigurationService),
/* harmony export */   ITextResourcePropertiesService: () => (/* binding */ ITextResourcePropertiesService)
/* harmony export */ });
/* harmony import */ var _platform_instantiation_common_instantiation_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(82399);

const ITextResourceConfigurationService = (0,_platform_instantiation_common_instantiation_js__WEBPACK_IMPORTED_MODULE_0__/* .createDecorator */ .u1)('textResourceConfigurationService');
const ITextResourcePropertiesService = (0,_platform_instantiation_common_instantiation_js__WEBPACK_IMPORTED_MODULE_0__/* .createDecorator */ .u1)('textResourcePropertiesService');


/***/ },

/***/ 42802
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   $l: () => (/* binding */ readUInt16LE),
/* harmony export */   Gs: () => (/* binding */ writeUInt8),
/* harmony export */   MB: () => (/* binding */ VSBuffer),
/* harmony export */   Sw: () => (/* binding */ writeUInt32BE),
/* harmony export */   bb: () => (/* binding */ readUInt32BE),
/* harmony export */   gN: () => (/* binding */ writeUInt16LE),
/* harmony export */   pJ: () => (/* binding */ readUInt8)
/* harmony export */ });
/* harmony import */ var _lazy_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(63946);
/* provided dependency */ var Buffer = __webpack_require__(48287)["hp"];
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const hasBuffer = (typeof Buffer !== 'undefined');
const indexOfTable = new _lazy_js__WEBPACK_IMPORTED_MODULE_0__/* .Lazy */ .d(() => new Uint8Array(256));
let textDecoder;
class VSBuffer {
    /**
     * When running in a nodejs context, if `actual` is not a nodejs Buffer, the backing store for
     * the returned `VSBuffer` instance might use a nodejs Buffer allocated from node's Buffer pool,
     * which is not transferrable.
     */
    static wrap(actual) {
        if (hasBuffer && !(Buffer.isBuffer(actual))) {
            // https://nodejs.org/dist/latest-v10.x/docs/api/buffer.html#buffer_class_method_buffer_from_arraybuffer_byteoffset_length
            // Create a zero-copy Buffer wrapper around the ArrayBuffer pointed to by the Uint8Array
            actual = Buffer.from(actual.buffer, actual.byteOffset, actual.byteLength);
        }
        return new VSBuffer(actual);
    }
    constructor(buffer) {
        this.buffer = buffer;
        this.byteLength = this.buffer.byteLength;
    }
    toString() {
        if (hasBuffer) {
            return this.buffer.toString();
        }
        else {
            if (!textDecoder) {
                textDecoder = new TextDecoder();
            }
            return textDecoder.decode(this.buffer);
        }
    }
}
function readUInt16LE(source, offset) {
    return (((source[offset + 0] << 0) >>> 0) |
        ((source[offset + 1] << 8) >>> 0));
}
function writeUInt16LE(destination, value, offset) {
    destination[offset + 0] = (value & 0b11111111);
    value = value >>> 8;
    destination[offset + 1] = (value & 0b11111111);
}
function readUInt32BE(source, offset) {
    return (source[offset] * 2 ** 24
        + source[offset + 1] * 2 ** 16
        + source[offset + 2] * 2 ** 8
        + source[offset + 3]);
}
function writeUInt32BE(destination, value, offset) {
    destination[offset + 3] = value;
    value = value >>> 8;
    destination[offset + 2] = value;
    value = value >>> 8;
    destination[offset + 1] = value;
    value = value >>> 8;
    destination[offset] = value;
}
function readUInt8(source, offset) {
    return source[offset];
}
function writeUInt8(destination, value, offset) {
    destination[offset] = value;
}


/***/ },

/***/ 47132
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   M: () => (/* binding */ combineTextEditInfos)
/* harmony export */ });
/* harmony import */ var _base_common_arrays_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(13338);
/* harmony import */ var _beforeEditPositionMapper_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(22994);
/* harmony import */ var _length_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(34883);
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/



function combineTextEditInfos(textEditInfoFirst, textEditInfoSecond) {
    if (textEditInfoFirst.length === 0) {
        return textEditInfoSecond;
    }
    if (textEditInfoSecond.length === 0) {
        return textEditInfoFirst;
    }
    // s0: State before any edits
    const s0ToS1Map = new _base_common_arrays_js__WEBPACK_IMPORTED_MODULE_0__/* .ArrayQueue */ .j3(toLengthMapping(textEditInfoFirst));
    // s1: State after first edit, but before second edit
    const s1ToS2Map = toLengthMapping(textEditInfoSecond);
    s1ToS2Map.push({ modified: false, lengthBefore: undefined, lengthAfter: undefined }); // Copy everything from old to new
    // s2: State after both edits
    let curItem = s0ToS1Map.dequeue();
    /**
     * @param s1Length Use undefined for length "infinity"
     */
    function nextS0ToS1MapWithS1LengthOf(s1Length) {
        if (s1Length === undefined) {
            const arr = s0ToS1Map.takeWhile(v => true) || [];
            if (curItem) {
                arr.unshift(curItem);
            }
            return arr;
        }
        const result = [];
        while (curItem && !(0,_length_js__WEBPACK_IMPORTED_MODULE_2__/* .lengthIsZero */ .Vh)(s1Length)) {
            const [item, remainingItem] = curItem.splitAt(s1Length);
            result.push(item);
            s1Length = (0,_length_js__WEBPACK_IMPORTED_MODULE_2__/* .lengthDiffNonNegative */ .MS)(item.lengthAfter, s1Length);
            curItem = remainingItem ?? s0ToS1Map.dequeue();
        }
        if (!(0,_length_js__WEBPACK_IMPORTED_MODULE_2__/* .lengthIsZero */ .Vh)(s1Length)) {
            result.push(new LengthMapping(false, s1Length, s1Length));
        }
        return result;
    }
    const result = [];
    function pushEdit(startOffset, endOffset, newLength) {
        if (result.length > 0 && (0,_length_js__WEBPACK_IMPORTED_MODULE_2__/* .lengthEquals */ .wP)(result[result.length - 1].endOffset, startOffset)) {
            const lastResult = result[result.length - 1];
            result[result.length - 1] = new _beforeEditPositionMapper_js__WEBPACK_IMPORTED_MODULE_1__/* .TextEditInfo */ .c(lastResult.startOffset, endOffset, (0,_length_js__WEBPACK_IMPORTED_MODULE_2__/* .lengthAdd */ .QB)(lastResult.newLength, newLength));
        }
        else {
            result.push({ startOffset, endOffset, newLength });
        }
    }
    let s0offset = _length_js__WEBPACK_IMPORTED_MODULE_2__/* .lengthZero */ .Vp;
    for (const s1ToS2 of s1ToS2Map) {
        const s0ToS1Map = nextS0ToS1MapWithS1LengthOf(s1ToS2.lengthBefore);
        if (s1ToS2.modified) {
            const s0Length = (0,_length_js__WEBPACK_IMPORTED_MODULE_2__/* .sumLengths */ .pW)(s0ToS1Map, s => s.lengthBefore);
            const s0EndOffset = (0,_length_js__WEBPACK_IMPORTED_MODULE_2__/* .lengthAdd */ .QB)(s0offset, s0Length);
            pushEdit(s0offset, s0EndOffset, s1ToS2.lengthAfter);
            s0offset = s0EndOffset;
        }
        else {
            for (const s1 of s0ToS1Map) {
                const s0startOffset = s0offset;
                s0offset = (0,_length_js__WEBPACK_IMPORTED_MODULE_2__/* .lengthAdd */ .QB)(s0offset, s1.lengthBefore);
                if (s1.modified) {
                    pushEdit(s0startOffset, s0offset, s1.lengthAfter);
                }
            }
        }
    }
    return result;
}
class LengthMapping {
    constructor(
    /**
     * If false, length before and length after equal.
     */
    modified, lengthBefore, lengthAfter) {
        this.modified = modified;
        this.lengthBefore = lengthBefore;
        this.lengthAfter = lengthAfter;
    }
    splitAt(lengthAfter) {
        const remainingLengthAfter = (0,_length_js__WEBPACK_IMPORTED_MODULE_2__/* .lengthDiffNonNegative */ .MS)(lengthAfter, this.lengthAfter);
        if ((0,_length_js__WEBPACK_IMPORTED_MODULE_2__/* .lengthEquals */ .wP)(remainingLengthAfter, _length_js__WEBPACK_IMPORTED_MODULE_2__/* .lengthZero */ .Vp)) {
            return [this, undefined];
        }
        else if (this.modified) {
            return [
                new LengthMapping(this.modified, this.lengthBefore, lengthAfter),
                new LengthMapping(this.modified, _length_js__WEBPACK_IMPORTED_MODULE_2__/* .lengthZero */ .Vp, remainingLengthAfter)
            ];
        }
        else {
            return [
                new LengthMapping(this.modified, lengthAfter, lengthAfter),
                new LengthMapping(this.modified, remainingLengthAfter, remainingLengthAfter)
            ];
        }
    }
    toString() {
        return `${this.modified ? 'M' : 'U'}:${(0,_length_js__WEBPACK_IMPORTED_MODULE_2__/* .lengthToObj */ .l4)(this.lengthBefore)} -> ${(0,_length_js__WEBPACK_IMPORTED_MODULE_2__/* .lengthToObj */ .l4)(this.lengthAfter)}`;
    }
}
function toLengthMapping(textEditInfos) {
    const result = [];
    let lastOffset = _length_js__WEBPACK_IMPORTED_MODULE_2__/* .lengthZero */ .Vp;
    for (const textEditInfo of textEditInfos) {
        const spaceLength = (0,_length_js__WEBPACK_IMPORTED_MODULE_2__/* .lengthDiffNonNegative */ .MS)(lastOffset, textEditInfo.startOffset);
        if (!(0,_length_js__WEBPACK_IMPORTED_MODULE_2__/* .lengthIsZero */ .Vh)(spaceLength)) {
            result.push(new LengthMapping(false, spaceLength, spaceLength));
        }
        const lengthBefore = (0,_length_js__WEBPACK_IMPORTED_MODULE_2__/* .lengthDiffNonNegative */ .MS)(textEditInfo.startOffset, textEditInfo.endOffset);
        result.push(new LengthMapping(true, lengthBefore, textEditInfo.newLength));
        lastOffset = textEditInfo.endOffset;
    }
    return result;
}


/***/ },

/***/ 48287
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
var __webpack_unused_export__;
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



const base64 = __webpack_require__(67526)
const ieee754 = __webpack_require__(251)
const customInspectSymbol =
  (typeof Symbol === 'function' && typeof Symbol['for'] === 'function') // eslint-disable-line dot-notation
    ? Symbol['for']('nodejs.util.inspect.custom') // eslint-disable-line dot-notation
    : null

exports.hp = Buffer
__webpack_unused_export__ = SlowBuffer
exports.IS = 50

const K_MAX_LENGTH = 0x7fffffff
__webpack_unused_export__ = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    const arr = new Uint8Array(1)
    const proto = { foo: function () { return 42 } }
    Object.setPrototypeOf(proto, Uint8Array.prototype)
    Object.setPrototypeOf(arr, proto)
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

Object.defineProperty(Buffer.prototype, 'parent', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.buffer
  }
})

Object.defineProperty(Buffer.prototype, 'offset', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.byteOffset
  }
})

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('The value "' + length + '" is invalid for option "size"')
  }
  // Return an augmented `Uint8Array` instance
  const buf = new Uint8Array(length)
  Object.setPrototypeOf(buf, Buffer.prototype)
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new TypeError(
        'The "string" argument must be of type string. Received type number'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  if (ArrayBuffer.isView(value)) {
    return fromArrayView(value)
  }

  if (value == null) {
    throw new TypeError(
      'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
      'or Array-like Object. Received type ' + (typeof value)
    )
  }

  if (isInstance(value, ArrayBuffer) ||
      (value && isInstance(value.buffer, ArrayBuffer))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof SharedArrayBuffer !== 'undefined' &&
      (isInstance(value, SharedArrayBuffer) ||
      (value && isInstance(value.buffer, SharedArrayBuffer)))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'number') {
    throw new TypeError(
      'The "value" argument must not be of type number. Received type number'
    )
  }

  const valueOf = value.valueOf && value.valueOf()
  if (valueOf != null && valueOf !== value) {
    return Buffer.from(valueOf, encodingOrOffset, length)
  }

  const b = fromObject(value)
  if (b) return b

  if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null &&
      typeof value[Symbol.toPrimitive] === 'function') {
    return Buffer.from(value[Symbol.toPrimitive]('string'), encodingOrOffset, length)
  }

  throw new TypeError(
    'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
    'or Array-like Object. Received type ' + (typeof value)
  )
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Object.setPrototypeOf(Buffer.prototype, Uint8Array.prototype)
Object.setPrototypeOf(Buffer, Uint8Array)

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be of type number')
  } else if (size < 0) {
    throw new RangeError('The value "' + size + '" is invalid for option "size"')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpreted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('Unknown encoding: ' + encoding)
  }

  const length = byteLength(string, encoding) | 0
  let buf = createBuffer(length)

  const actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  const length = array.length < 0 ? 0 : checked(array.length) | 0
  const buf = createBuffer(length)
  for (let i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayView (arrayView) {
  if (isInstance(arrayView, Uint8Array)) {
    const copy = new Uint8Array(arrayView)
    return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength)
  }
  return fromArrayLike(arrayView)
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('"offset" is outside of buffer bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('"length" is outside of buffer bounds')
  }

  let buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  Object.setPrototypeOf(buf, Buffer.prototype)

  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    const len = checked(obj.length) | 0
    const buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj.length !== undefined) {
    if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
      return createBuffer(0)
    }
    return fromArrayLike(obj)
  }

  if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
    return fromArrayLike(obj.data)
  }
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true &&
    b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
}

Buffer.compare = function compare (a, b) {
  if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength)
  if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength)
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError(
      'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
    )
  }

  if (a === b) return 0

  let x = a.length
  let y = b.length

  for (let i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  let i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  const buffer = Buffer.allocUnsafe(length)
  let pos = 0
  for (i = 0; i < list.length; ++i) {
    let buf = list[i]
    if (isInstance(buf, Uint8Array)) {
      if (pos + buf.length > buffer.length) {
        if (!Buffer.isBuffer(buf)) buf = Buffer.from(buf)
        buf.copy(buffer, pos)
      } else {
        Uint8Array.prototype.set.call(
          buffer,
          buf,
          pos
        )
      }
    } else if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    } else {
      buf.copy(buffer, pos)
    }
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    throw new TypeError(
      'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
      'Received type ' + typeof string
    )
  }

  const len = string.length
  const mustMatch = (arguments.length > 2 && arguments[2] === true)
  if (!mustMatch && len === 0) return 0

  // Use a for loop to avoid recursion
  let loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) {
          return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
        }
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  let loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coercion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  const i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  const len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (let i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  const len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (let i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  const len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (let i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  const length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.toLocaleString = Buffer.prototype.toString

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  let str = ''
  const max = exports.IS
  str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim()
  if (this.length > max) str += ' ... '
  return '<Buffer ' + str + '>'
}
if (customInspectSymbol) {
  Buffer.prototype[customInspectSymbol] = Buffer.prototype.inspect
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (isInstance(target, Uint8Array)) {
    target = Buffer.from(target, target.offset, target.byteLength)
  }
  if (!Buffer.isBuffer(target)) {
    throw new TypeError(
      'The "target" argument must be one of type Buffer or Uint8Array. ' +
      'Received type ' + (typeof target)
    )
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  let x = thisEnd - thisStart
  let y = end - start
  const len = Math.min(x, y)

  const thisCopy = this.slice(thisStart, thisEnd)
  const targetCopy = target.slice(start, end)

  for (let i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [val], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  let indexSize = 1
  let arrLength = arr.length
  let valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  let i
  if (dir) {
    let foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      let found = true
      for (let j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  const remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  const strLen = string.length

  if (length > strLen / 2) {
    length = strLen / 2
  }
  let i
  for (i = 0; i < length; ++i) {
    const parsed = parseInt(string.substr(i * 2, 2), 16)
    if (numberIsNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  const remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  let loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
      case 'latin1':
      case 'binary':
        return asciiWrite(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  const res = []

  let i = start
  while (i < end) {
    const firstByte = buf[i]
    let codePoint = null
    let bytesPerSequence = (firstByte > 0xEF)
      ? 4
      : (firstByte > 0xDF)
          ? 3
          : (firstByte > 0xBF)
              ? 2
              : 1

    if (i + bytesPerSequence <= end) {
      let secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
const MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  const len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  let res = ''
  let i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  let ret = ''
  end = Math.min(buf.length, end)

  for (let i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  let ret = ''
  end = Math.min(buf.length, end)

  for (let i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  const len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  let out = ''
  for (let i = start; i < end; ++i) {
    out += hexSliceLookupTable[buf[i]]
  }
  return out
}

function utf16leSlice (buf, start, end) {
  const bytes = buf.slice(start, end)
  let res = ''
  // If bytes.length is odd, the last 8 bits must be ignored (same as node.js)
  for (let i = 0; i < bytes.length - 1; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  const len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  const newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  Object.setPrototypeOf(newBuf, Buffer.prototype)

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUintLE =
Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  let val = this[offset]
  let mul = 1
  let i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUintBE =
Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  let val = this[offset + --byteLength]
  let mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUint8 =
Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUint16LE =
Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUint16BE =
Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUint32LE =
Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUint32BE =
Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readBigUInt64LE = defineBigIntMethod(function readBigUInt64LE (offset) {
  offset = offset >>> 0
  validateNumber(offset, 'offset')
  const first = this[offset]
  const last = this[offset + 7]
  if (first === undefined || last === undefined) {
    boundsError(offset, this.length - 8)
  }

  const lo = first +
    this[++offset] * 2 ** 8 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 24

  const hi = this[++offset] +
    this[++offset] * 2 ** 8 +
    this[++offset] * 2 ** 16 +
    last * 2 ** 24

  return BigInt(lo) + (BigInt(hi) << BigInt(32))
})

Buffer.prototype.readBigUInt64BE = defineBigIntMethod(function readBigUInt64BE (offset) {
  offset = offset >>> 0
  validateNumber(offset, 'offset')
  const first = this[offset]
  const last = this[offset + 7]
  if (first === undefined || last === undefined) {
    boundsError(offset, this.length - 8)
  }

  const hi = first * 2 ** 24 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 8 +
    this[++offset]

  const lo = this[++offset] * 2 ** 24 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 8 +
    last

  return (BigInt(hi) << BigInt(32)) + BigInt(lo)
})

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  let val = this[offset]
  let mul = 1
  let i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  let i = byteLength
  let mul = 1
  let val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  const val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  const val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readBigInt64LE = defineBigIntMethod(function readBigInt64LE (offset) {
  offset = offset >>> 0
  validateNumber(offset, 'offset')
  const first = this[offset]
  const last = this[offset + 7]
  if (first === undefined || last === undefined) {
    boundsError(offset, this.length - 8)
  }

  const val = this[offset + 4] +
    this[offset + 5] * 2 ** 8 +
    this[offset + 6] * 2 ** 16 +
    (last << 24) // Overflow

  return (BigInt(val) << BigInt(32)) +
    BigInt(first +
    this[++offset] * 2 ** 8 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 24)
})

Buffer.prototype.readBigInt64BE = defineBigIntMethod(function readBigInt64BE (offset) {
  offset = offset >>> 0
  validateNumber(offset, 'offset')
  const first = this[offset]
  const last = this[offset + 7]
  if (first === undefined || last === undefined) {
    boundsError(offset, this.length - 8)
  }

  const val = (first << 24) + // Overflow
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 8 +
    this[++offset]

  return (BigInt(val) << BigInt(32)) +
    BigInt(this[++offset] * 2 ** 24 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 8 +
    last)
})

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUintLE =
Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    const maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  let mul = 1
  let i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUintBE =
Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    const maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  let i = byteLength - 1
  let mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUint8 =
Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUint16LE =
Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUint16BE =
Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUint32LE =
Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUint32BE =
Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function wrtBigUInt64LE (buf, value, offset, min, max) {
  checkIntBI(value, min, max, buf, offset, 7)

  let lo = Number(value & BigInt(0xffffffff))
  buf[offset++] = lo
  lo = lo >> 8
  buf[offset++] = lo
  lo = lo >> 8
  buf[offset++] = lo
  lo = lo >> 8
  buf[offset++] = lo
  let hi = Number(value >> BigInt(32) & BigInt(0xffffffff))
  buf[offset++] = hi
  hi = hi >> 8
  buf[offset++] = hi
  hi = hi >> 8
  buf[offset++] = hi
  hi = hi >> 8
  buf[offset++] = hi
  return offset
}

function wrtBigUInt64BE (buf, value, offset, min, max) {
  checkIntBI(value, min, max, buf, offset, 7)

  let lo = Number(value & BigInt(0xffffffff))
  buf[offset + 7] = lo
  lo = lo >> 8
  buf[offset + 6] = lo
  lo = lo >> 8
  buf[offset + 5] = lo
  lo = lo >> 8
  buf[offset + 4] = lo
  let hi = Number(value >> BigInt(32) & BigInt(0xffffffff))
  buf[offset + 3] = hi
  hi = hi >> 8
  buf[offset + 2] = hi
  hi = hi >> 8
  buf[offset + 1] = hi
  hi = hi >> 8
  buf[offset] = hi
  return offset + 8
}

Buffer.prototype.writeBigUInt64LE = defineBigIntMethod(function writeBigUInt64LE (value, offset = 0) {
  return wrtBigUInt64LE(this, value, offset, BigInt(0), BigInt('0xffffffffffffffff'))
})

Buffer.prototype.writeBigUInt64BE = defineBigIntMethod(function writeBigUInt64BE (value, offset = 0) {
  return wrtBigUInt64BE(this, value, offset, BigInt(0), BigInt('0xffffffffffffffff'))
})

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    const limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  let i = 0
  let mul = 1
  let sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    const limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  let i = byteLength - 1
  let mul = 1
  let sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeBigInt64LE = defineBigIntMethod(function writeBigInt64LE (value, offset = 0) {
  return wrtBigUInt64LE(this, value, offset, -BigInt('0x8000000000000000'), BigInt('0x7fffffffffffffff'))
})

Buffer.prototype.writeBigInt64BE = defineBigIntMethod(function writeBigInt64BE (value, offset = 0) {
  return wrtBigUInt64BE(this, value, offset, -BigInt('0x8000000000000000'), BigInt('0x7fffffffffffffff'))
})

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  const len = end - start

  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
    // Use built-in when available, missing from IE11
    this.copyWithin(targetStart, start, end)
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, end),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
    if (val.length === 1) {
      const code = val.charCodeAt(0)
      if ((encoding === 'utf8' && code < 128) ||
          encoding === 'latin1') {
        // Fast path: If `val` fits into a single byte, use that numeric value.
        val = code
      }
    }
  } else if (typeof val === 'number') {
    val = val & 255
  } else if (typeof val === 'boolean') {
    val = Number(val)
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  let i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    const bytes = Buffer.isBuffer(val)
      ? val
      : Buffer.from(val, encoding)
    const len = bytes.length
    if (len === 0) {
      throw new TypeError('The value "' + val +
        '" is invalid for argument "value"')
    }
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// CUSTOM ERRORS
// =============

// Simplified versions from Node, changed for Buffer-only usage
const errors = {}
function E (sym, getMessage, Base) {
  errors[sym] = class NodeError extends Base {
    constructor () {
      super()

      Object.defineProperty(this, 'message', {
        value: getMessage.apply(this, arguments),
        writable: true,
        configurable: true
      })

      // Add the error code to the name to include it in the stack trace.
      this.name = `${this.name} [${sym}]`
      // Access the stack to generate the error message including the error code
      // from the name.
      this.stack // eslint-disable-line no-unused-expressions
      // Reset the name to the actual name.
      delete this.name
    }

    get code () {
      return sym
    }

    set code (value) {
      Object.defineProperty(this, 'code', {
        configurable: true,
        enumerable: true,
        value,
        writable: true
      })
    }

    toString () {
      return `${this.name} [${sym}]: ${this.message}`
    }
  }
}

E('ERR_BUFFER_OUT_OF_BOUNDS',
  function (name) {
    if (name) {
      return `${name} is outside of buffer bounds`
    }

    return 'Attempt to access memory outside buffer bounds'
  }, RangeError)
E('ERR_INVALID_ARG_TYPE',
  function (name, actual) {
    return `The "${name}" argument must be of type number. Received type ${typeof actual}`
  }, TypeError)
E('ERR_OUT_OF_RANGE',
  function (str, range, input) {
    let msg = `The value of "${str}" is out of range.`
    let received = input
    if (Number.isInteger(input) && Math.abs(input) > 2 ** 32) {
      received = addNumericalSeparator(String(input))
    } else if (typeof input === 'bigint') {
      received = String(input)
      if (input > BigInt(2) ** BigInt(32) || input < -(BigInt(2) ** BigInt(32))) {
        received = addNumericalSeparator(received)
      }
      received += 'n'
    }
    msg += ` It must be ${range}. Received ${received}`
    return msg
  }, RangeError)

function addNumericalSeparator (val) {
  let res = ''
  let i = val.length
  const start = val[0] === '-' ? 1 : 0
  for (; i >= start + 4; i -= 3) {
    res = `_${val.slice(i - 3, i)}${res}`
  }
  return `${val.slice(0, i)}${res}`
}

// CHECK FUNCTIONS
// ===============

function checkBounds (buf, offset, byteLength) {
  validateNumber(offset, 'offset')
  if (buf[offset] === undefined || buf[offset + byteLength] === undefined) {
    boundsError(offset, buf.length - (byteLength + 1))
  }
}

function checkIntBI (value, min, max, buf, offset, byteLength) {
  if (value > max || value < min) {
    const n = typeof min === 'bigint' ? 'n' : ''
    let range
    if (byteLength > 3) {
      if (min === 0 || min === BigInt(0)) {
        range = `>= 0${n} and < 2${n} ** ${(byteLength + 1) * 8}${n}`
      } else {
        range = `>= -(2${n} ** ${(byteLength + 1) * 8 - 1}${n}) and < 2 ** ` +
                `${(byteLength + 1) * 8 - 1}${n}`
      }
    } else {
      range = `>= ${min}${n} and <= ${max}${n}`
    }
    throw new errors.ERR_OUT_OF_RANGE('value', range, value)
  }
  checkBounds(buf, offset, byteLength)
}

function validateNumber (value, name) {
  if (typeof value !== 'number') {
    throw new errors.ERR_INVALID_ARG_TYPE(name, 'number', value)
  }
}

function boundsError (value, length, type) {
  if (Math.floor(value) !== value) {
    validateNumber(value, type)
    throw new errors.ERR_OUT_OF_RANGE(type || 'offset', 'an integer', value)
  }

  if (length < 0) {
    throw new errors.ERR_BUFFER_OUT_OF_BOUNDS()
  }

  throw new errors.ERR_OUT_OF_RANGE(type || 'offset',
                                    `>= ${type ? 1 : 0} and <= ${length}`,
                                    value)
}

// HELPER FUNCTIONS
// ================

const INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node takes equal signs as end of the Base64 encoding
  str = str.split('=')[0]
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  let codePoint
  const length = string.length
  let leadSurrogate = null
  const bytes = []

  for (let i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  const byteArray = []
  for (let i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  let c, hi, lo
  const byteArray = []
  for (let i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  let i
  for (i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
// the `instanceof` check but they should be treated as of that type.
// See: https://github.com/feross/buffer/issues/166
function isInstance (obj, type) {
  return obj instanceof type ||
    (obj != null && obj.constructor != null && obj.constructor.name != null &&
      obj.constructor.name === type.name)
}
function numberIsNaN (obj) {
  // For IE11 support
  return obj !== obj // eslint-disable-line no-self-compare
}

// Create lookup table for `toString('hex')`
// See: https://github.com/feross/buffer/issues/219
const hexSliceLookupTable = (function () {
  const alphabet = '0123456789abcdef'
  const table = new Array(256)
  for (let i = 0; i < 16; ++i) {
    const i16 = i * 16
    for (let j = 0; j < 16; ++j) {
      table[i16 + j] = alphabet[i] + alphabet[j]
    }
  }
  return table
})()

// Return not function with Error if BigInt not supported
function defineBigIntMethod (fn) {
  return typeof BigInt === 'undefined' ? BufferBigIntNotDefined : fn
}

function BufferBigIntNotDefined () {
  throw new Error('BigInt not supported')
}


/***/ },

/***/ 48295
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
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

/***/ 49550
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GB: () => (/* binding */ AutoClosingPairs),
/* harmony export */   i3: () => (/* binding */ StandardAutoClosingPairConditional),
/* harmony export */   l: () => (/* binding */ IndentAction)
/* harmony export */ });
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
/**
 * Describes what to do with the indentation when pressing Enter.
 */
var IndentAction;
(function (IndentAction) {
    /**
     * Insert new line and copy the previous line's indentation.
     */
    IndentAction[IndentAction["None"] = 0] = "None";
    /**
     * Insert new line and indent once (relative to the previous line's indentation).
     */
    IndentAction[IndentAction["Indent"] = 1] = "Indent";
    /**
     * Insert two new lines:
     *  - the first one indented which will hold the cursor
     *  - the second one at the same indentation level
     */
    IndentAction[IndentAction["IndentOutdent"] = 2] = "IndentOutdent";
    /**
     * Insert new line and outdent once (relative to the previous line's indentation).
     */
    IndentAction[IndentAction["Outdent"] = 3] = "Outdent";
})(IndentAction || (IndentAction = {}));
/**
 * @internal
 */
class StandardAutoClosingPairConditional {
    constructor(source) {
        this._neutralCharacter = null;
        this._neutralCharacterSearched = false;
        this.open = source.open;
        this.close = source.close;
        // initially allowed in all tokens
        this._inString = true;
        this._inComment = true;
        this._inRegEx = true;
        if (Array.isArray(source.notIn)) {
            for (let i = 0, len = source.notIn.length; i < len; i++) {
                const notIn = source.notIn[i];
                switch (notIn) {
                    case 'string':
                        this._inString = false;
                        break;
                    case 'comment':
                        this._inComment = false;
                        break;
                    case 'regex':
                        this._inRegEx = false;
                        break;
                }
            }
        }
    }
    isOK(standardToken) {
        switch (standardToken) {
            case 0 /* StandardTokenType.Other */:
                return true;
            case 1 /* StandardTokenType.Comment */:
                return this._inComment;
            case 2 /* StandardTokenType.String */:
                return this._inString;
            case 3 /* StandardTokenType.RegEx */:
                return this._inRegEx;
        }
    }
    shouldAutoClose(context, column) {
        // Always complete on empty line
        if (context.getTokenCount() === 0) {
            return true;
        }
        const tokenIndex = context.findTokenIndexAtOffset(column - 2);
        const standardTokenType = context.getStandardTokenType(tokenIndex);
        return this.isOK(standardTokenType);
    }
    _findNeutralCharacterInRange(fromCharCode, toCharCode) {
        for (let charCode = fromCharCode; charCode <= toCharCode; charCode++) {
            const character = String.fromCharCode(charCode);
            if (!this.open.includes(character) && !this.close.includes(character)) {
                return character;
            }
        }
        return null;
    }
    /**
     * Find a character in the range [0-9a-zA-Z] that does not appear in the open or close
     */
    findNeutralCharacter() {
        if (!this._neutralCharacterSearched) {
            this._neutralCharacterSearched = true;
            if (!this._neutralCharacter) {
                this._neutralCharacter = this._findNeutralCharacterInRange(48 /* CharCode.Digit0 */, 57 /* CharCode.Digit9 */);
            }
            if (!this._neutralCharacter) {
                this._neutralCharacter = this._findNeutralCharacterInRange(97 /* CharCode.a */, 122 /* CharCode.z */);
            }
            if (!this._neutralCharacter) {
                this._neutralCharacter = this._findNeutralCharacterInRange(65 /* CharCode.A */, 90 /* CharCode.Z */);
            }
        }
        return this._neutralCharacter;
    }
}
/**
 * @internal
 */
class AutoClosingPairs {
    constructor(autoClosingPairs) {
        this.autoClosingPairsOpenByStart = new Map();
        this.autoClosingPairsOpenByEnd = new Map();
        this.autoClosingPairsCloseByStart = new Map();
        this.autoClosingPairsCloseByEnd = new Map();
        this.autoClosingPairsCloseSingleChar = new Map();
        for (const pair of autoClosingPairs) {
            appendEntry(this.autoClosingPairsOpenByStart, pair.open.charAt(0), pair);
            appendEntry(this.autoClosingPairsOpenByEnd, pair.open.charAt(pair.open.length - 1), pair);
            appendEntry(this.autoClosingPairsCloseByStart, pair.close.charAt(0), pair);
            appendEntry(this.autoClosingPairsCloseByEnd, pair.close.charAt(pair.close.length - 1), pair);
            if (pair.close.length === 1 && pair.open.length === 1) {
                appendEntry(this.autoClosingPairsCloseSingleChar, pair.close, pair);
            }
        }
    }
}
function appendEntry(target, key, value) {
    if (target.has(key)) {
        target.get(key).push(value);
    }
    else {
        target.set(key, [value]);
    }
}


/***/ },

/***/ 50969
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   G: () => (/* binding */ computeIndentLevel)
/* harmony export */ });
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
/**
 * Returns:
 *  - -1 => the line consists of whitespace
 *  - otherwise => the indent level is returned value
 */
function computeIndentLevel(line, tabSize) {
    let indent = 0;
    let i = 0;
    const len = line.length;
    while (i < len) {
        const chCode = line.charCodeAt(i);
        if (chCode === 32 /* CharCode.Space */) {
            indent++;
        }
        else if (chCode === 9 /* CharCode.Tab */) {
            indent = indent - indent % tabSize + tabSize;
        }
        else {
            break;
        }
        i++;
    }
    if (i === len) {
        return -1; // line only consists of whitespace
    }
    return indent;
}


/***/ },

/***/ 51460
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
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

/***/ 52394
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  JZ: () => (/* binding */ ILanguageConfigurationService),
  Cw: () => (/* binding */ getIndentationAtPosition)
});

// UNUSED EXPORTS: LanguageConfigurationChangeEvent, LanguageConfigurationRegistry, LanguageConfigurationService, LanguageConfigurationServiceChangeEvent, ResolvedLanguageConfiguration

// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/base/common/event.js
var common_event = __webpack_require__(2106);
// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/base/common/lifecycle.js
var lifecycle = __webpack_require__(10998);
// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/base/common/strings.js
var strings = __webpack_require__(16844);
// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/editor/common/core/wordHelper.js
var wordHelper = __webpack_require__(18782);
// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/editor/common/languages/languageConfiguration.js
var languageConfiguration = __webpack_require__(49550);
;// ./node_modules/monaco-editor/esm/vs/editor/common/languages/supports/characterPair.js
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

class CharacterPairSupport {
    static { this.DEFAULT_AUTOCLOSE_BEFORE_LANGUAGE_DEFINED_QUOTES = ';:.,=}])> \n\t'; }
    static { this.DEFAULT_AUTOCLOSE_BEFORE_LANGUAGE_DEFINED_BRACKETS = '\'"`;:.,=}])> \n\t'; }
    constructor(config) {
        if (config.autoClosingPairs) {
            this._autoClosingPairs = config.autoClosingPairs.map(el => new languageConfiguration/* StandardAutoClosingPairConditional */.i3(el));
        }
        else if (config.brackets) {
            this._autoClosingPairs = config.brackets.map(b => new languageConfiguration/* StandardAutoClosingPairConditional */.i3({ open: b[0], close: b[1] }));
        }
        else {
            this._autoClosingPairs = [];
        }
        if (config.__electricCharacterSupport && config.__electricCharacterSupport.docComment) {
            const docComment = config.__electricCharacterSupport.docComment;
            // IDocComment is legacy, only partially supported
            this._autoClosingPairs.push(new languageConfiguration/* StandardAutoClosingPairConditional */.i3({ open: docComment.open, close: docComment.close || '' }));
        }
        this._autoCloseBeforeForQuotes = typeof config.autoCloseBefore === 'string' ? config.autoCloseBefore : CharacterPairSupport.DEFAULT_AUTOCLOSE_BEFORE_LANGUAGE_DEFINED_QUOTES;
        this._autoCloseBeforeForBrackets = typeof config.autoCloseBefore === 'string' ? config.autoCloseBefore : CharacterPairSupport.DEFAULT_AUTOCLOSE_BEFORE_LANGUAGE_DEFINED_BRACKETS;
        this._surroundingPairs = config.surroundingPairs || this._autoClosingPairs;
    }
    getAutoClosingPairs() {
        return this._autoClosingPairs;
    }
    getAutoCloseBeforeSet(forQuotes) {
        return (forQuotes ? this._autoCloseBeforeForQuotes : this._autoCloseBeforeForBrackets);
    }
    getSurroundingPairs() {
        return this._surroundingPairs;
    }
}

// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/base/common/arrays.js
var arrays = __webpack_require__(13338);
// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/editor/common/languages/supports.js
var supports = __webpack_require__(19184);
// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/editor/common/languages/supports/richEditBrackets.js
var richEditBrackets = __webpack_require__(1804);
;// ./node_modules/monaco-editor/esm/vs/editor/common/languages/supports/electricCharacter.js
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/



class BracketElectricCharacterSupport {
    constructor(richEditBrackets) {
        this._richEditBrackets = richEditBrackets;
    }
    getElectricCharacters() {
        const result = [];
        if (this._richEditBrackets) {
            for (const bracket of this._richEditBrackets.brackets) {
                for (const close of bracket.close) {
                    const lastChar = close.charAt(close.length - 1);
                    result.push(lastChar);
                }
            }
        }
        return (0,arrays/* distinct */.dM)(result);
    }
    onElectricCharacter(character, context, column) {
        if (!this._richEditBrackets || this._richEditBrackets.brackets.length === 0) {
            return null;
        }
        const tokenIndex = context.findTokenIndexAtOffset(column - 1);
        if ((0,supports/* ignoreBracketsInToken */.Yo)(context.getStandardTokenType(tokenIndex))) {
            return null;
        }
        const reversedBracketRegex = this._richEditBrackets.reversedRegex;
        const text = context.getLineContent().substring(0, column - 1) + character;
        const r = richEditBrackets/* BracketsUtils */.Fu.findPrevBracketInRange(reversedBracketRegex, 1, text, 0, text.length);
        if (!r) {
            return null;
        }
        const bracketText = text.substring(r.startColumn - 1, r.endColumn - 1).toLowerCase();
        const isOpen = this._richEditBrackets.textIsOpenBracket[bracketText];
        if (isOpen) {
            return null;
        }
        const textBeforeBracket = context.getActualLineContentBefore(r.startColumn - 1);
        if (!/^\s*$/.test(textBeforeBracket)) {
            // There is other text on the line before the bracket
            return null;
        }
        return {
            matchOpenBracket: bracketText
        };
    }
}

;// ./node_modules/monaco-editor/esm/vs/editor/common/languages/supports/indentRules.js
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
function resetGlobalRegex(reg) {
    if (reg.global) {
        reg.lastIndex = 0;
    }
    return true;
}
class IndentRulesSupport {
    constructor(indentationRules) {
        this._indentationRules = indentationRules;
    }
    shouldIncrease(text) {
        if (this._indentationRules) {
            if (this._indentationRules.increaseIndentPattern && resetGlobalRegex(this._indentationRules.increaseIndentPattern) && this._indentationRules.increaseIndentPattern.test(text)) {
                return true;
            }
            // if (this._indentationRules.indentNextLinePattern && this._indentationRules.indentNextLinePattern.test(text)) {
            // 	return true;
            // }
        }
        return false;
    }
    shouldDecrease(text) {
        if (this._indentationRules && this._indentationRules.decreaseIndentPattern && resetGlobalRegex(this._indentationRules.decreaseIndentPattern) && this._indentationRules.decreaseIndentPattern.test(text)) {
            return true;
        }
        return false;
    }
    shouldIndentNextLine(text) {
        if (this._indentationRules && this._indentationRules.indentNextLinePattern && resetGlobalRegex(this._indentationRules.indentNextLinePattern) && this._indentationRules.indentNextLinePattern.test(text)) {
            return true;
        }
        return false;
    }
    shouldIgnore(text) {
        // the text matches `unIndentedLinePattern`
        if (this._indentationRules && this._indentationRules.unIndentedLinePattern && resetGlobalRegex(this._indentationRules.unIndentedLinePattern) && this._indentationRules.unIndentedLinePattern.test(text)) {
            return true;
        }
        return false;
    }
    getIndentMetadata(text) {
        let ret = 0;
        if (this.shouldIncrease(text)) {
            ret += 1 /* IndentConsts.INCREASE_MASK */;
        }
        if (this.shouldDecrease(text)) {
            ret += 2 /* IndentConsts.DECREASE_MASK */;
        }
        if (this.shouldIndentNextLine(text)) {
            ret += 4 /* IndentConsts.INDENT_NEXTLINE_MASK */;
        }
        if (this.shouldIgnore(text)) {
            ret += 8 /* IndentConsts.UNINDENT_MASK */;
        }
        return ret;
    }
}

// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/base/common/errors.js
var errors = __webpack_require__(94327);
;// ./node_modules/monaco-editor/esm/vs/editor/common/languages/supports/onEnter.js
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/



class OnEnterSupport {
    constructor(opts) {
        opts = opts || {};
        opts.brackets = opts.brackets || [
            ['(', ')'],
            ['{', '}'],
            ['[', ']']
        ];
        this._brackets = [];
        opts.brackets.forEach((bracket) => {
            const openRegExp = OnEnterSupport._createOpenBracketRegExp(bracket[0]);
            const closeRegExp = OnEnterSupport._createCloseBracketRegExp(bracket[1]);
            if (openRegExp && closeRegExp) {
                this._brackets.push({
                    open: bracket[0],
                    openRegExp: openRegExp,
                    close: bracket[1],
                    closeRegExp: closeRegExp,
                });
            }
        });
        this._regExpRules = opts.onEnterRules || [];
    }
    onEnter(autoIndent, previousLineText, beforeEnterText, afterEnterText) {
        // (1): `regExpRules`
        if (autoIndent >= 3 /* EditorAutoIndentStrategy.Advanced */) {
            for (let i = 0, len = this._regExpRules.length; i < len; i++) {
                const rule = this._regExpRules[i];
                const regResult = [{
                        reg: rule.beforeText,
                        text: beforeEnterText
                    }, {
                        reg: rule.afterText,
                        text: afterEnterText
                    }, {
                        reg: rule.previousLineText,
                        text: previousLineText
                    }].every((obj) => {
                    if (!obj.reg) {
                        return true;
                    }
                    obj.reg.lastIndex = 0; // To disable the effect of the "g" flag.
                    return obj.reg.test(obj.text);
                });
                if (regResult) {
                    return rule.action;
                }
            }
        }
        // (2): Special indent-outdent
        if (autoIndent >= 2 /* EditorAutoIndentStrategy.Brackets */) {
            if (beforeEnterText.length > 0 && afterEnterText.length > 0) {
                for (let i = 0, len = this._brackets.length; i < len; i++) {
                    const bracket = this._brackets[i];
                    if (bracket.openRegExp.test(beforeEnterText) && bracket.closeRegExp.test(afterEnterText)) {
                        return { indentAction: languageConfiguration/* IndentAction */.l.IndentOutdent };
                    }
                }
            }
        }
        // (4): Open bracket based logic
        if (autoIndent >= 2 /* EditorAutoIndentStrategy.Brackets */) {
            if (beforeEnterText.length > 0) {
                for (let i = 0, len = this._brackets.length; i < len; i++) {
                    const bracket = this._brackets[i];
                    if (bracket.openRegExp.test(beforeEnterText)) {
                        return { indentAction: languageConfiguration/* IndentAction */.l.Indent };
                    }
                }
            }
        }
        return null;
    }
    static _createOpenBracketRegExp(bracket) {
        let str = strings/* escapeRegExpCharacters */.bm(bracket);
        if (!/\B/.test(str.charAt(0))) {
            str = '\\b' + str;
        }
        str += '\\s*$';
        return OnEnterSupport._safeRegExp(str);
    }
    static _createCloseBracketRegExp(bracket) {
        let str = strings/* escapeRegExpCharacters */.bm(bracket);
        if (!/\B/.test(str.charAt(str.length - 1))) {
            str = str + '\\b';
        }
        str = '^\\s*' + str;
        return OnEnterSupport._safeRegExp(str);
    }
    static _safeRegExp(def) {
        try {
            return new RegExp(def);
        }
        catch (err) {
            (0,errors/* onUnexpectedError */.dz)(err);
            return null;
        }
    }
}

// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/platform/instantiation/common/instantiation.js
var instantiation = __webpack_require__(82399);
// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/platform/configuration/common/configuration.js
var configuration = __webpack_require__(85753);
// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/editor/common/languages/language.js
var language = __webpack_require__(77922);
// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/platform/instantiation/common/extensions.js
var extensions = __webpack_require__(66726);
// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/editor/common/languages/modesRegistry.js
var modesRegistry = __webpack_require__(54957);
// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/base/common/cache.js
var cache = __webpack_require__(36260);
;// ./node_modules/monaco-editor/esm/vs/editor/common/languages/supports/languageBracketsConfiguration.js
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/


/**
 * Captures all bracket related configurations for a single language.
 * Immutable.
*/
class LanguageBracketsConfiguration {
    constructor(languageId, config) {
        this.languageId = languageId;
        const bracketPairs = config.brackets ? filterValidBrackets(config.brackets) : [];
        const openingBracketInfos = new cache/* CachedFunction */.VV((bracket) => {
            const closing = new Set();
            return {
                info: new OpeningBracketKind(this, bracket, closing),
                closing,
            };
        });
        const closingBracketInfos = new cache/* CachedFunction */.VV((bracket) => {
            const opening = new Set();
            const openingColorized = new Set();
            return {
                info: new ClosingBracketKind(this, bracket, opening, openingColorized),
                opening,
                openingColorized,
            };
        });
        for (const [open, close] of bracketPairs) {
            const opening = openingBracketInfos.get(open);
            const closing = closingBracketInfos.get(close);
            opening.closing.add(closing.info);
            closing.opening.add(opening.info);
        }
        // Treat colorized brackets as brackets, and mark them as colorized.
        const colorizedBracketPairs = config.colorizedBracketPairs
            ? filterValidBrackets(config.colorizedBracketPairs)
            // If not configured: Take all brackets except `<` ... `>`
            // Many languages set < ... > as bracket pair, even though they also use it as comparison operator.
            // This leads to problems when colorizing this bracket, so we exclude it if not explicitly configured otherwise.
            // https://github.com/microsoft/vscode/issues/132476
            : bracketPairs.filter((p) => !(p[0] === '<' && p[1] === '>'));
        for (const [open, close] of colorizedBracketPairs) {
            const opening = openingBracketInfos.get(open);
            const closing = closingBracketInfos.get(close);
            opening.closing.add(closing.info);
            closing.openingColorized.add(opening.info);
            closing.opening.add(opening.info);
        }
        this._openingBrackets = new Map([...openingBracketInfos.cachedValues].map(([k, v]) => [k, v.info]));
        this._closingBrackets = new Map([...closingBracketInfos.cachedValues].map(([k, v]) => [k, v.info]));
    }
    /**
     * No two brackets have the same bracket text.
    */
    get openingBrackets() {
        return [...this._openingBrackets.values()];
    }
    /**
     * No two brackets have the same bracket text.
    */
    get closingBrackets() {
        return [...this._closingBrackets.values()];
    }
    getOpeningBracketInfo(bracketText) {
        return this._openingBrackets.get(bracketText);
    }
    getClosingBracketInfo(bracketText) {
        return this._closingBrackets.get(bracketText);
    }
    getBracketInfo(bracketText) {
        return this.getOpeningBracketInfo(bracketText) || this.getClosingBracketInfo(bracketText);
    }
    getBracketRegExp(options) {
        const brackets = Array.from([...this._openingBrackets.keys(), ...this._closingBrackets.keys()]);
        return (0,richEditBrackets/* createBracketOrRegExp */.xb)(brackets, options);
    }
}
function filterValidBrackets(bracketPairs) {
    return bracketPairs.filter(([open, close]) => open !== '' && close !== '');
}
class BracketKindBase {
    constructor(config, bracketText) {
        this.config = config;
        this.bracketText = bracketText;
    }
    get languageId() {
        return this.config.languageId;
    }
}
class OpeningBracketKind extends BracketKindBase {
    constructor(config, bracketText, openedBrackets) {
        super(config, bracketText);
        this.openedBrackets = openedBrackets;
        this.isOpeningBracket = true;
    }
}
class ClosingBracketKind extends BracketKindBase {
    constructor(config, bracketText, 
    /**
     * Non empty array of all opening brackets this bracket closes.
    */
    openingBrackets, openingColorizedBrackets) {
        super(config, bracketText);
        this.openingBrackets = openingBrackets;
        this.openingColorizedBrackets = openingColorizedBrackets;
        this.isOpeningBracket = false;
    }
    /**
     * Checks if this bracket closes the given other bracket.
     * If the bracket infos come from different configurations, this method will return false.
    */
    closes(other) {
        if (other['config'] !== this.config) {
            return false;
        }
        return this.openingBrackets.has(other);
    }
    closesColorized(other) {
        if (other['config'] !== this.config) {
            return false;
        }
        return this.openingColorizedBrackets.has(other);
    }
    getOpeningBrackets() {
        return [...this.openingBrackets];
    }
}

;// ./node_modules/monaco-editor/esm/vs/editor/common/languages/languageConfigurationRegistry.js
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
















class LanguageConfigurationServiceChangeEvent {
    constructor(languageId) {
        this.languageId = languageId;
    }
    affects(languageId) {
        return !this.languageId ? true : this.languageId === languageId;
    }
}
const ILanguageConfigurationService = (0,instantiation/* createDecorator */.u1)('languageConfigurationService');
let LanguageConfigurationService = class LanguageConfigurationService extends lifecycle/* Disposable */.jG {
    constructor(configurationService, languageService) {
        super();
        this.configurationService = configurationService;
        this.languageService = languageService;
        this._registry = this._register(new LanguageConfigurationRegistry());
        this.onDidChangeEmitter = this._register(new common_event/* Emitter */.vl());
        this.onDidChange = this.onDidChangeEmitter.event;
        this.configurations = new Map();
        const languageConfigKeys = new Set(Object.values(customizedLanguageConfigKeys));
        this._register(this.configurationService.onDidChangeConfiguration((e) => {
            const globalConfigChanged = e.change.keys.some((k) => languageConfigKeys.has(k));
            const localConfigChanged = e.change.overrides
                .filter(([overrideLangName, keys]) => keys.some((k) => languageConfigKeys.has(k)))
                .map(([overrideLangName]) => overrideLangName);
            if (globalConfigChanged) {
                this.configurations.clear();
                this.onDidChangeEmitter.fire(new LanguageConfigurationServiceChangeEvent(undefined));
            }
            else {
                for (const languageId of localConfigChanged) {
                    if (this.languageService.isRegisteredLanguageId(languageId)) {
                        this.configurations.delete(languageId);
                        this.onDidChangeEmitter.fire(new LanguageConfigurationServiceChangeEvent(languageId));
                    }
                }
            }
        }));
        this._register(this._registry.onDidChange((e) => {
            this.configurations.delete(e.languageId);
            this.onDidChangeEmitter.fire(new LanguageConfigurationServiceChangeEvent(e.languageId));
        }));
    }
    register(languageId, configuration, priority) {
        return this._registry.register(languageId, configuration, priority);
    }
    getLanguageConfiguration(languageId) {
        let result = this.configurations.get(languageId);
        if (!result) {
            result = computeConfig(languageId, this._registry, this.configurationService, this.languageService);
            this.configurations.set(languageId, result);
        }
        return result;
    }
};
LanguageConfigurationService = __decorate([
    __param(0, configuration/* IConfigurationService */.pG),
    __param(1, language/* ILanguageService */.L)
], LanguageConfigurationService);

function computeConfig(languageId, registry, configurationService, languageService) {
    let languageConfig = registry.getLanguageConfiguration(languageId);
    if (!languageConfig) {
        if (!languageService.isRegisteredLanguageId(languageId)) {
            // this happens for the null language, which can be returned by monarch.
            // Instead of throwing an error, we just return a default config.
            return new ResolvedLanguageConfiguration(languageId, {});
        }
        languageConfig = new ResolvedLanguageConfiguration(languageId, {});
    }
    const customizedConfig = getCustomizedLanguageConfig(languageConfig.languageId, configurationService);
    const data = combineLanguageConfigurations([languageConfig.underlyingConfig, customizedConfig]);
    const config = new ResolvedLanguageConfiguration(languageConfig.languageId, data);
    return config;
}
const customizedLanguageConfigKeys = {
    brackets: 'editor.language.brackets',
    colorizedBracketPairs: 'editor.language.colorizedBracketPairs'
};
function getCustomizedLanguageConfig(languageId, configurationService) {
    const brackets = configurationService.getValue(customizedLanguageConfigKeys.brackets, {
        overrideIdentifier: languageId,
    });
    const colorizedBracketPairs = configurationService.getValue(customizedLanguageConfigKeys.colorizedBracketPairs, {
        overrideIdentifier: languageId,
    });
    return {
        brackets: validateBracketPairs(brackets),
        colorizedBracketPairs: validateBracketPairs(colorizedBracketPairs),
    };
}
function validateBracketPairs(data) {
    if (!Array.isArray(data)) {
        return undefined;
    }
    return data.map(pair => {
        if (!Array.isArray(pair) || pair.length !== 2) {
            return undefined;
        }
        return [pair[0], pair[1]];
    }).filter((p) => !!p);
}
function getIndentationAtPosition(model, lineNumber, column) {
    const lineText = model.getLineContent(lineNumber);
    let indentation = strings/* getLeadingWhitespace */.UU(lineText);
    if (indentation.length > column - 1) {
        indentation = indentation.substring(0, column - 1);
    }
    return indentation;
}
class ComposedLanguageConfiguration {
    constructor(languageId) {
        this.languageId = languageId;
        this._resolved = null;
        this._entries = [];
        this._order = 0;
        this._resolved = null;
    }
    register(configuration, priority) {
        const entry = new LanguageConfigurationContribution(configuration, priority, ++this._order);
        this._entries.push(entry);
        this._resolved = null;
        return (0,lifecycle/* toDisposable */.s)(() => {
            for (let i = 0; i < this._entries.length; i++) {
                if (this._entries[i] === entry) {
                    this._entries.splice(i, 1);
                    this._resolved = null;
                    break;
                }
            }
        });
    }
    getResolvedConfiguration() {
        if (!this._resolved) {
            const config = this._resolve();
            if (config) {
                this._resolved = new ResolvedLanguageConfiguration(this.languageId, config);
            }
        }
        return this._resolved;
    }
    _resolve() {
        if (this._entries.length === 0) {
            return null;
        }
        this._entries.sort(LanguageConfigurationContribution.cmp);
        return combineLanguageConfigurations(this._entries.map(e => e.configuration));
    }
}
function combineLanguageConfigurations(configs) {
    let result = {
        comments: undefined,
        brackets: undefined,
        wordPattern: undefined,
        indentationRules: undefined,
        onEnterRules: undefined,
        autoClosingPairs: undefined,
        surroundingPairs: undefined,
        autoCloseBefore: undefined,
        folding: undefined,
        colorizedBracketPairs: undefined,
        __electricCharacterSupport: undefined,
    };
    for (const entry of configs) {
        result = {
            comments: entry.comments || result.comments,
            brackets: entry.brackets || result.brackets,
            wordPattern: entry.wordPattern || result.wordPattern,
            indentationRules: entry.indentationRules || result.indentationRules,
            onEnterRules: entry.onEnterRules || result.onEnterRules,
            autoClosingPairs: entry.autoClosingPairs || result.autoClosingPairs,
            surroundingPairs: entry.surroundingPairs || result.surroundingPairs,
            autoCloseBefore: entry.autoCloseBefore || result.autoCloseBefore,
            folding: entry.folding || result.folding,
            colorizedBracketPairs: entry.colorizedBracketPairs || result.colorizedBracketPairs,
            __electricCharacterSupport: entry.__electricCharacterSupport || result.__electricCharacterSupport,
        };
    }
    return result;
}
class LanguageConfigurationContribution {
    constructor(configuration, priority, order) {
        this.configuration = configuration;
        this.priority = priority;
        this.order = order;
    }
    static cmp(a, b) {
        if (a.priority === b.priority) {
            // higher order last
            return a.order - b.order;
        }
        // higher priority last
        return a.priority - b.priority;
    }
}
class LanguageConfigurationChangeEvent {
    constructor(languageId) {
        this.languageId = languageId;
    }
}
class LanguageConfigurationRegistry extends lifecycle/* Disposable */.jG {
    constructor() {
        super();
        this._entries = new Map();
        this._onDidChange = this._register(new common_event/* Emitter */.vl());
        this.onDidChange = this._onDidChange.event;
        this._register(this.register(modesRegistry/* PLAINTEXT_LANGUAGE_ID */.vH, {
            brackets: [
                ['(', ')'],
                ['[', ']'],
                ['{', '}'],
            ],
            surroundingPairs: [
                { open: '{', close: '}' },
                { open: '[', close: ']' },
                { open: '(', close: ')' },
                { open: '<', close: '>' },
                { open: '\"', close: '\"' },
                { open: '\'', close: '\'' },
                { open: '`', close: '`' },
            ],
            colorizedBracketPairs: [],
            folding: {
                offSide: true
            }
        }, 0));
    }
    /**
     * @param priority Use a higher number for higher priority
     */
    register(languageId, configuration, priority = 0) {
        let entries = this._entries.get(languageId);
        if (!entries) {
            entries = new ComposedLanguageConfiguration(languageId);
            this._entries.set(languageId, entries);
        }
        const disposable = entries.register(configuration, priority);
        this._onDidChange.fire(new LanguageConfigurationChangeEvent(languageId));
        return (0,lifecycle/* toDisposable */.s)(() => {
            disposable.dispose();
            this._onDidChange.fire(new LanguageConfigurationChangeEvent(languageId));
        });
    }
    getLanguageConfiguration(languageId) {
        const entries = this._entries.get(languageId);
        return entries?.getResolvedConfiguration() || null;
    }
}
/**
 * Immutable.
*/
class ResolvedLanguageConfiguration {
    constructor(languageId, underlyingConfig) {
        this.languageId = languageId;
        this.underlyingConfig = underlyingConfig;
        this._brackets = null;
        this._electricCharacter = null;
        this._onEnterSupport =
            this.underlyingConfig.brackets ||
                this.underlyingConfig.indentationRules ||
                this.underlyingConfig.onEnterRules
                ? new OnEnterSupport(this.underlyingConfig)
                : null;
        this.comments = ResolvedLanguageConfiguration._handleComments(this.underlyingConfig);
        this.characterPair = new CharacterPairSupport(this.underlyingConfig);
        this.wordDefinition = this.underlyingConfig.wordPattern || wordHelper/* DEFAULT_WORD_REGEXP */.Ld;
        this.indentationRules = this.underlyingConfig.indentationRules;
        if (this.underlyingConfig.indentationRules) {
            this.indentRulesSupport = new IndentRulesSupport(this.underlyingConfig.indentationRules);
        }
        else {
            this.indentRulesSupport = null;
        }
        this.foldingRules = this.underlyingConfig.folding || {};
        this.bracketsNew = new LanguageBracketsConfiguration(languageId, this.underlyingConfig);
    }
    getWordDefinition() {
        return (0,wordHelper/* ensureValidWordDefinition */.Io)(this.wordDefinition);
    }
    get brackets() {
        if (!this._brackets && this.underlyingConfig.brackets) {
            this._brackets = new richEditBrackets/* RichEditBrackets */.az(this.languageId, this.underlyingConfig.brackets);
        }
        return this._brackets;
    }
    get electricCharacter() {
        if (!this._electricCharacter) {
            this._electricCharacter = new BracketElectricCharacterSupport(this.brackets);
        }
        return this._electricCharacter;
    }
    onEnter(autoIndent, previousLineText, beforeEnterText, afterEnterText) {
        if (!this._onEnterSupport) {
            return null;
        }
        return this._onEnterSupport.onEnter(autoIndent, previousLineText, beforeEnterText, afterEnterText);
    }
    getAutoClosingPairs() {
        return new languageConfiguration/* AutoClosingPairs */.GB(this.characterPair.getAutoClosingPairs());
    }
    getAutoCloseBeforeSet(forQuotes) {
        return this.characterPair.getAutoCloseBeforeSet(forQuotes);
    }
    getSurroundingPairs() {
        return this.characterPair.getSurroundingPairs();
    }
    static _handleComments(conf) {
        const commentRule = conf.comments;
        if (!commentRule) {
            return null;
        }
        // comment configuration
        const comments = {};
        if (commentRule.lineComment) {
            comments.lineCommentToken = commentRule.lineComment;
        }
        if (commentRule.blockComment) {
            const [blockStart, blockEnd] = commentRule.blockComment;
            comments.blockCommentStartToken = blockStart;
            comments.blockCommentEndToken = blockEnd;
        }
        return comments;
    }
}
(0,extensions/* registerSingleton */.v)(ILanguageConfigurationService, LanguageConfigurationService, 1 /* InstantiationType.Delayed */);


/***/ },

/***/ 52818
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   P: () => (/* binding */ GuidesTextModelPart),
/* harmony export */   k: () => (/* binding */ BracketPairGuidesClassNames)
/* harmony export */ });
/* harmony import */ var _base_common_arraysFind_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(97393);
/* harmony import */ var _base_common_strings_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(16844);
/* harmony import */ var _core_cursorColumns_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(62549);
/* harmony import */ var _core_range_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(28061);
/* harmony import */ var _textModelPart_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(32177);
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(50969);
/* harmony import */ var _textModelGuides_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(60779);
/* harmony import */ var _base_common_errors_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(94327);
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/








class GuidesTextModelPart extends _textModelPart_js__WEBPACK_IMPORTED_MODULE_4__/* .TextModelPart */ ._ {
    constructor(textModel, languageConfigurationService) {
        super();
        this.textModel = textModel;
        this.languageConfigurationService = languageConfigurationService;
    }
    getLanguageConfiguration(languageId) {
        return this.languageConfigurationService.getLanguageConfiguration(languageId);
    }
    _computeIndentLevel(lineIndex) {
        return (0,_utils_js__WEBPACK_IMPORTED_MODULE_5__/* .computeIndentLevel */ .G)(this.textModel.getLineContent(lineIndex + 1), this.textModel.getOptions().tabSize);
    }
    getActiveIndentGuide(lineNumber, minLineNumber, maxLineNumber) {
        this.assertNotDisposed();
        const lineCount = this.textModel.getLineCount();
        if (lineNumber < 1 || lineNumber > lineCount) {
            throw new _base_common_errors_js__WEBPACK_IMPORTED_MODULE_7__/* .BugIndicatingError */ .D7('Illegal value for lineNumber');
        }
        const foldingRules = this.getLanguageConfiguration(this.textModel.getLanguageId()).foldingRules;
        const offSide = Boolean(foldingRules && foldingRules.offSide);
        let up_aboveContentLineIndex = -2; /* -2 is a marker for not having computed it */
        let up_aboveContentLineIndent = -1;
        let up_belowContentLineIndex = -2; /* -2 is a marker for not having computed it */
        let up_belowContentLineIndent = -1;
        const up_resolveIndents = (lineNumber) => {
            if (up_aboveContentLineIndex !== -1 &&
                (up_aboveContentLineIndex === -2 ||
                    up_aboveContentLineIndex > lineNumber - 1)) {
                up_aboveContentLineIndex = -1;
                up_aboveContentLineIndent = -1;
                // must find previous line with content
                for (let lineIndex = lineNumber - 2; lineIndex >= 0; lineIndex--) {
                    const indent = this._computeIndentLevel(lineIndex);
                    if (indent >= 0) {
                        up_aboveContentLineIndex = lineIndex;
                        up_aboveContentLineIndent = indent;
                        break;
                    }
                }
            }
            if (up_belowContentLineIndex === -2) {
                up_belowContentLineIndex = -1;
                up_belowContentLineIndent = -1;
                // must find next line with content
                for (let lineIndex = lineNumber; lineIndex < lineCount; lineIndex++) {
                    const indent = this._computeIndentLevel(lineIndex);
                    if (indent >= 0) {
                        up_belowContentLineIndex = lineIndex;
                        up_belowContentLineIndent = indent;
                        break;
                    }
                }
            }
        };
        let down_aboveContentLineIndex = -2; /* -2 is a marker for not having computed it */
        let down_aboveContentLineIndent = -1;
        let down_belowContentLineIndex = -2; /* -2 is a marker for not having computed it */
        let down_belowContentLineIndent = -1;
        const down_resolveIndents = (lineNumber) => {
            if (down_aboveContentLineIndex === -2) {
                down_aboveContentLineIndex = -1;
                down_aboveContentLineIndent = -1;
                // must find previous line with content
                for (let lineIndex = lineNumber - 2; lineIndex >= 0; lineIndex--) {
                    const indent = this._computeIndentLevel(lineIndex);
                    if (indent >= 0) {
                        down_aboveContentLineIndex = lineIndex;
                        down_aboveContentLineIndent = indent;
                        break;
                    }
                }
            }
            if (down_belowContentLineIndex !== -1 &&
                (down_belowContentLineIndex === -2 ||
                    down_belowContentLineIndex < lineNumber - 1)) {
                down_belowContentLineIndex = -1;
                down_belowContentLineIndent = -1;
                // must find next line with content
                for (let lineIndex = lineNumber; lineIndex < lineCount; lineIndex++) {
                    const indent = this._computeIndentLevel(lineIndex);
                    if (indent >= 0) {
                        down_belowContentLineIndex = lineIndex;
                        down_belowContentLineIndent = indent;
                        break;
                    }
                }
            }
        };
        let startLineNumber = 0;
        let goUp = true;
        let endLineNumber = 0;
        let goDown = true;
        let indent = 0;
        let initialIndent = 0;
        for (let distance = 0; goUp || goDown; distance++) {
            const upLineNumber = lineNumber - distance;
            const downLineNumber = lineNumber + distance;
            if (distance > 1 && (upLineNumber < 1 || upLineNumber < minLineNumber)) {
                goUp = false;
            }
            if (distance > 1 &&
                (downLineNumber > lineCount || downLineNumber > maxLineNumber)) {
                goDown = false;
            }
            if (distance > 50000) {
                // stop processing
                goUp = false;
                goDown = false;
            }
            let upLineIndentLevel = -1;
            if (goUp && upLineNumber >= 1) {
                // compute indent level going up
                const currentIndent = this._computeIndentLevel(upLineNumber - 1);
                if (currentIndent >= 0) {
                    // This line has content (besides whitespace)
                    // Use the line's indent
                    up_belowContentLineIndex = upLineNumber - 1;
                    up_belowContentLineIndent = currentIndent;
                    upLineIndentLevel = Math.ceil(currentIndent / this.textModel.getOptions().indentSize);
                }
                else {
                    up_resolveIndents(upLineNumber);
                    upLineIndentLevel = this._getIndentLevelForWhitespaceLine(offSide, up_aboveContentLineIndent, up_belowContentLineIndent);
                }
            }
            let downLineIndentLevel = -1;
            if (goDown && downLineNumber <= lineCount) {
                // compute indent level going down
                const currentIndent = this._computeIndentLevel(downLineNumber - 1);
                if (currentIndent >= 0) {
                    // This line has content (besides whitespace)
                    // Use the line's indent
                    down_aboveContentLineIndex = downLineNumber - 1;
                    down_aboveContentLineIndent = currentIndent;
                    downLineIndentLevel = Math.ceil(currentIndent / this.textModel.getOptions().indentSize);
                }
                else {
                    down_resolveIndents(downLineNumber);
                    downLineIndentLevel = this._getIndentLevelForWhitespaceLine(offSide, down_aboveContentLineIndent, down_belowContentLineIndent);
                }
            }
            if (distance === 0) {
                initialIndent = upLineIndentLevel;
                continue;
            }
            if (distance === 1) {
                if (downLineNumber <= lineCount &&
                    downLineIndentLevel >= 0 &&
                    initialIndent + 1 === downLineIndentLevel) {
                    // This is the beginning of a scope, we have special handling here, since we want the
                    // child scope indent to be active, not the parent scope
                    goUp = false;
                    startLineNumber = downLineNumber;
                    endLineNumber = downLineNumber;
                    indent = downLineIndentLevel;
                    continue;
                }
                if (upLineNumber >= 1 &&
                    upLineIndentLevel >= 0 &&
                    upLineIndentLevel - 1 === initialIndent) {
                    // This is the end of a scope, just like above
                    goDown = false;
                    startLineNumber = upLineNumber;
                    endLineNumber = upLineNumber;
                    indent = upLineIndentLevel;
                    continue;
                }
                startLineNumber = lineNumber;
                endLineNumber = lineNumber;
                indent = initialIndent;
                if (indent === 0) {
                    // No need to continue
                    return { startLineNumber, endLineNumber, indent };
                }
            }
            if (goUp) {
                if (upLineIndentLevel >= indent) {
                    startLineNumber = upLineNumber;
                }
                else {
                    goUp = false;
                }
            }
            if (goDown) {
                if (downLineIndentLevel >= indent) {
                    endLineNumber = downLineNumber;
                }
                else {
                    goDown = false;
                }
            }
        }
        return { startLineNumber, endLineNumber, indent };
    }
    getLinesBracketGuides(startLineNumber, endLineNumber, activePosition, options) {
        const result = [];
        for (let lineNumber = startLineNumber; lineNumber <= endLineNumber; lineNumber++) {
            result.push([]);
        }
        // If requested, this could be made configurable.
        const includeSingleLinePairs = true;
        const bracketPairs = this.textModel.bracketPairs.getBracketPairsInRangeWithMinIndentation(new _core_range_js__WEBPACK_IMPORTED_MODULE_3__/* .Range */ .Q(startLineNumber, 1, endLineNumber, this.textModel.getLineMaxColumn(endLineNumber))).toArray();
        let activeBracketPairRange = undefined;
        if (activePosition && bracketPairs.length > 0) {
            const bracketsContainingActivePosition = (startLineNumber <= activePosition.lineNumber &&
                activePosition.lineNumber <= endLineNumber
                // We don't need to query the brackets again if the cursor is in the viewport
                ? bracketPairs
                : this.textModel.bracketPairs.getBracketPairsInRange(_core_range_js__WEBPACK_IMPORTED_MODULE_3__/* .Range */ .Q.fromPositions(activePosition)).toArray()).filter((bp) => _core_range_js__WEBPACK_IMPORTED_MODULE_3__/* .Range */ .Q.strictContainsPosition(bp.range, activePosition));
            activeBracketPairRange = (0,_base_common_arraysFind_js__WEBPACK_IMPORTED_MODULE_0__/* .findLast */ .Uk)(bracketsContainingActivePosition, (i) => includeSingleLinePairs || i.range.startLineNumber !== i.range.endLineNumber)?.range;
        }
        const independentColorPoolPerBracketType = this.textModel.getOptions().bracketPairColorizationOptions.independentColorPoolPerBracketType;
        const colorProvider = new BracketPairGuidesClassNames();
        for (const pair of bracketPairs) {
            /*


                    {
                    |
                    }

                    {
                    |
                    ----}

                ____{
                |test
                ----}

                renderHorizontalEndLineAtTheBottom:
                    {
                    |
                    |x}
                    --
                renderHorizontalEndLineAtTheBottom:
                ____{
                |test
                | x }
                ----
            */
            if (!pair.closingBracketRange) {
                continue;
            }
            const isActive = activeBracketPairRange && pair.range.equalsRange(activeBracketPairRange);
            if (!isActive && !options.includeInactive) {
                continue;
            }
            const className = colorProvider.getInlineClassName(pair.nestingLevel, pair.nestingLevelOfEqualBracketType, independentColorPoolPerBracketType) +
                (options.highlightActive && isActive
                    ? ' ' + colorProvider.activeClassName
                    : '');
            const start = pair.openingBracketRange.getStartPosition();
            const end = pair.closingBracketRange.getStartPosition();
            const horizontalGuides = options.horizontalGuides === _textModelGuides_js__WEBPACK_IMPORTED_MODULE_6__/* .HorizontalGuidesState */ .N6.Enabled || (options.horizontalGuides === _textModelGuides_js__WEBPACK_IMPORTED_MODULE_6__/* .HorizontalGuidesState */ .N6.EnabledForActive && isActive);
            if (pair.range.startLineNumber === pair.range.endLineNumber) {
                if (includeSingleLinePairs && horizontalGuides) {
                    result[pair.range.startLineNumber - startLineNumber].push(new _textModelGuides_js__WEBPACK_IMPORTED_MODULE_6__/* .IndentGuide */ .TH(-1, pair.openingBracketRange.getEndPosition().column, className, new _textModelGuides_js__WEBPACK_IMPORTED_MODULE_6__/* .IndentGuideHorizontalLine */ .pv(false, end.column), -1, -1));
                }
                continue;
            }
            const endVisibleColumn = this.getVisibleColumnFromPosition(end);
            const startVisibleColumn = this.getVisibleColumnFromPosition(pair.openingBracketRange.getStartPosition());
            const guideVisibleColumn = Math.min(startVisibleColumn, endVisibleColumn, pair.minVisibleColumnIndentation + 1);
            let renderHorizontalEndLineAtTheBottom = false;
            const firstNonWsIndex = _base_common_strings_js__WEBPACK_IMPORTED_MODULE_1__/* .firstNonWhitespaceIndex */ .HG(this.textModel.getLineContent(pair.closingBracketRange.startLineNumber));
            const hasTextBeforeClosingBracket = firstNonWsIndex < pair.closingBracketRange.startColumn - 1;
            if (hasTextBeforeClosingBracket) {
                renderHorizontalEndLineAtTheBottom = true;
            }
            const visibleGuideStartLineNumber = Math.max(start.lineNumber, startLineNumber);
            const visibleGuideEndLineNumber = Math.min(end.lineNumber, endLineNumber);
            const offset = renderHorizontalEndLineAtTheBottom ? 1 : 0;
            for (let l = visibleGuideStartLineNumber; l < visibleGuideEndLineNumber + offset; l++) {
                result[l - startLineNumber].push(new _textModelGuides_js__WEBPACK_IMPORTED_MODULE_6__/* .IndentGuide */ .TH(guideVisibleColumn, -1, className, null, l === start.lineNumber ? start.column : -1, l === end.lineNumber ? end.column : -1));
            }
            if (horizontalGuides) {
                if (start.lineNumber >= startLineNumber && startVisibleColumn > guideVisibleColumn) {
                    result[start.lineNumber - startLineNumber].push(new _textModelGuides_js__WEBPACK_IMPORTED_MODULE_6__/* .IndentGuide */ .TH(guideVisibleColumn, -1, className, new _textModelGuides_js__WEBPACK_IMPORTED_MODULE_6__/* .IndentGuideHorizontalLine */ .pv(false, start.column), -1, -1));
                }
                if (end.lineNumber <= endLineNumber && endVisibleColumn > guideVisibleColumn) {
                    result[end.lineNumber - startLineNumber].push(new _textModelGuides_js__WEBPACK_IMPORTED_MODULE_6__/* .IndentGuide */ .TH(guideVisibleColumn, -1, className, new _textModelGuides_js__WEBPACK_IMPORTED_MODULE_6__/* .IndentGuideHorizontalLine */ .pv(!renderHorizontalEndLineAtTheBottom, end.column), -1, -1));
                }
            }
        }
        for (const guides of result) {
            guides.sort((a, b) => a.visibleColumn - b.visibleColumn);
        }
        return result;
    }
    getVisibleColumnFromPosition(position) {
        return (_core_cursorColumns_js__WEBPACK_IMPORTED_MODULE_2__/* .CursorColumns */ .A.visibleColumnFromColumn(this.textModel.getLineContent(position.lineNumber), position.column, this.textModel.getOptions().tabSize) + 1);
    }
    getLinesIndentGuides(startLineNumber, endLineNumber) {
        this.assertNotDisposed();
        const lineCount = this.textModel.getLineCount();
        if (startLineNumber < 1 || startLineNumber > lineCount) {
            throw new Error('Illegal value for startLineNumber');
        }
        if (endLineNumber < 1 || endLineNumber > lineCount) {
            throw new Error('Illegal value for endLineNumber');
        }
        const options = this.textModel.getOptions();
        const foldingRules = this.getLanguageConfiguration(this.textModel.getLanguageId()).foldingRules;
        const offSide = Boolean(foldingRules && foldingRules.offSide);
        const result = new Array(endLineNumber - startLineNumber + 1);
        let aboveContentLineIndex = -2; /* -2 is a marker for not having computed it */
        let aboveContentLineIndent = -1;
        let belowContentLineIndex = -2; /* -2 is a marker for not having computed it */
        let belowContentLineIndent = -1;
        for (let lineNumber = startLineNumber; lineNumber <= endLineNumber; lineNumber++) {
            const resultIndex = lineNumber - startLineNumber;
            const currentIndent = this._computeIndentLevel(lineNumber - 1);
            if (currentIndent >= 0) {
                // This line has content (besides whitespace)
                // Use the line's indent
                aboveContentLineIndex = lineNumber - 1;
                aboveContentLineIndent = currentIndent;
                result[resultIndex] = Math.ceil(currentIndent / options.indentSize);
                continue;
            }
            if (aboveContentLineIndex === -2) {
                aboveContentLineIndex = -1;
                aboveContentLineIndent = -1;
                // must find previous line with content
                for (let lineIndex = lineNumber - 2; lineIndex >= 0; lineIndex--) {
                    const indent = this._computeIndentLevel(lineIndex);
                    if (indent >= 0) {
                        aboveContentLineIndex = lineIndex;
                        aboveContentLineIndent = indent;
                        break;
                    }
                }
            }
            if (belowContentLineIndex !== -1 &&
                (belowContentLineIndex === -2 || belowContentLineIndex < lineNumber - 1)) {
                belowContentLineIndex = -1;
                belowContentLineIndent = -1;
                // must find next line with content
                for (let lineIndex = lineNumber; lineIndex < lineCount; lineIndex++) {
                    const indent = this._computeIndentLevel(lineIndex);
                    if (indent >= 0) {
                        belowContentLineIndex = lineIndex;
                        belowContentLineIndent = indent;
                        break;
                    }
                }
            }
            result[resultIndex] = this._getIndentLevelForWhitespaceLine(offSide, aboveContentLineIndent, belowContentLineIndent);
        }
        return result;
    }
    _getIndentLevelForWhitespaceLine(offSide, aboveContentLineIndent, belowContentLineIndent) {
        const options = this.textModel.getOptions();
        if (aboveContentLineIndent === -1 || belowContentLineIndent === -1) {
            // At the top or bottom of the file
            return 0;
        }
        else if (aboveContentLineIndent < belowContentLineIndent) {
            // we are inside the region above
            return 1 + Math.floor(aboveContentLineIndent / options.indentSize);
        }
        else if (aboveContentLineIndent === belowContentLineIndent) {
            // we are in between two regions
            return Math.ceil(belowContentLineIndent / options.indentSize);
        }
        else {
            if (offSide) {
                // same level as region below
                return Math.ceil(belowContentLineIndent / options.indentSize);
            }
            else {
                // we are inside the region that ends below
                return 1 + Math.floor(belowContentLineIndent / options.indentSize);
            }
        }
    }
}
class BracketPairGuidesClassNames {
    constructor() {
        this.activeClassName = 'indent-active';
    }
    getInlineClassName(nestingLevel, nestingLevelOfEqualBracketType, independentColorPoolPerBracketType) {
        return this.getInlineClassNameOfLevel(independentColorPoolPerBracketType ? nestingLevelOfEqualBracketType : nestingLevel);
    }
    getInlineClassNameOfLevel(level) {
        // To support a dynamic amount of colors up to 6 colors,
        // we use a number that is a lcm of all numbers from 1 to 6.
        return `bracket-indent-guide lvl-${level % 30}`;
    }
}


/***/ },

/***/ 53720
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
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

/***/ 54296
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Th: () => (/* binding */ isEditStackElement),
/* harmony export */   z8: () => (/* binding */ EditStack)
/* harmony export */ });
/* unused harmony exports SingleModelEditStackData, SingleModelEditStackElement, MultiModelEditStackElement */
/* harmony import */ var _nls_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(19746);
/* harmony import */ var _base_common_errors_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(94327);
/* harmony import */ var _core_selection_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(93702);
/* harmony import */ var _base_common_uri_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(37264);
/* harmony import */ var _core_textChange_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(6949);
/* harmony import */ var _base_common_buffer_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(42802);
/* harmony import */ var _base_common_resources_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(22467);
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/







function uriGetComparisonKey(resource) {
    return resource.toString();
}
class SingleModelEditStackData {
    static create(model, beforeCursorState) {
        const alternativeVersionId = model.getAlternativeVersionId();
        const eol = getModelEOL(model);
        return new SingleModelEditStackData(alternativeVersionId, alternativeVersionId, eol, eol, beforeCursorState, beforeCursorState, []);
    }
    constructor(beforeVersionId, afterVersionId, beforeEOL, afterEOL, beforeCursorState, afterCursorState, changes) {
        this.beforeVersionId = beforeVersionId;
        this.afterVersionId = afterVersionId;
        this.beforeEOL = beforeEOL;
        this.afterEOL = afterEOL;
        this.beforeCursorState = beforeCursorState;
        this.afterCursorState = afterCursorState;
        this.changes = changes;
    }
    append(model, textChanges, afterEOL, afterVersionId, afterCursorState) {
        if (textChanges.length > 0) {
            this.changes = (0,_core_textChange_js__WEBPACK_IMPORTED_MODULE_4__/* .compressConsecutiveTextChanges */ .x)(this.changes, textChanges);
        }
        this.afterEOL = afterEOL;
        this.afterVersionId = afterVersionId;
        this.afterCursorState = afterCursorState;
    }
    static _writeSelectionsSize(selections) {
        return 4 + 4 * 4 * (selections ? selections.length : 0);
    }
    static _writeSelections(b, selections, offset) {
        _base_common_buffer_js__WEBPACK_IMPORTED_MODULE_5__/* .writeUInt32BE */ .Sw(b, (selections ? selections.length : 0), offset);
        offset += 4;
        if (selections) {
            for (const selection of selections) {
                _base_common_buffer_js__WEBPACK_IMPORTED_MODULE_5__/* .writeUInt32BE */ .Sw(b, selection.selectionStartLineNumber, offset);
                offset += 4;
                _base_common_buffer_js__WEBPACK_IMPORTED_MODULE_5__/* .writeUInt32BE */ .Sw(b, selection.selectionStartColumn, offset);
                offset += 4;
                _base_common_buffer_js__WEBPACK_IMPORTED_MODULE_5__/* .writeUInt32BE */ .Sw(b, selection.positionLineNumber, offset);
                offset += 4;
                _base_common_buffer_js__WEBPACK_IMPORTED_MODULE_5__/* .writeUInt32BE */ .Sw(b, selection.positionColumn, offset);
                offset += 4;
            }
        }
        return offset;
    }
    static _readSelections(b, offset, dest) {
        const count = _base_common_buffer_js__WEBPACK_IMPORTED_MODULE_5__/* .readUInt32BE */ .bb(b, offset);
        offset += 4;
        for (let i = 0; i < count; i++) {
            const selectionStartLineNumber = _base_common_buffer_js__WEBPACK_IMPORTED_MODULE_5__/* .readUInt32BE */ .bb(b, offset);
            offset += 4;
            const selectionStartColumn = _base_common_buffer_js__WEBPACK_IMPORTED_MODULE_5__/* .readUInt32BE */ .bb(b, offset);
            offset += 4;
            const positionLineNumber = _base_common_buffer_js__WEBPACK_IMPORTED_MODULE_5__/* .readUInt32BE */ .bb(b, offset);
            offset += 4;
            const positionColumn = _base_common_buffer_js__WEBPACK_IMPORTED_MODULE_5__/* .readUInt32BE */ .bb(b, offset);
            offset += 4;
            dest.push(new _core_selection_js__WEBPACK_IMPORTED_MODULE_2__/* .Selection */ .L(selectionStartLineNumber, selectionStartColumn, positionLineNumber, positionColumn));
        }
        return offset;
    }
    serialize() {
        let necessarySize = (+4 // beforeVersionId
            + 4 // afterVersionId
            + 1 // beforeEOL
            + 1 // afterEOL
            + SingleModelEditStackData._writeSelectionsSize(this.beforeCursorState)
            + SingleModelEditStackData._writeSelectionsSize(this.afterCursorState)
            + 4 // change count
        );
        for (const change of this.changes) {
            necessarySize += change.writeSize();
        }
        const b = new Uint8Array(necessarySize);
        let offset = 0;
        _base_common_buffer_js__WEBPACK_IMPORTED_MODULE_5__/* .writeUInt32BE */ .Sw(b, this.beforeVersionId, offset);
        offset += 4;
        _base_common_buffer_js__WEBPACK_IMPORTED_MODULE_5__/* .writeUInt32BE */ .Sw(b, this.afterVersionId, offset);
        offset += 4;
        _base_common_buffer_js__WEBPACK_IMPORTED_MODULE_5__/* .writeUInt8 */ .Gs(b, this.beforeEOL, offset);
        offset += 1;
        _base_common_buffer_js__WEBPACK_IMPORTED_MODULE_5__/* .writeUInt8 */ .Gs(b, this.afterEOL, offset);
        offset += 1;
        offset = SingleModelEditStackData._writeSelections(b, this.beforeCursorState, offset);
        offset = SingleModelEditStackData._writeSelections(b, this.afterCursorState, offset);
        _base_common_buffer_js__WEBPACK_IMPORTED_MODULE_5__/* .writeUInt32BE */ .Sw(b, this.changes.length, offset);
        offset += 4;
        for (const change of this.changes) {
            offset = change.write(b, offset);
        }
        return b.buffer;
    }
    static deserialize(source) {
        const b = new Uint8Array(source);
        let offset = 0;
        const beforeVersionId = _base_common_buffer_js__WEBPACK_IMPORTED_MODULE_5__/* .readUInt32BE */ .bb(b, offset);
        offset += 4;
        const afterVersionId = _base_common_buffer_js__WEBPACK_IMPORTED_MODULE_5__/* .readUInt32BE */ .bb(b, offset);
        offset += 4;
        const beforeEOL = _base_common_buffer_js__WEBPACK_IMPORTED_MODULE_5__/* .readUInt8 */ .pJ(b, offset);
        offset += 1;
        const afterEOL = _base_common_buffer_js__WEBPACK_IMPORTED_MODULE_5__/* .readUInt8 */ .pJ(b, offset);
        offset += 1;
        const beforeCursorState = [];
        offset = SingleModelEditStackData._readSelections(b, offset, beforeCursorState);
        const afterCursorState = [];
        offset = SingleModelEditStackData._readSelections(b, offset, afterCursorState);
        const changeCount = _base_common_buffer_js__WEBPACK_IMPORTED_MODULE_5__/* .readUInt32BE */ .bb(b, offset);
        offset += 4;
        const changes = [];
        for (let i = 0; i < changeCount; i++) {
            offset = _core_textChange_js__WEBPACK_IMPORTED_MODULE_4__/* .TextChange */ .k.read(b, offset, changes);
        }
        return new SingleModelEditStackData(beforeVersionId, afterVersionId, beforeEOL, afterEOL, beforeCursorState, afterCursorState, changes);
    }
}
class SingleModelEditStackElement {
    get type() {
        return 0 /* UndoRedoElementType.Resource */;
    }
    get resource() {
        if (_base_common_uri_js__WEBPACK_IMPORTED_MODULE_3__/* .URI */ .r.isUri(this.model)) {
            return this.model;
        }
        return this.model.uri;
    }
    constructor(label, code, model, beforeCursorState) {
        this.label = label;
        this.code = code;
        this.model = model;
        this._data = SingleModelEditStackData.create(model, beforeCursorState);
    }
    toString() {
        const data = (this._data instanceof SingleModelEditStackData ? this._data : SingleModelEditStackData.deserialize(this._data));
        return data.changes.map(change => change.toString()).join(', ');
    }
    matchesResource(resource) {
        const uri = (_base_common_uri_js__WEBPACK_IMPORTED_MODULE_3__/* .URI */ .r.isUri(this.model) ? this.model : this.model.uri);
        return (uri.toString() === resource.toString());
    }
    setModel(model) {
        this.model = model;
    }
    canAppend(model) {
        return (this.model === model && this._data instanceof SingleModelEditStackData);
    }
    append(model, textChanges, afterEOL, afterVersionId, afterCursorState) {
        if (this._data instanceof SingleModelEditStackData) {
            this._data.append(model, textChanges, afterEOL, afterVersionId, afterCursorState);
        }
    }
    close() {
        if (this._data instanceof SingleModelEditStackData) {
            this._data = this._data.serialize();
        }
    }
    open() {
        if (!(this._data instanceof SingleModelEditStackData)) {
            this._data = SingleModelEditStackData.deserialize(this._data);
        }
    }
    undo() {
        if (_base_common_uri_js__WEBPACK_IMPORTED_MODULE_3__/* .URI */ .r.isUri(this.model)) {
            // don't have a model
            throw new Error(`Invalid SingleModelEditStackElement`);
        }
        if (this._data instanceof SingleModelEditStackData) {
            this._data = this._data.serialize();
        }
        const data = SingleModelEditStackData.deserialize(this._data);
        this.model._applyUndo(data.changes, data.beforeEOL, data.beforeVersionId, data.beforeCursorState);
    }
    redo() {
        if (_base_common_uri_js__WEBPACK_IMPORTED_MODULE_3__/* .URI */ .r.isUri(this.model)) {
            // don't have a model
            throw new Error(`Invalid SingleModelEditStackElement`);
        }
        if (this._data instanceof SingleModelEditStackData) {
            this._data = this._data.serialize();
        }
        const data = SingleModelEditStackData.deserialize(this._data);
        this.model._applyRedo(data.changes, data.afterEOL, data.afterVersionId, data.afterCursorState);
    }
    heapSize() {
        if (this._data instanceof SingleModelEditStackData) {
            this._data = this._data.serialize();
        }
        return this._data.byteLength + 168 /*heap overhead*/;
    }
}
class MultiModelEditStackElement {
    get resources() {
        return this._editStackElementsArr.map(editStackElement => editStackElement.resource);
    }
    constructor(label, code, editStackElements) {
        this.label = label;
        this.code = code;
        this.type = 1 /* UndoRedoElementType.Workspace */;
        this._isOpen = true;
        this._editStackElementsArr = editStackElements.slice(0);
        this._editStackElementsMap = new Map();
        for (const editStackElement of this._editStackElementsArr) {
            const key = uriGetComparisonKey(editStackElement.resource);
            this._editStackElementsMap.set(key, editStackElement);
        }
        this._delegate = null;
    }
    prepareUndoRedo() {
        if (this._delegate) {
            return this._delegate.prepareUndoRedo(this);
        }
    }
    matchesResource(resource) {
        const key = uriGetComparisonKey(resource);
        return (this._editStackElementsMap.has(key));
    }
    setModel(model) {
        const key = uriGetComparisonKey(_base_common_uri_js__WEBPACK_IMPORTED_MODULE_3__/* .URI */ .r.isUri(model) ? model : model.uri);
        if (this._editStackElementsMap.has(key)) {
            this._editStackElementsMap.get(key).setModel(model);
        }
    }
    canAppend(model) {
        if (!this._isOpen) {
            return false;
        }
        const key = uriGetComparisonKey(model.uri);
        if (this._editStackElementsMap.has(key)) {
            const editStackElement = this._editStackElementsMap.get(key);
            return editStackElement.canAppend(model);
        }
        return false;
    }
    append(model, textChanges, afterEOL, afterVersionId, afterCursorState) {
        const key = uriGetComparisonKey(model.uri);
        const editStackElement = this._editStackElementsMap.get(key);
        editStackElement.append(model, textChanges, afterEOL, afterVersionId, afterCursorState);
    }
    close() {
        this._isOpen = false;
    }
    open() {
        // cannot reopen
    }
    undo() {
        this._isOpen = false;
        for (const editStackElement of this._editStackElementsArr) {
            editStackElement.undo();
        }
    }
    redo() {
        for (const editStackElement of this._editStackElementsArr) {
            editStackElement.redo();
        }
    }
    heapSize(resource) {
        const key = uriGetComparisonKey(resource);
        if (this._editStackElementsMap.has(key)) {
            const editStackElement = this._editStackElementsMap.get(key);
            return editStackElement.heapSize();
        }
        return 0;
    }
    split() {
        return this._editStackElementsArr;
    }
    toString() {
        const result = [];
        for (const editStackElement of this._editStackElementsArr) {
            result.push(`${(0,_base_common_resources_js__WEBPACK_IMPORTED_MODULE_6__/* .basename */ .P8)(editStackElement.resource)}: ${editStackElement}`);
        }
        return `{${result.join(', ')}}`;
    }
}
function getModelEOL(model) {
    const eol = model.getEOL();
    if (eol === '\n') {
        return 0 /* EndOfLineSequence.LF */;
    }
    else {
        return 1 /* EndOfLineSequence.CRLF */;
    }
}
function isEditStackElement(element) {
    if (!element) {
        return false;
    }
    return ((element instanceof SingleModelEditStackElement) || (element instanceof MultiModelEditStackElement));
}
class EditStack {
    constructor(model, undoRedoService) {
        this._model = model;
        this._undoRedoService = undoRedoService;
    }
    pushStackElement() {
        const lastElement = this._undoRedoService.getLastElement(this._model.uri);
        if (isEditStackElement(lastElement)) {
            lastElement.close();
        }
    }
    popStackElement() {
        const lastElement = this._undoRedoService.getLastElement(this._model.uri);
        if (isEditStackElement(lastElement)) {
            lastElement.open();
        }
    }
    clear() {
        this._undoRedoService.removeElements(this._model.uri);
    }
    _getOrCreateEditStackElement(beforeCursorState, group) {
        const lastElement = this._undoRedoService.getLastElement(this._model.uri);
        if (isEditStackElement(lastElement) && lastElement.canAppend(this._model)) {
            return lastElement;
        }
        const newElement = new SingleModelEditStackElement(_nls_js__WEBPACK_IMPORTED_MODULE_0__/* .localize */ .kg('edit', "Typing"), 'undoredo.textBufferEdit', this._model, beforeCursorState);
        this._undoRedoService.pushElement(newElement, group);
        return newElement;
    }
    pushEOL(eol) {
        const editStackElement = this._getOrCreateEditStackElement(null, undefined);
        this._model.setEOL(eol);
        editStackElement.append(this._model, [], getModelEOL(this._model), this._model.getAlternativeVersionId(), null);
    }
    pushEditOperation(beforeCursorState, editOperations, cursorStateComputer, group) {
        const editStackElement = this._getOrCreateEditStackElement(beforeCursorState, group);
        const inverseEditOperations = this._model.applyEdits(editOperations, true);
        const afterCursorState = EditStack._computeCursorState(cursorStateComputer, inverseEditOperations);
        const textChanges = inverseEditOperations.map((op, index) => ({ index: index, textChange: op.textChange }));
        textChanges.sort((a, b) => {
            if (a.textChange.oldPosition === b.textChange.oldPosition) {
                return a.index - b.index;
            }
            return a.textChange.oldPosition - b.textChange.oldPosition;
        });
        editStackElement.append(this._model, textChanges.map(op => op.textChange), getModelEOL(this._model), this._model.getAlternativeVersionId(), afterCursorState);
        return afterCursorState;
    }
    static _computeCursorState(cursorStateComputer, inverseEditOperations) {
        try {
            return cursorStateComputer ? cursorStateComputer(inverseEditOperations) : null;
        }
        catch (e) {
            (0,_base_common_errors_js__WEBPACK_IMPORTED_MODULE_1__/* .onUnexpectedError */ .dz)(e);
            return null;
        }
    }
}


/***/ },

/***/ 54324
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Su: () => (/* binding */ decodeUTF16LE),
/* harmony export */   b7: () => (/* binding */ getPlatformTextDecoder),
/* harmony export */   fe: () => (/* binding */ StringBuilder)
/* harmony export */ });
/* harmony import */ var _base_common_strings_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(16844);
/* harmony import */ var _base_common_platform_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(63339);
/* harmony import */ var _base_common_buffer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(42802);
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/



let _utf16LE_TextDecoder;
function getUTF16LE_TextDecoder() {
    if (!_utf16LE_TextDecoder) {
        _utf16LE_TextDecoder = new TextDecoder('UTF-16LE');
    }
    return _utf16LE_TextDecoder;
}
let _utf16BE_TextDecoder;
function getUTF16BE_TextDecoder() {
    if (!_utf16BE_TextDecoder) {
        _utf16BE_TextDecoder = new TextDecoder('UTF-16BE');
    }
    return _utf16BE_TextDecoder;
}
let _platformTextDecoder;
function getPlatformTextDecoder() {
    if (!_platformTextDecoder) {
        _platformTextDecoder = _base_common_platform_js__WEBPACK_IMPORTED_MODULE_1__/* .isLittleEndian */ .cm() ? getUTF16LE_TextDecoder() : getUTF16BE_TextDecoder();
    }
    return _platformTextDecoder;
}
function decodeUTF16LE(source, offset, len) {
    const view = new Uint16Array(source.buffer, offset, len);
    if (len > 0 && (view[0] === 0xFEFF || view[0] === 0xFFFE)) {
        // UTF16 sometimes starts with a BOM https://de.wikipedia.org/wiki/Byte_Order_Mark
        // It looks like TextDecoder.decode will eat up a leading BOM (0xFEFF or 0xFFFE)
        // We don't want that behavior because we know the string is UTF16LE and the BOM should be maintained
        // So we use the manual decoder
        return compatDecodeUTF16LE(source, offset, len);
    }
    return getUTF16LE_TextDecoder().decode(view);
}
function compatDecodeUTF16LE(source, offset, len) {
    const result = [];
    let resultLen = 0;
    for (let i = 0; i < len; i++) {
        const charCode = _base_common_buffer_js__WEBPACK_IMPORTED_MODULE_2__/* .readUInt16LE */ .$l(source, offset);
        offset += 2;
        result[resultLen++] = String.fromCharCode(charCode);
    }
    return result.join('');
}
class StringBuilder {
    constructor(capacity) {
        this._capacity = capacity | 0;
        this._buffer = new Uint16Array(this._capacity);
        this._completedStrings = null;
        this._bufferLength = 0;
    }
    reset() {
        this._completedStrings = null;
        this._bufferLength = 0;
    }
    build() {
        if (this._completedStrings !== null) {
            this._flushBuffer();
            return this._completedStrings.join('');
        }
        return this._buildBuffer();
    }
    _buildBuffer() {
        if (this._bufferLength === 0) {
            return '';
        }
        const view = new Uint16Array(this._buffer.buffer, 0, this._bufferLength);
        return getPlatformTextDecoder().decode(view);
    }
    _flushBuffer() {
        const bufferString = this._buildBuffer();
        this._bufferLength = 0;
        if (this._completedStrings === null) {
            this._completedStrings = [bufferString];
        }
        else {
            this._completedStrings[this._completedStrings.length] = bufferString;
        }
    }
    /**
     * Append a char code (<2^16)
     */
    appendCharCode(charCode) {
        const remainingSpace = this._capacity - this._bufferLength;
        if (remainingSpace <= 1) {
            if (remainingSpace === 0 || _base_common_strings_js__WEBPACK_IMPORTED_MODULE_0__/* .isHighSurrogate */ .pc(charCode)) {
                this._flushBuffer();
            }
        }
        this._buffer[this._bufferLength++] = charCode;
    }
    /**
     * Append an ASCII char code (<2^8)
     */
    appendASCIICharCode(charCode) {
        if (this._bufferLength === this._capacity) {
            // buffer is full
            this._flushBuffer();
        }
        this._buffer[this._bufferLength++] = charCode;
    }
    appendString(str) {
        const strLen = str.length;
        if (this._bufferLength + strLen >= this._capacity) {
            // This string does not fit in the remaining buffer space
            this._flushBuffer();
            this._completedStrings[this._completedStrings.length] = str;
            return;
        }
        for (let i = 0; i < strLen; i++) {
            this._buffer[this._bufferLength++] = str.charCodeAt(i);
        }
    }
}


/***/ },

/***/ 54957
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
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

/***/ 57445
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   T: () => (/* binding */ getStandardTokenTypeAtPosition),
/* harmony export */   f: () => (/* binding */ LineTokens)
/* harmony export */ });
/* harmony import */ var _encodedTokenAttributes_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15910);
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

class LineTokens {
    static { this.defaultTokenMetadata = ((0 /* FontStyle.None */ << 11 /* MetadataConsts.FONT_STYLE_OFFSET */)
        | (1 /* ColorId.DefaultForeground */ << 15 /* MetadataConsts.FOREGROUND_OFFSET */)
        | (2 /* ColorId.DefaultBackground */ << 24 /* MetadataConsts.BACKGROUND_OFFSET */)) >>> 0; }
    static createEmpty(lineContent, decoder) {
        const defaultMetadata = LineTokens.defaultTokenMetadata;
        const tokens = new Uint32Array(2);
        tokens[0] = lineContent.length;
        tokens[1] = defaultMetadata;
        return new LineTokens(tokens, lineContent, decoder);
    }
    static createFromTextAndMetadata(data, decoder) {
        let offset = 0;
        let fullText = '';
        const tokens = new Array();
        for (const { text, metadata } of data) {
            tokens.push(offset + text.length, metadata);
            offset += text.length;
            fullText += text;
        }
        return new LineTokens(new Uint32Array(tokens), fullText, decoder);
    }
    constructor(tokens, text, decoder) {
        this._lineTokensBrand = undefined;
        this._tokens = tokens;
        this._tokensCount = (this._tokens.length >>> 1);
        this._text = text;
        this.languageIdCodec = decoder;
    }
    equals(other) {
        if (other instanceof LineTokens) {
            return this.slicedEquals(other, 0, this._tokensCount);
        }
        return false;
    }
    slicedEquals(other, sliceFromTokenIndex, sliceTokenCount) {
        if (this._text !== other._text) {
            return false;
        }
        if (this._tokensCount !== other._tokensCount) {
            return false;
        }
        const from = (sliceFromTokenIndex << 1);
        const to = from + (sliceTokenCount << 1);
        for (let i = from; i < to; i++) {
            if (this._tokens[i] !== other._tokens[i]) {
                return false;
            }
        }
        return true;
    }
    getLineContent() {
        return this._text;
    }
    getCount() {
        return this._tokensCount;
    }
    getStartOffset(tokenIndex) {
        if (tokenIndex > 0) {
            return this._tokens[(tokenIndex - 1) << 1];
        }
        return 0;
    }
    getMetadata(tokenIndex) {
        const metadata = this._tokens[(tokenIndex << 1) + 1];
        return metadata;
    }
    getLanguageId(tokenIndex) {
        const metadata = this._tokens[(tokenIndex << 1) + 1];
        const languageId = _encodedTokenAttributes_js__WEBPACK_IMPORTED_MODULE_0__/* .TokenMetadata */ .x.getLanguageId(metadata);
        return this.languageIdCodec.decodeLanguageId(languageId);
    }
    getStandardTokenType(tokenIndex) {
        const metadata = this._tokens[(tokenIndex << 1) + 1];
        return _encodedTokenAttributes_js__WEBPACK_IMPORTED_MODULE_0__/* .TokenMetadata */ .x.getTokenType(metadata);
    }
    getForeground(tokenIndex) {
        const metadata = this._tokens[(tokenIndex << 1) + 1];
        return _encodedTokenAttributes_js__WEBPACK_IMPORTED_MODULE_0__/* .TokenMetadata */ .x.getForeground(metadata);
    }
    getClassName(tokenIndex) {
        const metadata = this._tokens[(tokenIndex << 1) + 1];
        return _encodedTokenAttributes_js__WEBPACK_IMPORTED_MODULE_0__/* .TokenMetadata */ .x.getClassNameFromMetadata(metadata);
    }
    getInlineStyle(tokenIndex, colorMap) {
        const metadata = this._tokens[(tokenIndex << 1) + 1];
        return _encodedTokenAttributes_js__WEBPACK_IMPORTED_MODULE_0__/* .TokenMetadata */ .x.getInlineStyleFromMetadata(metadata, colorMap);
    }
    getPresentation(tokenIndex) {
        const metadata = this._tokens[(tokenIndex << 1) + 1];
        return _encodedTokenAttributes_js__WEBPACK_IMPORTED_MODULE_0__/* .TokenMetadata */ .x.getPresentationFromMetadata(metadata);
    }
    getEndOffset(tokenIndex) {
        return this._tokens[tokenIndex << 1];
    }
    /**
     * Find the token containing offset `offset`.
     * @param offset The search offset
     * @return The index of the token containing the offset.
     */
    findTokenIndexAtOffset(offset) {
        return LineTokens.findIndexInTokensArray(this._tokens, offset);
    }
    inflate() {
        return this;
    }
    sliceAndInflate(startOffset, endOffset, deltaOffset) {
        return new SliceLineTokens(this, startOffset, endOffset, deltaOffset);
    }
    static convertToEndOffset(tokens, lineTextLength) {
        const tokenCount = (tokens.length >>> 1);
        const lastTokenIndex = tokenCount - 1;
        for (let tokenIndex = 0; tokenIndex < lastTokenIndex; tokenIndex++) {
            tokens[tokenIndex << 1] = tokens[(tokenIndex + 1) << 1];
        }
        tokens[lastTokenIndex << 1] = lineTextLength;
    }
    static findIndexInTokensArray(tokens, desiredIndex) {
        if (tokens.length <= 2) {
            return 0;
        }
        let low = 0;
        let high = (tokens.length >>> 1) - 1;
        while (low < high) {
            const mid = low + Math.floor((high - low) / 2);
            const endOffset = tokens[(mid << 1)];
            if (endOffset === desiredIndex) {
                return mid + 1;
            }
            else if (endOffset < desiredIndex) {
                low = mid + 1;
            }
            else if (endOffset > desiredIndex) {
                high = mid;
            }
        }
        return low;
    }
    /**
     * @pure
     * @param insertTokens Must be sorted by offset.
    */
    withInserted(insertTokens) {
        if (insertTokens.length === 0) {
            return this;
        }
        let nextOriginalTokenIdx = 0;
        let nextInsertTokenIdx = 0;
        let text = '';
        const newTokens = new Array();
        let originalEndOffset = 0;
        while (true) {
            const nextOriginalTokenEndOffset = nextOriginalTokenIdx < this._tokensCount ? this._tokens[nextOriginalTokenIdx << 1] : -1;
            const nextInsertToken = nextInsertTokenIdx < insertTokens.length ? insertTokens[nextInsertTokenIdx] : null;
            if (nextOriginalTokenEndOffset !== -1 && (nextInsertToken === null || nextOriginalTokenEndOffset <= nextInsertToken.offset)) {
                // original token ends before next insert token
                text += this._text.substring(originalEndOffset, nextOriginalTokenEndOffset);
                const metadata = this._tokens[(nextOriginalTokenIdx << 1) + 1];
                newTokens.push(text.length, metadata);
                nextOriginalTokenIdx++;
                originalEndOffset = nextOriginalTokenEndOffset;
            }
            else if (nextInsertToken) {
                if (nextInsertToken.offset > originalEndOffset) {
                    // insert token is in the middle of the next token.
                    text += this._text.substring(originalEndOffset, nextInsertToken.offset);
                    const metadata = this._tokens[(nextOriginalTokenIdx << 1) + 1];
                    newTokens.push(text.length, metadata);
                    originalEndOffset = nextInsertToken.offset;
                }
                text += nextInsertToken.text;
                newTokens.push(text.length, nextInsertToken.tokenMetadata);
                nextInsertTokenIdx++;
            }
            else {
                break;
            }
        }
        return new LineTokens(new Uint32Array(newTokens), text, this.languageIdCodec);
    }
    getTokenText(tokenIndex) {
        const startOffset = this.getStartOffset(tokenIndex);
        const endOffset = this.getEndOffset(tokenIndex);
        const text = this._text.substring(startOffset, endOffset);
        return text;
    }
    forEach(callback) {
        const tokenCount = this.getCount();
        for (let tokenIndex = 0; tokenIndex < tokenCount; tokenIndex++) {
            callback(tokenIndex);
        }
    }
}
class SliceLineTokens {
    constructor(source, startOffset, endOffset, deltaOffset) {
        this._source = source;
        this._startOffset = startOffset;
        this._endOffset = endOffset;
        this._deltaOffset = deltaOffset;
        this._firstTokenIndex = source.findTokenIndexAtOffset(startOffset);
        this.languageIdCodec = source.languageIdCodec;
        this._tokensCount = 0;
        for (let i = this._firstTokenIndex, len = source.getCount(); i < len; i++) {
            const tokenStartOffset = source.getStartOffset(i);
            if (tokenStartOffset >= endOffset) {
                break;
            }
            this._tokensCount++;
        }
    }
    getMetadata(tokenIndex) {
        return this._source.getMetadata(this._firstTokenIndex + tokenIndex);
    }
    getLanguageId(tokenIndex) {
        return this._source.getLanguageId(this._firstTokenIndex + tokenIndex);
    }
    getLineContent() {
        return this._source.getLineContent().substring(this._startOffset, this._endOffset);
    }
    equals(other) {
        if (other instanceof SliceLineTokens) {
            return (this._startOffset === other._startOffset
                && this._endOffset === other._endOffset
                && this._deltaOffset === other._deltaOffset
                && this._source.slicedEquals(other._source, this._firstTokenIndex, this._tokensCount));
        }
        return false;
    }
    getCount() {
        return this._tokensCount;
    }
    getStandardTokenType(tokenIndex) {
        return this._source.getStandardTokenType(this._firstTokenIndex + tokenIndex);
    }
    getForeground(tokenIndex) {
        return this._source.getForeground(this._firstTokenIndex + tokenIndex);
    }
    getEndOffset(tokenIndex) {
        const tokenEndOffset = this._source.getEndOffset(this._firstTokenIndex + tokenIndex);
        return Math.min(this._endOffset, tokenEndOffset) - this._startOffset + this._deltaOffset;
    }
    getClassName(tokenIndex) {
        return this._source.getClassName(this._firstTokenIndex + tokenIndex);
    }
    getInlineStyle(tokenIndex, colorMap) {
        return this._source.getInlineStyle(this._firstTokenIndex + tokenIndex, colorMap);
    }
    getPresentation(tokenIndex) {
        return this._source.getPresentation(this._firstTokenIndex + tokenIndex);
    }
    findTokenIndexAtOffset(offset) {
        return this._source.findTokenIndexAtOffset(offset + this._startOffset - this._deltaOffset) - this._firstTokenIndex;
    }
    getTokenText(tokenIndex) {
        const adjustedTokenIndex = this._firstTokenIndex + tokenIndex;
        const tokenStartOffset = this._source.getStartOffset(adjustedTokenIndex);
        const tokenEndOffset = this._source.getEndOffset(adjustedTokenIndex);
        let text = this._source.getTokenText(adjustedTokenIndex);
        if (tokenStartOffset < this._startOffset) {
            text = text.substring(this._startOffset - tokenStartOffset);
        }
        if (tokenEndOffset > this._endOffset) {
            text = text.substring(0, text.length - (tokenEndOffset - this._endOffset));
        }
        return text;
    }
    forEach(callback) {
        for (let tokenIndex = 0; tokenIndex < this.getCount(); tokenIndex++) {
            callback(tokenIndex);
        }
    }
}
function getStandardTokenTypeAtPosition(model, position) {
    const lineNumber = position.lineNumber;
    if (!model.tokenization.isCheapToTokenize(lineNumber)) {
        return undefined;
    }
    model.tokenization.forceTokenization(lineNumber);
    const lineTokens = model.tokenization.getLineTokens(lineNumber);
    const tokenIndex = lineTokens.findTokenIndexAtOffset(position.column - 1);
    const tokenType = lineTokens.getStandardTokenType(tokenIndex);
    return tokenType;
}


/***/ },

/***/ 57999
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   P: () => (/* binding */ normalizeIndentation)
/* harmony export */ });
/* harmony import */ var _base_common_strings_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(16844);
/* harmony import */ var _cursorColumns_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(62549);
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/


function _normalizeIndentationFromWhitespace(str, indentSize, insertSpaces) {
    let spacesCnt = 0;
    for (let i = 0; i < str.length; i++) {
        if (str.charAt(i) === '\t') {
            spacesCnt = _cursorColumns_js__WEBPACK_IMPORTED_MODULE_1__/* .CursorColumns */ .A.nextIndentTabStop(spacesCnt, indentSize);
        }
        else {
            spacesCnt++;
        }
    }
    let result = '';
    if (!insertSpaces) {
        const tabsCnt = Math.floor(spacesCnt / indentSize);
        spacesCnt = spacesCnt % indentSize;
        for (let i = 0; i < tabsCnt; i++) {
            result += '\t';
        }
    }
    for (let i = 0; i < spacesCnt; i++) {
        result += ' ';
    }
    return result;
}
function normalizeIndentation(str, indentSize, insertSpaces) {
    let firstNonWhitespaceIndex = _base_common_strings_js__WEBPACK_IMPORTED_MODULE_0__/* .firstNonWhitespaceIndex */ .HG(str);
    if (firstNonWhitespaceIndex === -1) {
        firstNonWhitespaceIndex = str.length;
    }
    return _normalizeIndentationFromWhitespace(str.substring(0, firstNonWhitespaceIndex), indentSize, insertSpaces) + str.substring(firstNonWhitespaceIndex);
}


/***/ },

/***/ 60756
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FD: () => (/* binding */ identityKeyProvider),
/* harmony export */   Mg: () => (/* binding */ DenseKeyProvider),
/* harmony export */   gV: () => (/* binding */ SmallImmutableSet)
/* harmony export */ });
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
const emptyArr = [];
/**
 * Represents an immutable set that works best for a small number of elements (less than 32).
 * It uses bits to encode element membership efficiently.
*/
class SmallImmutableSet {
    static { this.cache = new Array(129); }
    static create(items, additionalItems) {
        if (items <= 128 && additionalItems.length === 0) {
            // We create a cache of 128=2^7 elements to cover all sets with up to 7 (dense) elements.
            let cached = SmallImmutableSet.cache[items];
            if (!cached) {
                cached = new SmallImmutableSet(items, additionalItems);
                SmallImmutableSet.cache[items] = cached;
            }
            return cached;
        }
        return new SmallImmutableSet(items, additionalItems);
    }
    static { this.empty = SmallImmutableSet.create(0, emptyArr); }
    static getEmpty() {
        return this.empty;
    }
    constructor(items, additionalItems) {
        this.items = items;
        this.additionalItems = additionalItems;
    }
    add(value, keyProvider) {
        const key = keyProvider.getKey(value);
        let idx = key >> 5; // divided by 32
        if (idx === 0) {
            // fast path
            const newItem = (1 << key) | this.items;
            if (newItem === this.items) {
                return this;
            }
            return SmallImmutableSet.create(newItem, this.additionalItems);
        }
        idx--;
        const newItems = this.additionalItems.slice(0);
        while (newItems.length < idx) {
            newItems.push(0);
        }
        newItems[idx] |= 1 << (key & 31);
        return SmallImmutableSet.create(this.items, newItems);
    }
    merge(other) {
        const merged = this.items | other.items;
        if (this.additionalItems === emptyArr && other.additionalItems === emptyArr) {
            // fast path
            if (merged === this.items) {
                return this;
            }
            if (merged === other.items) {
                return other;
            }
            return SmallImmutableSet.create(merged, emptyArr);
        }
        // This can be optimized, but it's not a common case
        const newItems = [];
        for (let i = 0; i < Math.max(this.additionalItems.length, other.additionalItems.length); i++) {
            const item1 = this.additionalItems[i] || 0;
            const item2 = other.additionalItems[i] || 0;
            newItems.push(item1 | item2);
        }
        return SmallImmutableSet.create(merged, newItems);
    }
    intersects(other) {
        if ((this.items & other.items) !== 0) {
            return true;
        }
        for (let i = 0; i < Math.min(this.additionalItems.length, other.additionalItems.length); i++) {
            if ((this.additionalItems[i] & other.additionalItems[i]) !== 0) {
                return true;
            }
        }
        return false;
    }
}
const identityKeyProvider = {
    getKey(value) {
        return value;
    }
};
/**
 * Assigns values a unique incrementing key.
*/
class DenseKeyProvider {
    constructor() {
        this.items = new Map();
    }
    getKey(value) {
        let existing = this.items.get(value);
        if (existing === undefined) {
            existing = this.items.size;
            this.items.set(value, existing);
        }
        return existing;
    }
}


/***/ },

/***/ 60779
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   N6: () => (/* binding */ HorizontalGuidesState),
/* harmony export */   TH: () => (/* binding */ IndentGuide),
/* harmony export */   pv: () => (/* binding */ IndentGuideHorizontalLine)
/* harmony export */ });
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var HorizontalGuidesState;
(function (HorizontalGuidesState) {
    HorizontalGuidesState[HorizontalGuidesState["Disabled"] = 0] = "Disabled";
    HorizontalGuidesState[HorizontalGuidesState["EnabledForActive"] = 1] = "EnabledForActive";
    HorizontalGuidesState[HorizontalGuidesState["Enabled"] = 2] = "Enabled";
})(HorizontalGuidesState || (HorizontalGuidesState = {}));
class IndentGuide {
    constructor(visibleColumn, column, className, 
    /**
     * If set, this indent guide is a horizontal guide (no vertical part).
     * It starts at visibleColumn and continues until endColumn.
    */
    horizontalLine, 
    /**
     * If set (!= -1), only show this guide for wrapped lines that don't contain this model column, but are after it.
    */
    forWrappedLinesAfterColumn, forWrappedLinesBeforeOrAtColumn) {
        this.visibleColumn = visibleColumn;
        this.column = column;
        this.className = className;
        this.horizontalLine = horizontalLine;
        this.forWrappedLinesAfterColumn = forWrappedLinesAfterColumn;
        this.forWrappedLinesBeforeOrAtColumn = forWrappedLinesBeforeOrAtColumn;
        if ((visibleColumn !== -1) === (column !== -1)) {
            throw new Error();
        }
    }
}
class IndentGuideHorizontalLine {
    constructor(top, endColumn) {
        this.top = top;
        this.endColumn = endColumn;
    }
}


/***/ },

/***/ 62549
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ CursorColumns)
/* harmony export */ });
/* harmony import */ var _base_common_strings_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(16844);
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * A column in a position is the gap between two adjacent characters. The methods here
 * work with a concept called "visible column". A visible column is a very rough approximation
 * of the horizontal screen position of a column. For example, using a tab size of 4:
 * ```txt
 * |<TAB>|<TAB>|T|ext
 * |     |     | \---- column = 4, visible column = 9
 * |     |     \------ column = 3, visible column = 8
 * |     \------------ column = 2, visible column = 4
 * \------------------ column = 1, visible column = 0
 * ```
 *
 * **NOTE**: Visual columns do not work well for RTL text or variable-width fonts or characters.
 *
 * **NOTE**: These methods work and make sense both on the model and on the view model.
 */
class CursorColumns {
    static _nextVisibleColumn(codePoint, visibleColumn, tabSize) {
        if (codePoint === 9 /* CharCode.Tab */) {
            return CursorColumns.nextRenderTabStop(visibleColumn, tabSize);
        }
        if (_base_common_strings_js__WEBPACK_IMPORTED_MODULE_0__/* .isFullWidthCharacter */ .ne(codePoint) || _base_common_strings_js__WEBPACK_IMPORTED_MODULE_0__/* .isEmojiImprecise */ .Ss(codePoint)) {
            return visibleColumn + 2;
        }
        return visibleColumn + 1;
    }
    /**
     * Returns a visible column from a column.
     * @see {@link CursorColumns}
     */
    static visibleColumnFromColumn(lineContent, column, tabSize) {
        const textLen = Math.min(column - 1, lineContent.length);
        const text = lineContent.substring(0, textLen);
        const iterator = new _base_common_strings_js__WEBPACK_IMPORTED_MODULE_0__/* .GraphemeIterator */ .km(text);
        let result = 0;
        while (!iterator.eol()) {
            const codePoint = _base_common_strings_js__WEBPACK_IMPORTED_MODULE_0__/* .getNextCodePoint */ .Z5(text, textLen, iterator.offset);
            iterator.nextGraphemeLength();
            result = this._nextVisibleColumn(codePoint, result, tabSize);
        }
        return result;
    }
    /**
     * Returns a column from a visible column.
     * @see {@link CursorColumns}
     */
    static columnFromVisibleColumn(lineContent, visibleColumn, tabSize) {
        if (visibleColumn <= 0) {
            return 1;
        }
        const lineContentLength = lineContent.length;
        const iterator = new _base_common_strings_js__WEBPACK_IMPORTED_MODULE_0__/* .GraphemeIterator */ .km(lineContent);
        let beforeVisibleColumn = 0;
        let beforeColumn = 1;
        while (!iterator.eol()) {
            const codePoint = _base_common_strings_js__WEBPACK_IMPORTED_MODULE_0__/* .getNextCodePoint */ .Z5(lineContent, lineContentLength, iterator.offset);
            iterator.nextGraphemeLength();
            const afterVisibleColumn = this._nextVisibleColumn(codePoint, beforeVisibleColumn, tabSize);
            const afterColumn = iterator.offset + 1;
            if (afterVisibleColumn >= visibleColumn) {
                const beforeDelta = visibleColumn - beforeVisibleColumn;
                const afterDelta = afterVisibleColumn - visibleColumn;
                if (afterDelta < beforeDelta) {
                    return afterColumn;
                }
                else {
                    return beforeColumn;
                }
            }
            beforeVisibleColumn = afterVisibleColumn;
            beforeColumn = afterColumn;
        }
        // walked the entire string
        return lineContentLength + 1;
    }
    /**
     * ATTENTION: This works with 0-based columns (as opposed to the regular 1-based columns)
     * @see {@link CursorColumns}
     */
    static nextRenderTabStop(visibleColumn, tabSize) {
        return visibleColumn + tabSize - visibleColumn % tabSize;
    }
    /**
     * ATTENTION: This works with 0-based columns (as opposed to the regular 1-based columns)
     * @see {@link CursorColumns}
     */
    static nextIndentTabStop(visibleColumn, indentSize) {
        return visibleColumn + indentSize - visibleColumn % indentSize;
    }
    /**
     * ATTENTION: This works with 0-based columns (as opposed to the regular 1-based columns)
     * @see {@link CursorColumns}
     */
    static prevRenderTabStop(column, tabSize) {
        return Math.max(0, column - 1 - (column - 1) % tabSize);
    }
    /**
     * ATTENTION: This works with 0-based columns (as opposed to the regular 1-based columns)
     * @see {@link CursorColumns}
     */
    static prevIndentTabStop(column, indentSize) {
        return Math.max(0, column - 1 - (column - 1) % indentSize);
    }
}


/***/ },

/***/ 64651
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Gc: () => (/* binding */ InvalidBracketAstNode),
/* harmony export */   Nn: () => (/* binding */ PairAstNode),
/* harmony export */   Xw: () => (/* binding */ ListAstNode),
/* harmony export */   rh: () => (/* binding */ BracketAstNode),
/* harmony export */   yF: () => (/* binding */ TextAstNode)
/* harmony export */ });
/* harmony import */ var _base_common_errors_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(94327);
/* harmony import */ var _core_cursorColumns_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(62549);
/* harmony import */ var _length_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(34883);
/* harmony import */ var _smallImmutableSet_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(60756);
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/




/**
 * The base implementation for all AST nodes.
*/
class BaseAstNode {
    /**
     * The length of the entire node, which should equal the sum of lengths of all children.
    */
    get length() {
        return this._length;
    }
    constructor(length) {
        this._length = length;
    }
}
/**
 * Represents a bracket pair including its child (e.g. `{ ... }`).
 * Might be unclosed.
 * Immutable, if all children are immutable.
*/
class PairAstNode extends BaseAstNode {
    static create(openingBracket, child, closingBracket) {
        let length = openingBracket.length;
        if (child) {
            length = (0,_length_js__WEBPACK_IMPORTED_MODULE_2__/* .lengthAdd */ .QB)(length, child.length);
        }
        if (closingBracket) {
            length = (0,_length_js__WEBPACK_IMPORTED_MODULE_2__/* .lengthAdd */ .QB)(length, closingBracket.length);
        }
        return new PairAstNode(length, openingBracket, child, closingBracket, child ? child.missingOpeningBracketIds : _smallImmutableSet_js__WEBPACK_IMPORTED_MODULE_3__/* .SmallImmutableSet */ .gV.getEmpty());
    }
    get kind() {
        return 2 /* AstNodeKind.Pair */;
    }
    get listHeight() {
        return 0;
    }
    get childrenLength() {
        return 3;
    }
    getChild(idx) {
        switch (idx) {
            case 0: return this.openingBracket;
            case 1: return this.child;
            case 2: return this.closingBracket;
        }
        throw new Error('Invalid child index');
    }
    /**
     * Avoid using this property, it allocates an array!
    */
    get children() {
        const result = [];
        result.push(this.openingBracket);
        if (this.child) {
            result.push(this.child);
        }
        if (this.closingBracket) {
            result.push(this.closingBracket);
        }
        return result;
    }
    constructor(length, openingBracket, child, closingBracket, missingOpeningBracketIds) {
        super(length);
        this.openingBracket = openingBracket;
        this.child = child;
        this.closingBracket = closingBracket;
        this.missingOpeningBracketIds = missingOpeningBracketIds;
    }
    canBeReused(openBracketIds) {
        if (this.closingBracket === null) {
            // Unclosed pair ast nodes only
            // end at the end of the document
            // or when a parent node is closed.
            // This could be improved:
            // Only return false if some next token is neither "undefined" nor a bracket that closes a parent.
            return false;
        }
        if (openBracketIds.intersects(this.missingOpeningBracketIds)) {
            return false;
        }
        return true;
    }
    deepClone() {
        return new PairAstNode(this.length, this.openingBracket.deepClone(), this.child && this.child.deepClone(), this.closingBracket && this.closingBracket.deepClone(), this.missingOpeningBracketIds);
    }
    computeMinIndentation(offset, textModel) {
        return this.child ? this.child.computeMinIndentation((0,_length_js__WEBPACK_IMPORTED_MODULE_2__/* .lengthAdd */ .QB)(offset, this.openingBracket.length), textModel) : Number.MAX_SAFE_INTEGER;
    }
}
class ListAstNode extends BaseAstNode {
    /**
     * This method uses more memory-efficient list nodes that can only store 2 or 3 children.
    */
    static create23(item1, item2, item3, immutable = false) {
        let length = item1.length;
        let missingBracketIds = item1.missingOpeningBracketIds;
        if (item1.listHeight !== item2.listHeight) {
            throw new Error('Invalid list heights');
        }
        length = (0,_length_js__WEBPACK_IMPORTED_MODULE_2__/* .lengthAdd */ .QB)(length, item2.length);
        missingBracketIds = missingBracketIds.merge(item2.missingOpeningBracketIds);
        if (item3) {
            if (item1.listHeight !== item3.listHeight) {
                throw new Error('Invalid list heights');
            }
            length = (0,_length_js__WEBPACK_IMPORTED_MODULE_2__/* .lengthAdd */ .QB)(length, item3.length);
            missingBracketIds = missingBracketIds.merge(item3.missingOpeningBracketIds);
        }
        return immutable
            ? new Immutable23ListAstNode(length, item1.listHeight + 1, item1, item2, item3, missingBracketIds)
            : new TwoThreeListAstNode(length, item1.listHeight + 1, item1, item2, item3, missingBracketIds);
    }
    static getEmpty() {
        return new ImmutableArrayListAstNode(_length_js__WEBPACK_IMPORTED_MODULE_2__/* .lengthZero */ .Vp, 0, [], _smallImmutableSet_js__WEBPACK_IMPORTED_MODULE_3__/* .SmallImmutableSet */ .gV.getEmpty());
    }
    get kind() {
        return 4 /* AstNodeKind.List */;
    }
    get missingOpeningBracketIds() {
        return this._missingOpeningBracketIds;
    }
    /**
     * Use ListAstNode.create.
    */
    constructor(length, listHeight, _missingOpeningBracketIds) {
        super(length);
        this.listHeight = listHeight;
        this._missingOpeningBracketIds = _missingOpeningBracketIds;
        this.cachedMinIndentation = -1;
    }
    throwIfImmutable() {
        // NOOP
    }
    makeLastElementMutable() {
        this.throwIfImmutable();
        const childCount = this.childrenLength;
        if (childCount === 0) {
            return undefined;
        }
        const lastChild = this.getChild(childCount - 1);
        const mutable = lastChild.kind === 4 /* AstNodeKind.List */ ? lastChild.toMutable() : lastChild;
        if (lastChild !== mutable) {
            this.setChild(childCount - 1, mutable);
        }
        return mutable;
    }
    makeFirstElementMutable() {
        this.throwIfImmutable();
        const childCount = this.childrenLength;
        if (childCount === 0) {
            return undefined;
        }
        const firstChild = this.getChild(0);
        const mutable = firstChild.kind === 4 /* AstNodeKind.List */ ? firstChild.toMutable() : firstChild;
        if (firstChild !== mutable) {
            this.setChild(0, mutable);
        }
        return mutable;
    }
    canBeReused(openBracketIds) {
        if (openBracketIds.intersects(this.missingOpeningBracketIds)) {
            return false;
        }
        if (this.childrenLength === 0) {
            // Don't reuse empty lists.
            return false;
        }
        let lastChild = this;
        while (lastChild.kind === 4 /* AstNodeKind.List */) {
            const lastLength = lastChild.childrenLength;
            if (lastLength === 0) {
                // Empty lists should never be contained in other lists.
                throw new _base_common_errors_js__WEBPACK_IMPORTED_MODULE_0__/* .BugIndicatingError */ .D7();
            }
            lastChild = lastChild.getChild(lastLength - 1);
        }
        return lastChild.canBeReused(openBracketIds);
    }
    handleChildrenChanged() {
        this.throwIfImmutable();
        const count = this.childrenLength;
        let length = this.getChild(0).length;
        let unopenedBrackets = this.getChild(0).missingOpeningBracketIds;
        for (let i = 1; i < count; i++) {
            const child = this.getChild(i);
            length = (0,_length_js__WEBPACK_IMPORTED_MODULE_2__/* .lengthAdd */ .QB)(length, child.length);
            unopenedBrackets = unopenedBrackets.merge(child.missingOpeningBracketIds);
        }
        this._length = length;
        this._missingOpeningBracketIds = unopenedBrackets;
        this.cachedMinIndentation = -1;
    }
    computeMinIndentation(offset, textModel) {
        if (this.cachedMinIndentation !== -1) {
            return this.cachedMinIndentation;
        }
        let minIndentation = Number.MAX_SAFE_INTEGER;
        let childOffset = offset;
        for (let i = 0; i < this.childrenLength; i++) {
            const child = this.getChild(i);
            if (child) {
                minIndentation = Math.min(minIndentation, child.computeMinIndentation(childOffset, textModel));
                childOffset = (0,_length_js__WEBPACK_IMPORTED_MODULE_2__/* .lengthAdd */ .QB)(childOffset, child.length);
            }
        }
        this.cachedMinIndentation = minIndentation;
        return minIndentation;
    }
}
class TwoThreeListAstNode extends ListAstNode {
    get childrenLength() {
        return this._item3 !== null ? 3 : 2;
    }
    getChild(idx) {
        switch (idx) {
            case 0: return this._item1;
            case 1: return this._item2;
            case 2: return this._item3;
        }
        throw new Error('Invalid child index');
    }
    setChild(idx, node) {
        switch (idx) {
            case 0:
                this._item1 = node;
                return;
            case 1:
                this._item2 = node;
                return;
            case 2:
                this._item3 = node;
                return;
        }
        throw new Error('Invalid child index');
    }
    get children() {
        return this._item3 ? [this._item1, this._item2, this._item3] : [this._item1, this._item2];
    }
    get item1() {
        return this._item1;
    }
    get item2() {
        return this._item2;
    }
    get item3() {
        return this._item3;
    }
    constructor(length, listHeight, _item1, _item2, _item3, missingOpeningBracketIds) {
        super(length, listHeight, missingOpeningBracketIds);
        this._item1 = _item1;
        this._item2 = _item2;
        this._item3 = _item3;
    }
    deepClone() {
        return new TwoThreeListAstNode(this.length, this.listHeight, this._item1.deepClone(), this._item2.deepClone(), this._item3 ? this._item3.deepClone() : null, this.missingOpeningBracketIds);
    }
    appendChildOfSameHeight(node) {
        if (this._item3) {
            throw new Error('Cannot append to a full (2,3) tree node');
        }
        this.throwIfImmutable();
        this._item3 = node;
        this.handleChildrenChanged();
    }
    unappendChild() {
        if (!this._item3) {
            throw new Error('Cannot remove from a non-full (2,3) tree node');
        }
        this.throwIfImmutable();
        const result = this._item3;
        this._item3 = null;
        this.handleChildrenChanged();
        return result;
    }
    prependChildOfSameHeight(node) {
        if (this._item3) {
            throw new Error('Cannot prepend to a full (2,3) tree node');
        }
        this.throwIfImmutable();
        this._item3 = this._item2;
        this._item2 = this._item1;
        this._item1 = node;
        this.handleChildrenChanged();
    }
    unprependChild() {
        if (!this._item3) {
            throw new Error('Cannot remove from a non-full (2,3) tree node');
        }
        this.throwIfImmutable();
        const result = this._item1;
        this._item1 = this._item2;
        this._item2 = this._item3;
        this._item3 = null;
        this.handleChildrenChanged();
        return result;
    }
    toMutable() {
        return this;
    }
}
/**
 * Immutable, if all children are immutable.
*/
class Immutable23ListAstNode extends TwoThreeListAstNode {
    toMutable() {
        return new TwoThreeListAstNode(this.length, this.listHeight, this.item1, this.item2, this.item3, this.missingOpeningBracketIds);
    }
    throwIfImmutable() {
        throw new Error('this instance is immutable');
    }
}
/**
 * For debugging.
*/
class ArrayListAstNode extends ListAstNode {
    get childrenLength() {
        return this._children.length;
    }
    getChild(idx) {
        return this._children[idx];
    }
    setChild(idx, child) {
        this._children[idx] = child;
    }
    get children() {
        return this._children;
    }
    constructor(length, listHeight, _children, missingOpeningBracketIds) {
        super(length, listHeight, missingOpeningBracketIds);
        this._children = _children;
    }
    deepClone() {
        const children = new Array(this._children.length);
        for (let i = 0; i < this._children.length; i++) {
            children[i] = this._children[i].deepClone();
        }
        return new ArrayListAstNode(this.length, this.listHeight, children, this.missingOpeningBracketIds);
    }
    appendChildOfSameHeight(node) {
        this.throwIfImmutable();
        this._children.push(node);
        this.handleChildrenChanged();
    }
    unappendChild() {
        this.throwIfImmutable();
        const item = this._children.pop();
        this.handleChildrenChanged();
        return item;
    }
    prependChildOfSameHeight(node) {
        this.throwIfImmutable();
        this._children.unshift(node);
        this.handleChildrenChanged();
    }
    unprependChild() {
        this.throwIfImmutable();
        const item = this._children.shift();
        this.handleChildrenChanged();
        return item;
    }
    toMutable() {
        return this;
    }
}
/**
 * Immutable, if all children are immutable.
*/
class ImmutableArrayListAstNode extends ArrayListAstNode {
    toMutable() {
        return new ArrayListAstNode(this.length, this.listHeight, [...this.children], this.missingOpeningBracketIds);
    }
    throwIfImmutable() {
        throw new Error('this instance is immutable');
    }
}
const emptyArray = [];
class ImmutableLeafAstNode extends BaseAstNode {
    get listHeight() {
        return 0;
    }
    get childrenLength() {
        return 0;
    }
    getChild(idx) {
        return null;
    }
    get children() {
        return emptyArray;
    }
    deepClone() {
        return this;
    }
}
class TextAstNode extends ImmutableLeafAstNode {
    get kind() {
        return 0 /* AstNodeKind.Text */;
    }
    get missingOpeningBracketIds() {
        return _smallImmutableSet_js__WEBPACK_IMPORTED_MODULE_3__/* .SmallImmutableSet */ .gV.getEmpty();
    }
    canBeReused(_openedBracketIds) {
        return true;
    }
    computeMinIndentation(offset, textModel) {
        const start = (0,_length_js__WEBPACK_IMPORTED_MODULE_2__/* .lengthToObj */ .l4)(offset);
        // Text ast nodes don't have partial indentation (ensured by the tokenizer).
        // Thus, if this text node does not start at column 0, the first line cannot have any indentation at all.
        const startLineNumber = (start.columnCount === 0 ? start.lineCount : start.lineCount + 1) + 1;
        const endLineNumber = (0,_length_js__WEBPACK_IMPORTED_MODULE_2__/* .lengthGetLineCount */ .eu)((0,_length_js__WEBPACK_IMPORTED_MODULE_2__/* .lengthAdd */ .QB)(offset, this.length)) + 1;
        let result = Number.MAX_SAFE_INTEGER;
        for (let lineNumber = startLineNumber; lineNumber <= endLineNumber; lineNumber++) {
            const firstNonWsColumn = textModel.getLineFirstNonWhitespaceColumn(lineNumber);
            const lineContent = textModel.getLineContent(lineNumber);
            if (firstNonWsColumn === 0) {
                continue;
            }
            const visibleColumn = _core_cursorColumns_js__WEBPACK_IMPORTED_MODULE_1__/* .CursorColumns */ .A.visibleColumnFromColumn(lineContent, firstNonWsColumn, textModel.getOptions().tabSize);
            result = Math.min(result, visibleColumn);
        }
        return result;
    }
}
class BracketAstNode extends ImmutableLeafAstNode {
    static create(length, bracketInfo, bracketIds) {
        const node = new BracketAstNode(length, bracketInfo, bracketIds);
        return node;
    }
    get kind() {
        return 1 /* AstNodeKind.Bracket */;
    }
    get missingOpeningBracketIds() {
        return _smallImmutableSet_js__WEBPACK_IMPORTED_MODULE_3__/* .SmallImmutableSet */ .gV.getEmpty();
    }
    constructor(length, bracketInfo, 
    /**
     * In case of a opening bracket, this is the id of the opening bracket.
     * In case of a closing bracket, this contains the ids of all opening brackets it can close.
    */
    bracketIds) {
        super(length);
        this.bracketInfo = bracketInfo;
        this.bracketIds = bracketIds;
    }
    get text() {
        return this.bracketInfo.bracketText;
    }
    get languageId() {
        return this.bracketInfo.languageId;
    }
    canBeReused(_openedBracketIds) {
        // These nodes could be reused,
        // but not in a general way.
        // Their parent may be reused.
        return false;
    }
    computeMinIndentation(offset, textModel) {
        return Number.MAX_SAFE_INTEGER;
    }
}
class InvalidBracketAstNode extends ImmutableLeafAstNode {
    get kind() {
        return 3 /* AstNodeKind.UnexpectedClosingBracket */;
    }
    constructor(closingBrackets, length) {
        super(length);
        this.missingOpeningBracketIds = closingBrackets;
    }
    canBeReused(openedBracketIds) {
        return !openedBracketIds.intersects(this.missingOpeningBracketIds);
    }
    computeMinIndentation(offset, textModel) {
        return Number.MAX_SAFE_INTEGER;
    }
}


/***/ },

/***/ 66726
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
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

/***/ 67167
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
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

/***/ 67526
(__unused_webpack_module, exports) {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}


/***/ },

/***/ 68302
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  T: () => (/* binding */ parseDocument)
});

// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/editor/common/model/bracketPairsTextModelPart/bracketPairsTree/ast.js
var ast = __webpack_require__(64651);
// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/editor/common/model/bracketPairsTextModelPart/bracketPairsTree/beforeEditPositionMapper.js
var beforeEditPositionMapper = __webpack_require__(22994);
// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/editor/common/model/bracketPairsTextModelPart/bracketPairsTree/smallImmutableSet.js
var smallImmutableSet = __webpack_require__(60756);
// EXTERNAL MODULE: ./node_modules/monaco-editor/esm/vs/editor/common/model/bracketPairsTextModelPart/bracketPairsTree/length.js
var bracketPairsTree_length = __webpack_require__(34883);
;// ./node_modules/monaco-editor/esm/vs/editor/common/model/bracketPairsTextModelPart/bracketPairsTree/concat23Trees.js
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * Concatenates a list of (2,3) AstNode's into a single (2,3) AstNode.
 * This mutates the items of the input array!
 * If all items have the same height, this method has runtime O(items.length).
 * Otherwise, it has runtime O(items.length * max(log(items.length), items.max(i => i.height))).
*/
function concat23Trees(items) {
    if (items.length === 0) {
        return null;
    }
    if (items.length === 1) {
        return items[0];
    }
    let i = 0;
    /**
     * Reads nodes of same height and concatenates them to a single node.
    */
    function readNode() {
        if (i >= items.length) {
            return null;
        }
        const start = i;
        const height = items[start].listHeight;
        i++;
        while (i < items.length && items[i].listHeight === height) {
            i++;
        }
        if (i - start >= 2) {
            return concat23TreesOfSameHeight(start === 0 && i === items.length ? items : items.slice(start, i), false);
        }
        else {
            return items[start];
        }
    }
    // The items might not have the same height.
    // We merge all items by using a binary concat operator.
    let first = readNode(); // There must be a first item
    let second = readNode();
    if (!second) {
        return first;
    }
    for (let item = readNode(); item; item = readNode()) {
        // Prefer concatenating smaller trees, as the runtime of concat depends on the tree height.
        if (heightDiff(first, second) <= heightDiff(second, item)) {
            first = concat(first, second);
            second = item;
        }
        else {
            second = concat(second, item);
        }
    }
    const result = concat(first, second);
    return result;
}
function concat23TreesOfSameHeight(items, createImmutableLists = false) {
    if (items.length === 0) {
        return null;
    }
    if (items.length === 1) {
        return items[0];
    }
    let length = items.length;
    // All trees have same height, just create parent nodes.
    while (length > 3) {
        const newLength = length >> 1;
        for (let i = 0; i < newLength; i++) {
            const j = i << 1;
            items[i] = ast/* ListAstNode */.Xw.create23(items[j], items[j + 1], j + 3 === length ? items[j + 2] : null, createImmutableLists);
        }
        length = newLength;
    }
    return ast/* ListAstNode */.Xw.create23(items[0], items[1], length >= 3 ? items[2] : null, createImmutableLists);
}
function heightDiff(node1, node2) {
    return Math.abs(node1.listHeight - node2.listHeight);
}
function concat(node1, node2) {
    if (node1.listHeight === node2.listHeight) {
        return ast/* ListAstNode */.Xw.create23(node1, node2, null, false);
    }
    else if (node1.listHeight > node2.listHeight) {
        // node1 is the tree we want to insert into
        return append(node1, node2);
    }
    else {
        return prepend(node2, node1);
    }
}
/**
 * Appends the given node to the end of this (2,3) tree.
 * Returns the new root.
*/
function append(list, nodeToAppend) {
    list = list.toMutable();
    let curNode = list;
    const parents = [];
    let nodeToAppendOfCorrectHeight;
    while (true) {
        // assert nodeToInsert.listHeight <= curNode.listHeight
        if (nodeToAppend.listHeight === curNode.listHeight) {
            nodeToAppendOfCorrectHeight = nodeToAppend;
            break;
        }
        // assert 0 <= nodeToInsert.listHeight < curNode.listHeight
        if (curNode.kind !== 4 /* AstNodeKind.List */) {
            throw new Error('unexpected');
        }
        parents.push(curNode);
        // assert 2 <= curNode.childrenLength <= 3
        curNode = curNode.makeLastElementMutable();
    }
    // assert nodeToAppendOfCorrectHeight!.listHeight === curNode.listHeight
    for (let i = parents.length - 1; i >= 0; i--) {
        const parent = parents[i];
        if (nodeToAppendOfCorrectHeight) {
            // Can we take the element?
            if (parent.childrenLength >= 3) {
                // assert parent.childrenLength === 3 && parent.listHeight === nodeToAppendOfCorrectHeight.listHeight + 1
                // we need to split to maintain (2,3)-tree property.
                // Send the third element + the new element to the parent.
                nodeToAppendOfCorrectHeight = ast/* ListAstNode */.Xw.create23(parent.unappendChild(), nodeToAppendOfCorrectHeight, null, false);
            }
            else {
                parent.appendChildOfSameHeight(nodeToAppendOfCorrectHeight);
                nodeToAppendOfCorrectHeight = undefined;
            }
        }
        else {
            parent.handleChildrenChanged();
        }
    }
    if (nodeToAppendOfCorrectHeight) {
        return ast/* ListAstNode */.Xw.create23(list, nodeToAppendOfCorrectHeight, null, false);
    }
    else {
        return list;
    }
}
/**
 * Prepends the given node to the end of this (2,3) tree.
 * Returns the new root.
*/
function prepend(list, nodeToAppend) {
    list = list.toMutable();
    let curNode = list;
    const parents = [];
    // assert nodeToInsert.listHeight <= curNode.listHeight
    while (nodeToAppend.listHeight !== curNode.listHeight) {
        // assert 0 <= nodeToInsert.listHeight < curNode.listHeight
        if (curNode.kind !== 4 /* AstNodeKind.List */) {
            throw new Error('unexpected');
        }
        parents.push(curNode);
        // assert 2 <= curNode.childrenFast.length <= 3
        curNode = curNode.makeFirstElementMutable();
    }
    let nodeToPrependOfCorrectHeight = nodeToAppend;
    // assert nodeToAppendOfCorrectHeight!.listHeight === curNode.listHeight
    for (let i = parents.length - 1; i >= 0; i--) {
        const parent = parents[i];
        if (nodeToPrependOfCorrectHeight) {
            // Can we take the element?
            if (parent.childrenLength >= 3) {
                // assert parent.childrenLength === 3 && parent.listHeight === nodeToAppendOfCorrectHeight.listHeight + 1
                // we need to split to maintain (2,3)-tree property.
                // Send the third element + the new element to the parent.
                nodeToPrependOfCorrectHeight = ast/* ListAstNode */.Xw.create23(nodeToPrependOfCorrectHeight, parent.unprependChild(), null, false);
            }
            else {
                parent.prependChildOfSameHeight(nodeToPrependOfCorrectHeight);
                nodeToPrependOfCorrectHeight = undefined;
            }
        }
        else {
            parent.handleChildrenChanged();
        }
    }
    if (nodeToPrependOfCorrectHeight) {
        return ast/* ListAstNode */.Xw.create23(nodeToPrependOfCorrectHeight, list, null, false);
    }
    else {
        return list;
    }
}

;// ./node_modules/monaco-editor/esm/vs/editor/common/model/bracketPairsTextModelPart/bracketPairsTree/nodeReader.js
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * Allows to efficiently find a longest child at a given offset in a fixed node.
 * The requested offsets must increase monotonously.
*/
class NodeReader {
    constructor(node) {
        this.lastOffset = bracketPairsTree_length/* lengthZero */.Vp;
        this.nextNodes = [node];
        this.offsets = [bracketPairsTree_length/* lengthZero */.Vp];
        this.idxs = [];
    }
    /**
     * Returns the longest node at `offset` that satisfies the predicate.
     * @param offset must be greater than or equal to the last offset this method has been called with!
    */
    readLongestNodeAt(offset, predicate) {
        if ((0,bracketPairsTree_length/* lengthLessThan */.zG)(offset, this.lastOffset)) {
            throw new Error('Invalid offset');
        }
        this.lastOffset = offset;
        // Find the longest node of all those that are closest to the current offset.
        while (true) {
            const curNode = lastOrUndefined(this.nextNodes);
            if (!curNode) {
                return undefined;
            }
            const curNodeOffset = lastOrUndefined(this.offsets);
            if ((0,bracketPairsTree_length/* lengthLessThan */.zG)(offset, curNodeOffset)) {
                // The next best node is not here yet.
                // The reader must advance before a cached node is hit.
                return undefined;
            }
            if ((0,bracketPairsTree_length/* lengthLessThan */.zG)(curNodeOffset, offset)) {
                // The reader is ahead of the current node.
                if ((0,bracketPairsTree_length/* lengthAdd */.QB)(curNodeOffset, curNode.length) <= offset) {
                    // The reader is after the end of the current node.
                    this.nextNodeAfterCurrent();
                }
                else {
                    // The reader is somewhere in the current node.
                    const nextChildIdx = getNextChildIdx(curNode);
                    if (nextChildIdx !== -1) {
                        // Go to the first child and repeat.
                        this.nextNodes.push(curNode.getChild(nextChildIdx));
                        this.offsets.push(curNodeOffset);
                        this.idxs.push(nextChildIdx);
                    }
                    else {
                        // We don't have children
                        this.nextNodeAfterCurrent();
                    }
                }
            }
            else {
                // readerOffsetBeforeChange === curNodeOffset
                if (predicate(curNode)) {
                    this.nextNodeAfterCurrent();
                    return curNode;
                }
                else {
                    const nextChildIdx = getNextChildIdx(curNode);
                    // look for shorter node
                    if (nextChildIdx === -1) {
                        // There is no shorter node.
                        this.nextNodeAfterCurrent();
                        return undefined;
                    }
                    else {
                        // Descend into first child & repeat.
                        this.nextNodes.push(curNode.getChild(nextChildIdx));
                        this.offsets.push(curNodeOffset);
                        this.idxs.push(nextChildIdx);
                    }
                }
            }
        }
    }
    // Navigates to the longest node that continues after the current node.
    nextNodeAfterCurrent() {
        while (true) {
            const currentOffset = lastOrUndefined(this.offsets);
            const currentNode = lastOrUndefined(this.nextNodes);
            this.nextNodes.pop();
            this.offsets.pop();
            if (this.idxs.length === 0) {
                // We just popped the root node, there is no next node.
                break;
            }
            // Parent is not undefined, because idxs is not empty
            const parent = lastOrUndefined(this.nextNodes);
            const nextChildIdx = getNextChildIdx(parent, this.idxs[this.idxs.length - 1]);
            if (nextChildIdx !== -1) {
                this.nextNodes.push(parent.getChild(nextChildIdx));
                this.offsets.push((0,bracketPairsTree_length/* lengthAdd */.QB)(currentOffset, currentNode.length));
                this.idxs[this.idxs.length - 1] = nextChildIdx;
                break;
            }
            else {
                this.idxs.pop();
            }
            // We fully consumed the parent.
            // Current node is now parent, so call nextNodeAfterCurrent again
        }
    }
}
function getNextChildIdx(node, curIdx = -1) {
    while (true) {
        curIdx++;
        if (curIdx >= node.childrenLength) {
            return -1;
        }
        if (node.getChild(curIdx)) {
            return curIdx;
        }
    }
}
function lastOrUndefined(arr) {
    return arr.length > 0 ? arr[arr.length - 1] : undefined;
}

;// ./node_modules/monaco-editor/esm/vs/editor/common/model/bracketPairsTextModelPart/bracketPairsTree/parser.js
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/






/**
 * Non incrementally built ASTs are immutable.
*/
function parseDocument(tokenizer, edits, oldNode, createImmutableLists) {
    const parser = new Parser(tokenizer, edits, oldNode, createImmutableLists);
    return parser.parseDocument();
}
/**
 * Non incrementally built ASTs are immutable.
*/
class Parser {
    constructor(tokenizer, edits, oldNode, createImmutableLists) {
        this.tokenizer = tokenizer;
        this.createImmutableLists = createImmutableLists;
        this._itemsConstructed = 0;
        this._itemsFromCache = 0;
        if (oldNode && createImmutableLists) {
            throw new Error('Not supported');
        }
        this.oldNodeReader = oldNode ? new NodeReader(oldNode) : undefined;
        this.positionMapper = new beforeEditPositionMapper/* BeforeEditPositionMapper */.W(edits);
    }
    parseDocument() {
        this._itemsConstructed = 0;
        this._itemsFromCache = 0;
        let result = this.parseList(smallImmutableSet/* SmallImmutableSet */.gV.getEmpty(), 0);
        if (!result) {
            result = ast/* ListAstNode */.Xw.getEmpty();
        }
        return result;
    }
    parseList(openedBracketIds, level) {
        const items = [];
        while (true) {
            let child = this.tryReadChildFromCache(openedBracketIds);
            if (!child) {
                const token = this.tokenizer.peek();
                if (!token ||
                    (token.kind === 2 /* TokenKind.ClosingBracket */ &&
                        token.bracketIds.intersects(openedBracketIds))) {
                    break;
                }
                child = this.parseChild(openedBracketIds, level + 1);
            }
            if (child.kind === 4 /* AstNodeKind.List */ && child.childrenLength === 0) {
                continue;
            }
            items.push(child);
        }
        // When there is no oldNodeReader, all items are created from scratch and must have the same height.
        const result = this.oldNodeReader ? concat23Trees(items) : concat23TreesOfSameHeight(items, this.createImmutableLists);
        return result;
    }
    tryReadChildFromCache(openedBracketIds) {
        if (this.oldNodeReader) {
            const maxCacheableLength = this.positionMapper.getDistanceToNextChange(this.tokenizer.offset);
            if (maxCacheableLength === null || !(0,bracketPairsTree_length/* lengthIsZero */.Vh)(maxCacheableLength)) {
                const cachedNode = this.oldNodeReader.readLongestNodeAt(this.positionMapper.getOffsetBeforeChange(this.tokenizer.offset), curNode => {
                    // The edit could extend the ending token, thus we cannot re-use nodes that touch the edit.
                    // If there is no edit anymore, we can re-use the node in any case.
                    if (maxCacheableLength !== null && !(0,bracketPairsTree_length/* lengthLessThan */.zG)(curNode.length, maxCacheableLength)) {
                        // Either the node contains edited text or touches edited text.
                        // In the latter case, brackets might have been extended (`end` -> `ending`), so even touching nodes cannot be reused.
                        return false;
                    }
                    const canBeReused = curNode.canBeReused(openedBracketIds);
                    return canBeReused;
                });
                if (cachedNode) {
                    this._itemsFromCache++;
                    this.tokenizer.skip(cachedNode.length);
                    return cachedNode;
                }
            }
        }
        return undefined;
    }
    parseChild(openedBracketIds, level) {
        this._itemsConstructed++;
        const token = this.tokenizer.read();
        switch (token.kind) {
            case 2 /* TokenKind.ClosingBracket */:
                return new ast/* InvalidBracketAstNode */.Gc(token.bracketIds, token.length);
            case 0 /* TokenKind.Text */:
                return token.astNode;
            case 1 /* TokenKind.OpeningBracket */: {
                if (level > 300) {
                    // To prevent stack overflows
                    return new ast/* TextAstNode */.yF(token.length);
                }
                const set = openedBracketIds.merge(token.bracketIds);
                const child = this.parseList(set, level + 1);
                const nextToken = this.tokenizer.peek();
                if (nextToken &&
                    nextToken.kind === 2 /* TokenKind.ClosingBracket */ &&
                    (nextToken.bracketId === token.bracketId || nextToken.bracketIds.intersects(token.bracketIds))) {
                    this.tokenizer.read();
                    return ast/* PairAstNode */.Nn.create(token.astNode, child, nextToken.astNode);
                }
                else {
                    return ast/* PairAstNode */.Nn.create(token.astNode, child, null);
                }
            }
            default:
                throw new Error('unexpected');
        }
    }
}


/***/ },

/***/ 70559
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";

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

/***/ 77922
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   L: () => (/* binding */ ILanguageService)
/* harmony export */ });
/* harmony import */ var _platform_instantiation_common_instantiation_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(82399);
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const ILanguageService = (0,_platform_instantiation_common_instantiation_js__WEBPACK_IMPORTED_MODULE_0__/* .createDecorator */ .u1)('languageService');


/***/ },

/***/ 78518
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
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

"use strict";
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

"use strict";
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


/***/ },

/***/ 83455
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   E$: () => (/* binding */ ModelRawLinesDeleted),
/* harmony export */   HP: () => (/* binding */ ModelRawContentChangedEvent),
/* harmony export */   Ic: () => (/* binding */ InternalModelContentChangeEvent),
/* harmony export */   U0: () => (/* binding */ ModelRawLineChanged),
/* harmony export */   Wn: () => (/* binding */ ModelRawFlush),
/* harmony export */   bg: () => (/* binding */ ModelRawLinesInserted),
/* harmony export */   mS: () => (/* binding */ ModelRawEOLChanged),
/* harmony export */   uK: () => (/* binding */ LineInjectedText),
/* harmony export */   vn: () => (/* binding */ ModelInjectedTextChangedEvent)
/* harmony export */ });
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
/**
 * An event describing that a model has been reset to a new value.
 * @internal
 */
class ModelRawFlush {
    constructor() {
        this.changeType = 1 /* RawContentChangedType.Flush */;
    }
}
/**
 * Represents text injected on a line
 * @internal
 */
class LineInjectedText {
    static applyInjectedText(lineText, injectedTexts) {
        if (!injectedTexts || injectedTexts.length === 0) {
            return lineText;
        }
        let result = '';
        let lastOriginalOffset = 0;
        for (const injectedText of injectedTexts) {
            result += lineText.substring(lastOriginalOffset, injectedText.column - 1);
            lastOriginalOffset = injectedText.column - 1;
            result += injectedText.options.content;
        }
        result += lineText.substring(lastOriginalOffset);
        return result;
    }
    static fromDecorations(decorations) {
        const result = [];
        for (const decoration of decorations) {
            if (decoration.options.before && decoration.options.before.content.length > 0) {
                result.push(new LineInjectedText(decoration.ownerId, decoration.range.startLineNumber, decoration.range.startColumn, decoration.options.before, 0));
            }
            if (decoration.options.after && decoration.options.after.content.length > 0) {
                result.push(new LineInjectedText(decoration.ownerId, decoration.range.endLineNumber, decoration.range.endColumn, decoration.options.after, 1));
            }
        }
        result.sort((a, b) => {
            if (a.lineNumber === b.lineNumber) {
                if (a.column === b.column) {
                    return a.order - b.order;
                }
                return a.column - b.column;
            }
            return a.lineNumber - b.lineNumber;
        });
        return result;
    }
    constructor(ownerId, lineNumber, column, options, order) {
        this.ownerId = ownerId;
        this.lineNumber = lineNumber;
        this.column = column;
        this.options = options;
        this.order = order;
    }
}
/**
 * An event describing that a line has changed in a model.
 * @internal
 */
class ModelRawLineChanged {
    constructor(lineNumber, detail, injectedText) {
        this.changeType = 2 /* RawContentChangedType.LineChanged */;
        this.lineNumber = lineNumber;
        this.detail = detail;
        this.injectedText = injectedText;
    }
}
/**
 * An event describing that line(s) have been deleted in a model.
 * @internal
 */
class ModelRawLinesDeleted {
    constructor(fromLineNumber, toLineNumber) {
        this.changeType = 3 /* RawContentChangedType.LinesDeleted */;
        this.fromLineNumber = fromLineNumber;
        this.toLineNumber = toLineNumber;
    }
}
/**
 * An event describing that line(s) have been inserted in a model.
 * @internal
 */
class ModelRawLinesInserted {
    constructor(fromLineNumber, toLineNumber, detail, injectedTexts) {
        this.changeType = 4 /* RawContentChangedType.LinesInserted */;
        this.injectedTexts = injectedTexts;
        this.fromLineNumber = fromLineNumber;
        this.toLineNumber = toLineNumber;
        this.detail = detail;
    }
}
/**
 * An event describing that a model has had its EOL changed.
 * @internal
 */
class ModelRawEOLChanged {
    constructor() {
        this.changeType = 5 /* RawContentChangedType.EOLChanged */;
    }
}
/**
 * An event describing a change in the text of a model.
 * @internal
 */
class ModelRawContentChangedEvent {
    constructor(changes, versionId, isUndoing, isRedoing) {
        this.changes = changes;
        this.versionId = versionId;
        this.isUndoing = isUndoing;
        this.isRedoing = isRedoing;
        this.resultingSelection = null;
    }
    containsEvent(type) {
        for (let i = 0, len = this.changes.length; i < len; i++) {
            const change = this.changes[i];
            if (change.changeType === type) {
                return true;
            }
        }
        return false;
    }
    static merge(a, b) {
        const changes = [].concat(a.changes).concat(b.changes);
        const versionId = b.versionId;
        const isUndoing = (a.isUndoing || b.isUndoing);
        const isRedoing = (a.isRedoing || b.isRedoing);
        return new ModelRawContentChangedEvent(changes, versionId, isUndoing, isRedoing);
    }
}
/**
 * An event describing a change in injected text.
 * @internal
 */
class ModelInjectedTextChangedEvent {
    constructor(changes) {
        this.changes = changes;
    }
}
/**
 * @internal
 */
class InternalModelContentChangeEvent {
    constructor(rawContentChangedEvent, contentChangedEvent) {
        this.rawContentChangedEvent = rawContentChangedEvent;
        this.contentChangedEvent = contentChangedEvent;
    }
    merge(other) {
        const rawContentChangedEvent = ModelRawContentChangedEvent.merge(this.rawContentChangedEvent, other.rawContentChangedEvent);
        const contentChangedEvent = InternalModelContentChangeEvent._mergeChangeEvents(this.contentChangedEvent, other.contentChangedEvent);
        return new InternalModelContentChangeEvent(rawContentChangedEvent, contentChangedEvent);
    }
    static _mergeChangeEvents(a, b) {
        const changes = [].concat(a.changes).concat(b.changes);
        const eol = b.eol;
        const versionId = b.versionId;
        const isUndoing = (a.isUndoing || b.isUndoing);
        const isRedoing = (a.isRedoing || b.isRedoing);
        const isFlush = (a.isFlush || b.isFlush);
        const isEolChange = a.isEolChange && b.isEolChange; // both must be true to not confuse listeners who skip such edits
        return {
            changes: changes,
            eol: eol,
            isEolChange: isEolChange,
            versionId: versionId,
            isUndoing: isUndoing,
            isRedoing: isRedoing,
            isFlush: isFlush,
        };
    }
}


/***/ },

/***/ 85702
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* binding */ LanguageAgnosticBracketTokens)
/* harmony export */ });
/* unused harmony export BracketTokens */
/* harmony import */ var _base_common_strings_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(16844);
/* harmony import */ var _ast_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(64651);
/* harmony import */ var _length_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(34883);
/* harmony import */ var _smallImmutableSet_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(60756);
/* harmony import */ var _tokenizer_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(33206);
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/





class BracketTokens {
    static createFromLanguage(configuration, denseKeyProvider) {
        function getId(bracketInfo) {
            return denseKeyProvider.getKey(`${bracketInfo.languageId}:::${bracketInfo.bracketText}`);
        }
        const map = new Map();
        for (const openingBracket of configuration.bracketsNew.openingBrackets) {
            const length = (0,_length_js__WEBPACK_IMPORTED_MODULE_2__/* .toLength */ .qe)(0, openingBracket.bracketText.length);
            const openingTextId = getId(openingBracket);
            const bracketIds = _smallImmutableSet_js__WEBPACK_IMPORTED_MODULE_3__/* .SmallImmutableSet */ .gV.getEmpty().add(openingTextId, _smallImmutableSet_js__WEBPACK_IMPORTED_MODULE_3__/* .identityKeyProvider */ .FD);
            map.set(openingBracket.bracketText, new _tokenizer_js__WEBPACK_IMPORTED_MODULE_4__/* .Token */ .ou(length, 1 /* TokenKind.OpeningBracket */, openingTextId, bracketIds, _ast_js__WEBPACK_IMPORTED_MODULE_1__/* .BracketAstNode */ .rh.create(length, openingBracket, bracketIds)));
        }
        for (const closingBracket of configuration.bracketsNew.closingBrackets) {
            const length = (0,_length_js__WEBPACK_IMPORTED_MODULE_2__/* .toLength */ .qe)(0, closingBracket.bracketText.length);
            let bracketIds = _smallImmutableSet_js__WEBPACK_IMPORTED_MODULE_3__/* .SmallImmutableSet */ .gV.getEmpty();
            const closingBrackets = closingBracket.getOpeningBrackets();
            for (const bracket of closingBrackets) {
                bracketIds = bracketIds.add(getId(bracket), _smallImmutableSet_js__WEBPACK_IMPORTED_MODULE_3__/* .identityKeyProvider */ .FD);
            }
            map.set(closingBracket.bracketText, new _tokenizer_js__WEBPACK_IMPORTED_MODULE_4__/* .Token */ .ou(length, 2 /* TokenKind.ClosingBracket */, getId(closingBrackets[0]), bracketIds, _ast_js__WEBPACK_IMPORTED_MODULE_1__/* .BracketAstNode */ .rh.create(length, closingBracket, bracketIds)));
        }
        return new BracketTokens(map);
    }
    constructor(map) {
        this.map = map;
        this.hasRegExp = false;
        this._regExpGlobal = null;
    }
    getRegExpStr() {
        if (this.isEmpty) {
            return null;
        }
        else {
            const keys = [...this.map.keys()];
            keys.sort();
            keys.reverse();
            return keys.map(k => prepareBracketForRegExp(k)).join('|');
        }
    }
    /**
     * Returns null if there is no such regexp (because there are no brackets).
    */
    get regExpGlobal() {
        if (!this.hasRegExp) {
            const regExpStr = this.getRegExpStr();
            this._regExpGlobal = regExpStr ? new RegExp(regExpStr, 'gi') : null;
            this.hasRegExp = true;
        }
        return this._regExpGlobal;
    }
    getToken(value) {
        return this.map.get(value.toLowerCase());
    }
    findClosingTokenText(openingBracketIds) {
        for (const [closingText, info] of this.map) {
            if (info.kind === 2 /* TokenKind.ClosingBracket */ && info.bracketIds.intersects(openingBracketIds)) {
                return closingText;
            }
        }
        return undefined;
    }
    get isEmpty() {
        return this.map.size === 0;
    }
}
function prepareBracketForRegExp(str) {
    let escaped = (0,_base_common_strings_js__WEBPACK_IMPORTED_MODULE_0__/* .escapeRegExpCharacters */ .bm)(str);
    // These bracket pair delimiters start or end with letters
    // see https://github.com/microsoft/vscode/issues/132162 https://github.com/microsoft/vscode/issues/150440
    if (/^[\w ]+/.test(str)) {
        escaped = `\\b${escaped}`;
    }
    if (/[\w ]+$/.test(str)) {
        escaped = `${escaped}\\b`;
    }
    return escaped;
}
class LanguageAgnosticBracketTokens {
    constructor(denseKeyProvider, getLanguageConfiguration) {
        this.denseKeyProvider = denseKeyProvider;
        this.getLanguageConfiguration = getLanguageConfiguration;
        this.languageIdToBracketTokens = new Map();
    }
    didLanguageChange(languageId) {
        // Report a change whenever the language configuration updates.
        return this.languageIdToBracketTokens.has(languageId);
    }
    getSingleLanguageBracketTokens(languageId) {
        let singleLanguageBracketTokens = this.languageIdToBracketTokens.get(languageId);
        if (!singleLanguageBracketTokens) {
            singleLanguageBracketTokens = BracketTokens.createFromLanguage(this.getLanguageConfiguration(languageId), this.denseKeyProvider);
            this.languageIdToBracketTokens.set(languageId, singleLanguageBracketTokens);
        }
        return singleLanguageBracketTokens;
    }
}


/***/ },

/***/ 85753
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
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

/***/ 87676
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
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

/***/ 89044
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
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

"use strict";
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

/***/ 97036
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   $H: () => (/* binding */ nullTokenize),
/* harmony export */   Lh: () => (/* binding */ nullTokenizeEncoded),
/* harmony export */   r3: () => (/* binding */ NullState)
/* harmony export */ });
/* harmony import */ var _languages_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(44364);
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const NullState = new class {
    clone() {
        return this;
    }
    equals(other) {
        return (this === other);
    }
};
function nullTokenize(languageId, state) {
    return new _languages_js__WEBPACK_IMPORTED_MODULE_0__/* .TokenizationResult */ .$M([new _languages_js__WEBPACK_IMPORTED_MODULE_0__/* .Token */ .ou(0, '', languageId)], state);
}
function nullTokenizeEncoded(languageId, state) {
    const tokens = new Uint32Array(2);
    tokens[0] = 0;
    tokens[1] = ((languageId << 0 /* MetadataConsts.LANGUAGEID_OFFSET */)
        | (0 /* StandardTokenType.Other */ << 8 /* MetadataConsts.TOKEN_TYPE_OFFSET */)
        | (0 /* FontStyle.None */ << 11 /* MetadataConsts.FONT_STYLE_OFFSET */)
        | (1 /* ColorId.DefaultForeground */ << 15 /* MetadataConsts.FOREGROUND_OFFSET */)
        | (2 /* ColorId.DefaultBackground */ << 24 /* MetadataConsts.BACKGROUND_OFFSET */)) >>> 0;
    return new _languages_js__WEBPACK_IMPORTED_MODULE_0__/* .EncodedTokenizationResult */ .rY(tokens, state === null ? NullState : state);
}


/***/ }

}]);