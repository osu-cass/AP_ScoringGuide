import * as path from "path";
import { Stream } from "stream";
import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
const wkhtmltopdf = require('wkhtmltopdf');
import {PdfContainer, ItemGroupModel} from '@osu-cass/sb-components';

const {ITEM_VIEWER_SERVICE_API, PORT} = process.env;

export function renderBody(items: ItemGroupModel[], subject: string, grade: string, titlePage: boolean, scoringInfo: boolean) {
    return ReactDOMServer.renderToString(
        <PdfContainer
            items={items}
            subject={subject}
            grade={grade}
            ivsBaseUrl={ITEM_VIEWER_SERVICE_API}
            cssUrl={path.join(__dirname, '../public/pdf/pdf.css')}
            displayTitlePage={titlePage}
            displayScoreInfo={scoringInfo}
            port={PORT} />
    );
}

export function generate(html: string, title: string) {
    return wkhtmltopdf(html, {
        title,
        headerHtml: path.join(__dirname, '../public/pdf/header.html'),
        headerSpacing: 5,
        footerSpacing: 5,
        footerHtml: path.join(__dirname, '../public/pdf/footer.html'),
        marginBottom: '.75in',
        marginTop: '1.25in',
        marginLeft: '.5in',
        marginRight: '.5in',
        debug: true
    }) as Stream;
}
