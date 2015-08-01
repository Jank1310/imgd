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
     return callback(null, res.body.recentChannels);
   });
};

var getPopularChannels = function(callback) {
  console.log('API: get popular channels');
  agent
    .get('/api/popular/channels')
    .on('error', handleAPIError)
    .end(function(err, res) {
      if(err) { return callback(err); }
      return callback(null, res.body.popularChannels);
    });
};


module.exports.getRecentChannels = getRecentChannels;
module.exports.getPopularChannels = getPopularChannels;
