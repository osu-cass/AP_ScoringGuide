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
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
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

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
function parseQueryString(url) {
    var queryObject = {};
    var pairs = url.slice(url.indexOf("?") + 1).split("&");
    for (var _i = 0, pairs_1 = pairs; _i < pairs_1.length; _i++) {
        var pair = pairs_1[_i];
        var pairParts = pair.split("=");
        if (pairParts[0] && pairParts[1]) {
            queryObject[pairParts[0]] = pairParts[1].split(",");
        }
    }
    return queryObject;
}
exports.parseQueryString = parseQueryString;
function get(url, params) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    $.ajax({
                        url: url,
                        dataType: "json",
                        traditional: true,
                        data: params,
                        success: resolve,
                        error: function (xhr, status, err) { return reject(new Error(err)); },
                        type: "GET"
                    });
                })];
        });
    });
}
exports.get = get;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/* tslint:disable:no-bitwise */
Object.defineProperty(exports, "__esModule", { value: true });
var GradeLevels;
(function (GradeLevels) {
    GradeLevels[GradeLevels["NA"] = 0] = "NA";
    GradeLevels[GradeLevels["Grade3"] = 1] = "Grade3";
    GradeLevels[GradeLevels["Grade4"] = 2] = "Grade4";
    GradeLevels[GradeLevels["Grade5"] = 4] = "Grade5";
    GradeLevels[GradeLevels["Grade6"] = 8] = "Grade6";
    GradeLevels[GradeLevels["Grade7"] = 16] = "Grade7";
    GradeLevels[GradeLevels["Grade8"] = 32] = "Grade8";
    GradeLevels[GradeLevels["Grade9"] = 64] = "Grade9";
    GradeLevels[GradeLevels["Grade10"] = 128] = "Grade10";
    GradeLevels[GradeLevels["Grade11"] = 256] = "Grade11";
    GradeLevels[GradeLevels["Grade12"] = 512] = "Grade12";
    GradeLevels[GradeLevels["Elementary"] = 7] = "Elementary";
    GradeLevels[GradeLevels["Middle"] = 56] = "Middle";
    GradeLevels[GradeLevels["High"] = 960] = "High";
    GradeLevels[GradeLevels["All"] = 1023] = "All";
})(GradeLevels = exports.GradeLevels || (exports.GradeLevels = {}));
function caseToString(grade) {
    switch (grade) {
        case GradeLevels.NA: return "NA";
        case GradeLevels.Grade3: return "Grade 3";
        case GradeLevels.Grade4: return "Grade 4";
        case GradeLevels.Grade5: return "Grade 5";
        case GradeLevels.Grade6: return "Grade 6";
        case GradeLevels.Grade7: return "Grade 7";
        case GradeLevels.Grade8: return "Grade 8";
        case GradeLevels.Grade9: return "Grade 9";
        case GradeLevels.Grade10: return "Grade 10";
        case GradeLevels.Grade11: return "Grade 11";
        case GradeLevels.Grade12: return "Grade 12";
        case GradeLevels.Elementary: return "Elementary";
        case GradeLevels.Middle: return "Middle";
        case GradeLevels.High: return "High";
        default: return "";
    }
}
exports.caseToString = caseToString;
function toString(grades) {
    var caseString = caseToString(grades);
    if (caseString !== "") {
        return caseString;
    }
    var gradeStrings = [];
    for (var i = 0; i < 10; i++) {
        if ((grades & 1 << i) === 1 << i) {
            gradeStrings.push(caseToString(1 << i));
        }
    }
    return gradeStrings.join(", ");
}
exports.toString = toString;
function contains(haystack, needle) {
    return (haystack & needle) === needle;
}
exports.contains = contains;


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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__(0);
var ReactDOM = __webpack_require__(4);
var ItemModels = __webpack_require__(5);
var ItemCard = __webpack_require__(6);
var GradeLevels = __webpack_require__(2);
var ItemCardViewer = __webpack_require__(7);
var AboutItem = __webpack_require__(12);
var ItemTable = __webpack_require__(13);
var ItemSearchDropdown = __webpack_require__(14);
var client = {
    itemsSearch: function (params, onSuccess, onError) {
        $.ajax({
            dataType: "json",
            url: "/ScoringGuide/search",
            traditional: true,
            data: params,
            success: onSuccess,
            error: onError
        });
    }
};
var ScoringGuidePage = (function (_super) {
    __extends(ScoringGuidePage, _super);
    function ScoringGuidePage(props) {
        var _this = _super.call(this, props) || this;
        _this.headerColumns = ItemTable.headerColumns;
        //row is selected passed from item table
        _this.onSelectItem = function (item) {
            _this.setState({
                selectedRow: item
            });
            AboutItem.ScoreSearchClient({ bankKey: item.bankKey, itemKey: item.itemKey })
                .then(function (data) { return _this.onAboutItemSuccess(data); })
                .catch(function (err) { return _this.onAboutItemError(err); });
        };
        _this.onClickHeader = function (col) {
            var newSorts = (_this.state.sorts || []).slice();
            var headIdx = newSorts.findIndex(function (hs) { return hs.col.header === col.header; });
            if (headIdx !== -1) {
                var newSort = Object.assign({}, newSorts[headIdx]);
                if (newSort.direction == ItemTable.SortDirection.Ascending) {
                    newSort.direction = ItemTable.SortDirection.Descending;
                }
                else if (newSort.direction == ItemTable.SortDirection.Descending) {
                    newSort.direction = ItemTable.SortDirection.NoSort;
                }
                else {
                    newSort.direction = ItemTable.SortDirection.Ascending;
                }
                newSorts[headIdx] = newSort;
            }
            else {
                var newSort = {
                    col: col,
                    direction: ItemTable.SortDirection.Ascending,
                    resetSortCount: 0
                };
                newSorts.push(newSort);
            }
            _this.setState({ sorts: newSorts });
        };
        _this.state = {
            searchParams: {
                gradeLevels: GradeLevels.GradeLevels.NA,
                subjects: [],
                techType: []
            },
            itemSearchResult: { kind: "loading" },
            selectedItem: { kind: "loading" },
            sorts: [],
            subjects: props.subjects,
            interactionTypes: props.interactionTypes,
        };
        return _this;
    }
    //on load success, after row is selected
    ScoringGuidePage.prototype.onAboutItemSuccess = function (item) {
        this.setState({
            selectedItem: { kind: "success", content: item }
        });
    };
    ScoringGuidePage.prototype.onAboutItemError = function (err) {
        console.error(err);
    };
    ScoringGuidePage.prototype.onSearchSuccess = function (result) {
        var searchParams = this.state.searchParams;
        var items = result;
        this.setState({
            itemSearchResult: { kind: "success", content: items },
        });
    };
    ScoringGuidePage.prototype.onSearchError = function (err) {
        console.log(err);
    };
    ScoringGuidePage.prototype.callSearch = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var searchParams;
            return __generator(this, function (_a) {
                searchParams = this.state.searchParams;
                return [2 /*return*/, ItemModels.ScoreSearchClient(searchParams)
                        .then(function (data) { return _this.onSearchSuccess(data); })
                        .catch(function (err) { return _this.onSearchError(err); })];
            });
        });
    };
    ScoringGuidePage.prototype.isLoading = function () {
        return this.state.itemSearchResult.kind === "loading" || this.state.itemSearchResult.kind === "reloading";
    };
    ScoringGuidePage.prototype.renderAboutItemDetails = function () {
        var selectedResult = this.state.selectedItem;
        if (selectedResult.kind == "success" && selectedResult.content) {
            var itemCard = selectedResult.content.itemCardViewModel;
            return (React.createElement("div", null,
                React.createElement(ItemCardViewer.ItemCardViewer, { aboutItem: selectedResult.content })));
        }
        else {
            return (React.createElement("div", null));
        }
    };
    ScoringGuidePage.prototype.invokeMultiSort = function (lhs, rhs) {
        var sorts = this.state.sorts || [];
        for (var _i = 0, sorts_1 = sorts; _i < sorts_1.length; _i++) {
            var sort = sorts_1[_i];
            var diff = sort.col.compare(lhs, rhs) * sort.direction;
            if (diff !== 0) {
                return diff;
            }
        }
        return 0;
    };
    //Post sorted table data.
    ScoringGuidePage.prototype.getTableData = function (data) {
        var _this = this;
        var sortedData = this.state.sorts && this.state.sorts.length !== 0
            ? data.sort(function (lhs, rhs) { return _this.invokeMultiSort(lhs, rhs); })
            : data;
        return sortedData;
    };
    ScoringGuidePage.prototype.onSearch = function (results) {
        this.setState({ itemSearchResult: { kind: "success", content: results } });
    };
    ScoringGuidePage.prototype.onError = function (err) {
        this.setState({ itemSearchResult: { kind: "failure" } });
        console.error(err);
    };
    ScoringGuidePage.prototype.selectSingleResult = function () {
        var searchResults = this.state.itemSearchResult;
        if (searchResults.kind === "success" && searchResults.content.length === 1) {
            var searchResult = searchResults.content[0];
            ItemCard.itemPageLink(searchResult.bankKey, searchResult.itemKey);
        }
    };
    ScoringGuidePage.prototype.beginSearch = function (params) {
        var searchResults = this.state.itemSearchResult;
        if (searchResults.kind === "success") {
            this.setState({
                itemSearchResult: {
                    kind: "reloading",
                    content: searchResults.content
                }
            });
        }
        else if (searchResults.kind === "failure") {
            this.setState({
                itemSearchResult: { kind: "loading" }
            });
        }
        this.props.apiClient.itemsSearch(params, this.onSearch.bind(this), this.onError.bind(this));
    };
    ScoringGuidePage.prototype.renderSearchControls = function (isLoading) {
        var _this = this;
        return (React.createElement("div", { className: "search-controls" },
            React.createElement("a", null, "Print Items"),
            React.createElement(ItemSearchDropdown.ItemSearchDropdown, { interactionTypes: this.state.interactionTypes, subjects: this.state.subjects, onChange: function (params) { return _this.beginSearch(params); }, selectSingleResult: function () { return _this.selectSingleResult(); }, isLoading: isLoading })));
    };
    ScoringGuidePage.prototype.renderSearch = function () {
        var _this = this;
        var searchResults = this.state.itemSearchResult;
        var resultElement;
        if (searchResults.kind === "success" || searchResults.kind === "reloading") {
            if (searchResults.content == null || searchResults.content.length === 0) {
                resultElement = React.createElement("span", { className: "placeholder-text", role: "alert" }, "No results found for the given search terms.");
            }
            else {
                resultElement =
                    React.createElement("div", { className: "search-results" },
                        React.createElement(ItemTable.HeaderTable, { sorts: this.state.sorts, onHeaderClick: this.onClickHeader, columns: this.headerColumns }),
                        React.createElement(ItemTable.DataTable, { mapRows: this.getTableData(searchResults.content), rowOnClick: this.onSelectItem, sort: this.state.sorts, tableRef: function (ref) { return _this.dataTableRef = ref; }, columns: this.headerColumns, selectedRow: this.state.selectedRow }));
            }
        }
        else if (searchResults.kind === "failure") {
            resultElement = React.createElement("div", { className: "placeholder-text", role: "alert" }, "An error occurred. Please try again later.");
        }
        return resultElement;
    };
    ScoringGuidePage.prototype.render = function () {
        var isLoading = this.isLoading();
        return (React.createElement("div", { className: "search-page" },
            React.createElement("div", { className: "search-container" },
                this.renderSearchControls(isLoading),
                this.renderSearch()),
            this.renderAboutItemDetails()));
    };
    return ScoringGuidePage;
}(React.Component));
exports.ScoringGuidePage = ScoringGuidePage;
function initializePage(viewModel) {
    var container = document.getElementById("react-page-container");
    ReactDOM.render(React.createElement(ScoringGuidePage, __assign({ apiClient: client }, viewModel)), container);
}
exports.initializePage = initializePage;


