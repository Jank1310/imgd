'use strict';

var React = require('react/addons');

//var Actions = require('actions/xxx')

require('styles/NewPost.scss');

var AddPost = React.createClass({

  render: function () {
    return (
      <div className="ui card">
        <div className="content">
          <div className="header">Post image</div>
          <div className="ui form">
            <div className="field">
              <label>channel</label>
              <input type="text" value={this.props.query.channel}/>
            </div>

            <div className="field">
               <label>Message</label>
               <textarea rows="2" hint="Your message"></textarea>
             </div>
         </div>
       </div>
      </div>
      );
  }
});

module.exports = AddPost;
