import * as React from 'react'
import { ItemTableData } from "../models";
import * as ItemTable from './item-table';

interface Props {
    tableData: ItemTableData;
}

export class Component extends React.Component<Props, undefined> {
    render() {
        return (
            <tr className='item-page'>
                <td>
                    <ItemTable.Component tableData={this.props.tableData} />
                </td>
            </tr>
        );
    }
}