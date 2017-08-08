import * as React from 'react';
import * as ItemTableRow from './ItemTableRow';
import * as ItemCard from "./ItemCard";

interface SortableSettings {
    State: SortingState; 
    Priority: number;
}

export enum SortingState { NoSort, Ascending, Decending };

interface TableSortables {
    item: SortableSettings;
    subject: SortableSettings;
    grade: SortableSettings;
    claimAndTaget: SortableSettings;
    interactionType: SortableSettings;
}

export interface ItemTableModel {
    data: ItemCard.ItemCardViewModel[];
    sortables: TableSortables;
    onClick(item: ItemCard.ItemCardViewModel): void;
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

export class ItemTable extends React.Component<ItemTableModel, {}> {
    constructor(model: ItemTableModel) {
        super(model);
        this.initialSort();
    }

    initialSort() {
        this.props.data.sort((data1: ItemCard.ItemCardViewModel, data2: ItemCard.ItemCardViewModel) => {
            if (data1.itemKey < data2.itemKey) {
                return -1;
            }
            else {
                return 1;
            }
        });
    }

    resetSortSettings() {
        this.props.sortables.item.State = SortingState.NoSort;
        this.props.sortables.subject.State = SortingState.NoSort;
        this.props.sortables.grade.State = SortingState.NoSort;
        this.props.sortables.claimAndTaget.State = SortingState.NoSort;
        this.props.sortables.interactionType.State = SortingState.NoSort;
    }

    cycleColumnSortState(column: SortableSettings) {
        switch (column.State) {
            case SortingState.NoSort:
                column.State = SortingState.Decending;
                break;
            case SortingState.Decending:
                column.State = SortingState.Ascending;
                break;
            case SortingState.Ascending:
                column.State = SortingState.NoSort;
                break;
            default:
                column.State = SortingState.NoSort;
                break;
        }
    }

    invokeSort(column: SortableSettings) {
        //Determines if sorting by Ascending or Descending.
        // -1 means data# comes first before data#+1
        // 1 means data#-1 comes first before data#
        // 0 means order is unchanged.
        let data1AscDec:number, data2AscDec:number;

        switch (column.State) {
            case SortingState.Decending:
                data1AscDec = -1;
                data2AscDec = 1;
                break;
            case SortingState.Ascending:
                data1AscDec = 1;
                data2AscDec = -1;
                break;
            default: // if NoSort dont update
                this.setState(this.props);
                return;
        }

        switch (column) {
            case (this.props.sortables.item):
                this.props.data.sort((data1: ItemCard.ItemCardViewModel, data2: ItemCard.ItemCardViewModel) => {
                    if (data1.itemKey < data2.itemKey) {
                        return data1AscDec;
                    }
                    else {
                        return data2AscDec;
                    }
                });
                break;
            case (this.props.sortables.claimAndTaget):
                this.props.data.sort((data1: ItemCard.ItemCardViewModel, data2: ItemCard.ItemCardViewModel) => {
                    if (data1.claimCode < data2.claimCode || data1.target < data2.target) {
                        return data1AscDec;
                    }
                    else if(data1.claimCode > data2.claimCode || data1.target > data2.target) {
                        return data2AscDec;
                    }
                    else{
                        return 0;
                    }
                });
                break;
            case (this.props.sortables.subject):
                this.props.data.sort((data1: ItemCard.ItemCardViewModel, data2: ItemCard.ItemCardViewModel) => {
                    if (data1.subjectCode < data2.subjectCode) {
                        return data1AscDec;
                    }
                    else {
                        return data2AscDec;
                    }
                });
                break;
            case (this.props.sortables.grade):
                this.props.data.sort((data1: ItemCard.ItemCardViewModel, data2: ItemCard.ItemCardViewModel) => {
                    if (data1.grade < data2.grade) {
                        return data1AscDec;
                    }
                    else {
                        return data2AscDec;
                    }
                });
                break;
            case (this.props.sortables.interactionType):
                this.props.data.sort((data1: ItemCard.ItemCardViewModel, data2: ItemCard.ItemCardViewModel) => {
                    if (data1.interactionTypeCode < data2.interactionTypeCode) {
                        return data1AscDec;
                    }
                    else {
                        return data2AscDec;
                    }
                });
                break;

        }
        this.setState(this.props);
    }

    invokeMultiSort() {
        const headers = this.props.sortables;
        // TODO: Find a better way of doing this.
        let sortingQueue:SortableSettings[] = [headers.item, headers.claimAndTaget, headers.grade, headers.interactionType, headers.subject];

        sortingQueue.sort((a: SortableSettings, b: SortableSettings) => {
            if (a.Priority < b.Priority) {
                return -1;
            }
            else {
                return 1;
            }
        });

        sortingQueue.forEach((setting) => {
            this.invokeSort(setting);
        });
    }

    sortingArrowDisplay(columnState:SortingState):JSX.Element {
        switch (columnState) {
            case SortingState.NoSort:
                return noSortArrow;
            case SortingState.Decending:
                return decendingArrow;
            case SortingState.Ascending:
                return acendingArrow;
            default:
                return noSortArrow;
        }
    }

    render() {
            return (
                <div className="search-container">
                    <div className="search-results" >
                        <table className="item-table">
                            <thead>
                                <tr>
                                    <th onClick={() => {
                                        this.cycleColumnSortState(this.props.sortables.item);
                                        this.invokeSort(this.props.sortables.item);
                                    }}>
                                        Item # {this.sortingArrowDisplay(this.props.sortables.item.State)}
                                    </th>
                                    <th onClick={() => {
                                        this.cycleColumnSortState(this.props.sortables.claimAndTaget);
                                        this.invokeSort(this.props.sortables.claimAndTaget);
                                    }}>
                                        Claim/Target {this.sortingArrowDisplay(this.props.sortables.claimAndTaget.State)}
                                    </th>
                                    <th onClick={() => {
                                        this.cycleColumnSortState(this.props.sortables.subject);
                                        this.invokeSort(this.props.sortables.subject);
                                    }}>
                                        Subject {this.sortingArrowDisplay(this.props.sortables.subject.State)}
                                    </th>
                                    <th onClick={() => {
                                        this.cycleColumnSortState(this.props.sortables.grade);
                                        this.invokeSort(this.props.sortables.grade);
                                    }}>
                                        Grade {this.sortingArrowDisplay(this.props.sortables.grade.State)}
                                    </th>
                                    <th onClick={() => {
                                        this.cycleColumnSortState(this.props.sortables.interactionType);
                                        this.invokeSort(this.props.sortables.interactionType)
                                    }}>
                                        Item Type {this.sortingArrowDisplay(this.props.sortables.interactionType.State)}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.props.data.map(digest =>
                                    <ItemTableRow.ItemTableRow itemCard={digest} onClick={this.props.onClick} key={digest.bankKey.toString() + "-" + digest.itemKey.toString()} />)}
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        }
}