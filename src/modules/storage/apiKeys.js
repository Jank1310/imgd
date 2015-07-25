'use strict';

var uuid = require('node-uuid');
var redisConfig = require('./redisConfiguration');
var sha1 = require('sha1');
var moment = require('moment');

var apiKeys = function(redisClient) {
  return {
    createAPIKey: function(userId, cb) {
      var newApiKey = uuid.v4();
      var hashedAPIKey = sha1(newApiKey);
      var apiKeyContent = {
        apiKey: hashedAPIKey,
        created: moment().unix(),
        userId: userId
      };
      redisClient.hmset(redisConfig.API_KEYS_HASH_PREFIX + hashedAPIKey, apiKeyContent, function(err) {
        if(err) { return cb(err); }
        redisClient.hmset(redisConfig.API_KEYS_TO_USER_ID_HASH, hashedAPIKey, userId, function(_err) {
          if(_err) { return cb(err); }
          return cb(null, newApiKey);
        });
      });
    },

    //returns valid and userId (if valid)
    verifyAPIKey: function(apiKey, cb) {
      var hashedAPIKey = sha1(apiKey);
      redisClient.hget(redisConfig.API_KEYS_TO_USER_ID_HASH, hashedAPIKey, function(err, userId) {
        if(err) { return cb(err); }
        if(userId) {
          return cb(null, true, userId);
        }
        return cb(null, false);
      });
    }
  };
};

module.exports = apiKeys;
