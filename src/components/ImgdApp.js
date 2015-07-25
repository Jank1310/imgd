'use strict';

var React = require('react/addons');
var ChannelsList = require('components/ChannelsList');
var Channel = require('components/Channel');

// CSS
require('purecss/build/pure-min.css');
require('purecss/build/grids-responsive-min.css');
require('../styles/main.css');


var ImgdApp = React.createClass({
  render: function() {
    return (
      <div className="pure-g">
          <div className="pure-u-1-5"><ChannelsList /></div>
          <div className="pure-u-1-3"><Channel /></div>
      </div>
    );
  }
});

module.exports = ImgdApp;
