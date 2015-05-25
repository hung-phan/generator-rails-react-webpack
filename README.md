# generator-rails-react-webpack

> [Yeoman](http://yeoman.io) generator

[![NPM](https://nodei.co/npm/generator-rails-react-webpack.png?downloads=true)](https://nodei.co/npm/generator-rails-react-webpack/)

## Getting Started

To install `generator-rails-react-webpack` from npm, run:

```bash
$ npm install -g generator-rails-react-webpack
```

## Up and Running

Create Ruby on Rails project with normal `rails` command, but skip gem bundling:

```bash
$ rails new app-name --skip-bundle
```

Then, initiate the generator:

```bash
$ cd app-name
$ yo rails-react-webpack
```

Answer 'Yes' to all 'Overwrite' actions. Then, update 'config/database.yml' if you use different database than 'sqlite3'.

## Dependencies

- [Bower](http://bower.io/) via `npm install -g bower`

## Application template

### Javascript modules

All javascript modules are placed in `app/frontend/javascripts` folder, which will be compiled into `app/assets/javascript/build`
folder. In addition, `app/assets/javascript/build` is appended to `.gitignore` (Webpack built bundles will be ignored and rebuilt every deployment).

Control you application assets via [webpack](http://webpack.github.io/docs/) or [sprockets](https://github.com/sstephenson/sprockets).
However, for javascript files, prefer `webpack` over `sprockets` for the reason that those will run through loaders before getting
serve at the browser.

### package.json

Manage built tools and application dependencies

### Webpack

- `config.json`: loads additional configurations into `javascript-build.js` via `config = require('./config.json');`

  ```json
    {
      "webpack": {
        "path": "./app/frontend/javascripts/",
        "test": "./__tests__/**/*-test.js",
        "build": "./app/assets/javascripts/build"
      }
    }
  ```
- `default.config.js`: the basic webpack settings for both development and production environment. You can have any available
  webpack settings here. For example, config [externals](http://webpack.github.io/docs/library-and-externals.html),
  [loaders](http://webpack.github.io/docs/using-loaders.html), and so on.

  ```javascript
    module.exports = {
      context: path.join(__dirname, '../', '../'),
      entry: {
        main: './app/frontend/javascripts/main'
      },
      ...
      externals: {},
      ...
      module: {
        loaders: [{
          test: /.js$/,
          //exclude: /node_modules(?!.*(\/js-csp))/, // ignore node_modules except node_modules/js-csp
          exclude: /node_modules/,
          loader: 'babel-loader?experimental&optional=runtime'
        }]
      },
    };
  ```
- `development.config.js`: contains development config for webpack. For advance usage, [Hot Module Replacement](#Hot Module Replacement), and
  [Code splitting](#Code splitting).

  ```javascript
    module.exports = _.merge(defaultConfig, {
      cache: true,
      debug: true,
      outputPathinfo: true,
      devtool: 'source-map',
      plugins: [
        new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"development"', '__DEV__': true })
      ]
      ...
  ```
- `production.config.js`: contains production config for webpack. For advance usage, [Code splitting](#Code splitting).

  ```javascript
    module.exports = _.merge(defaultConfig, {
      devtool: false,
      output: {
        path: './public/assets',
        publicPath: '/assets/',
        filename: '[name]-[chunkhash].bundle.js',
        chunkFilename: '[id]-[chunkhash].bundle.js'
      },
      plugins: [
        new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"production"', '__DEV__': false }),
        new ChunkManifestPlugin({
          filename: 'webpack-common-manifest.json',
          manfiestVariable: 'webpackBundleManifest'
        }),
        new webpack.optimize.UglifyJsPlugin()
      ]
  ```
- `javascript-build.js`: defines javascript built tasks.

  ```javascript
    var _        = require('lodash'),
        config   = require('./config.json'),
        del      = require('del'),
        gulp     = require('gulp'),
        ...;

    gulp.task('javascript:clean', function () { ... });
    gulp.task('javascript:dev', function () { ... });
    gulp.task('javascript:build', function () { ... });
  ```

### Code splitting

Refer to [webpack code spliting](http://webpack.github.io/docs/code-splitting.html) for detail implementations.
Bundles are created by `require` or `require.ensure` will be automatically loaded. Additionally, all the settings in
`devlopment.config.js` and `production.config.js` for `optimizing common chunk` have been added to config files.

```javascript
  new webpack.optimize.CommonsChunkPlugin('common', 'common.bundle.js'), // development.config.js
  new webpack.optimize.CommonsChunkPlugin('common', 'common-[chunkhash].bundle.js'), // production.config.js
```

Uncomment those and add this tag `<%= webpack_bundle_tag 'common' %>` before your main bundle in your layout:

```
<%= webpack_bundle_tag 'common' %>
<%= webpack_bundle_tag 'main' %>
```

### Hot Module Replacement

Refer to [HMR](https://github.com/gaearon/react-hot-loader) for detail implementations, only for `development.config.js`.
Uncomment all `HMR` config in `development.config.js`.

```javascript
  entry: {
    main: [
      'webpack-dev-server/client?http://localhost:8080/assets/',
      'webpack/hot/only-dev-server'
    ]
  }, // Hot Module Replacement
  output: {
    publicPath: 'http://localhost:8080/assets/build/'
  }, // Hot Module Replacement
  ...
  module: {
    loaders: [{
      test: /.js$/,
      //exclude: /node_modules(?!.*(\/js-csp))/, // ignore node_modules except node_modules/js-csp
      exclude: /node_modules/,
      loader: 'react-hot'
    }]
  }, // Hot Module Replacement
  plugins: [
    new webpack.NoErrorsPlugin(), // Hot Module Replacement
    ...
  ]
```

And `app/helpers/application_helper.rb`

```ruby
  "http://localhost:8080/assets/build/#{bundle}.bundle.js" # Hot module replacement
  # "assets/build/#{bundle}.bundle"
```

This config will concat to every entry with specify in this `development.config.js`. The result will be like:

```javascript
  entry: {
    main: [
      'webpack-dev-server/client?http://localhost:8080/assets/',
      'webpack/hot/only-dev-server',
      './app/frontend/javascripts/main'
    ]
  }, // Hot Module Replacement

```

Then [start coding](#Start developing)

### Current transformation applied

- [babel-loader](https://github.com/babel/babel-loader)
- [expose-loader](https://github.com/webpack/expose-loader)
- [imports-loader](https://github.com/webpack/imports-loader)
- [exports-loader](https://github.com/webpack/exports-loader)

### Available gulp task

```bash
$ gulp javascript:clean # remove the build folder placed at 'app/assets/javascripts/build'
$ gulp javascript:dev # watch over changes for multiple js bundle
$ gulp javascript:build # should use this for testing only, please read Assets compile
```

## Start developing

Run these commands, and start coding

```bash
$ gulp javascript:dev
$ rails server
```

For [Hot Module Replacement](http://webpack.github.io/docs/hot-module-replacement-with-webpack.html), update `config/webpack/development.config.js` and run these command instead:

```bash
$ npm run webpack-dev
$ rails server
```

## Assets compile
```bash
$ rake assets:precompile RAILS_ENV=production
```

## Heroku deploy
Configure Heroku to use `ddollar's multi-buildpack`:

```bash
$ heroku config:add BUILDPACK_URL=https://github.com/ddollar/heroku-buildpack-multi.git
```

Add the `heroku-nodejs buildpack` and `heroku-ruby buildpack` to .buildpacks:

```
$ cat .buildpacks
https://github.com/heroku/heroku-buildpack-nodejs
https://github.com/heroku/heroku-buildpack-ruby
```

## Options

Name: mongoid (for mongodb)

add `--skip-active-record` option to your `rails new app --skip-active-record` command before selecting this option.

## Task

### Live reload

For using livereload utility, firstly, install [guard](https://github.com/guard/guard-livereload). Then, use [rack-livereload](https://github.com/johnbintz/rack-livereload)
or install [LiveReload Safari/Chrome extension](http://feedback.livereload.com/knowledgebase/articles/86242-how-do-i-install-and-use-the-browser-extensions-)

```bash
$ bundle exec guard # to run the guard server and enjoy coding
```

## Testing
Test files are placed in the same folder with component.

```
▾ home/
    home-test.js
    home.js*
```

Use iojs instead of node to run mocha test (See more [here](https://github.com/tmpvar/jsdom)). And update mocha config
if you need to in `package.json`

```bash
npm test
```
## Structure

```
application/
  |- app/
  |  |- apis/
  |  |  |- v1/
  |  |  |  |- base.rb
  |  |  |  |- person_api.rb
  |  |  |- base.rb
  |  |- assets/
  |  |  |- images/
  |  |  |- javascripts/
  |  |  |  |- build/
  |  |  |  |  |- page-module.bundle.js
  |  |  |  |- application.js
  |  |- frontend/
  |  |  |- javascripts/
  |  |  |  |- <page-module-dependencies>/
  |  |  |  |- <page-module>.js
  |  |  |- stylesheets/
  |  |  |  |- application.css
  |  |- controllers/
  |  |- helpers/
  |  |- mailers/
  |  |- models/
  |  |- views/
  |  |  |- application/
  |  |  |  |- index.html # default template for the application
  |  |  |- layouts/
  |  |  |  |- application.html.erb
  |- bin/
  |- config/
  |  |- initializers/
  |  |  |- *.rb
  |  |  |- webpack.rb # webpack manifest config
  |  |- browserify/
  |  |  |- config.json
  |  |  |- default.config.js
  |  |  |- development.config.js
  |  |  |- javascript-build.js
  |  |  |- production.config.js
  |  |- initializers/
  |  |  |- bower_rails.rb # bower rails config
  |- db/
  |- lib/
  |  |- assets/
  |  |- tasks/
  |  |  |- webpack.rake # built task
  |- log/
  |- public/
  |- test/
  |- vendor/
  |  |- assets/
  |  |  |- bower_components/
  |  |  |  |- third libararies/
  |- |  |- bower.json
  |- Bowerfile # bower package dependencies
  |- config.ru
  |- gulpfile.js
  |- package.json
  |- config.ru
  |- Gemfile
  |- Gemfile.lock
  |- Guardfile # Guard file for livereload
  |- Rakefile
  |- README.rdoc
```

## Acknowledgement

Thanks Dave Clark for this wonderful [post](http://clarkdave.net/2015/01/how-to-use-webpack-with-rails/)

## Example project

- [rails-react-webpack](https://github.com/hung-phan/rails-react-webpack)

## Running example

![alt text](https://raw.githubusercontent.com/hung-phan/generator-rails-react-webpack/master/screenshot.png "application screenshot")

## Contribution

All contributions are welcomed.

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
