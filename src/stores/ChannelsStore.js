'use strict';

var Reflux = require('reflux');
var Actions = require('actions/ChannelsActionCreators');
var agent = require('superagent');

var ChannelsStore = Reflux.createStore({
  listenables: Actions,
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
   }
});

module.exports = ChannelsStore;
