import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { Item } from './models';
import * as Pdf from './components/Pdf';
import * as Header from './components/Header';

export class HtmlRenderer {
    static renderBody(items: Item[]) {
        return ReactDOMServer.renderToString(<Pdf.Component />);
    }
}
