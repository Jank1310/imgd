'use strict';

var redisConfig = require('./redisConfiguration');
var moment = require('moment');
var async = require('async');
var isSafeInteger = require('validate.io-safe-integer');

var DEFAULT_POST_LIMIT = 20;

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

  function _addPostIdToGlobalPostList(postId, callback) {
    redisClient.zadd(redisConfig.ALL_POSTS, postId, postId, callback);
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
          function(done) { _addPostIdToGlobalPostList(postContent.id, done); },
          function(done) { _setLastPostDateToChannel(postContent.channel, postContent.created, done); },
          function(done) { _updateNumberOfPostsChannelSort(postContent.channel, done); }
        ], function(__err) {
          cb(__err, postContent);
        });
      });
    });
  }

  function getPostsForPostIds(postIds, callback) {
    var postsResult = [];
    async.eachSeries(postIds, function(postId, _cb) {
      var postHash = redisConfig.POSTS_PREFIX + postId;
      redisClient.hgetall(postHash, function(_err, post) {
        if(_err) { return _cb(_err); }
        postsResult.push(post);
        return _cb();
      });
    }, function(err) {
      callback(err, postsResult);
    });
  }

  function getPostsOfChannel(channel, before, limit, cb) {
    if(!before || isSafeInteger(parseInt(before)) === false) {
      before = '+inf'; //latest post
    }
    if(isSafeInteger(parseInt(limit)) === false) {
      limit = DEFAULT_POST_LIMIT0;
    } else {
      limit = limit < 100 ? limit : 100; //limit post count to 100
    }
    var channelPostsKey = redisConfig.CHANNEL_PREFIX + channel + redisConfig.CHANNEL_POSTS_POSTFIX;
    redisClient.zrevrangebyscore(channelPostsKey, '(' + before, '-inf', 'LIMIT', '0', limit, function(err, postIds) {
      if(err) { return cb(err); }
      getPostsForPostIds(postIds, function(_err, postsResult) {
        if(_err) { return cb(_err); }
        return cb(null, postsResult);
      });
    });
  }

  function getLastPosts(before, limit, cb) {
    if(!before || isSafeInteger(parseInt(before)) === false) {
      before = '+inf'; //latest post
    }
    if(isSafeInteger(parseInt(limit)) === false) {
      limit = DEFAULT_POST_LIMIT;
    } else {
      limit = limit < 100 ? limit : 100; //limit post count to 100
    }
    redisClient.zrevrangebyscore(redisConfig.ALL_POSTS, '(' + before, '-inf', 'LIMIT', '0', limit, function(err, postIds) {
      getPostsForPostIds(postIds, function(_err, postsResult) {
        if(_err) { return cb(_err); }
        return cb(null, postsResult);
      });
    });
  }

  return {
    addPostToChannel: addPostToChannel,
    getPostsOfChannel: getPostsOfChannel,
    getLastPosts: getLastPosts
  };
};


module.exports = posts;
