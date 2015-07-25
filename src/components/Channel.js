'use strict';

var React = require('react/addons');
var Post = require('components/Post');

require('styles/Channel.scss');

var Channel = React.createClass({

  render: function () {
    return (
        <div className="channel pure-g">
          <div class="pure-u-3-5">
            <Post />
            <Post />
          </div>
        </div>
      );
  }
});

module.exports = Channel;
