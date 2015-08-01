'use strict';

var redisConfig = require('./redisConfiguration');
var moment = require('moment');
var async = require('async');
var isSafeInteger = require('validate.io-safe-integer');

var posts = function(redisClient) {

  function _addPostIdToChannel(postId, channel, callback) {
    var channelPostsKey = redisConfig.CHANNEL_PREFIX + channel + redisConfig.CHANNEL_POSTS_POSTFIX;
    redisClient.zadd(channelPostsKey, postId, postId, function(err) {
      if(err) { return callback(err); }
      return callback();
    });
  }

  function _setLastPostDateToChannel(channel, timestamp, callback) {
    redisClient.zadd(redisConfig.CHANNELS_SORT_BY_LAST_POST, timestamp, channel, callback);
  }

  function _updateNumberOfPostsChannelSort(channel, callback) {
    redisClient.zincrby(redisConfig.CHANNELS_SORT_BY_NUMBER_OF_POSTS, 1, channel, callback);
  }

  function addPostToChannel(channel, post, cb) {
    var ts = moment().unix();
    redisClient.incr(redisConfig.POSTS_ID_KEY, function(err, postId) {
      if(err) { return cb(err); }
      var postContent = {
        id: postId,
        message: post.message,
        created: ts,
        channel: channel
      };
      var postKey = redisConfig.POSTS_PREFIX + postId;
      redisClient.hmset(postKey, postContent, function(_err) {
        if(_err) { return cb(_err); }

        async.parallel([
          function(done) { _addPostIdToChannel(postContent.id, postContent.channel, done); },
          function(done) { _setLastPostDateToChannel(postContent.channel, postContent.created, done); },
          function(done) { _updateNumberOfPostsChannelSort(postContent.channel, done); }
        ], function(__err) {
          cb(__err, postContent);
        });
      });
    });
  }

    function getPostsOfChannel(channel, before, postCount, cb) {
      if(!before || isSafeInteger(parseInt(before)) === false) {
        before = '+inf'; //latest post
      }
      if(isSafeInteger(parseInt(postCount)) === false) {
        postCount = 20; //default post count
      } else {
        postCount = postCount < 100 ? postCount : 100; //limit post count to 100
      }
      var channelPostsKey = redisConfig.CHANNEL_PREFIX + channel + redisConfig.CHANNEL_POSTS_POSTFIX;
      redisClient.zrevrangebyscore(channelPostsKey, '(' + before, '-inf', 'LIMIT', '0', postCount, function(err, postIds) {
        if(err) {
          return cb(err);
        }
        //get posts for ids
        var postsResult = [];
        async.eachSeries(postIds, function(postId, _cb) {
          var postHash = redisConfig.POSTS_PREFIX + postId;
          redisClient.hgetall(postHash, function(_err, post) {
            if(_err) { return _cb(_err); }
            postsResult.push(post);
            return _cb();
          });
        }, function(_err) {
          if(_err) { return cb(_err); }
          return cb(null, postsResult);
        });
      });
    }

    return {
      addPostToChannel: addPostToChannel,
      getPostsOfChannel: getPostsOfChannel
    };
};


module.exports = posts;
