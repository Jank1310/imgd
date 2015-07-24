'use strict';

var redisConfig = require('./redisConfiguration');

var channels = function(redisClient) {
  return {
    channelExists: function(channel, cb) {
        redisClient.sismember(redisConfig.CHANNELS_SET, channel, function(err, result) {
          var exists = result === 1;
          return cb(err, exists);
        });
    },

    createChannel: function(channel, cb) {
      redisClient.sismember(redisConfig.CHANNELS_SET, channel, function(err, result) {
        if(err) { return (err); }
        if(result === 1) {
          return cb();
        } else {
          //add the channel to the set
          redisClient.sadd(redisConfig.CHANNELS_SET, channel, function(_err) {
            if(_err) { return cb(_err); }
            return cb();
          });
        }
      });
    }
  };
};

module.exports = channels;
