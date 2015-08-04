'use strict';

var async = require('async');
var serverError = require('./serverError');
var validator = require('validator');
var _ = require('underscore');
var path = require('path');

module.exports = function(channels, posts, files) {
  return {
    getChannel: function(req, res) {
      if(req.query.before) {
        if(!validator.isNumeric(req.query.before)) {
          return res.status(400).send({error: 'Before query parameter malformed', errorCode: 100});
        }
      }
      if(req.query.limit) {
        if(!validator.isNumeric(req.query.limit) || req.query.limit < 0 || req.query.limit > 100) {
          return res.status(400).send({error: 'Count parameter exceeds limits 0 < N < 100', errorCode: 100});
        }
      }
      var limit = req.query.limit ? req.query.limit : 10;
      channels.channelExists(req.params.channel, function(err, exists) {
        if(err) { return serverError(req, res, err); }
        if(exists === true) {
          posts.getPostsOfChannel(req.params.channel, req.query.before, limit, function(_err, postsArray) {
            if(_err) {
              return res.status(500).send('Something broke!');
            }
            _.each(postsArray, function(post) {
              post.imageUrl = path.join(files.imagesUrlPrefix, post.imageId);
              post.previewImageUrl = path.join(files.imagesUrlPrefix, post.previewImageId);
            });
            return res.json({posts: postsArray});
          });
        } else {
          return res.json({posts: []});
        }
      });
    },

    getGlobal: function(req, res) {
      if(req.query.before) {
        if(!validator.isNumeric(req.query.before)) {
          return res.status(400).send({error: 'Before query parameter malformed', errorCode: 100});
        }
      }
      if(req.query.limit) {
        if(!validator.isNumeric(req.query.limit) || req.query.limit < 0 || req.query.limit > 100) {
          return res.status(400).send({error: 'Count parameter exceeds limits 0 < N < 100', errorCode: 100});
        }
      }
      var limit = req.query.limit ? req.query.limit : 10;
      posts.getLastPosts(req.query.before, limit, function(err, postsArray) {
        if(err) {
          return res.status(500).send('Something broke!');
        }
        _.each(postsArray, function(post) {
          post.imageUrl = path.join(files.imagesUrlPrefix, post.imageId);
          post.previewImageUrl = path.join(files.imagesUrlPrefix, post.previewImageId);
        });
        return res.json({posts: postsArray});
      });
    },

    postToChannel: function(req, res) {
      var requestValid = req.body && req.body.message && req.body.imageId && req.body.previewImageId && validator.isAscii(req.params.channel);
      if(!requestValid) {
        return res.status(400).send({error: 'malformed post request', errorCode: 100});
      }
      var verifyImages = function(callback) {
        async.parallel([
          function(done) { files.exists(req.body.imageId, done); },
          function(done) { files.exists(req.body.previewImageId, done); }
        ], function(err, results) {
          if(err) { return callback(err); }
          var imagesValid = results[0] === true && results[1] === true;
          if(imagesValid === false) {
            return callback('images invalid');
          }
          return callback(null, imagesValid);
        });
      };

      var creatChannelIfNeeded = function(callback) {
        channels.channelExists(req.params.channel, function(err, exists) {
          if(err) { return callback(err); }
          if(exists === false) {
            channels.createChannel(req.params.channel, callback);
          }
        });
      };

      var createPost = function(callback) {
        posts.addPostToChannel(req.params.channel, req.body, function(err, newPost) {
          if(err) { return callback(err); }
          return callback(null, newPost);
        });
      };

      async.series([verifyImages, creatChannelIfNeeded, createPost], function(err, result) {
        if(err === 'images invalid') {
          return res.status(400).send({error: 'malformed post request', errorCode: 100});
        }
        if(err) { return serverError(req, res, err); }
        return res.status(201).send(result[2]);
      });
    },

    getRecentChannels: function(req, res) {
      if(req.query.limit) {
        if(!validator.isNumeric(req.query.limit) || req.query.limit < 0 || req.query.limit > 100) {
          return res.status(400).send({error: 'Count parameter exceeds limits 0 < N < 100', errorCode: 100});
        }
      }
      var limit = req.query.limit ? req.query.limit : 10;
      channels.getRecent(limit, function(err, result) {
        if(err) { return serverError(req, res, err); }
        return res.json({recentChannels: result});
      });
    },

    getPopularChannels: function(req, res) {
      if(req.query.limit) {
        if(!validator.isNumeric(req.query.limit) || req.query.limit < 0 || req.query.limit > 100) {
          return res.status(400).send({error: 'Count parameter exceeds limits 0 < N < 100', errorCode: 100});
        }
      }
      var limit = req.query.limit ? req.query.limit : 10;
      channels.getPopular(limit, function(err, result) {
        if(err) { return serverError(req, res, err); }
        return res.json({popularChannels: result});
      });
    }
  };
};
