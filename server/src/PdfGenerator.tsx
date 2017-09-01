import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { Item } from './models';
import { PdfComponent } from './components/Pdf';

export class HtmlRenderer {
    static renderBody(items: Item[]) {
        return ReactDOMServer.renderToString(<PdfComponent />);
    }
}
