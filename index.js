var path        = require('path');

var _           = require('lodash');
var yargs       = require('yargs');
var findup      = require('findup-sync');
var gulp        = require('gulp');
var Class       = require('extnd');
var DataParser  = require('dataobject-parser');
var extend      = require('extend');

var GulpProxy   = require('./lib/gulp-proxy.js');

var Gag = Class.extnd({
  init: function (mod, fn) {
    this.module = mod;
    this.packageInfo = require(findup('package.json', {cwd: path.dirname(mod.filename)}));
    this.extensions = {};
    this.proxy = new GulpProxy(this);

    var d = new DataParser();

    _.each(yargs.argv, function (val, key) {
      d.set(key, val);
    });

    var config = extend(true, packageInfo.config || {}, d.data());

    if(_.isFunction(fn))
      fn.call(this, this.proxy, config);

    this.tasks = {};
    this.tasks[mod] = this.proxy.tasks;
  },

  pour: function (gulp) {
    var aggregates = {};
    _.each(this.tasks, function (taskMap, prefix) {

      _.each(taskMap, function (task, taskName) {
        var prefixedTaskName = prefix + ':' + taskName;

        if(_.isUndefined(aggregates[taskName]))
          aggregates[taskName] = [];

        aggregates[taskName].push(prefixedTaskName);
        gulp.task(prefixedTaskName, task[0], task[1]);
      });
    });

    _.each(aggregates, function (deps, name) {
      gulp.task(name, deps);
    });
  },

  weave: function () {
    var self = this;

    _.toArray(arguments).forEach(function (gag) {
      self.tasks[gag.module] = self.proxy.tasks;
    });

    return this;
  },

  extend: function (task, extension) {
    if(_.isUndefined(this.extensions[task]))
      this.extensions[task] = [];

    this.extensions[task].push(extension);

    return this;  
  }
});

Gag.Pipeline = require('./lib/pipeline.js');

module.exports = Gag;