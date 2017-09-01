const wkhtmltopdf = require('wkhtmltopdf');
import { Request, Response } from 'express';
import { HtmlRenderer } from "../PdfGenerator";
import { ItemCapture } from "../ItemCapture";
import { ScreenshotManager } from "../ScreenshotManager";


let screenshotManager = new ScreenshotManager({
    pageWidth: 640,
    screenshotPath: 'client/dist/images/screenshots'
})

export default async function post(req: Request, res: Response) {
    const ids = req.param('ids', '') as string;
    const idsArray = ids.split(',');

    let pictures = await Promise.all(idsArray.map(id => screenshotManager.getScreenshots([id])));
    console.log(pictures);

    const htmlString = HtmlRenderer.renderBody([]);
    const title = 'Grade 5 Mathematics';
    const urlTitle = encodeURIComponent(title);
    const port = process.env.PORT || 3000;
    const options = {
        headerHtml: 'http://localhost:' + port + '/pdf-header.html?title=' + urlTitle,
        headerSpacing: 5,
        footerSpacing: 5,
        footerHtml: 'http://localhost:' + port + '/pdf-footer.html?title=' + urlTitle,
        marginBottom: '13mm'
    };
    res.type('application/pdf');
    wkhtmltopdf(htmlString, options).pipe(res);
}