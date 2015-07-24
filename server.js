var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var async = require('async');
var moment = require('moment');
var redis = require('redis'),
    client = redis.createClient();

client.on('error', function (err) {
  console.log('Redis error: ' + err);
});

//redis data
var CHANNELS_SET = 'channels';
var CHANNEL_POST_IDS_PREFIX = 'postids:'; //posts:channelname
var POST_HASH_PREFIX = 'posts:'; //posts:uniqueid
var POSTS_ID_KEY = 'posts_next_id';

//create basic user
client.set('users:id', 1);
client.hmset('users:1', {'name': 'test', 'password': '1234'});

// middleware
app.use(bodyParser.json()); // for parsing application/json

// setup Routes
app.get('/', function (req, res) {
  res.send('Hello World!');
});


//channel route, returns json with posts.
app.get('/c/:channel', function(req, res) {
  client.sismember(CHANNELS_SET, req.params.channel, function(err, result) {
    if(err) {
      console.err('Request: ' + req.path + ' error: ' + err);
      return res.status(500).send('Something broke!');
    }

    if(result === 1) {
        getPostsOfChannel(req.params.channel, req.query.before, 100, function(_err, postsArray) {
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
});

//post to any channel
app.post('/c/:channel', function(req, res) {
  if(req.body && req.body.message) {
    addPostToChannel(req.params.channel, req.body, function(err, post) {
      if(err) {
        res.status(500).send('Something broke!');
      } else {
        res.status(201).json(post);
      }
    });
  }
});

var getPostsOfChannel = function(channel, before, postCount, cb) {
  if(!before) {
    before = '+inf'; //latest post
  }
  postCount = postCount < 100 ? postCount : 100; //limit post count to 100
  var postsSSet = CHANNEL_POST_IDS_PREFIX + channel;
  console.log('Get posts of channel: ' + channel + ' before: ' + before + ' posts: ' + postCount);
  client.zrevrangebyscore(postsSSet, before, '-inf', 'LIMIT', '0', postCount, function(err, postIds) {
    if(err) {
      return cb(err);
    }
    //get posts for ids
    var posts = [];
    async.eachSeries(postIds, function(postId, _cb) {
      var postHash = POST_HASH_PREFIX + postId;
      client.hgetall(postHash, function(_err, post) {
        if(_err) { return _cb(_err); }
        posts.push(post);
        return _cb();
      });
    }, function(_err) {
      if(_err) { return cb(_err); }
      return cb(null, posts);
    });
  });
};

var createChannel = function(channel, cb) {
  client.sismember(CHANNELS_SET, channel, function(err, result) {
    if(err) { return (err); }
    if(result === 1) {
      console.log('Channel: ' + channel + ' exists, nothing to do');
      return cb();
    } else {
      console.log('Channel: ' + channel + ' does not exists, creating...');
      //add the channel to the set
      client.sadd(CHANNELS_SET, channel, function(_err) {
        if(_err) { return cb(_err); }
        console.log('Channel ' + channel + ' created!');
        return cb();
      });
    }
  });
};

var addPostToChannel = function(channel, post, cb) {
  var ts = moment().unix();
  client.incr(POSTS_ID_KEY, function(err, postId) {
    if(err) { return cb(err); }
    //use post content to prevent unwanted key from req.body
    postContent = {
      'id': postId,
      'message': post.message,
      'created': ts
    };
    client.hmset(POST_HASH_PREFIX + postId, postContent, function(_err) {
      if(_err) { return cb(err); }
      client.zadd(CHANNEL_POST_IDS_PREFIX + channel, postId, postId, function(_e) {
        if(_e) { return cb(err); }
        createChannel(channel, function(cerr) {
          if(cerr) { return cb(cerr); }
          return cb(null, postContent);
        });
      });
    });
  });
};

var server = app.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
