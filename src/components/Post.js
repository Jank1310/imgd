'use strict';

var React = require('react/addons');

require('font-awesome/css/font-awesome.css');
require('styles/Post.scss');

var Post = React.createClass({

  render: function () {
    return (
        <div className="post">
          <div className="post-image">
            <img src="http://img-9gag-fun.9cache.com/photo/aYwgMRv_700b.jpg" />
          </div>
          <div className="info uk-grid">
            <div className="uk-width-4-5"><strong>Jank1310</strong></div>
            <div className="uk-width-1-5 uk-text-right">30 min</div>
          </div>
          <div className="description">
            <div className="pure-u-1">This dramatic imajjljkge shows the Hubble Space Telescope’s view of a dwarf galaxy known as NGC 1140, which lies 60 million light-years away in the constellation of Eridanus. As can be seen in this image NGC 1140 has an irregular form, much like the Large Magellanic Cloud — a small galaxy that orbits the Milky Way.</div>
          </div>
          <div className="like">
              <a href="#"> <i className="fa fa-heart-o"></i></a> 5343</div>
        </div>
      );
  }
});

module.exports = Post;
