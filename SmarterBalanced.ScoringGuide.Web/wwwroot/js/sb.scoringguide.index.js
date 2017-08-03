var EntryPoint =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = React;

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["initializePage"] = initializePage;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_dom__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react_dom__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ItemViewerFrame__ = __webpack_require__(3);



class ScoringGuidePage extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {
    render() {
        return (__WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_2__ItemViewerFrame__["a" /* ItemFrame */], { url: "http://ivs.smarterbalanced.org/items?ids=187-1437" }));
    }
}
/* harmony export (immutable) */ __webpack_exports__["ScoringGuidePage"] = ScoringGuidePage;

function initializePage() {
    const container = document.getElementById("react-page-container");
    __WEBPACK_IMPORTED_MODULE_1_react_dom__["render"](__WEBPACK_IMPORTED_MODULE_0_react__["createElement"](ScoringGuidePage, null), container);
}


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = ReactDOM;

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);

class ItemFrame extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {
    constructor(props) {
        super(props);
        this.startLoad = () => {
            this.setState({
                loading: true
            });
        };
        this.finishLoad = () => {
            this.setState({
                loading: false
            });
        };
        this.state = { loading: true };
    }
    renderNoItem() {
        return (__WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("div", { className: "no-item" },
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("p", null, "No Item Found")));
    }
    renderItem() {
        const spinner = this.state.loading
            ? __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("div", { className: "itemviewer-iframe-spinner" },
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("img", { src: "/images/spin-large.gif" }))
            : null;
        return (__WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("div", { className: "itemViewerFrame", tabIndex: 0 },
            spinner,
            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("iframe", { id: "itemviewer-iframe", className: "itemviewer-iframe", onLoadStart: this.startLoad, onLoad: this.finishLoad, src: this.props.url })));
    }
    render() {
        if (this.props.url) {
            return this.renderItem();
        }
        else {
            return this.renderNoItem();
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ItemFrame;



/***/ })
/******/ ]);
//# sourceMappingURL=sb.scoringguide.index.js.map