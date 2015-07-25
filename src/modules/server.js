'use strict';

var server = function(redisClient) {
  var express = require('express');
  var app = express();
  var bodyParser = require('body-parser');
  var channels = require('./storage/channels')(redisClient);
  var posts = require('./storage/posts')(redisClient);
  var users = require('./storage/users')(redisClient);
  var apiKeys = require('./storage/apiKeys')(redisClient);
  var channelRoutes = require('./routes/channelRoutes.js')(channels, posts);
  var loginRoutes = require('./routes/loginRoutes.js')(users, apiKeys);
  // middleware
  app.use(bodyParser.json()); // for parsing application/json
  // setup Routes
  app.get('/', function (req, res) {
    res.json({'version': '1'});
  });

  //login and registration
  app.post('/register', loginRoutes.register);
  app.post('/login', loginRoutes.login);
  //channels and posts
  app.get('/c/:channel', channelRoutes.getChannel);
  app.post('/c/:channel', channelRoutes.postToChannel);

  return app;
};



module.exports.newServer = server;
