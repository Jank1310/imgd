'use strict';

var redis = require('redis'),
    redisClient = redis.createClient();
var server = require('../../../src/modules/server');
var request = require('supertest');
var assert = require('assert');
var async = require('async');
var sinon = require('sinon');
var path = require('path');

describe('channelRoutes', function() {
  var app;
  var filesStorage;
  var filesStorageExistsStub;
  var defaultPost = {message: 'some message 2', imageId: 'someImageId', previewImageId: 'somePreviewImageId'};

  beforeEach(function(done) {
    filesStorage = { exists: function() {}, imagesUrlPrefix: '/api/images' };
    filesStorageExistsStub = sinon.stub(filesStorage, 'exists');
    filesStorageExistsStub.withArgs(defaultPost.imageId).callsArgWith(1, null, true);
    filesStorageExistsStub.withArgs(defaultPost.previewImageId).callsArgWith(1, null, true);
    redisClient.select(2, function() {
      redisClient.flushdb(function() {
        app = server.newServer(redisClient, filesStorage);
        done();
      });
    });
  });

  it('should return recent channels', function(done) {
    this.slow(500);
    var channelList = ['channel1', 'channel2', 'channel3', 'channel4'];
    async.eachSeries(channelList, function(channel, cb) {
      request(app).post('/api/c/' + channel).send(defaultPost).end(cb);
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
        request(app).post('/api/c/' + channelName).send(defaultPost).end(next);
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
    var channel = 'someChannel3';
    request(app)
      .post('/api/c/' + channel)
      .on('error', done)
      .send(defaultPost)
      .end(function(err, res){
        assert.equal(res.status, 201);
        assert.deepEqual(res.body.message, defaultPost.message);
        assert.ok(filesStorageExistsStub.called);
        request(app)
              .get('/api/c/' + channel)
              .on('error', done)
              .expect('Content-Type', /json/)
              .expect(function(resp) {
                assert.equal(resp.body.posts.length, 1);
                assert.equal(resp.body.posts[0].id, 1);
                assert.equal(resp.body.posts[0].message, defaultPost.message);
                assert.equal(resp.body.posts[0].imageId, defaultPost.imageId);
                assert.equal(resp.body.posts[0].previewImageId, defaultPost.previewImageId);
                assert.equal(resp.body.posts[0].imageUrl, path.join(filesStorage.imagesUrlPrefix, defaultPost.imageId));
                assert.equal(resp.body.posts[0].previewImageUrl, path.join(filesStorage.imagesUrlPrefix, defaultPost.previewImageId));
                assert.equal(resp.body.posts[0].channel, channel, 'should sent channel name');
              })
              .expect(200, done);
       });
   });

   it('should not post when image id or previewImageId is wrong', function(done) {
     filesStorageExistsStub.withArgs('someImageId').callsArgWith(1, null, false);
     filesStorageExistsStub.withArgs('somePreviewImageId').callsArgWith(1, null, false);
     var channel = 'someChannel3';
     request(app)
           .post('/api/c/' + channel)
           .on('error', done)
           .send(defaultPost)
           .expect(400)
           .end(done);
   });

   it('should post and return global posts', function(done) {
     var channel = 'someChannel3';
     request(app)
           .post('/api/c/' + channel)
           .on('error', done)
           .send(defaultPost)
           .end(function() {
             request(app)
                   .get('/api/c/')
                   .on('error', done)
                   .expect('Content-Type', /json/)
                   .expect(function(resp) {
                     assert.equal(resp.body.posts.length, 1);
                     assert.equal(resp.body.posts[0].id, 1);
                     assert.equal(resp.body.posts[0].message, defaultPost.message);
                     assert.equal(resp.body.posts[0].imageId, defaultPost.imageId);
                     assert.equal(resp.body.posts[0].previewImageId, defaultPost.previewImageId);
                     assert.equal(resp.body.posts[0].imageUrl, path.join(filesStorage.imagesUrlPrefix, defaultPost.imageId));
                     assert.equal(resp.body.posts[0].previewImageUrl, path.join(filesStorage.imagesUrlPrefix, defaultPost.previewImageId));
                     assert.equal(resp.body.posts[0].channel, channel, 'should sent channel name');
                   })
                   .expect(200, done);
            });
   });
});
