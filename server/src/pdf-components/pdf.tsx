import * as React from 'react';
import { ItemMetadata } from '../models';
import * as Header from './header';

interface Props {
    items: ItemMetadata[];
}

export class Component extends React.Component<undefined, undefined> {
    render() {
        // let pageData: JSX.Element[] = [];
        // for (let i = 0; i < 10000; i++) {
        //     pageData.push(<div>{i}</div>);
        // }
        const port = process.env.PORT || 3000;
        return (
            <html>
                <head>
                    <base href={'localhost:' + port} />
                </head>
                <body>
                    <Header.Component />
                    hello world!
                </body>
            </html>
        );
    }
}

