var _        = require('lodash');
var lazypipe = require('lazypipe');
var gulp     = require('gulp');
var Class    = require('node-extnd');

var Hook     = require('./hook.js');

var Pipeline = Class.extnd({
  init: function () { 
    this.hooks = {};
    this.pipes = {};
  },

  src: function () {
    this._appendPipe('src', _.toArray(arguments).unshift(gulp.src));
    return this;
  },

  dest: function (path) {
    this._appendPipe('dest', _.toArray(arguments).unshift(gulp.dest));
    return this;
  },

  before: function () {
    this._appendPipe('before', arguments);
    return this;
  },

  after: function () {
    this._appendPipe('after', arguments);
    return this;
  },

  post: function () {
    this._appendPipe('post', arguments);
    return this;
  },

  _appendPipe: function (pipeName, args) {
    var self = this,
        previous = _.isUndefined(self.pipes[pipeName]) ? lazypipe() : self.pipes[pipeName];

    self.pipes[pipeName] = previous.pipe.apply(previous, args);

    if(_.isUndefined(self.hooks[pipeName])) {
      self.hooks[pipeName] = function (stream) {
        return stream.pipe(self.pipes[pipeName]());
      };
    }
  }
});

module.exports = Pipeline;