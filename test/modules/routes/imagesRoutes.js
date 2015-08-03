'use strict';

var redis = require('redis'),
    redisClient = redis.createClient();

var server = require('../../../src/modules/server');
var request = require('supertest');
var assert = require('assert');
var async = require('async');
var tmp = require('tmp');


describe('imageRoutes', function() {
  var app;
  beforeEach(function() {
    var localFiles = require('../../../src/modules/storage/filesLocal')(tmp.dirSync().name);
    app = server.newServer(redisClient, localFiles);
  });

  it('should add image (jpg) and return ids', function(done) {
    this.slow(1500);
    request(app)
      .post('/api/images/')
      .attach('image', './test/fixtures/test_image_1.jpg')
      .expect('Content-Type', /json/)
      .expect(201)
      .on('error', done)
      .end(function(err, response) {
        assert(response.body.imageId, 'set image id');
        assert(response.body.imageUrl, 'set image url');
        assert(response.body.streamImageId, 'set small image id');
        assert(response.body.streamImageUrl, 'set small image url');
        done();
      });
  });

  it('should deliver images', function(done) {
    this.slow(2000);
    request(app)
      .post('/api/images/')
      .attach('image', './test/fixtures/test_image_1.jpg')
      .end(function(err, res) {
        async.parallel([
          function(cb) { request(app).get(res.body.imageUrl).expect(200).expect('Content-Type', /jpeg/).end(cb); },
          function(cb) { request(app).get(res.body.streamImageUrl).expect(200).expect('Content-Type', /jpeg/).end(cb); }
        ], done);
      });
  });

  it('should handle corrupt image', function(done) {
    request(app)
      .post('/api/images/')
      .attach('image', './test/fixtures/some_non_image.db')
      .expect(406)
      .end(done);
  });

  it('should handle file formats', function(done) {
    this.slow(1000);
    request(app)
      .post('/api/images/')
      .attach('image', './test/fixtures/test_image_1.tiff')
      .expect(406)
      .end(done);
  });
});
