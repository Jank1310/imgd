'use strict';

var redis = require('redis'),
    redisClient = redis.createClient();
var server = require('../../../src/modules/server');
var request = require('supertest');
var assert = require('assert');
var users = require('../../../src/modules/storage/users')(redisClient);

describe('loginRoutes', function() {
  var app;
  var sampleUser = {
    username: 'Jon Doe',
    email: 'jondoe@internet.com',
    password: 'secretPassword'
  };

  beforeEach(function(done) {
    redisClient.select(2, function() {
      redisClient.flushdb(function() {
        app = server.newServer(redisClient);
        done();
      });
    });
  });

  describe('registration', function() {
    it('should register new user', function(done) {
      this.slow(1000);
      var expectedResponse = {
        username: 'Jon Doe',
        email: 'jondoe@internet.com',
        id: 1
      };
      request(app)
            .post('/api/register')
            .on('error', done)
            .send(sampleUser)
            .end(function(err, res){
              assert.equal(res.status, 201);
              assert.deepEqual(res.body, expectedResponse);
              done();
            });
    });

    it('should not accept malformed mail address', function(done) {
      var registration = {
        username: 'Jon Doe',
        email: 'wrongmailinternet.com',
        password: 'secretPassword'
      };
      request(app)
            .post('/api/register')
            .on('error', done)
            .send(registration)
            .end(function(err, res){
              assert.equal(res.status, 400);
              assert.deepEqual(res.body, {error: 'email malformed', errorCode: 1});
              done();
            });
    });

    it('should not accept short password', function(done) {
      var registration = {
        username: 'Jon Doe',
        email: 'jondoe@internet.com',
        password: '123'
      };
      request(app)
            .post('/api/register')
            .on('error', done)
            .send(registration)
            .end(function(err, res){
              assert.equal(res.status, 400);
              assert.deepEqual(res.body, {error: 'Password malformed. Minimum 4 digits. Maximum 50 digits.', errorCode: 2});
              done();
            });
        });
  });

  describe('login', function() {
    beforeEach(function(done) {
      users.addUser(sampleUser.email, sampleUser.username, sampleUser.password, done);
    });

    it('should login with correct credentials and get api key', function(done) {
      this.slow(2000);
      request(app)
            .post('/api/login')
            .on('error', done)
            .send({email: sampleUser.email, password: sampleUser.password})
            .end(function(err, res){
              assert.equal(res.status, 200);
              assert.equal(res.body.id, 1, 'should return id');
              assert.equal(res.body.email, 'jondoe@internet.com', 'should return email');
              assert.equal(res.body.username, 'Jon Doe', 'should return username');
              assert.ok(res.body.apiKey, 'should return api key');
              done();
            });
    });

    it('should not login with wrong email', function(done) {
      this.slow(2000);
      request(app)
            .post('/api/login')
            .on('error', done)
            .send({email: 'someWrongEmail', password: sampleUser.password})
            .end(function(err, res){
              assert.equal(res.status, 401);
              done();
            });
    });

    it('should not login with wrong password', function(done) {
      this.slow(2000);
      request(app)
            .post('/api/login')
            .on('error', done)
            .send({email: sampleUser.email, password: 'wrongpassword'})
            .end(function(err, res){
              assert.equal(res.status, 401);
              done();
            });
    });
  });
});
