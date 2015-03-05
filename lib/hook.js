var _ = require('lodash');
var Class = require('node-extnd');

var Hook = Class.extnd({
  init: function (plugins, fx) {
    this.plugins = plugins;
    this.fx = fx;
    this.fired = false;
  },

  transform: function (value) {
    var args = _.toArray(arguments);

    var result = _.reduce(this.plugins, function (value, plugin) {
      var result = _.isFunction(plugin[this.fx]) ? plugin[this.fx].apply(plugin, args) : null;

      return _.isUndefined(result) ? value : result;
    }, value);

    this.fired = true;
    return result;
  },

  collect: function () {
    var args = _.toArray(arguments);

    var result = _.reduce(this.plugins, function (collector, plugin) {
      var result = _.isFunction(plugin[this.fx]) ? plugin[this.fx].apply(plugin, args) : null;
      if(_.isArray(result)) {
        collector = collector.concat(result); 
      } else if (!_.isUndefined(result)) {
        collector.push(result);
      }

      return collector;

    }, []);

    this.fired = true;
    return result;
  }

});

module.exports = Hook;