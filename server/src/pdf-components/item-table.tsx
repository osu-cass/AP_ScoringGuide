import * as React from 'react';
import { ItemTableData } from "../models";

export class Component extends React.Component<ItemTableData, undefined> {
    render() {
        return (
            <table className='item-data-table'>
                <thead>
                    <th>Item</th>
                    <th>Claim</th>
                    <th>Domain</th>
                    <th>Target</th>
                    <th>DOK</th>
                    <th>CCSS-MC</th>
                    <th>CCSS-MP</th>
                </thead>
                <tbody>
                    <tr>
                        <td>{this.props.item}</td>
                        <td>{this.props.claim}</td>
                        <td>{this.props.domain}</td>
                        <td>{this.props.target}</td>
                        <td>{this.props.depthOfKnowledge}</td>
                        <td>{this.props.ccssMc}</td>
                        <td>{this.props.ccssMp}</td>
                    </tr>
                </tbody>
            </table>
        );
    }
}
