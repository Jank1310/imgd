'use strict';

var serverError = require('./serverError');
var gm = require('gm');
var tmp = require('tmp');
var async = require('async');
var fs = require('fs');
var path = require('path');
var _ = require('underscore');

var acceptedFileFormats = ['JPEG', 'JPG', 'PNG', 'GIF'];

module.exports = function(filesStorage) {
  function getImage(req, res) {
    var imageId = req.params.imageId;
    filesStorage.getFileStream(imageId, function(err, imageStream) {
      if(err) { return serverError(req, res, err); }
      res.set('Content-Type', 'image/jpeg');
      imageStream.on('error', function(_err) { serverError(req, res, _err); });
      imageStream.pipe(res);
    });
  }

  function saveSmallImage(sourceImage, callback) {
    tmp.file(function(err, filePath, fd) {
      var stream = gm(sourceImage).resize(1080).stream();
      stream.on('end', function() {
          filesStorage.save(filePath, callback);
      });
      var output = fs.createWriteStream(filePath, {fd: fd});
      stream.pipe(output);
    });
  }

  function saveImage(sourceImage, callback) {
    filesStorage.save(sourceImage, callback);
  }

  function addImage(req, res) {
    var imagePath = req.file.path;
    gm(imagePath).identify(function(err, result) {
      if(err) { return res.status(406).send('Image corrupted or no image'); }
      if(_.contains(acceptedFileFormats, result.format) === false) {
        return res.status(406).send('Only jpeg, png or gif files are allowed! Sent: ' + result.format);
      }
      async.parallel([
        function(done) { saveImage(imagePath, done); },
        function(done) { saveSmallImage(imagePath, done); }
      ], function(_err, results) {
        if(_err) { return serverError(req, res, err); }
        res.json({
          imageId: results[0],
          imageUrl: path.join('/api/images/', results[0]),
          streamImageId: results[1],
          streamImageUrl: path.join('/api/images/', results[1])
        });
      });
    });
  }

  return {
      addImage: addImage,
      getImage: getImage
  };
};
