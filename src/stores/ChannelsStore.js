'use strict';

var Reflux = require('reflux');
var Actions = require('actions/ChannelsActionCreators');
var api = require('./api');
var async = require('async');

var ChannelsStore = Reflux.createStore({
  listenables: [Actions],
  popularChannels: [],
  recentChannels: [],

  getInitialState: function() {
    Actions.getChannels();
    return {popular: this.popularChannels, recent: this.recentChannels};
  },

  onGetChannels: function() {
    async.parallel([api.getRecentChannels, api.getPopularChannels],
      function(err, result) {
        if(err) { return Actions.getChannels.failed(err); }
        Actions.getChannels.completed({recent: result[0], popular: result[1]});
      }
    );
  },

  onGetChannelsCompleted: function(result) {
    this.recentChannels = result.recent;
    this.popularChannels = result.popular;
    this.trigger({popular: this.popularChannels, recent: this.recentChannels});
  },

  onGetChannelsFailed: function(error) {
    console.log('Could not get channels:', error);
  }
});

module.exports = ChannelsStore;
