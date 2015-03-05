var path        = require('path');

var _           = require('lodash');
var yargs       = require('yargs');
var findup      = require('findup-sync');
var Class       = require('node-extnd');
var extend      = require('extend');

var GulpProxy   = require('./lib/gulp-proxy.js');

var Gag = Class.extnd({
  init: function (mod, fn) {
    this.module = mod;
    this.packageInfo = require(findup('package.json', {cwd: path.dirname(mod.filename)}));
    this.extensions = {};
    this.proxy = new GulpProxy(this);

    var config = extend(true, this.packageInfo.config || {}, yargs.argv);

    if(_.isFunction(fn))
      fn.call(this, this.proxy, config);
    console.log(this.proxy.tasks);

    this.tasks = {};
    this.tasks[mod.id] = this.proxy.tasks;
  },

  pour: function (gulp) {
    var aggregates = {};
    console.log(this.tasks);
    _.each(this.tasks, function (taskMap, prefix) {

      _.each(taskMap, function (task, taskName) {
        var prefixedTaskName = prefix + ':' + taskName;
        console.log(prefixedTaskName);
        if(_.isUndefined(aggregates[taskName]))
          aggregates[taskName] = [];

        aggregates[taskName].push(prefixedTaskName);
        gulp.task(prefixedTaskName, task[0], task[1]);
      });
    });

    _.each(aggregates, function (deps, name) {
      console.log(deps, name)
      gulp.task(name, deps);
    });
  },

  weave: function () {
    var self = this;
    _.toArray(arguments).forEach(function (gag) {
      self.tasks[gag.module.id] = gag.proxy.tasks;
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