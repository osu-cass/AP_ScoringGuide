import { Request, Response } from 'express';
import { PdfGenerator } from "../pdf-generator";

export default async function post(req: Request, res: Response) {
    const htmlString = PdfGenerator.render([]);
    const buffer = await PdfGenerator.generate(htmlString, 9222);
    res.type('application/pdf');
    res.end(buffer);
}