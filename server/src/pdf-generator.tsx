import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { Item } from './models';
import * as Pdf from './pdf-components/pdf';
import * as Header from './pdf-components/header';

export class HtmlRenderer {
    static renderBody(items: Item[]) {
        return ReactDOMServer.renderToString(<Pdf.Component />);
    }

    static renderHeader(title: string) {
        return ReactDOMServer.renderToString(<Header.Component title={title} />);
    }
}