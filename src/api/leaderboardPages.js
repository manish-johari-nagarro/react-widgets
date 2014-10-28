"use strict";

var routes = require('./routes');
var getJSON = require('../lib/getJSON');

module.exports = {
  find: function(ids, callback) {
    getJSON(routes('leaderboardPages', {ids: ids}), callback);
  }
};