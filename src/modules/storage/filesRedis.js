'use strict';
var uuid = require('node-uuid');
var fs = require('fs');
var extra = require('fs-extra');
var path = require('path');
var redisConfig = require('./redisConfiguration');

/*
 * This is a simple storage implementation which uses the file system
 * to store data
 */
var filesRedis = function(redisClient, filesDirectory) {
  /*
   * Saves a file and returns an access key
  */
  function save(sourceFile, callback) {
    var fileId = uuid.v4();
    var fileStoragePath = path.join(filesDirectory, fileId);
    extra.ensureDir(filesDirectory, function(err) {
      if(err) { return callback(err); }
      extra.copy(sourceFile, fileStoragePath, function(_err) {
        if (_err) { return callback(_err); }
        redisClient.sadd(redisConfig.FILES_SET, fileId, function(__err) {
          if (__err) { return callback(__err); }
          return callback(null, fileId);
        });
      });
    });
  }

  /*
   * Check if a file exists
   */
  function exists(fileId, callback) {
    redisClient.sismember(redisConfig.FILES_SET, fileId, function(err, result) {
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
     var filePath = path.join(filesDirectory, fileId);
     var readStream = fs.createReadStream(filePath);
     return callback(null, readStream);
   });
  }

  return {
    save: save,
    exists: exists,
    getFileStream: getFileStream,
    imagesUrlPrefix: '/api/images'
  };
};


module.exports = filesRedis;
