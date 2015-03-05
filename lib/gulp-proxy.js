var _           = require('lodash');
var gulp        = require('gulp');
var Class       = require('node-extnd');
var lazypipe    = require('lazypipe');

var Pipeline    = require('./pipeline.js');
var Hook        = require('./hook.js');

var GulpProxy = Class.extnd({
  init: function (gag) {
    this.tasks = {};
    this.gag = gag;
  },

  src: function () {
    var args = _.toArray(arguments);
    var srcHook = this._getHook(this.__currentTask, 'src');
    var beforeHook = this._getHook(this.__currentTask, 'before');

    var pipeline = lazypipe();  

    if(!srcHook.fired)
      pipeline = srcHook.transform(pipeline);

    args.unshift(gulp.src);
    pipeline = pipeline.pipe.apply(pipeline, args);

    if(!beforeHook.fired)
      pipeline = beforeHook.transform(pipeline);

    return pipeline();
  },

  dest: function () {
    var args = _.toArray(arguments);
    var destHook = this._getHook(this.__currentTask, 'dest');
    var afterHook = this._getHook(this.__currentTask, 'after');

    var pipeline = lazypipe();

    if(!afterHook.fired)
      pipeline = afterHook.transform(pipeline);

    args.unshift(gulp.dest);
    pipeline = pipeline.pipe.apply(pipeline, args);

    if(!destHook.fired)
      pipeline = destHook.transform(pipeline);

    return pipeline();
  },

  watch: function (glob, opts, tasks) {
    throw new Exception("gulp.watch() isn't supported in gag. Please use gulp-watch instead");
  },

  task: function (name, deps, fn) {
    var self = this;
    if(_.isFunction(deps)) {
      fn = deps;
      deps = [];
    }

    if(_.isUndefined(fn)) {
      fn = _.noop;
    }
    
    var previous = this.__currentTask;
    this.__currentTask = name;

    this.tasks[name] = [deps, function (cb) {
      var stream = fn(cb);
      if(!_.isUndefined(stream))
        stream = self._getHook(name, 'post').transform(stream);

      return stream;
    }];

    this.__currentTask = previous;
  },

  extend: function (name, pipeline) {
    var hooks = _.isUndefined(pipeline['hooks']) ? pipeline : pipeline.hooks;
    this.gag.extend(name, hooks);

    return this;
  },

  _getHook: function (task, part) {
    var hook = null;
    if(_.isUndefined(this.gag.extensions[task]))
      this.gag.extensions[task] = [];

    hook = new Hook(this.gag.extensions[task], part);
    return (this.gag.extensions[task].hook = hook);
  }
});

module.exports = GulpProxy;