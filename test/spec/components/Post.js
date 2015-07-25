'use strict';

// Uncomment the following lines to use the react test utilities
// import React from 'react/addons';
// const TestUtils = React.addons.TestUtils;

import createComponent from 'helpers/createComponent';
import Post from 'components/Post.js';

describe('Post', () => {
    let PostComponent;

    beforeEach(() => {
        PostComponent = createComponent(Post);
    });

    it('should have its component name as default className', () => {
        expect(PostComponent._store.props.className).toBe('Post');
    });
});
