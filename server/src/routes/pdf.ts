const wkhtmltopdf = require('wkhtmltopdf');
import { Request, Response } from 'express';
import { HtmlRenderer } from "../pdf-generator";

export default async function post(req: Request, res: Response) {
    const htmlString = HtmlRenderer.renderBody([]);
    const title = 'Grade 5 Mathematics';
    const options = {
        headerHtml: HtmlRenderer.renderHeader(title),
        footerRight: 'Page [page]',
        footerLeft: 'Smarter Balanced ' + title + 'Practice Test Scoring Guide'
    };
    res.type('application/pdf');
    wkhtmltopdf(htmlString, options).pipe(res);
}