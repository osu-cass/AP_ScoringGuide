require( 'dotenv' ).config();

import * as path from 'path';
import * as Express from 'express';
import * as bodyParser from "body-parser";
import { APIRoute } from './routes/API';
import { ItemParser } from './ItemParser';

const { PORT } = process.env;

const app = Express();
const apiRoute = new APIRoute();

app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( { extended: false } ) );
app.use( '/api', apiRoute.router );

app.get( '/item', ( req, res ) => {
    const id = req.param( 'id', '' ) as string;
    const ip = new ItemParser();
    ip.loadPlainHtml( id )
        .then( item => res.send( item ) )
        .catch( err => res.status( 500 ).send( err ) );
} );

app.use( Express.static( path.join( __dirname, '../public' ) ) );

app.get( '*', ( req, res ) => {
    res.sendFile( path.join( __dirname, '../public/index.html' ) );
} );

app.listen( PORT || 3000, () => {
    console.log( 'server started', PORT || 3000 )
} );
