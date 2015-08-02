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

var getPostsOfChannel = function(channel, callback) {
  console.log('API: get posts for channel: ' + channel);
  var url = '/api/c/' + (channel ? channel : '');
  console.log(url);
  agent.get(url).on('error', handleAPIError).end(function(err, res) {
    if(err) { return callback(err); }
    return callback(null, res.body.posts);
  });
};

var postToChannel = function(channel, message, callback) {
  console.log('API: post to channel', channel, message);
  if(!channel) {
    return callback('Cannot post to global channel. Channel is null or undefined!');
  }
  var url = '/api/c/' + channel;
  agent.post(url).send({message: message}).end(function(err, res) {
    if(err) { return callback(err); }
    return callback(null, res.body);
  });
};

module.exports.getRecentChannels = getRecentChannels;
module.exports.getPopularChannels = getPopularChannels;
module.exports.getPostsOfChannel = getPostsOfChannel;
module.exports.postToChannel = postToChannel;
