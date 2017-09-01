import * as React from 'react';
import { shallow } from 'enzyme';
import { ScoringGuidePage } from '../src/ScoringGuidePage';
import { ItemSearchDropdown, SearchAPIParams } from '../src/ItemSearchDropdown';
import * as $ from 'jquery'

describe('<ScoringGuidePage />', () => {

    it('Contains an ItemSearchDropdown', () => {
        const wrapper = shallow(<ScoringGuidePage/>)
        expect(wrapper.find(ItemSearchDropdown)).toHaveLength(0);
    });
});