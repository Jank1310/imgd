'use strict';

var Reflux = require('reflux');

var PostsActionCreators = Reflux.createActions({
  'getPostsOfChannel': {asyncResult: true}
});


module.exports = PostsActionCreators;
