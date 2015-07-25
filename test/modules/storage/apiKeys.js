'use strict';

var assert = require('assert');
var redisClient = require('redis').createClient();
var apiKeys = require('../../../src/modules/storage/apiKeys.js')(redisClient);
var async = require('async');

describe('apiKeys', function() {
  beforeEach(function(cb) {
    redisClient.select(2, function(err) {
      assert.ifError(err);
      redisClient.flushdb(cb);
    });
  });

  it('should generate a new api key', function(done) {
    var userId = 10;
    apiKeys.createAPIKey(userId, function(err) {
      assert.ifError(err);
      done();
    });
  });

  it('should verify new api key', function(done) {
    var userId = 42;
    var correctKey;
    async.series([
      function(cb) {
        apiKeys.createAPIKey(userId, function(err, apiKey) {
          correctKey = apiKey;
          cb(err, apiKey);
        });
      },
      function(cb) { apiKeys.verifyAPIKey('some random api key', cb); },
      function(cb) { apiKeys.verifyAPIKey(correctKey, cb); }
    ], function(err, results) {
      assert.ifError(err);
      assert.strictEqual(results[1], false, 'should not validate api key');
      assert.strictEqual(results[2][0], true, 'should validate api key');
      assert.equal(results[2][1], userId, 'should return user id');
      done();
    });
  });
});
