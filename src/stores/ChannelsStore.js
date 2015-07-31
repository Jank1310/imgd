'use strict';

var Reflux = require('reflux');
var Actions = require('actions/ChannelsActionCreators');
var ChannelActions = require('actions/PostsActionCreators');
var agent = require('superagent');

var ChannelsStore = Reflux.createStore({
  listenables: [Actions, ChannelActions],
  popularChannels: [],
  recentChannels: [],

  getInitialState: function() {
      Actions.getChannels();
      return {popular: this.popularChannels, recent: this.recentChannels};
   },

   onGetChannels: function() {
     agent
      .get('/api/recent/channels')
      .end(function(err, res) {
        if(res.ok) {
          Actions.getChannels.completed(res.body);
        } else {
          Actions.getChannels.failed(res.error);
        }
      });
   },

   onGetChannelsCompleted: function(res) {
    console.log(res);
    this.recentChannels = res.recentChannels;
    this.trigger({popular: this.popularChannels, recent: this.recentChannels});
   },

   onGetChannelsFailed: function(error) {
     console.log(error);
   },

   onPostToChannel: function() {
     console.log("post (channel)");
   },

   onPostToChannelCompleted: function() {
      console.log("Post completed (channel)");
   }
});

module.exports = ChannelsStore;
