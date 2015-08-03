'use strict';

var mv = require('mv');
var uuid = require('node-uuid');
var fs = require('fs');
var path = require('path');

/*
 * This is a simple storage implementation which uses the file system
 * to store data
 */
var files = function(storageFolder) {
  /*
   * Saves a file and returns an access key
  */
  function save(sourceFile, callback) {
    var fileId = uuid.v4();
    var newFilePath = path.join(storageFolder, fileId);
    mv(sourceFile, newFilePath, {clobber: false}, function(err) {
      if(err) { return callback(err); }
      return callback(null, fileId);
    });
  }

  /*
   * Check if a file exists
   */
  function exists(fileId, callback) {
    var filePath = path.join(storageFolder, fileId);
    fs.exists(filePath, callback);
  }

  /*
   * Returns the file content as a stream
   */
 function getFileStream(fileId, callback) {
   var filePath = path.join(storageFolder, fileId);
   exists(fileId, function(_exists) {
     if(_exists === true) {
       var stream = fs.createReadStream(filePath);
       return callback(null, stream);
     }
     return callback('File with id: ' + fileId + ' does not exist');
   });
  }

  return {
    save: save,
    exists: exists,
    getFileStream: getFileStream
  };
};


module.exports = files;
