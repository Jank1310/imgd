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
    var username = 'Jon Doe';
    var password = '1234';
    users.addUser(email, username, password, function(err, addedUser) {
        assert.ifError(err);
        assert.equal(addedUser.id, 1, 'should set user id');
        assert.equal(addedUser.email, email, 'should set mail');
        assert.equal(addedUser.username, username, 'should set username');
        done(err);
    });
  });

  it('should check if a user exists', function(done) {
    this.slow(700);
    var email = 'some@user.com';
    var username = 'Jon Doe';
    var password = '1234';
    users.userExists(email, function(err, exists) {
        assert.ifError(err);
        assert.strictEqual(exists, false, 'user should not exist');
        users.addUser(email, username, password, function(_err, user) {
            assert.ifError(_err);
            users.userExists(email, function(__err, _exists, id) {
              assert.ifError(__err);
              assert.equal(id, user.id, 'should return id');
              assert.ok(_exists, 'user should exist');
              done();
            });
        });
    });
  });

  it('should get user details', function(done) {
    this.slow(700);
    var email = 'some@user.com';
    var username = 'Jon Doe';
    var password = '1234';
    users.addUser(email, username, password, function(_err, user) {
        assert.ifError(_err);
        users.getUserDetails(user.id, function(__err, _user) {
          assert.ifError(__err);
          assert.deepEqual(_user, user, 'user details should match');
          done();
        });
    });
  });

  it('should verify password', function(done) {
    this.slow(10000);
    var username = 'Jon Doe';
    var email = 'some@user.com';
    var password = '1234';
    async.series([
      function(cb) { users.addUser(email, username, password, cb); },
      function(cb) { users.verifyPassword('wrong user', password, cb); },
      function(cb) { users.verifyPassword(email, 'wrong password', cb); },
      function(cb) { users.verifyPassword(email, password, cb); }], function(err, results) {
      assert.ifError(err);
      assert.strictEqual(results[1][0], false, 'password should be invalid');
      assert.strictEqual(results[2][0], false, 'password should be invalid');
      assert.strictEqual(results[3][0], true, 'password should be valid');
      assert.equal(results[3][1], results[0].id, 'should return userid');
      done();
    });
  });
});
