var assert = require('assert');
var redisClient = require('redis').createClient();
var async = require('async');
var posts = require('../../../src/modules/storage/posts.js')(redisClient);


describe('channels', function() {
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
      done();
    });
  });

  it('should get posts of channel', function(done) {
    var channel = 'someChannel';
    async.each([{'message': 'test message 1'}, {'message': 'test message 2'}], function(item, cb) {
      posts.addPostToChannel(channel, item, cb);
    }, function() {
      posts.getPostsOfChannel(channel, null, 100, function(err, postsOfChannel) {
        assert.equal(postsOfChannel.length, 2, 'should contain 2 posts');
        done();
      });
    });
  });

});
