'use strict';

var Reflux = require('reflux');
var Actions = require('actions/PostsActionCreators');
var agent = require('superagent');

var PostsStore = Reflux.createStore({
  listenables: Actions,

  state: {
        loading: false,
        posts: []
  },

  getInitialState: function() {
    return this.state;
  },

  onGetPostsOfChannel: function(channel) {
    this.state.posts = [];
    this.state.loading = true;
    this.trigger(this.state);
    agent.get('/api/c/' + channel, function(err, res) {
      if(res.ok) {
        Actions.getPostsOfChannel.completed(res.body);
      } else {
        Actions.getPostsOfChannel.failed(res.error);
      }
    });
  },

  onGetPostsOfChannelCompleted: function(result) {
    this.state.posts = result.posts;
    this.state.loading = false;
    this.trigger(this.state);
  }
});

module.exports = PostsStore;
