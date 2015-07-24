'use strict';

var server = function(redisClient) {
  var express = require('express');
  var app = express();
  var bodyParser = require('body-parser');
  var channels = require('./storage/channels')(redisClient);
  var posts = require('./storage/posts')(redisClient);
  var channelRoutes = require('./routes/channelRoutes.js')(channels, posts);
  // middleware
  app.use(bodyParser.json()); // for parsing application/json
  // setup Routes
  app.get('/', function (req, res) {
    res.send('Hello World!');
  });
  app.get('/c/:channel', channelRoutes.getChannel);
  app.post('/c/:channel', channelRoutes.postToChannel);

  return app;
};



module.exports.newServer = server;
