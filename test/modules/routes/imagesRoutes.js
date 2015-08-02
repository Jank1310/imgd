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


});
