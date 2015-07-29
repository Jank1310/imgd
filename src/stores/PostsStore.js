'use strict';

var Reflux = require('reflux');
var Actions = require('actions/PostsActionCreators');

var PostsStore = Reflux.createStore({
  listenables: Actions,

  posts: [
    {
      id: 1,
      user: 'Jank1310',
      created: 123434545,
      image: 'http://img-9gag-fun.9cache.com/photo/aYwgMRv_700b.jpg',
      message: 'This dramatic imajjljkge shows the Hubble Space Telescope’s view of a dwarf galaxy known as NGC 1140, whic',
      likes: 1243
    },
    {
      id: 2,
      user: 'Jank1310',
      created: 123438945,
      image: 'http://img-9gag-fun.9cache.com/photo/aYwgMRv_700b.jpg',
      message: 'Register your component to listen for changes in your data stores',
      likes: 3423
    }
  ],

  getInitialState: function() {
      return this.posts;
   },

  onGetPosts: function() {
    console.log('get posts');
  }
});

module.exports = PostsStore;
