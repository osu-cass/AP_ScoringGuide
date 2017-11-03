import * as path from "path";
import { Stream } from "stream";
import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
const wkhtmltopdf = require('wkhtmltopdf');
import { ItemGroup } from './Models';
import { PdfComponent } from './components/PdfComponent';

const {ITEM_VIEWER_SERVICE_API} = process.env;

export class HtmlRenderer {
    static renderBody(items: ItemGroup[], subject: string, grade: string, titlePage: boolean) {
        return ReactDOMServer.renderToString(
            <PdfComponent
                items={items}
                subject={subject}
                grade={grade}
                ivsBaseUrl={ITEM_VIEWER_SERVICE_API}
                displayTitlePage={titlePage} />
        );
    }
}

export class PdfGenerator {
    static generate(html: string, title: string) {
        return wkhtmltopdf(html, {
            title,
            headerHtml: path.join(__dirname, '../public/pdf/header.html'),
            headerSpacing: 5,
            footerSpacing: 5,
            footerHtml: path.join(__dirname, '../public/pdf/footer.html'),
            marginBottom: '.75in',
            marginTop: '1.25in',
            marginLeft: '.5in',
            marginRight: '.5in'
        }) as Stream;
    }
}
