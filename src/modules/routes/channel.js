var serverError = function(res, err) {
  console.err('Request: ' + req.path + ' error: ' + err);
  res.status(500).send('Something broke!');
};

module.exports = function(channels, posts) {
  return {
    getChannel: function(req, res) {
      channels.channelExists(req.params.channel, function(err, exists) {
        if(err) { return serverError(res, err); }
        if(exists) {
          posts.getPostsOfChannel(req.params.channel, req.query.before, req.query.count, function(_err, postsArray) {
            if(_err) {
              console.err('Request: ' + req.path + ' error: ' + err);
              return res.status(500).send('Something broke!');
            }
            res.json({posts: postsArray});
          });
        } else {
          res.json({posts: []});
        }
      });
    },

    postToChannel: function(req, res) {
      if(req.body && req.body.message) {
        var createPost = function() {
          posts.addPostToChannel(req.params.channel, req.body, function(err, newPost) {
            if(err) { return serverError(); }
            res.status(201).json(newPost);
          });
        };
        channels.channelExists(req.params.channel, function(err, exists) {
          if(err) { return serverError(); }

          if(exists === false) {
            channels.createChannel(req.params.channel, function(_err) {
              if(_err) { return serverError(); }
              createPost();
            });
          }
          createPost();
        });
      }
    }
  };
};
