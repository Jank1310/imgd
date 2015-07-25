'use strict';

var serverError = require('./serverError');

module.exports = function(channels, posts) {
  return {
    getChannel: function(req, res) {
      channels.channelExists(req.params.channel, function(err, exists) {
        if(err) { return serverError(req, res, err); }
        if(exists === true) {
          posts.getPostsOfChannel(req.params.channel, req.query.before, req.query.count, function(_err, postsArray) {
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

    postToChannel: function(req, res) {
      if(req.body && req.body.message) {
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
              if(_err) { return serverError(req, err); }
              createPost();
            });
          } else {
            createPost();
          }
        });
      }
    }
  };
};
