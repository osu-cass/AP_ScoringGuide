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
var React = require("react");
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
//# sourceMappingURL=ItemCard.js.map