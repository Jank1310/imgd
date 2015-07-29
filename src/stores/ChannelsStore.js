'use strict';

var Reflux = require('reflux');
var Actions = require('actions/ChannelsActionCreators');


var ChannelsStore = Reflux.createStore({
  listenables: Actions,
  popularChannels: ['germany', 'nfsw', 'cats', 'funny'],
  recentChannels: ['world', 'party', 'nuernberg'],

  getInitialState: function() {
      return {popular: this.popularChannels, recent: this.recentChannels};
   }
});

module.exports = ChannelsStore;
