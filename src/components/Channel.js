'use strict';

var React = require('react/addons');
var Post = require('components/Post');
var Reflux = require('reflux');
var postsStore = require('stores/PostsStore');

require('styles/Channel.scss');

var Channel = React.createClass({
  mixins: [Reflux.connect(postsStore, 'postsStatus')],

  render: function () {
    return (
        <div className="channel">
          {this.state.postsStatus.map(function(post) {
            return <Post key={post.id} data={post} />;
          })}
        </div>
      );
  }
});

module.exports = Channel;
