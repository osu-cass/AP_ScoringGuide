import { Request, Response } from 'express';
import { HtmlRenderer, PdfGenerator } from "../PdfGenerator";
import { ItemCapture } from "../ItemCapture";
import { ItemDataManager } from "../ItemDataManager";


let manager = new ItemDataManager({
    pageWidth: 800,
    screenshotPath: 'client/dist/images/screenshots'
})

export default async function post(req: Request, res: Response) {
    const ids = req.param('ids', '') as string;
    const idsArray = ids.split(',');

    let pictures = await Promise.all(idsArray.map(id => manager.getItemData([id])));
    console.log(pictures);

    const htmlString = HtmlRenderer.renderBody([]);
    const title = 'Grade 5 Mathematics';
    res.type('application/pdf');
    PdfGenerator.generate(htmlString, title).pipe(res);
}