/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = ReactDOM;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var API = __webpack_require__(1);
exports.ScoreSearchClient = function (params) { return API.get("/ScoringGuide/Search", params); };


/***/ }),
/* 6 */
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
function itemPageLink(bankKey, itemKey) {
    window.location.href = "/Item/Details?bankKey=" + bankKey + "&itemKey=" + itemKey;
}
exports.itemPageLink = itemPageLink;
var ItemCard = (function (_super) {
    __extends(ItemCard, _super);
    function ItemCard() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ItemCard.prototype.handleKeyPress = function (bankKey, itemKey, e) {
        if (e.keyCode === 13 || e.keyCode === 23) {
            itemPageLink(bankKey, itemKey);
        }
    };
    ItemCard.prototype.shouldComponentUpdate = function (nextProps, nextState, nextContext) {
        return false;
    };
    ItemCard.prototype.render = function () {
        var _this = this;
        var _a = this.props, bankKey = _a.bankKey, itemKey = _a.itemKey;
        return (React.createElement("div", { className: "card card-block " + this.props.subjectCode.toLowerCase(), onClick: function (e) { return itemPageLink(bankKey, itemKey); }, onKeyUp: function (e) { return _this.handleKeyPress(bankKey, itemKey, e); }, tabIndex: 0 },
            React.createElement("div", { className: "card-contents" },
                React.createElement("h4", { className: "card-title", onClick: function (e) { return itemPageLink(bankKey, itemKey); }, onKeyUp: function (e) { return _this.handleKeyPress(bankKey, itemKey, e); } }, this.props.title),
                React.createElement("p", { className: "card-text subject" },
                    React.createElement("span", { className: "card-text-label" }, "Subject:"),
                    React.createElement("span", { className: "card-text-value" },
                        " ",
                        this.props.subjectLabel)),
                React.createElement("p", { className: "card-text grade" },
                    React.createElement("span", { className: "card-text-label" }, "Grade:"),
                    React.createElement("span", { className: "card-text-value" },
                        " ",
                        this.props.gradeLabel)),
                React.createElement("p", { className: "card-text claim" },
                    React.createElement("span", { className: "card-text-label" }, "Claim:"),
                    React.createElement("span", { className: "card-text-value" },
                        " ",
                        this.props.claimLabel)),
                React.createElement("p", { className: "card-text target" },
                    React.createElement("span", { className: "card-text-label" }, "Target:"),
                    React.createElement("span", { className: "card-text-value" },
                        " ",
                        this.props.target)),
                React.createElement("p", { className: "card-text interaction-type" },
                    React.createElement("span", { className: "card-text-label" }, "Item Type:"),
                    React.createElement("span", { className: "card-text-value" },
                        " ",
                        this.props.interactionTypeLabel)),
                React.createElement("p", { className: "card-text item-id" },
                    React.createElement("span", { className: "card-text-label" }, "Item Id:"),
                    React.createElement("span", { className: "card-text-value" },
                        " ",
                        this.props.itemKey)))));
    };
    return ItemCard;
}(React.Component));
exports.ItemCard = ItemCard;
var ItemCardCondensed = (function (_super) {
    __extends(ItemCardCondensed, _super);
    function ItemCardCondensed() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ItemCardCondensed.prototype.handleKeyPress = function (bankKey, itemKey, e) {
        if (e.keyCode === 13) {
            itemPageLink(bankKey, itemKey);
        }
    };
    ItemCardCondensed.prototype.render = function () {
        var _this = this;
        var _a = this.props, bankKey = _a.bankKey, itemKey = _a.itemKey;
        return (React.createElement("div", { className: "card card-block " + this.props.subjectCode.toLowerCase() + " condensed", onClick: function (e) { return itemPageLink(bankKey, itemKey); }, onKeyUp: function (e) { return _this.handleKeyPress(bankKey, itemKey, e); }, tabIndex: 0 },
            React.createElement("div", { className: "card-contents" },
                React.createElement("h4", { className: "card-title" }, this.props.subjectLabel),
                React.createElement("p", { className: "card-text claim" },
                    React.createElement("span", { className: "card-text-label" }, "Claim:"),
                    React.createElement("span", { className: "card-text-value" },
                        " ",
                        this.props.claimLabel)),
                React.createElement("p", { className: "card-text target" },
                    React.createElement("span", { className: "card-text-label" }, "Target:"),
                    React.createElement("span", { className: "card-text-value" },
                        " ",
                        this.props.target)),
                React.createElement("p", { className: "card-text interaction-type" },
                    React.createElement("span", { className: "card-text-label" }, "Item Type:"),
                    React.createElement("span", { className: "card-text-value" },
                        " ",
                        this.props.interactionTypeLabel)),
                React.createElement("p", { className: "card-text item-id" },
                    React.createElement("span", { className: "card-text-label" }, "Item Id:"),
                    React.createElement("span", { className: "card-text-value" },
                        " ",
                        this.props.itemKey)))));
    };
    return ItemCardCondensed;
}(React.Component));
exports.ItemCardCondensed = ItemCardCondensed;


