import * as ItemCard from "./ItemCard";
import * as React from "react";

namespace MapComponent {
    export type Header = "Item" | "Claim/Target" | "Subject" | "Grade" | "Item Type";

    export enum SortDirection {
        Ascending = 1,
        Descending = -1
    }

    export interface HeaderSort {
        col: SortColumn;
        direction: SortDirection;
    }

    export interface SortColumn {
        header: Header;
        className: string;
        accessor: (mcs: ItemCard.ItemCard) => string | number;
        compare: (a: ItemCard.ItemCard, b: ItemCard.ItemCard) => number;
    }

    const decendingArrow = (
        <span aria-label="Decend">▼</span>
    );

    const acendingArrow = (
        <span aria-label="Ascend">▲</span>
    );

    const noSortArrow = (
        <span aria-label="NoSort">◄</span>
    );

    export const headerColumns: SortColumn[] = [
        {
            header: "Item",
            className: "item",
            accessor: mcs => mcs.props.itemKey,
            compare: (a, b) => (a.props.itemKey) - (b.props.itemKey)
        },
        {
            header: "Claim/Target",
            className: "claimAndTarget",
            accessor: mcs => mcs.props.claimLabel + "/" + mcs.props.target,
            compare: (a, b) => {
                if (a.props.claimCode < b.props.claimCode || a.props.target < b.props.target) {
                    return 1
                }
                else if (a.props.claimCode > b.props.claimCode || a.props.target > b.props.target) {
                    return -1
                }
                else {
                    return 0;
                }
            }
        },
        {
            header: "Subject",
            className: "subject",
            accessor: mcs => mcs.props.subjectLabel,
            compare: (a, b) => (a.props.subjectCode).localeCompare(b.props.subjectCode)
        },
        {
            header: "Grade",
            className: "grade",
            accessor: mcs => mcs.props.gradeLabel,
            compare: (a, b) => (a.props.grade) - (b.props.grade)
        },
        {
            header: "Item Type",
            className: "interactionType",
            accessor: mcs => mcs.props.interactionTypeLabel,
            compare: (a, b) => (a.props.interactionTypeCode).localeCompare(b.props.interactionTypeCode)
        },
    ];



    interface HeaderProps {
        columns: SortColumn[];
        onHeaderClick: (header: SortColumn) => void;
        sorts: HeaderSort[];
    }

    export class MCHeaders extends React.Component<HeaderProps, {}> {
        onMCHeaderClick = (col: MapComponent.SortColumn) => {
            const newSorts = (this.props.sorts || []).slice();
            const headIdx = newSorts.findIndex(hs => hs.col.header === col.header);
            if (headIdx !== -1) {
                const newSort = Object.assign({}, newSorts[headIdx]);
                newSort.direction = newSort.direction === MapComponent.SortDirection.Ascending
                    ? MapComponent.SortDirection.Descending
                    : MapComponent.SortDirection.Ascending;
                newSorts[headIdx] = newSort;
            } else {
                const newSort: MapComponent.HeaderSort = {
                    col: col,
                    direction: MapComponent.SortDirection.Ascending
                };
                newSorts.push(newSort);
            }
            this.setState({ sorts: newSorts });
        }

        clearSort = () => {
            this.setState({ sorts: [] });
        }

        compareMCRs(lhs: ItemCard.ItemCard, rhs: ItemCard.ItemCard): number {
            const sorts = this.props.sorts || [];
            for (const sort of sorts) {
                const diff = sort.col.compare(lhs, rhs) * sort.direction;
                if (diff !== 0) {
                    return diff;
                }
            }
            return 0;
        }

        renderHeader(col: SortColumn): JSX.Element {
            let dirElem: string | undefined | JSX.Element;
            const headerSort = this.props.sorts.find(hs => hs.col.header === col.header);
            if (!headerSort) {
                dirElem = undefined;//noSortArrow
            } else if (headerSort.direction === SortDirection.Ascending) {
                dirElem = acendingArrow;
            } else {
                dirElem = decendingArrow;
            }

            return (
                <td key={col.header}
                    className={col.className}
                    onClick={() => this.props.onHeaderClick(col)}>
                    <div className={col.className}>
                        {dirElem} {col.header}
                    </div>
                </td>
            );
        }

        render() {
            return (
                <table className="table phenotype-table mapcomponent-table">
                    <thead>
                        <tr className="primary">
                            {this.props.columns.map(col => this.renderHeader(col))}
                        </tr>
                    </thead>
                </table>
            );
        }
    }

    interface Props {
        tableRef?: (ref: HTMLTableElement) => void;
        mapRows: ItemCard.ItemCard[];
        sort: HeaderSort[];
        columns: SortColumn[];
    }

    export class MCComponent extends React.Component<Props, {}> {
        constructor(props: Props) {
            super(props);
            this.state = {};
        }

        renderCell(col: SortColumn, mcr: ItemCard.ItemCard): JSX.Element {

            return (
                <td key={col.header}
                    className={col.className}>
                    <div className={col.className}>
                        {col.accessor(mcr)}
                    </div>
                </td>
            );
        }

        renderRow(mcr: ItemCard.ItemCard): JSX.Element {
            return (
                <tr>
                    {this.props.columns.map(col => this.renderCell(col, mcr))}
                </tr>
            );
        }

        renderRows(): JSX.Element {
            const rows = this.props.mapRows.map(mcr => this.renderRow(mcr));
            return (
                <tbody>{rows}</tbody>
            );
        }

        render(): JSX.Element {
            return (
                <table className="table table-striped phenotype-table mapcomponent-table"
                    ref={this.props.tableRef}>

                    {this.renderRows()}
                </table>
            );
        }
    }
}