import * as ItemCard from "./ItemCard";
import * as React from "react";

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
    accessor: (mcs: ItemCard.ItemCardViewModel) => string | number;
    compare: (a: ItemCard.ItemCardViewModel, b: ItemCard.ItemCardViewModel) => number;
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
        accessor: mcs => mcs.itemKey,
        compare: (a, b) => (a.itemKey) - (b.itemKey)
    },
    {
        header: "Claim/Target",
        className: "claimAndTarget",
        accessor: mcs => mcs.claimLabel + "/" + mcs.target,
        compare: (a, b) => {
            if (a.claimCode < b.claimCode || a.target < b.target) {
                return 1
            }
            else if (a.claimCode > b.claimCode || a.target > b.target) {
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
        accessor: mcs => mcs.subjectLabel,
        compare: (a, b) => (a.subjectCode).localeCompare(b.subjectCode)
    },
    {
        header: "Grade",
        className: "grade",
        accessor: mcs => mcs.gradeLabel,
        compare: (a, b) => (a.grade) - (b.grade)
    },
    {
        header: "Item Type",
        className: "interactionType",
        accessor: mcs => mcs.interactionTypeLabel,
        compare: (a, b) => (a.interactionTypeCode).localeCompare(b.interactionTypeCode)
    },
];



interface HeaderProps {
    columns: SortColumn[];
    onHeaderClick: (header: SortColumn) => void;
    sorts: HeaderSort[];
}

export class MCHeaders extends React.Component<HeaderProps, {}> {
    compareMCRs(lhs: ItemCard.ItemCardViewModel, rhs: ItemCard.ItemCardViewModel): number {
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
            <table className="item-table table mapcomponent-table">
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
    mapRows: ItemCard.ItemCardViewModel[];
    rowOnClick: (item: ItemCard.ItemCardViewModel) => void;
    sort: HeaderSort[];
    columns: SortColumn[];
}

export class MCComponent extends React.Component<Props, {}> {
    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    renderCell(col: SortColumn, mcr: ItemCard.ItemCardViewModel): JSX.Element {

        return (
            <td key={col.header}
                className={col.className}>
                <div className={col.className}>
                    {col.accessor(mcr)}
                </div>
            </td>
        );
    }

    renderRow(mcr: ItemCard.ItemCardViewModel): JSX.Element {
        return (
            <tr onClick={() => this.props.rowOnClick(mcr)}>
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
            <table className="item-table table table-striped mapcomponent-table"
                ref={this.props.tableRef}>

                {this.renderRows()}
            </table>
        );
    }
}