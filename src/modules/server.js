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
  app.get('/*', express.static('dist/'));

  //api root
  app.get('/api/', function(req, res) {
      res.json({'version': '1'});
  });

  //login and registration
  app.post('/api/register', loginRoutes.register);
  app.post('/api/login', loginRoutes.login);
  //channels and posts
  app.get('/api/c/:channel', channelRoutes.getChannel);
  app.post('/api/c/:channel', channelRoutes.postToChannel);

  return app;
};



module.exports.newServer = server;
