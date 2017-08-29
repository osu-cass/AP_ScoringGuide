import * as HtmlPdf from 'html-pdf-chrome';
import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { ItemMetadata } from './models';
import * as Pdf from './pdf-components/pdf';

export class PdfGenerator {
    static async generate(html: string, chromePort?: number) {
        const options: HtmlPdf.CreateOptions = {
            host: 'localhost',
            port: chromePort || 9222,
            //completionTrigger: new HtmlPdf.CompletionTrigger.Element('div', 5000)
            printOptions: {
                printBackground: true
            }
        };
        const pdf = await HtmlPdf.create(html, options);
        const buffer = pdf.toBuffer();
        return buffer;
    }

    static render(items: ItemMetadata[]) {
        return ReactDOMServer.renderToString(<Pdf.Component />)
    }
}