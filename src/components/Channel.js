'use strict';

var React = require('react/addons');
var Post = require('components/Post');

require('styles/Channel.scss');

var Channel = React.createClass({

  render: function () {
    return (
        <div className="channel">
          <div className="">
            <Post />
            <Post />
          </div>
        </div>
      );
  }
});

module.exports = Channel;
