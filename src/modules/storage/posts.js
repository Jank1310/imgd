var redisConfig = require('./redisConfiguration');
var moment = require('moment');
var async = require('async');
var isSafeInteger = require('validate.io-safe-integer');

var posts = function(redisClient) {
  return {
    addPostToChannel: function(channel, post, cb) {
      var ts = moment().unix();
      redisClient.incr(redisConfig.POSTS_ID_KEY, function(err, postId) {
        if(err) { return cb(err); }
        //use post content to prevent unwanted key from req.body
        postContent = {
          'id': postId,
          'message': post.message,
          'created': ts
        };
        redisClient.hmset(redisConfig.POST_HASH_PREFIX + postId, postContent, function(_err) {
          if(_err) { return cb(_err); }
          redisClient.zadd(redisConfig.CHANNEL_POST_IDS_PREFIX_SSET + channel, postId, postId, function(_err2) {
            if(_err2) { return cb(_err2); }
            return cb(null, postContent);
          });
        });
      });
    },

    getPostsOfChannel: function(channel, before, postCount, cb) {
      if(!before || isSafeInteger(parseInt(before)) === false) {
        before = '+inf'; //latest post
      }
      if(isSafeInteger(parseInt(postCount)) === false) {
        postCount = 20; //default post count
      } else {
        postCount = postCount < 100 ? postCount : 100; //limit post count to 100
      }
      var postsSSet = redisConfig.CHANNEL_POST_IDS_PREFIX_SSET + channel;
      console.log('Get posts of channel: ' + channel + ' before: ' + before + ' posts: ' + postCount);
      redisClient.zrevrangebyscore(postsSSet, '(' + before, '-inf', 'LIMIT', '0', postCount, function(err, postIds) {
        if(err) {
          return cb(err);
        }
        //get posts for ids
        var postsResult = [];
        async.eachSeries(postIds, function(postId, _cb) {
          var postHash = redisConfig.POST_HASH_PREFIX + postId;
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

  };
};


module.exports = posts;
