import 'jsdom-global/register';
import * as React from 'react';
import * as $ from 'jquery'
import * as ReactDOM from 'react-dom';
import { ItemSearchContainer } from '../ItemSearchContainer';
import { ItemCardModel, Resource, GradeLevels, AboutItemModel } from '@osu-cass/sb-components'
import { AdvancedFilters, AdvancedFilterCategory } from "@osu-cass/react-advanced-filter";
import { FilterHelper } from "../../Models/FilterHelper";
import { shallow, mount } from 'enzyme';

const subject = {
    code: "subjectCode",
    label: "subjectLabel"
}

const itemVM: ItemCardModel = {
    bankKey: 1,
    itemKey: 2,
    title: "title",
    grade: GradeLevels.Grade3,
    gradeLabel: "gradeLabel",
    subjectCode: "subjectCode",
    subjectLabel: "subjectLabel",
    claimCode: "claimCode",
    claimLabel: "claimLabel",
    targetHash: 1234,
    targetShortName: "shortName",
    targetId: "abc",
    interactionTypeCode: "interactionTypeCode",
    interactionTypeLabel: "interactionTypeLabel",
    isPerformanceItem: true
}

const searchClient = jest.fn(() => {
    return new Promise<ItemCardModel[]>((resolve, reject) => {
        let item: ItemCardModel[] = [itemVM]
        resolve(item);
    })
})

const searchClientErr = jest.fn(() => {
    return new Promise<ItemCardModel[]>((resolve, reject) => {
        reject(new Error("Search failed"))
    })
})

const onRowSelection = jest.fn((item: { itemKey: number, bankKey: number }, reset: boolean) => {
    return null;
})

const item: Resource<AboutItemModel> = {
    kind: "none"
}

const advancedFilterCategory: AdvancedFilterCategory = {
    disabled: false,
    isMultiSelect: false,
    label: "filter category",
    helpText: "you need help?",
    filterOptions: FilterHelper.getFilterOptions().find(f => f.label == "Grade")!.filterOptions,
    displayAllButton: true
}

describe("ItemSearchContainer", () => {

    const props = {
        onRowSelection,
        searchClient,
        filterOptions: [advancedFilterCategory],
        item
    }

    it("matches snapshot", () => {
        expect(shallow(<ItemSearchContainer {...props} />)).toMatchSnapshot();;
    })

    it("calls the api", () => {
        let wrapper = shallow(<ItemSearchContainer {...props} />);
        expect(searchClient).toHaveBeenCalled();
    })

    it("calls api which returns an error", () => {
        const errProps = {
            ...props,
            searchClient: searchClientErr
        }
        console.error = jest.fn(() => {});
        let wrapper = shallow(<ItemSearchContainer {...errProps} />);
        expect(searchClientErr).toHaveBeenCalled();
        expect(wrapper).toMatchSnapshot();
    })
})
