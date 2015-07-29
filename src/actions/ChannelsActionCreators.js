'use strict';

var Reflux = require('reflux');

var ChannelsActionCreators = Reflux.createActions({
  'getChannels': {asyncResult: true}
});


module.exports = ChannelsActionCreators;