/***/ }),
/* 7 */
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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__(0);
var Rubric = __webpack_require__(8);
var PageTabs = __webpack_require__(9);
var ItemViewerFrame = __webpack_require__(10);
var ItemInformation = __webpack_require__(11);
var ItemCardViewer = (function (_super) {
    __extends(ItemCardViewer, _super);
    function ItemCardViewer(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            selectedTab: "viewer"
        };
        return _this;
    }
    ItemCardViewer.prototype.onTabChange = function (tab) {
        this.setState({
            selectedTab: tab
        });
    };
    ItemCardViewer.prototype.renderChosen = function () {
        var selectedTab = this.state.selectedTab;
        var itemCard = this.props.aboutItem.itemCardViewModel;
        if (selectedTab == "viewer") {
            var url = "http://ivs.smarterbalanced.org/items?ids=" + itemCard.bankKey.toString() + "-" + itemCard.itemKey.toString();
            return (React.createElement("div", { className: "item-content" },
                React.createElement(ItemViewerFrame.ItemFrame, { url: url })));
        }
        else if (selectedTab == "rubric") {
            var rubrics = this.props.aboutItem.rubrics.map(function (ru, i) { return React.createElement(Rubric.RubricComponent, __assign({}, ru, { key: String(i) })); });
            return (React.createElement("div", { className: "item-content" }, rubrics));
        }
        else if (selectedTab == "information") {
            return (React.createElement("div", { className: "item-content" },
                React.createElement("div", null,
                    React.createElement(ItemInformation.ItemInformationDetail, { itemCardViewModel: this.props.aboutItem.itemCardViewModel, depthOfKnowledge: this.props.aboutItem.depthOfKnowledge, commonCoreStandardsDescription: this.props.aboutItem.commonCoreStandardsDescription, targetDescription: this.props.aboutItem.targetDescription, educationalDifficulty: this.props.aboutItem.educationalDifficulty, evidenceStatement: this.props.aboutItem.evidenceStatement }))));
        }
    };
    ItemCardViewer.prototype.render = function () {
        var _this = this;
        var tabs = PageTabs.ItemTabs;
        return (React.createElement("div", { className: "item-card" },
            React.createElement(PageTabs.ItemTabs, { changedTab: function (tab) { return _this.onTabChange(tab); }, selectedTab: this.state.selectedTab }),
            this.renderChosen()));
    };
    return ItemCardViewer;
}(React.Component));
exports.ItemCardViewer = ItemCardViewer;


