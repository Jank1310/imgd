'use strict';

// Vendor
require('jquery');
require('semantic/semantic.js');
require('semantic/semantic.css');


var React = require('react/addons');
var ChannelsList = require('components/ChannelsList');
var Router = require('react-router');
var Link = Router.Link;
var RouteHandler = Router.RouteHandler;
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
                <h1 className="logo"><Link to='/'>imgd</Link></h1>
                <ChannelsList />
              </div>
            </div>
            <div id="channel" className="five wide column">
              <RouteHandler />
              <div className="ui divider"></div>
              <div className="ui center aligned disabled header">
                <div className="sub header">Made with <i className="heart icon"></i> in Nuremberg</div>
                <div className="sub header ui horizontal center aligned bulleted list">
                  <a className="item">
                    About Us
                  </a>
                  <a className="item">
                    Sitemap
                  </a>
                  <a className="item">
                    Contact
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = ImgdApp;
