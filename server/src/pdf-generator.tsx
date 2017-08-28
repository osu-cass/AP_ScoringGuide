import * as HtmlPdf from 'html-pdf-chrome';
import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { ItemMetadata } from './models';
import * as Pdf from './pdf-components/pdf';

//for testing: 
import * as FileSystem from 'fs';

export class PdfGenerator {
    static async generate(chromePort: number, html: string) {
        const options: HtmlPdf.CreateOptions = {
            port: chromePort
        };
        const pdf = await HtmlPdf.create(html, options);
        const bytes = pdf.toBase64();
        return bytes;
    }

    static render(items: ItemMetadata[]) {
        return ReactDOMServer.renderToString(<Pdf.Component />)
    }
}

// let html = PdfGenerator.render([]);
// let bytes = PdfGenerator.generate();
// FileSystem.writeFileSync()