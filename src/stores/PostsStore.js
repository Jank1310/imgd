'use strict';

var Reflux = require('reflux');
var Actions = require('actions/PostsActionCreators');
var ChannelActions = require('actions/ChannelsActionCreators');
var api = require('./api');

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
    api.getPostsOfChannel(channel, function(err, posts) {
      if(!err) {
        Actions.getPostsOfChannel.completed(posts);
      } else {
        Actions.getPostsOfChannel.failed(err);
      }
    });
  },
  onGetPostsOfChannelCompleted: function(posts) {
    this.state.posts = posts;
    this.state.loading = false;
    this.trigger(this.state);
  },

  onPostToChannel: function(channel, message, image) {
    api.postToChannel(channel, message, image, function(err, post) {
      if(!err) {
        Actions.postToChannel.completed(post);
      } else {
        Actions.postToChannel.failed(err);
      }
    });
  },
  onPostToChannelCompleted: function() {
    ChannelActions.getChannels();
  }
});

module.exports = PostsStore;
