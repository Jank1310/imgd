'use strict';

// Uncomment the following lines to use the react test utilities
// import React from 'react/addons';
// const TestUtils = React.addons.TestUtils;

import createComponent from 'helpers/createComponent';
import ChannelsList from 'components/ChannelsList.js';

describe('ChannelsList', () => {
    let ChannelsListComponent;

    beforeEach(() => {
        ChannelsListComponent = createComponent(ChannelsList);
    });

    it('should have its component name as default className', () => {
        expect(ChannelsListComponent._store.props.className).toBe('ChannelsList');
    });
});
