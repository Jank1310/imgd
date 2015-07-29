'use strict';

// Vendor
require('jquery');
require('semantic/semantic.js');
require('semantic/semantic.css');


var React = require('react/addons');
var ChannelsList = require('components/ChannelsList');
var Channel = require('components/Channel');

// App
require('../styles/ImgdApp.scss');


var ImgdApp = React.createClass({
  componentDidMount: function() {
    $('.ui.sticky').sticky();
  },

  render: function() {
    return (
      <div className="app">
        <div className="ui centered grid">
          <div className="row">
            <div className="two wide column">
              <div className="ui sticky">
                <ChannelsList />
              </div>
            </div>
            <div id="channel" className="five wide column"><Channel /></div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = ImgdApp;
