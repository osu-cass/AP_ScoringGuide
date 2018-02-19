import "./Styles/bundle.less";
import "typeface-pt-sans-caption/index.css";
import "typeface-pt-serif/index.css";
import "typeface-pt-serif-caption/index.css";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { routes } from "./Routes";
import { BrowserRouter } from "react-router-dom";
// tslint:disable-next-line:no-var-requires no-require-imports
require("es6-promise/auto");

function renderApp() {
  ReactDOM.render(
    <BrowserRouter children={routes} basename="/" />,
    document.getElementById("react-app")
  );
}

renderApp();
