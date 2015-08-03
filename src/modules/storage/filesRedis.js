'use strict';
var uuid = require('node-uuid');
var fs = require('fs');
var Readable = require('stream').Readable;

var fileStorageHashKey = 'files';

/*
 * This is a simple storage implementation which uses the file system
 * to store data
 */
var filesRedis = function(redisClient) {
  /*
   * Saves a file and returns an access key
  */
  function save(sourceFile, callback) {
    var fileId = uuid.v4();
    fs.readFile(sourceFile, 'utf8', function (err, data) {
      if (err) { return callback(err); }
      redisClient.hset(fileStorageHashKey, fileId, data, function(_err) {
        if(_err) { return callback(_err); }
        return callback(null, fileId);
      });
    });
  }

  /*
   * Check if a file exists
   */
  function exists(fileId, callback) {
    redisClient.hexists(fileStorageHashKey, fileId, function(err, result) {
      if (err) { return callback(err); }
      var _exists = result === 1;
      callback(null, _exists);
    });
  }

  /*
   * Returns the file content as a stream
   */
  function getFileStream(fileId, callback) {
    exists(fileId, function(err, _exists) {
     if (err) { return callback(err); }
     if(_exists === false) {
       return callback('File with id: ' + fileId + ' does not exist');
     }
     redisClient.hget(fileStorageHashKey, fileId, function(_err, data) {
       if (_err) { return callback(_err); }
       var s = new Readable();
       s.push(data); // the string you want
       s.push(null); // indicates end-of-file basically - the end of the stream
       return callback(null, s);
    });
   });
  }

  return {
    save: save,
    exists: exists,
    getFileStream: getFileStream
  };
};


module.exports = filesRedis;
