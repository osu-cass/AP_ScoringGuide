import * as React from 'react';
import { shallow } from 'enzyme';
import * as ScoringGuidePage from '../Scripts/ScoringGuidePage';
import * as ItemViewerFrame from '../Scripts/ItemViewerFrame';

describe("<ScoringGuidePage />", () => {
    
    it("Should render an ItemFrame", () => {
        const wrapper = shallow(<ScoringGuidePage.ScoringGuidePage />);
        expect(wrapper.find(ItemViewerFrame.ItemFrame)).toHaveLength(1);
    });
});