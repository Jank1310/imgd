'use strict';

var serverError = require('./serverError');
var validator = require('validator');

module.exports = function(channels, posts) {
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
        return res.json({posts: postsArray});
      });
    },

    postToChannel: function(req, res) {
      if(req.body && req.body.message && validator.isAscii(req.params.channel)) {
        var createPost = function() {
          posts.addPostToChannel(req.params.channel, req.body, function(err, newPost) {
            if(err) { return serverError(req, res, err); }
            return res.status(201).send(newPost);
          });
        };
        channels.channelExists(req.params.channel, function(err, exists) {
          if(err) { return serverError(req, res, err); }
          if(exists === false) {
            channels.createChannel(req.params.channel, function(_err) {
              if(_err) { return serverError(req, res, err); }
              createPost();
            });
          } else {
            createPost();
          }
        });
      } else {
        return res.status(400).send({error: 'malformed post request', errorCode: 100});
      }
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
