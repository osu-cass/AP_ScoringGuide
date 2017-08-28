import * as React from 'react';
import { shallow } from 'enzyme';
import { ScoringGuidePage, ItemsSearchClient } from '../../src/client/ScoringGuidePage';
import { ItemSearchDropdown, SearchAPIParams } from '../../src/client/ItemSearchDropdown';
import { ItemCardViewModel } from '../../src/client/ItemCard'

describe('<ScoringGuidePage />', () => {

    it('Contains an ItemSearchDropdown', () => {
        const apiClient: ItemsSearchClient = {
            itemsSearch(params: SearchAPIParams, 
                onSuccess: (data: ItemCardViewModel[]) => void,
                onError?: (jqXHR: JQueryXHR, textStatus: string, errorThrown: string) => any) { } 
        }
        const wrapper = shallow(<ScoringGuidePage interactionTypes={[]} subjects={[]} apiClient={apiClient} />)
        expect(wrapper.find(ItemSearchDropdown)).toHaveLength(1);
    });
});