/***/ }),
/* 8 */
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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__(0);
var RubricEntryComponent = (function (_super) {
    __extends(RubricEntryComponent, _super);
    function RubricEntryComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RubricEntryComponent.prototype.render = function () {
        var pointLabel = this.props.scorepoint === "1" ? "point" : "points";
        var label = this.props.name + " (" + this.props.scorepoint + " " + pointLabel + ")";
        return (React.createElement("div", { dangerouslySetInnerHTML: { __html: this.props.value } }));
    };
    return RubricEntryComponent;
}(React.Component));
exports.RubricEntryComponent = RubricEntryComponent;
var SampleResponseComponent = (function (_super) {
    __extends(SampleResponseComponent, _super);
    function SampleResponseComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SampleResponseComponent.prototype.render = function () {
        var pointLabel = this.props.scorePoint == "1" ? "point" : "points";
        var label = this.props.name + " (" + this.props.scorePoint + " " + pointLabel + ")";
        return (React.createElement("div", { className: "sample-response" },
            React.createElement("b", null, "Purpose: "),
            " ",
            this.props.purpose,
            " ",
            React.createElement("br", null),
            React.createElement("b", null, "Sample Response: "),
            " ",
            React.createElement("br", null),
            React.createElement("div", { dangerouslySetInnerHTML: { __html: this.props.sampleContent } })));
    };
    return SampleResponseComponent;
}(React.Component));
exports.SampleResponseComponent = SampleResponseComponent;
var RubricComponent = (function (_super) {
    __extends(RubricComponent, _super);
    function RubricComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RubricComponent.prototype.renderRubrics = function () {
        var rubricEntries = this.props.rubricEntries.map(function (re, i) { return React.createElement(RubricEntryComponent, __assign({}, re, { key: String(i) })); });
        if (rubricEntries.length === 0) {
            return null;
        }
        var rubrics = (React.createElement("div", null,
            React.createElement("h4", null, "Rubrics"),
            rubricEntries));
        return rubrics;
    };
    RubricComponent.prototype.renderSampleResponses = function () {
        var rubricSamples = [];
        var i = 0;
        var _loop_1 = function (sample) {
            var key = i + ":";
            var responses = sample.sampleResponses.map(function (sr, idx) { return React.createElement(SampleResponseComponent, __assign({}, sr, { key: key + String(idx) })); });
            rubricSamples.push.apply(rubricSamples, responses);
            i++;
        };
        for (var _i = 0, _a = this.props.samples; _i < _a.length; _i++) {
            var sample = _a[_i];
            _loop_1(sample);
        }
        if (rubricSamples.length === 0) {
            return null;
        }
        var sampleResponses = (React.createElement("div", null,
            React.createElement("h4", null, "Sample Responses"),
            rubricSamples));
        return sampleResponses;
    };
    RubricComponent.prototype.render = function () {
        var label = this.props.language + " Rubric";
        return (React.createElement("div", { className: "item-information-content" },
            this.renderRubrics(),
            this.renderSampleResponses()));
    };
    return RubricComponent;
}(React.Component));
exports.RubricComponent = RubricComponent;


