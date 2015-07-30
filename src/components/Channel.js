'use strict';

var React = require('react/addons');
var Reflux = require('reflux');
var Router = require('react-router');
var Link = Router.Link;

var Post = require('components/Post');
var postsStore = require('stores/PostsStore');


require('styles/Channel.scss');

var Channel = React.createClass({
  mixins: [Reflux.connect(postsStore, 'postsStatus')],

  render: function () {
    var channelName = '/global';
    if(this.props.channelName) {
      channelName = '/' + this.props.channelName;
    }

    return (
        <div className="channel">
          <h2>{channelName}</h2>
          <Link to="newPost" query={{channel: this.props.channelName}}>
              <div className="fluid ui blue button">
                <i className="add icon"></i>
                Post image
             </div>
          </Link>
          {this.state.postsStatus.map(function(post) {
            return <Post key={post.id} data={post} />;
          })}
        </div>
      );
  }
});

module.exports = Channel;
