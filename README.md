# Gag

Gag allows you to split your Gulpfile in multiple modules and allow extensions to pitch in to extend existing tasks.

## Installation

```
npm install --save gag
```

## Usage

Each module has its own `Gagfile.js`, that collects tasks and combines dependencies. They can then be pulled in from the module that needs building in its `Gulpfile` and invoked through the usual `gulp` CLI semantics.

It also gives submodules a simplified access to main module's `package.json` `config` section and to the command line parameters, that get merged in a single object for ease of access and overriding.

### Gagfile.js

#### Namespaced tasks
```javascript
var Gag = require('gag');

module.exports = new Gag(module, function (gulp, config) {
  gulp.task('js', function () {
    // ...
  });
});

```

#### Extending tasks

```javascript
var Gag = require('gag');

module.exports = new Gag(module, function (gulp, config) {
  gulp.extend('js', new Gag.Pipeline()
    .before(somePlugin)
    .after(someOtherPlugin)
  );

});

```

### Gulpfile.js

```javascript
var Gag  = require('gag');
var gulp = require('gulp');

new Gag(module)
    .weave('moduleA/Gagfile.js')
    .weave('moduleB/Gagfile.js')
    .pour(gulp);
```

## License

The MIT License (MIT)

Copyright (c) 2015 Michele Piccirillo

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
