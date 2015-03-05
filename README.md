# Gag

Gag allows you to split your Gulpfile in multiple modules and allow extensions to pitch in to extend existing tasks.

## Gagfile.js

### Namespaced tasks
```javascript
var Gag = require('gag');

module.exports = new Gag(module, function (gulp, config) {
  gulp.task('js', function () {
    // ...
  });
});

```

### Extending tasks

```javascript
var Gag = require('gag');

module.exports = new Gag(module, function (gulp, config) {
  gulp.extend('js', new Gag.Pipeline()
    .before(somePlugin)
    .after(someOtherPlugin)
  );

});

```

## Gulpfile.js

```javascript
var Gag  = require('gag');
var gulp = require('gulp');

new Gag(module)
    .weave('moduleA/Gagfile.js')
    .weave('moduleB/Gagfile.js')
    .pour(gulp);
```
