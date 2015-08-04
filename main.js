'use strict';

var redis = require('redis'),
    client = redis.createClient();
    client.on('error', function (err) {
      console.log('Redis error: ' + err);
    });
var filesDir = '.files/';
var fileStorage = require('./src/modules/storage/filesRedis')(client, filesDir);
var server = require('./src/modules/server').newServer(client, fileStorage);

var httpServer = server.listen(8080, function () {
  var host = httpServer.address().address;
  var port = httpServer.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});
