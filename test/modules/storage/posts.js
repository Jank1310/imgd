var assert = require('assert');
var redisClient = require('redis').createClient();
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

  it('should get posts of channel', function(done) {
    var channel = 'someChannel';
    var postsArr = [{'message': 'test message 1'}, {'message': 'test message 2'}];
    async.each(postsArr, function(item, cb) {
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

});
