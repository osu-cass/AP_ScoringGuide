import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { PassageView } from '../PassageView';
import * as Models from "../../Models";
import { shallow } from 'enzyme';

const itemView: Models.ItemView = {
    id: "12334",
    html: null,
    picturePath: null,
    captured: true,
    type: Models.ViewType.html
}

const props = {
    view: itemView,
    associatedItems: "some_text"
}

describe("EvidenceStatement", () => {
    it("matches snapshot", () => {
        expect(shallow(<PassageView {...props}/>)).toMatchSnapshot()
    })
})