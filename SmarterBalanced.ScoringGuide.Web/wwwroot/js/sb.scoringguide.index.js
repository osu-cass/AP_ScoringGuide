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
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__(0);
var ReactDOM = __webpack_require__(2);
var ItemViewerFrame = __webpack_require__(3);
var ScoringGuidePage = (function (_super) {
    __extends(ScoringGuidePage, _super);
    function ScoringGuidePage() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ScoringGuidePage.prototype.render = function () {
        return (React.createElement(ItemViewerFrame.ItemFrame, { url: "http://ivs.smarterbalanced.org/items?ids=187-1437" }));
    };
    return ScoringGuidePage;
}(React.Component));
exports.ScoringGuidePage = ScoringGuidePage;
function initializePage() {
    var container = document.getElementById("react-page-container");
    ReactDOM.render(React.createElement(ScoringGuidePage, null), container);
}
exports.initializePage = initializePage;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = ReactDOM;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__(0);
var ItemFrame = (function (_super) {
    __extends(ItemFrame, _super);
    function ItemFrame(props) {
        var _this = _super.call(this, props) || this;
        _this.startLoad = function () {
            _this.setState({
                loading: true
            });
        };
        _this.finishLoad = function () {
            _this.setState({
                loading: false
            });
        };
        _this.state = { loading: true };
        return _this;
    }
    ItemFrame.prototype.renderNoItem = function () {
        return (React.createElement("div", { className: "no-item" },
            React.createElement("p", null, "No Item Found")));
    };
    ItemFrame.prototype.renderItem = function () {
        var spinner = this.state.loading
            ? React.createElement("div", { className: "itemviewer-iframe-spinner" },
                React.createElement("img", { src: "/images/spin-large.gif" }))
            : null;
        return (React.createElement("div", { className: "itemViewerFrame", tabIndex: 0 },
            spinner,
            React.createElement("iframe", { id: "itemviewer-iframe", className: "itemviewer-iframe", onLoadStart: this.startLoad, onLoad: this.finishLoad, src: this.props.url })));
    };
    ItemFrame.prototype.render = function () {
        if (this.props.url) {
            return this.renderItem();
        }
        else {
            return this.renderNoItem();
        }
    };
    return ItemFrame;
}(React.Component));
exports.ItemFrame = ItemFrame;


/***/ })
/******/ ]);
//# sourceMappingURL=sb.scoringguide.index.js.map