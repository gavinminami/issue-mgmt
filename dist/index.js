/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it uses a non-standard name for the exports (exports).
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.hasLabel = exports.parseData = void 0;
function parseData(formData) {
    const lines = formData.split("\n");
    const jsondata = {};
    let key;
    let val = [];
    for (var i = 0; i < lines.length; i++) {
        console.log(lines[i]);
        const line = lines[i];
        if (line.startsWith("###")) {
            if (key !== undefined) {
                Object.assign(jsondata, {
                    [`${key}`]: val,
                });
                key = undefined;
            }
            key = line.split("### ")[1];
            console.log({ key });
            val = [];
        }
        else {
            val.push(line);
        }
    }
    if (key !== undefined) {
        Object.assign(jsondata, {
            [`${key}`]: val,
        });
    }
    return jsondata;
}
exports.parseData = parseData;
function hasLabel(issue, labelName) {
    const labels = issue?.data?.labels;
    return !!labels?.find(({ name }) => labelName === name);
}
exports.hasLabel = hasLabel;

})();

module.exports = __webpack_exports__;
/******/ })()
;