"use strict";

var React = require('react');
var Icon  = require('../../helpers/Icon');
var cx    = require('react/lib/cx');

module.exports = React.createClass({
  displayName: 'LeaderboardPagingButton',

  handleClick: function() {
    this.props.action();
  },

  render: function() {
    var pageCount   = this.props.pageCount;
    var currentPage = this.props.currentPage;
    var classes;
    var iconName;

    if (this.props.type == "next") {
      classes = cx({
        "LeaderboardPagingButton__next": true,
        "LeaderboardPagingButton__next--active": currentPage < pageCount
      });

      iconName = "caret-right";
    } else {
      classes = cx({
        "LeaderboardPagingButton__prev": true,
        "LeaderboardPagingButton__prev--active": currentPage > 1
      });

      iconName = "caret-left";
    }

    return (
      <div onClick={ this.handleClick } className={ classes }>
        <Icon className="LeaderboardPagingButton__icon" icon={ iconName } />
      </div>
    );
  },
});
