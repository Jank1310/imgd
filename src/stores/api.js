var agent = require('superagent');

var handleAPIError = function(err) {
  console.error('API error occurred: ', err);
};

var getRecentChannels = function(callback) {
  console.log('API: get recent channels');
  agent
   .get('/api/recent/channels')
   .on('error', handleAPIError)
   .end(function(err, res) {
     if(err) { return callback(err); }
     return callback(null, res.recentChannels);
   });
};

var getHotChannels = function(callback) {
  console.log('API: get hot channels');
  agent
    .get('/api/hot/channels')
    .on('error', handleAPIError)
    .end(function(err, res) {
      if(err) { return callback(err); }
      return callback(null, res.hotChannels);
    });
};


module.exports.getRecentChannels = getRecentChannels;
module.exports.getHotChannels = getHotChannels;
