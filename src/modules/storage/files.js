'use strict';

var mv = require('node-mv');
var uuid = require('node-uuid');
var fs = require('fs');

var storageFolder = './storage_images/';

/*
 * This is a simple storage implementation which uses the file system
 * to store data
 */
var files = function() {
  /*
   * Saves a file and returns an access key
  */
  function save(sourceFile, callback) {
    var fileId = uuid.v4();
    var newFilePath = storageFolder + fileId;
    console.log('', sourceFile, ' to ', newFilePath);
    mv(sourceFile, newFilePath, {mkdirp: true, clobber: false}, function(err) {
      if(err) { return callback(err); }
      return callback(null, fileId);
    });
  }

  /*
   * Check if a file exists
   */
  function exists(fileId, callback) {
    var filePath = storageFolder + fileId;
    fs.fileExists(filePath, callback);
  }

  /*
   * Returns the file content as a stream
   */
 function getFileStream(fileId, callback) {
   var filePath = storageFolder + fileId;
   exists(function(_exists) {
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
}();


module.exports = files;
