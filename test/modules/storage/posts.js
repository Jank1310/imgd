var assert = require('assert');
var redisClient = require('redis').createClient();
var redisConfig = require('../../../src/modules/storage/redisConfiguration');
var async = require('async');
var posts = require('../../../src/modules/storage/posts.js')(redisClient);

describe('posts', function() {
  beforeEach(function(cb) {
    redisClient.select(2, function(err) {
      assert.ifError(err);
      redisClient.flushdb(cb);
    });
  });

  it('should add post to channel', function(done) {
    posts.addPostToChannel('someChannel', {'message': 'test message'}, function(err, post) {
      assert.ifError(err);
      assert.equal(post.message, 'test message', 'should set post message');
      assert.equal(post.channel, 'someChannel', 'should set channel');
      done();
    });
  });

  it('should add multiple posts and update the correct sorted sets in redis', function(done) {
    var channel = 'theChannel';
    var postList = [{message: 'test message'}, {message: 'test message2'},
      {message: 'test message3'}, {message: 'test message4'}];
    var checkRedis = function() {
      async.parallel([
        function(cb) {
            redisClient.zscore(redisConfig.CHANNELS_SORT_BY_NUMBER_OF_POSTS, channel, function(err, result) {
              cb(err, result);
          });
        }
      ], function(err, result) {
        assert.equal(4, result[0]);
        done(err);
      });
    };
    async.each(postList, function(post, cb) {
      posts.addPostToChannel(channel, post, cb);
    }, checkRedis);
  });

  it('should get posts of channel', function(done) {
    var channel = 'someChannel';
    var postsArr = [{'message': 'test message 1'}, {'message': 'test message 2'}];
    async.eachSeries(postsArr, function(item, cb) {
      posts.addPostToChannel(channel, item, cb);
    }, function() {
      posts.getPostsOfChannel(channel, null, 100, function(err, postsOfChannel) {
        assert.equal(postsOfChannel.length, 2, 'should contain 2 posts');
        assert.equal(postsOfChannel[1].message, postsArr[0].message); //watch the sorting!
        assert.equal(postsOfChannel[0].message, postsArr[1].message);
        done();
      });
    });
  });

  it('should add and get posts to global list', function(done) {
    var channel = 'someChannel';
    var postsArr = [{'message': 'test message 1'}, {'message': 'test message 2'}];
    async.eachSeries(postsArr, function(item, cb) {
      posts.addPostToChannel(channel, item, cb);
    }, function() {
      posts.getLastPosts(null, 100, function(err, globalPosts) {
        assert.equal(globalPosts.length, 2, 'should contain 2 posts');
        assert.equal(globalPosts[1].message, postsArr[0].message); //watch the sorting!
        assert.equal(globalPosts[0].message, postsArr[1].message);
        done();
      });
    });
  });
});
