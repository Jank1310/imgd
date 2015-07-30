'use strict';

// Uncomment the following lines to use the react test utilities
// import React from 'react/addons';
// const TestUtils = React.addons.TestUtils;

import createComponent from 'helpers/createComponent';
import AddPost from 'components/AddPost.js';

describe('AddPost', () => {
    let AddPostComponent;

    beforeEach(() => {
        AddPostComponent = createComponent(AddPost);
    });

    it('should have its component name as default className', () => {
        expect(AddPostComponent._store.props.className).toBe('AddPost');
    });
});