/***/ }),
/* 9 */
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
var ItemTabs = (function (_super) {
    __extends(ItemTabs, _super);
    function ItemTabs(props) {
        var _this = _super.call(this, props) || this;
        _this.onClick = function (selectedVal) {
            _this.props.changedTab(selectedVal);
        };
        _this.state = {
            selectedTab: _this.props.selectedTab
        };
        return _this;
    }
    ItemTabs.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", { className: "tabs" },
            React.createElement("div", { className: this.props.selectedTab == "viewer" ? "selected-tab" : "tab-not-selected", onClick: function () { return _this.onClick("viewer"); } }, "Item Viewer"),
            React.createElement("div", { className: this.props.selectedTab == "rubric" ? "selected-tab" : "tab-not-selected", onClick: function () { return _this.onClick("rubric"); } }, "Rubric and Exemplar"),
            React.createElement("div", { className: this.props.selectedTab == "information" ? "selected-tab" : "tab-not-selected", onClick: function () { return _this.onClick("information"); } }, "Item Information")));
    };
    return ItemTabs;
}(React.Component));
exports.ItemTabs = ItemTabs;


/***/ }),
/* 10 */
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


/***/ }),
/* 11 */
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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__(0);
var ItemInformation = (function (_super) {
    __extends(ItemInformation, _super);
    function ItemInformation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ItemInformation.prototype.render = function () {
        return (React.createElement("div", { className: "modal fade", id: "about-item-modal-container", tabIndex: -1, role: "dialog", "aria-labelledby": "About Item Modal", "aria-hidden": "true" },
            React.createElement("div", { className: "modal-dialog about-item-modal", role: "document" },
                React.createElement("div", { className: "modal-content" },
                    React.createElement("div", { className: "modal-header" },
                        React.createElement("button", { type: "button", className: "close", "data-dismiss": "modal", "aria-label": "Close" },
                            React.createElement("span", { "aria-hidden": "true" }, "\u00D7")),
                        React.createElement("h4", { className: "modal-title" }, "About This Item")),
                    React.createElement("div", { className: "modal-body" },
                        React.createElement(ItemInformationDetail, __assign({}, this.props))),
                    React.createElement("div", { className: "modal-footer" },
                        React.createElement("button", { className: "btn btn-primary", form: "accessibility-form", "data-dismiss": "modal" }, "Close"))))));
    };
    return ItemInformation;
}(React.Component));
exports.ItemInformation = ItemInformation;
var ItemInformationDetail = (function (_super) {
    __extends(ItemInformationDetail, _super);
    function ItemInformationDetail() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ItemInformationDetail.prototype.renderField = function (label, value, className) {
        if (!value) {
            return null;
        }
        return (React.createElement("p", { className: "card-text " + className, tabIndex: 0 },
            React.createElement("span", { className: "card-text-label" },
                label,
                ":"),
            React.createElement("span", { className: "card-text-value" },
                " ",
                value)));
    };
    ItemInformationDetail.prototype.render = function () {
        return (React.createElement("div", { className: "item-information-content" },
            this.renderField("Subject", this.props.itemCardViewModel.subjectLabel, "subject"),
            this.renderField("Grade", this.props.itemCardViewModel.gradeLabel, "grade"),
            this.renderField("Claim", this.props.itemCardViewModel.claimLabel, "claim"),
            this.renderField("Target", this.props.itemCardViewModel.target, "target"),
            this.renderField("Item Type", this.props.itemCardViewModel.interactionTypeLabel, "interaction-type"),
            this.renderField("Item Id", this.props.itemCardViewModel.itemKey, "item-id"),
            this.renderField("Depth of Knowledge", this.props.depthOfKnowledge, "dok"),
            this.renderField("Common Core State Standard", this.props.commonCoreStandardsDescription, "ccss"),
            this.renderField("Target Description", this.props.targetDescription, "target-description"),
            this.renderField("Educational Difficulty", this.props.educationalDifficulty, "educational-difficulty"),
            this.renderField("Evidence Statement", this.props.evidenceStatement, "evidence-statement")));
    };
    return ItemInformationDetail;
}(React.Component));
exports.ItemInformationDetail = ItemInformationDetail;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var API = __webpack_require__(1);
exports.ScoreSearchClient = function (params) { return API.get("/ScoringGuide/AboutThisItem", params); };


