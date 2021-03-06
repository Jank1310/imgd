var assert = require('assert');
var redisClient = require('redis').createClient();
var channels = require('../../../src/modules/storage/channels.js')(redisClient);
var async = require('async');

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

  it('should return recent channels', function(done) {
    var channelList = ['channel1', 'channel2', 'channel3', 'channel4'];
    async.eachSeries(channelList, function(channel, cb) {
      channels.createChannel(channel, cb);
    }, function() {
        channels.getRecent(3, function(err, recentChannels) {
          assert.ifError(err);
          assert.equal(recentChannels.length, 3, 'should contain 3 channels');
          assert.equal(channelList[3], recentChannels[0]);
          assert.equal(channelList[2], recentChannels[1]);
          assert.equal(channelList[1], recentChannels[2]);
          done();
        });
    });
  });
});
