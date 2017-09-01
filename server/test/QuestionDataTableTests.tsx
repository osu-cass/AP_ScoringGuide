import * as React from 'react';
import { shallow } from 'enzyme';
import { QuestionDataTable } from '../src/components/QuestionDataTable';
import { QuestionTableData } from '../src/models'

describe('<QuestionDataTable />', () => {
    it('Contains an QuestionDataTable', () => {
        let itemData:QuestionTableData = {
            item: 'item',
            claim: 'claim',
            domain: 'domain',
            target: 'target',
            depthOfKnowledge: 'depth',
            ccssMc: 'ccss mc',
            ccssMp: 'ccss mp'
        };

        const wrapper = shallow(<QuestionDataTable tableData={itemData} />);
        expect(wrapper.find(QuestionDataTable)).toHaveLength(1);
    });


});