/***/ }),
/* 13 */
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
var SortDirection;
(function (SortDirection) {
    SortDirection[SortDirection["NoSort"] = 0] = "NoSort";
    SortDirection[SortDirection["Ascending"] = 1] = "Ascending";
    SortDirection[SortDirection["Descending"] = -1] = "Descending";
})(SortDirection = exports.SortDirection || (exports.SortDirection = {}));
var invokeResetSortLimit = 2;
var decendingArrow = (React.createElement("span", { "aria-label": "Decend" }, "\u25BC"));
var acendingArrow = (React.createElement("span", { "aria-label": "Ascend" }, "\u25B2"));
var noSort = (React.createElement("span", { "aria-label": "NoSort" }));
exports.headerColumns = [
    {
        header: "Item",
        className: "item",
        accessor: function (label) { return label.itemKey; },
        compare: function (a, b) { return (a.itemKey) - (b.itemKey); }
    },
    {
        header: "Claim/Target",
        className: "claimAndTarget",
        accessor: function (label) { return label.claimLabel + "/" + label.target; },
        compare: function (a, b) {
            if (a.claimCode < b.claimCode || a.target < b.target) {
                return 1;
            }
            else if (a.claimCode > b.claimCode || a.target > b.target) {
                return -1;
            }
            else {
                return 0;
            }
        }
    },
    {
        header: "Subject",
        className: "subject",
        accessor: function (label) { return label.subjectLabel; },
        compare: function (a, b) { return (a.subjectCode).localeCompare(b.subjectCode); }
    },
    {
        header: "Grade",
        className: "grade",
        accessor: function (label) { return label.gradeLabel; },
        compare: function (a, b) { return (a.grade) - (b.grade); }
    },
    {
        header: "Item Type",
        className: "interactionType",
        accessor: function (label) { return label.interactionTypeLabel; },
        compare: function (a, b) { return (a.interactionTypeCode).localeCompare(b.interactionTypeCode); }
    },
];
var HeaderTable = (function (_super) {
    __extends(HeaderTable, _super);
    function HeaderTable(props) {
        return _super.call(this, props) || this;
    }
    HeaderTable.prototype.compareColumn = function (lhs, rhs) {
        var sorts = this.props.sorts || [];
        for (var _i = 0, sorts_1 = sorts; _i < sorts_1.length; _i++) {
            var sort = sorts_1[_i];
            var diff = sort.col.compare(lhs, rhs) * sort.direction;
            if (diff !== 0) {
                return diff;
            }
        }
        return 0;
    };
    HeaderTable.prototype.headerEventHandler = function (scol, hcol) {
        this.props.onHeaderClick(scol);
    };
    HeaderTable.prototype.renderHeader = function (col) {
        var _this = this;
        var dirElem;
        var headerSort = this.props.sorts.find(function (hs) { return hs.col.header === col.header; });
        if (!headerSort) {
            dirElem = noSort;
        }
        else if (headerSort.direction === SortDirection.Ascending) {
            dirElem = acendingArrow;
        }
        else if (headerSort.direction === SortDirection.Descending) {
            dirElem = decendingArrow;
        }
        else {
            dirElem = noSort;
        }
        return (React.createElement("th", { key: col.header, className: col.className, onClick: function () { return _this.headerEventHandler(col, headerSort); } },
            React.createElement("div", { className: col.className },
                dirElem,
                " ",
                col.header)));
    };
    HeaderTable.prototype.render = function () {
        var _this = this;
        return (React.createElement("table", { className: "item-table table mapcomponent-table" },
            React.createElement("thead", null,
                React.createElement("tr", { className: "primary" },
                    React.createElement("th", null),
                    this.props.columns.map(function (col) { return _this.renderHeader(col); })))));
    };
    return HeaderTable;
}(React.Component));
exports.HeaderTable = HeaderTable;
var DataTable = (function (_super) {
    __extends(DataTable, _super);
    function DataTable(props) {
        return _super.call(this, props) || this;
    }
    DataTable.prototype.renderCell = function (col, cellData) {
        return (React.createElement("td", { key: col.header, className: col.className },
            React.createElement("div", { className: col.className }, col.accessor(cellData))));
    };
    //TODO replace X with checkmark icon 
    DataTable.prototype.renderRow = function (rowData, index) {
        var _this = this;
        var isSelected = false;
        if (this.props.selectedRow) {
            isSelected = rowData.itemKey === this.props.selectedRow.itemKey
                && rowData.bankKey === this.props.selectedRow.bankKey;
        }
        return (React.createElement("tr", { key: index, className: isSelected ? "selected" : "", onClick: function () {
                _this.props.rowOnClick(rowData);
            } },
            React.createElement("td", null, isSelected ? "X" : ""),
            this.props.columns.map(function (col) { return _this.renderCell(col, rowData); })));
    };
    DataTable.prototype.renderRows = function () {
        var _this = this;
        var rows = this.props.mapRows.map(function (rowData, idx) { return _this.renderRow(rowData, idx); });
        return (React.createElement("tbody", null, rows));
    };
    DataTable.prototype.render = function () {
        return (React.createElement("table", { className: "item-table table table-striped mapcomponent-table", ref: this.props.tableRef }, this.renderRows()));
    };
    return DataTable;
}(React.Component));
exports.DataTable = DataTable;


