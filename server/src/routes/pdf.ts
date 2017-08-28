import { Request, Response } from 'express';

export default function post(req: Request, res: Response) {
    res.status(200).send('hello world!');
}