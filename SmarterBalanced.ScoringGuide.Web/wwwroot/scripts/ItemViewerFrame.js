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
//# sourceMappingURL=ItemViewerFrame.js.map