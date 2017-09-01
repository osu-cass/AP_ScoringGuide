import { Request, Response } from 'express';
import { HtmlRenderer, PdfGenerator } from "../PdfGenerator";
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
    res.type('application/pdf');
    PdfGenerator.generate(htmlString, title).pipe(res);
}