/***/ }),
/* 14 */
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
var GradeLevels = __webpack_require__(2);
var ApiModels_1 = __webpack_require__(1);
var ItemSearchDropdown = (function (_super) {
    __extends(ItemSearchDropdown, _super);
    function ItemSearchDropdown(props) {
        var _this = _super.call(this, props) || this;
        _this.toggleGrades = function (event) {
            _this.setState({
                // Exclusive OR to flip just the bits for the input grades
                gradeLevels: Number(event.currentTarget.value) // tslint:disable-line:no-bitwise
            }, function () { return _this.beginChangeTimeout(); });
        };
        _this.toggleSubject = function (event) {
            var subject = event.currentTarget.value;
            var subjectCodes = _this.state.subjects || [];
            var newSubjectCodes = [];
            if (subject !== "NA") {
                newSubjectCodes = [subject];
            }
            var newSubjects = _this.props.subjects.filter(function (s) { return subject.indexOf(s.code) !== -1; });
            // Remove all claims not contained by the newly selected subjects
            var subjectClaimCodes = newSubjects.reduce(function (prev, cur) { return prev.concat(cur.claims.map(function (c) { return c.code; })); }, []);
            var newClaimCodes = _this.state.claims.filter(function (c) { return subjectClaimCodes.indexOf(c) !== -1; });
            var subjectInteractionCodes = newSubjects.reduce(function (prev, cur) { return prev.concat(cur.interactionTypeCodes); }, []);
            var newInteractionCodes = _this.state.interactionTypes.filter(function (i) { return subjectInteractionCodes.indexOf(i) !== -1; });
            _this.setState({
                subjects: newSubjectCodes,
                claims: newClaimCodes,
                interactionTypes: newInteractionCodes
            }, function () { return _this.beginChangeTimeout(); });
        };
        _this.toggleClaim = function (event) {
            var claim = event.currentTarget.value;
            var allClaims = _this.state.claims;
            var newClaims = [];
            if (claim !== "NA") {
                newClaims = [claim];
            }
            _this.setState({
                claims: newClaims
            }, function () { return _this.beginChangeTimeout(); });
        };
        _this.toggleInteractionType = function (event) {
            var code = event.currentTarget.value;
            var allInteractionTypes = _this.state.interactionTypes;
            var newInteractionType = [];
            if (code !== "NA") {
                newInteractionType = [code];
            }
            _this.setState({
                interactionTypes: newInteractionType
            }, function () { return _this.beginChangeTimeout(); });
        };
        var queryObject = ApiModels_1.parseQueryString(location.search);
        var itemId = (queryObject["itemID"] || [])[0] || "";
        var gradeString = (queryObject["gradeLevels"] || [])[0];
        var gradeLevels = parseInt(gradeString, 10) || GradeLevels.GradeLevels.NA;
        var subjects = queryObject["subjects"] || [];
        var claims = queryObject["claims"] || [];
        var interactionTypes = queryObject["interactionTypes"] || [];
        var performanceOnly = (queryObject["performanceOnly"] || [])[0] === "true";
        _this.state = {
            itemId: itemId,
            gradeLevels: gradeLevels,
            subjects: subjects,
            claims: claims,
            interactionTypes: interactionTypes,
            performanceOnly: performanceOnly
        };
        _this.onChange();
        return _this;
    }
    ItemSearchDropdown.prototype.encodeQuery = function () {
        var pairs = [];
        if (this.state.claims && this.state.claims.length !== 0) {
            pairs.push("claims=" + this.state.claims.join(","));
        }
        if (this.state.gradeLevels !== GradeLevels.GradeLevels.NA) {
            pairs.push("gradeLevels=" + this.state.gradeLevels);
        }
        if (this.state.interactionTypes && this.state.interactionTypes.length !== 0) {
            pairs.push("interactionTypes=" + this.state.interactionTypes.join(","));
        }
        if (this.state.itemId) {
            pairs.push("itemID=" + this.state.itemId);
        }
        if (this.state.subjects && this.state.subjects.length !== 0) {
            pairs.push("subjects=" + this.state.subjects.join(","));
        }
        if (this.state.performanceOnly) {
            pairs.push("performanceOnly=true");
        }
        if (pairs.length === 0) {
            return "/ScoringGuide";
        }
        var query = "?" + pairs.join("&");
        return query;
    };
    ItemSearchDropdown.prototype.beginChangeTimeout = function () {
        var _this = this;
        if (this.timeoutToken !== undefined) {
            clearTimeout(this.timeoutToken);
        }
        this.timeoutToken = setTimeout(function () { return _this.onChange(); }, 200);
    };
    ItemSearchDropdown.prototype.onChange = function () {
        var params = {
            itemId: this.state.itemId || "",
            gradeLevels: this.state.gradeLevels || GradeLevels.GradeLevels.All,
            subjects: this.state.subjects || [],
            claims: this.state.claims || [],
            interactionTypes: this.state.interactionTypes || [],
            performanceOnly: this.state.performanceOnly || false
        };
        this.props.onChange(params);
    };
    ItemSearchDropdown.prototype.onItemIDInput = function (e) {
        var _this = this;
        var newValue = e.currentTarget.value;
        var isInputOK = /^\d{0,4}$/.test(newValue);
        if (isInputOK) {
            this.setState({
                itemId: newValue
            }, function () { return _this.beginChangeTimeout(); });
        }
    };
    ItemSearchDropdown.prototype.onItemIDKeyUp = function (e) {
        if (e.keyCode === 13) {
            this.props.selectSingleResult();
        }
    };
    ItemSearchDropdown.prototype.togglePerformanceOnly = function () {
        var _this = this;
        this.setState({
            performanceOnly: !this.state.performanceOnly
        }, function () { return _this.beginChangeTimeout(); });
    };
    ItemSearchDropdown.prototype.resetFilters = function () {
        var _this = this;
        this.setState({
            itemId: "",
            gradeLevels: GradeLevels.GradeLevels.NA,
            subjects: [],
            claims: [],
            interactionTypes: []
        }, function () { return _this.beginChangeTimeout(); });
    };
    ItemSearchDropdown.prototype.keyPressResetFilters = function (e) {
        if (e.keyCode === 0 || e.keyCode === 13 || e.keyCode === 32) {
            this.resetFilters();
        }
    };
    ItemSearchDropdown.prototype.render = function () {
        var _this = this;
        history.replaceState(null, "", this.encodeQuery());
        return (React.createElement("div", { className: "search-params" },
            React.createElement("div", { className: "search-header" },
                React.createElement("h1", { className: "search-title", tabIndex: 0 }, "Browse Items"),
                React.createElement("div", { className: "search-status" },
                    this.props.isLoading ? React.createElement("img", { src: "images/spin.gif", className: "spin" }) : undefined,
                    React.createElement("div", null,
                        React.createElement("a", { onClick: function () { return _this.resetFilters(); }, onKeyPress: function (e) { return _this.keyPressResetFilters(e); }, tabIndex: 0 }, "Reset filters")))),
            React.createElement("div", { className: "search-categories", "aria-live": "polite", "aria-relevant": "additions removals" },
                this.renderGrades(),
                this.renderSubjects(),
                this.renderClaims(),
                this.renderInteractionTypes())));
    };
    ItemSearchDropdown.prototype.renderGrades = function () {
        var tags = [
            React.createElement("option", { key: 1, value: GradeLevels.GradeLevels.NA }, "NA"),
            React.createElement("option", { key: 2, value: GradeLevels.GradeLevels.Elementary }, "Elementary"),
            React.createElement("option", { key: 3, value: GradeLevels.GradeLevels.Middle }, "Middle"),
            React.createElement("option", { key: 4, value: GradeLevels.GradeLevels.High }, "High"),
        ];
        return (React.createElement("select", { value: this.state.gradeLevels, onChange: this.toggleGrades }, tags));
    };
    ItemSearchDropdown.prototype.renderSingleSubject = function (subject) {
        var subjects = this.state.subjects;
        var containsSubject = subjects.indexOf(subject.code) !== -1;
        var className = (containsSubject ? "selected" : "") + " tag";
        return (React.createElement("option", { key: subject.code, value: subject.code }, subject.label));
    };
    ItemSearchDropdown.prototype.renderSubjects = function () {
        var _this = this;
        var tags = [React.createElement("option", { key: 0 }, "NA"), this.props.subjects.map(function (s) { return _this.renderSingleSubject(s); })];
        return (React.createElement("select", { value: this.state.subjects, onChange: this.toggleSubject }, tags));
    };
    ItemSearchDropdown.prototype.renderSingleClaim = function (claim) {
        var selectedClaims = this.state.claims;
        var containsClaim = selectedClaims.indexOf(claim.code) !== -1;
        return (React.createElement("option", { key: claim.code, value: claim.code }, claim.label));
    };
    ItemSearchDropdown.prototype.renderClaims = function () {
        var _this = this;
        // If no subjects are selected, use the entire list of subjects
        var selectedSubjectCodes = this.state.subjects;
        var subjects = selectedSubjectCodes.length !== 0
            ? this.props.subjects.filter(function (s) { return selectedSubjectCodes.indexOf(s.code) !== -1; })
            : [];
        var tags = [React.createElement("option", { key: 0 }, "NA"),
            subjects
                .reduce(function (cs, s) { return cs.concat(s.claims); }, [])
                .map(function (c) { return _this.renderSingleClaim(c); })];
        return (React.createElement("select", { value: this.state.claims, onChange: this.toggleClaim }, tags));
    };
    ItemSearchDropdown.prototype.renderSingleInteractionType = function (it) {
        var selectedInteractionTypes = this.state.interactionTypes;
        var containsInteractionType = selectedInteractionTypes.indexOf(it.code) !== -1;
        return (React.createElement("option", { key: it.code, value: it.code }, it.label));
    };
    ItemSearchDropdown.prototype.renderInteractionTypes = function () {
        var _this = this;
        var selectedSubjectCodes = this.state.subjects;
        var selectedSubjects = selectedSubjectCodes.length !== 0
            ? this.props.subjects.filter(function (subj) { return selectedSubjectCodes.indexOf(subj.code) !== -1; })
            : [];
        var visibleInteractionTypes = selectedSubjects.length !== 0
            ? this.props.interactionTypes.filter(function (it) { return selectedSubjects.some(function (subj) { return subj.interactionTypeCodes.indexOf(it.code) !== -1; }); })
            : [];
        var tags = [React.createElement("option", { key: 0 }, "NA"), visibleInteractionTypes.map(function (vit) { return _this.renderSingleInteractionType(vit); })];
        return (React.createElement("select", { value: this.state.interactionTypes, onChange: this.toggleInteractionType }, tags));
    };
    return ItemSearchDropdown;
}(React.Component));
exports.ItemSearchDropdown = ItemSearchDropdown;


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map