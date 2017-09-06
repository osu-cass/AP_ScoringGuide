import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { ItemGroup } from './models';
import { PdfComponent } from './components/PdfComponent';
import { Stream } from "stream";
const wkhtmltopdf = require('wkhtmltopdf');

export class HtmlRenderer {
    static renderBody(items: ItemGroup[], subject: string, grade: string) {
        return ReactDOMServer.renderToString(
            <PdfComponent items={items} subject={subject} grade={grade}/>
        );
    }
}

export class PdfGenerator {
    static generate(html: string, title: string) {
        const urlTitle = encodeURIComponent(title);
        const port = process.env.PORT || 3000;
        const options = {
            headerHtml: 'http://localhost:' + port + '/pdf-header.html?title=' + urlTitle,
            headerSpacing: 5,
            footerSpacing: 5,
            footerHtml: 'http://localhost:' + port + '/pdf-footer.html?title=' + urlTitle,
            marginBottom: '13mm'
        };
        return wkhtmltopdf(html, options) as Stream;
    }
}