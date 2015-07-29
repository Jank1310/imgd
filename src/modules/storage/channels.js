'use strict';

var redisConfig = require('./redisConfiguration');
var moment = require('moment');
var async = require('async');

var channels = function(redisClient) {
  function saveChannel(channel, cb) {
    async.parallel([
      function(done) {
        //save in scored set
        redisClient.zadd(redisConfig.CHANNELS_SET, 1, channel, done);
      },
      function(done) {
        //save in sort by time set
        redisClient.zadd(redisConfig.CHANNELS_SORT_BY_CREATION, moment().unix(), channel, done);
      }], cb);
  }

  function channelExists(channel, cb) {
      redisClient.zscore(redisConfig.CHANNELS_SET, channel, function(err, result) {
        var exists = result !== null;
        return cb(err, exists);
      });
  }

  function createChannel(channel, cb) {
    channelExists(channel, function(err, exists) {
      if(err) { return cb(err); }
      if(exists === false) {
        saveChannel(channel, function(_err) { return cb(_err); });
      }
    });
  }

  function getRecent(limit, cb) {
    var unixNow = moment().unix();
    redisClient.zrevrangebyscore(redisConfig.CHANNELS_SORT_BY_CREATION, unixNow, '0', 'LIMIT', 0, limit, function(err, result) {
      return cb(err, result);
    });
  }

  return {
    channelExists: channelExists,
    createChannel: createChannel,
    getRecent: getRecent
  };
};

module.exports = channels;
