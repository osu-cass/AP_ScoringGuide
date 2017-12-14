import * as React from 'react';
import * as ReactDOM from 'react-dom';
import "./styles/site.less";
import "@osu-cass/sb-components/lib/Assets/styles/custom.less"
import { routes } from './Routes';
import { BrowserRouter } from 'react-router-dom';

function renderApp() {
    ReactDOM.render(
        <BrowserRouter children={routes} basename={'/'} />,
        document.getElementById('react-app')
    );
}

renderApp();