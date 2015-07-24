var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var redis = require('redis'),
    client = redis.createClient();

var channels = require('./src/modules/storage/channels')(client);
var posts = require('./src/modules/storage/posts')(client);

var channelRoutes = require('./src/modules/routes/channel.js')(channels, posts);

client.on('error', function (err) {
  console.log('Redis error: ' + err);
});

// middleware
app.use(bodyParser.json()); // for parsing application/json

// setup Routes
app.get('/', function (req, res) {
  res.send('Hello World!');
});
app.get('/c/:channel', channelRoutes.getChannel);
app.post('/c/:channel', channelRoutes.postToChannel);

var server = app.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
