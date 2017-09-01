import * as React from 'react';
import { shallow } from 'enzyme';
import { ItemPage } from '../src/components/ItemPage';
import { QuestionTableData } from '../src/models'

describe('<ItemPage />', () => {
    it('Contains an ItemPage', () => {
        let itemData:QuestionTableData = {
            item: 'item',
            claim: 'claim',
            domain: 'domain',
            target: 'target',
            depthOfKnowledge: 'depth',
            ccssMc: 'ccss mc',
            ccssMp: 'ccss mp'
        };
        let pageTitle = 'Grade 5 Math';

        // const wrapper = shallow(<ItemPage title={pageTitle} tableData={itemData} />);
        // expect(wrapper.find(ItemPage)).toHaveLength(1);
    });


});