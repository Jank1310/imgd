'use strict';

var redis = require('redis'),
    redisClient = redis.createClient();
var server = require('../../../src/modules/server');
var request = require('supertest');
var assert = require('assert');
var async = require('async');

describe('channelRoutes', function() {
  var app;
  beforeEach(function(done) {
    redisClient.select(2, function() {
      redisClient.flushdb(function() {
        app = server.newServer(redisClient);
        done();
      });
    });
  });

  it('should return recent channels', function(done) {
    this.slow(500);
    var channelList = ['channel1', 'channel2', 'channel3', 'channel4'];
    async.eachSeries(channelList, function(channel, cb) {
      request(app).post('/api/c/' + channel).send({'message': 'new message'}).end(cb);
    }, function() {
        request(app)
        .get('/api/recent/channels?limit=2')
        .on('error', done)
        .expect({recentChannels: ['channel4', 'channel3']})
        .expect(200, done);
    });
  });

  it('should return popular channels', function(done) {
    var channelList = [{'channel1': 2}, {'channel2': 3}, {'channel3': 4}, {'channel4': 2}];
    async.each(channelList, function(channel, cb) {
      var channelName = Object.keys(channel)[0];
      async.times(channel[channelName], function(n, next){
        request(app).post('/api/c/' + channelName).send({'message': 'new message' + n}).end(next);
      }, cb);
    }, function() {
        request(app)
          .get('/api/popular/channels?limit=2')
          .on('error', done)
          .expect({popularChannels: ['channel3', 'channel2']})
          .expect(200, done);
    });
  });

  it('should return no posts when channel does not exist', function(done) {
    request(app)
          .get('/api/c/someChannel')
          .on('error', done)
          .expect('Content-Type', /json/)
          .expect({'posts': []})
          .expect(200, done);
  });

  it('should post and return posts', function(done) {
    var postContent = {'message': 'some message 2'};
    var channel = 'someChannel3';
    request(app)
          .post('/api/c/' + channel)
          .on('error', done)
          .send(postContent)
          .end(function(err, res){
            assert.equal(res.status, 201);
            assert.deepEqual(res.body.message, postContent.message);
            request(app)
                  .get('/api/c/' + channel)
                  .expect('Content-Type', /json/)
                  .expect(function(resp) {
                    assert.equal(resp.body.posts.length, 1);
                    assert.equal(resp.body.posts[0].id, 1);
                    assert.equal(resp.body.posts[0].message, postContent.message);
                    assert.equal(resp.body.posts[0].channel, channel, 'should sent channel name');
                  })
                  .expect(200, done);
           });
   });
});
