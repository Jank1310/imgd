var assert = require('assert');
var redisConfig = require('../../../src/modules/storage/redisConfiguration');
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

  describe('create channel', function() {
    it('should create channel without error', function(done) {
      channels.createChannel('newChannel', function(err) {
        assert.ifError(err);
        return done();
      });
    });

    it('should raise error when space in channel name exists', function(done) {
      channels.createChannel('newChannel with space', function(err) {
        assert(err);
        done();
      });
    });

    it('should raise error when space in channel name exists', function(done) {
      channels.createChannel('newChannel with space', function(err) {
        assert(err);
        done();
      });
    });

    it('should create channel with underscore', function(done) {
      channels.createChannel('name_with_underscore', function(err) {
        assert.ifError(err);
        done();
      });
    });

    it('should raise errer when channel name is len > 25', function(done) {
      channels.createChannel('afjdfklasdjfasdfjasdflkaas', function(err) {
        assert(err);
        done();
      });
    });

    it('should raise when channel name is len < 2', function(done) {
      channels.createChannel('a', function(err) {
        assert(err);
        done();
      });
    });

    it('should raise when channel name contains special chars', function(done) {
      channels.createChannel('some&awkward%20§channel', function(err) {
        assert(err);
        done();
      });
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

  it('should return popular channels', function(done) {
    var channelList = [{'channel1': 2}, {'channel2': 3}, {'channel3': 4}, {'channel4': 2}];
    async.each(channelList, function(channel, cb) {
      var channelName = Object.keys(channel)[0];
      var channelScore = channel[channelName];
      redisClient.zadd(redisConfig.CHANNELS_SORT_BY_NUMBER_OF_POSTS, channelScore, channelName, cb);
    }, function() {
      channels.getPopular(2, function(err, hotChannels) {
        assert.ifError(err);
        assert.equal(hotChannels.length, 2, 'should contain 2 channels');
        assert.equal(hotChannels[0], 'channel3');
        assert.equal(hotChannels[1], 'channel2');
        done();
      });
    });
  });
});
