import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { routes } from './Routes';
import { BrowserRouter } from 'react-router-dom';

function renderApp() {
    ReactDOM.render(
        <BrowserRouter children={routes} basename={'/'} />,
        document.getElementById('react-app')
    );
}

renderApp();