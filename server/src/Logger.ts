import * as Express from "express";
import * as morgan from "morgan";
import * as fs from "fs";
import * as path from "path";

/**
 * The loggerApi handles each request and logs it to a file called requests.log in the root of the server.
 * If the response status code is > 400, the request is logged to the errors.log file at the root of
 * the server.
 * @param {string} format: the format that Morgan uses to output request logs
 */
export const loggerApi = ( format: string ): Express.RequestHandler[] => {
    const requestStream = fs.createWriteStream( path.join( __dirname, '..', 'requests.log' ), { flags: 'a' } );
    const errorStream = fs.createWriteStream( path.join( __dirname, '..', 'errors.log' ), { flags: 'a' } );

    return [
        morgan( format, {
            skip: ( req: Express.Request, res: Express.Response ) => {
                return res.statusCode >= 400;
            },
            stream: requestStream
        } ),
        morgan( format, {
            skip: ( req: Express.Request, res: Express.Response ) => {
                return res.statusCode < 400;
            },
            stream: errorStream
        } ) ];
};