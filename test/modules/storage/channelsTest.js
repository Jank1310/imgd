var assert = require('assert');
var redisClient = require('redis').createClient();
var channels = require('../../../src/modules/storage/channels.js')(redisClient);


describe('channels', function() {
  beforeEach(function(cb) {
    redisClient.select(2, function(err) {
      assert.ifError(err);
      redisClient.flushdb(cb);
    });
  });

  it('should check if channel exists', function (done) {
    channels.channelExists('someChannel', function(err, exists) {
      assert.ifError(err);
      assert.equal(exists, false, 'should not find a non existent channel');
      return done();
    });
  });

  it('should create channel without error', function(done) {
    channels.createChannel('newChannel', function(err) {
      assert.ifError(err);
      return done();
    });
  });

  it('should find existent channel', function(done) {
    channels.createChannel('newChannel', function(err) {
      assert.ifError(err);
      channels.channelExists('newChannel', function(_err, exists) {
        assert.ifError(_err);
        assert.equal(exists, true, 'should find channel');
        return done();
      });
    });
  });
});
