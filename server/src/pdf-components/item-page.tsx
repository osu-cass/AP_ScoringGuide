import * as React from 'react'
import { ItemTableData } from "../models";
import * as ItemTable from './item-table';
import * as Header from './header';

interface Props {
    tableData: ItemTableData;
    title: string
}

export class Component extends React.Component<Props, undefined> {
    render() {
        return (
            <div className='item-page'>
                <Header.Component title={this.props.title} />
                <ItemTable.Component tableData={this.props.tableData} />
            </div>
        );
    }
}