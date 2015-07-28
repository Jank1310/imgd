'use strict';

var React = require('react/addons');
var ChannelsList = require('components/ChannelsList');
var Channel = require('components/Channel');

// CSS
require('jquery');
require('uikit');
require('uikit/js/components/sticky.js');
require('../styles/ImgdApp.scss');


var ImgdApp = React.createClass({
  render: function() {
    return (
      <div className="app">
        <div className="uk-grid">
          <div className="uk-width-2-3 uk-container-center">
            <div className="uk-grid">
              <div className="uk-width-2-6" data-uk-sticky><ChannelsList /></div>
              <div className="uk-width-3-6"><Channel /></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = ImgdApp;
