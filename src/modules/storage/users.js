var redisConfig = require('./redisConfiguration');
var bcrypt = require('bcrypt-nodejs');
var async = require('async');

var users = function(redisClient) {
  return {
    //expects valid data, performs no verfication!
    addUser: function(email, nick, password, cb) {
      redisClient.incr(redisConfig.USRS_ID_KEY, function(err, nextUserId) {
        if(err) { return cb(err); }
        bcrypt.hash(password, null, null, function(_err, passwordHash) {
          if(_err) { return cb(_err); }
            var user = {
              id: nextUserId,
              nick: nick,
              email: email,
              password: passwordHash
            };
            redisClient.hmset(redisConfig.USERS_HASH_PREFIX + user.id, user, function(_err2) {
              if(_err2) { return cb(_err2); }
              redisClient.hmset(redisConfig.EMAIL_TO_USER_ID_HASH, user.email, user.id, function(_err3) {
                delete user.password;
                cb(_err3, user);
              });
            });
        });
      });
    },

    verifyPassword: function(email, password, cb) {
      var getUserId = function(callback) {
        redisClient.hget(redisConfig.EMAIL_TO_USER_ID_HASH, email, callback);
      };
      var getHashedUserPassword = function(userId, callback) {
        if(userId) {
          return redisClient.hget(redisConfig.USERS_HASH_PREFIX + userId, 'password', callback);
        } else {
          return callback(null, null);
        }
      };
      var checkPassword = function(hashedPassword, callback) {
        if(hashedPassword) {
          return bcrypt.compare(password, hashedPassword, callback);
        }
        return callback(null, false);
      };
      var verfiyPasswordComposed = async.seq(getUserId, getHashedUserPassword, checkPassword);
      verfiyPasswordComposed(cb);
    }
  };
};

module.exports = users;
