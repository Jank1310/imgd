'use strict';

var Reflux = require('reflux');
var Actions = require('actions/PostsActionCreators');
var agent = require('superagent');

var PostsStore = Reflux.createStore({
  listenables: Actions,

  posts: [
    /*
    {
      id: 1,
      user: 'Jank1310',
      channel: 'funny',
      created: 123434545,
      image: 'http://img-9gag-fun.9cache.com/photo/aYwgMRv_700b.jpg',
      message: 'This dramatic imajjljkge shows the Hubble Space Telescope’s view of a dwarf galaxy known as NGC 1140, whic',
      likes: 1243
    },
    {
      id: 2,
      user: 'Jank1310',
      channel: 'nurnberg',
      created: 123438945,
      image: 'http://img-9gag-fun.9cache.com/photo/aYwgMRv_700b.jpg',
      message: 'Register your component to listen for changes in your data stores',
      likes: 3423
    }
    */
  ],

  getInitialState: function() {
      return {loading: false, posts: this.posts};
   },

  onGetPostsOfChannel: function(channel) {
    console.log('get posts:' + channel);
    this.posts = [];
    this.trigger({loading: true, posts: this.posts});
    agent.get('/api/c/' + channel, function(err, res) {
      console.log(res);
      if(res.ok) {
        Actions.getPostsOfChannel.completed(res.body);
      } else {
        Actions.getPostsOfChannel.failed(res.error);
      }
    });
  },

  onGetPostsOfChannelCompleted: function(result) {
    console.log('Received result: ' + result);
    this.posts = result.posts;
    this.trigger({loading: false, posts: this.posts});
  }

});

module.exports = PostsStore;
