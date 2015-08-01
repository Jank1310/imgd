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
  var proxy = require('http-proxy').createProxyServer();
  var agent = require('superagent');

  // middleware
  app.use(bodyParser.json()); // for parsing application/json

  var isProduction = process.env.NODE_ENV === 'production';

  if(!isProduction) {
    var serveIndex = function(req, res) {
      agent.get('localhost:3000/index.html').end(function(err, _res) {
        if(_res.body) {
          res.type('html');
          res.send(_res.text);
        } else {
          res.send('Error');
        }
      });
    };

    app.all('/', serveIndex);
    app.all('/c/:channel', serveIndex);
    app.all('/newPost', serveIndex);
    //serve assets from the webpack server
    app.all('/assets/*', function (req, res) {
      proxy.web(req, res, {
          target: 'http://localhost:3000'
      });
    });
    proxy.on('error', function() {
      console.log('Could not connect to proxy, please try again...');
    });
  } else {
    app.get(express.static('dist/'));
    app.get('/c/:channel', function(req, res) {
      res.sendFile('index.html', {root: './dist'});
    });
  }

  //api root
  app.get('/api/', function(req, res) {
      res.json({'version': '1'});
  });

  //api login and registration
  app.post('/api/register', loginRoutes.register);
  app.post('/api/login', loginRoutes.login);

  //api channel list
  app.get('/api/recent/channels', channelRoutes.getRecentChannels);
  app.get('/api/popular/channels', channelRoutes.getPopularChannels);
  //api channels and posts
  app.get('/api/c/', channelRoutes.getGlobal);
  app.get('/api/c/:channel', channelRoutes.getChannel);
  app.post('/api/c/:channel', channelRoutes.postToChannel);

  return app;
};



module.exports.newServer = server;
