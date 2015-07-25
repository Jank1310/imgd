'use strict';

var assert = require('assert');
var redisClient = require('redis').createClient();
var users = require('../../../src/modules/storage/users.js')(redisClient);
var async = require('async');

describe('users', function() {
  beforeEach(function(cb) {
    redisClient.select(2, function(err) {
      assert.ifError(err);
      redisClient.flushdb(cb);
    });
  });

  it('should register a new user', function(done) {
    this.slow(1000);
    var email = 'some@user.com';
    var nick = 'Jon Doe';
    var password = '1234';
    users.addUser(email, nick, password, function(err, addedUser) {
        assert.ifError(err);
        assert.equal(addedUser.id, 1, 'should set user id');
        assert.equal(addedUser.email, email, 'should set mail');
        assert.equal(addedUser.nick, nick, 'should set nick');
        done(err);
    });
  });

  it('should verify password', function(done) {
    this.slow(10000);
    var nick = 'Jon Doe';
    var email = 'some@user.com';
    var password = '1234';
    async.series([
      function(cb) { users.addUser(email, nick, password, cb); },
      function(cb) { users.verifyPassword('wrong user', password, cb); },
      function(cb) { users.verifyPassword(email, 'wrong password', cb); },
      function(cb) { users.verifyPassword(email, password, cb); }], function(err, results) {
      assert.ifError(err);
      assert.equal(results[1], false, 'password should be invalid');
      assert.equal(results[2], false, 'password should be invalid');
      assert.equal(results[3], true, 'password should be valid');
      done();
    });
  });
});
