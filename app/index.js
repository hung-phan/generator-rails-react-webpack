'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
var magenta = chalk.magenta;
var shell = require('shelljs');

module.exports = yeoman.generators.Base.extend({
  init: function () {
    this.on('end', function () {
      if (!this.options['skip-install']) {
        console.log(magenta("Thank for using"));
      }
    });
  },

  askForCSSLibrary: function () {
    var cb = this.async();

    var prompts = [{
      type: 'checkbox',
      name: 'cssFile',
      message: 'What css library would you like to include?',
      choices: [
        { name: 'Animate SCSS'           , value: 'includeAnimateCss'  , checked: false } ,
        { name: 'Bootstrap font-awesome' , value: 'includeFontAwesome' , checked: true }
      ]
    }];

    this.prompt(prompts, function (props) {
      function includeCSS(css) { return props.cssFile.indexOf(css) !== -1; }

      // CSS
      this.includeAnimateCss  = includeCSS('includeAnimateCss');
      this.includeFontAwesome = includeCSS('includeFontAwesome');

      cb();
    }.bind(this));
  },

  assForUtility: function() {
    var cb = this.async();

    var prompts = [{
      type: 'checkbox',
      name: 'tool',
      message: 'What tool support would you like to include?',
      choices: [
        { name: 'Grape Rest'            , value: 'includeGrape'      , checked: true  } ,
        { name: 'therubyracer'          , value: 'includeRubyRacer'  , checked: false } ,
        { name: 'mongoid (for mongodb)' , value: 'includeMongodb'    , checked: false } ,
        { name: 'Livereload'            , value: 'includeLiveReload' , checked: false }
      ]
    }];

    this.prompt(prompts, function (props) {
      function includeTool(tool) { return props.tool.indexOf(tool) !== -1; }

      // template support
      this.includeMongodb    = includeTool('includeMongodb');
      this.includeRubyRacer  = includeTool('includeRubyRacer');
      this.includeLiveReload = includeTool('includeLiveReload');
      this.includeGrape      = includeTool('includeGrape');

      cb();
    }.bind(this));
  },

  assForJSFile: function() {
    var cb = this.async();

    var prompts = [{
      type: 'checkbox',
      name: 'jsFile',
      message: 'What js library would you like to include?',
      choices: [
        { name: 'Lodash.js'                      , value: 'includeLodash'      , checked: true } ,
        { name: 'REST superagent by visionmedia' , value: 'includeSuperagent'  , checked: true } ,
        { name: 'Modernizr'                      , value: 'includeModernizr'   , checked: true }
      ]
    }];

    this.prompt(prompts, function (props) {
      function includeJS(js) { return props.jsFile.indexOf(js) !== -1; }

      // JS
      this.includeLodash      = includeJS('includeLodash');
      this.includeSuperagent  = includeJS('includeSuperagent');
      this.includeModernizr   = includeJS('includeModernizr');
      cb();
    }.bind(this));
  },

  processingGemfileTemplate: function() {
    console.log(magenta('Processing Gemfile'));
    this.template('Gemfile', 'tmp/yeoman/Gemfile');
  },

  gemfile: function() {
    //process Gemfile
    var path   = 'tmp/yeoman/Gemfile',
        dest   = 'Gemfile',
        file   = this.readFileAsString(dest),
        insert = this.readFileAsString(path);

    //modify file before insert
    file = file.replace("# Use jquery as the JavaScript library\n", '')
               .replace("# Turbolinks makes following links in your web application faster. Read more: https://github.com/rails/turbolinks\n", '')
               .replace("gem 'turbolinks'\n", '');

    if (file.indexOf(insert) === -1) {
      this.write(dest, file + insert);
    }
  },

  bundleInstall: function() {
    shell.exec("bundle install");
  },

  executeBowerTask: function() {
    console.log(magenta('Processing Bowerfile'));
    shell.exec("rails g bower_rails:initialize");
  },

  processingBowerfileTemplate: function() {
    this.template('Bowerfile', 'tmp/yeoman/Bowerfile');
  },

  bower: function() {
    //process bower
    var path   = 'tmp/yeoman/Bowerfile',
        dest   = 'Bowerfile',
        file   = this.readFileAsString(dest),
        insert = this.readFileAsString(path);

    if (file.indexOf(insert) === -1) {
      this.write(dest, file + insert);
    }
  },

  bowerInstall: function() {
    shell.exec("rake bower:install");
  },

  copyTasks: function() {
    this.copy('_package.json', 'package.json');
    this.copy('_compiler.js', 'compiler.js');
    this.copy('_bowerrc', '.bowerrc');
    this.copy('_gulpfile.js', 'gulpfile.js');
    this.directory('webpack', 'config/webpack');
    this.copy('initializers/webpack.rb', 'config/initializers/webpack.rb');
    this.copy('tasks/webpack.rake', 'lib/tasks/webpack.rake');
    this.copy('helpers/application_helper.rb', 'app/helpers/application_helper.rb');
  },

  npmInstall: function() {
    console.log(magenta('Install npm dependencies'));
    shell.exec("npm install");
  },
  mongodb: function() {
    if (this.includeMongodb) {
      shell.exec("rails g mongoid:config");
    }
  },

  grape: function() {
    if (this.includeGrape) {
      console.log(magenta('Insert Grape API into config/routes.rb'));
      var path   = 'config/routes.rb',
      hook   = 'Rails.application.routes.draw do\n',
      file   = this.readFileAsString(path),
      insert = "  mount APIS::Base => '/api'\n";

      if (file.indexOf(insert) === -1) {
        this.write(path, file.replace(hook, hook + insert));
      }
    }
  },

  grapeInitFile: function() {
    if (this.includeGrape) {
      this.directory('apis', 'app/apis');
    }
  },

  autoLoadPath: function() {
    //include config into config/application.rb
    var path   = 'config/application.rb',
        hook   = 'class Application < Rails::Application\n',
        file   = this.readFileAsString(path),
        insert = '    config.autoload_paths += %W(#{config.root}/lib #{Rails.root}/app)\n' +
                 '    config.webpack = {\n' +
                 '       use_manifest: false,\n' +
                 '       asset_manifest: {},\n' +
                 '       common_manifest: {}\n' +
                 '    }\n';

    if (file.indexOf(insert) === -1) {
      this.write(path, file.replace(hook, hook + insert));
    }
  },

  guard: function() {
    //process livereload
    if (this.includeLiveReload) {
      console.log(magenta('Add livereload utility'));
      shell.exec("guard init livereload");
    }
  },

  view: function () {
    console.log(magenta('Processing view'));
    this.copy('view/index.html', 'app/views/application/index.html');
    this.template('view/application.html.erb', 'app/views/layouts/application.html.erb');
  },

  appJs: function() {
    console.log(magenta('Processing app js'));
    var path   = 'app/assets/javascripts/application.js',
        file   = this.readFileAsString(path);

    //modify file before insert
    file = file.replace("//= require turbolinks\n", '')
               .replace("//= require jquery\n", '')
               .replace("//= require jquery_ujs\n", '')
               .replace("//= require_tree .",
                        "//= require react_ujs\n");


    this.write(path, file);
    this.template('app/main.js', 'app/frontend/javascripts/main.js');
    this.template('app/home/home.js', 'app/frontend/javascripts/home/home.js');
    this.copy('app/home/home-test.js', 'app/frontend/javascripts/home/home-test.js');
  },

  reactConfig: function() {
    console.log(magenta('Processing config/environments/development.rb'));
    var path   = 'config/environments/development.rb',
        hook   = 'Rails.application.configure do\n',
        file   = this.readFileAsString(path),
        insert = "  config.react.variant = :development\n  config.react.addons = true\n";

    if (file.indexOf(insert) === -1) {
      this.write(path, file.replace(hook, hook + insert));
    }

    console.log(magenta('Processing config/environments/production.rb'));
    path   = 'config/environments/production.rb',
    hook   = 'Rails.application.configure do\n',
    file   = this.readFileAsString(path),
    insert = "  config.webpack[:use_manifest] = true\n  config.react.variant = :development\n  config.react.addons = true\n";

    if (file.indexOf(insert) === -1) {
      this.write(path, file.replace(hook, hook + insert));
    }
  },

  routes: function() {
    console.log(magenta('Processing config/routes.rb'));
    var path   = 'config/routes.rb',
        hook   = 'Rails.application.routes.draw do\n',
        file   = this.readFileAsString(path),
        insert = "  root 'application#index'\n";

    if (file.indexOf(insert) === -1) {
      this.write(path, file.replace(hook, hook + insert));
    }
  },

  gitIgnore: function() {
    console.log(magenta('Processing .gitignore'));
    var path   = '.gitignore',
        file   = this.readFileAsString(path),
        insert = "app/assets/javascripts/build\n" +
                 "node_modules\n";

    if (file.indexOf(insert) === -1) {
      this.write(path, file + insert);
    }
  },

  rspecRails: function() {
    shell.exec("rails generate rspec:install");
  },

  guardRspec: function() {
    shell.exec("guard init rspec");
  },

  rspecHelper: function() {
    console.log(magenta('Update spec/rails_helper.rb for DatabaseCleaner and Grape api'));
    var path   = 'spec/rails_helper.rb',
        hook   = 'RSpec.configure do |config|\n',
        file   = this.readFileAsString(path),
        insert = '  config.include RSpec::Rails::RequestExampleGroup, type: :request, file_path: /spec\\/apis/\n' +
                 '  config.before(:suite) do\n' +
                 '    DatabaseCleaner.strategy = :transaction\n' +
                 '    DatabaseCleaner.clean_with(:truncation)\n' +
                 '  end\n';

    if (file.indexOf(insert) === -1) {
      this.write(path, file.replace(hook, hook + insert));
    }
  },

  copySpecs: function() {
    this.copy('app/home/home-test.js', 'app/frontend/javascripts/home/home-test.js');
  },

  defaultStylesheet: function() {
    console.log(magenta('Copy default.css.scss file'));
    this.copy('spec/apis/person_spec.rb', 'spec/apis/person_spec.rb');
  },

  stylesheets: function() {
    console.log(magenta('Processing app stylesheets'));
    var extra  = '';
    if (this.includeAnimateCss) {
      extra += " *= require animate-sass/_animate.scss\n";
    }
    var path   = 'app/assets/stylesheets/application.css',
        hook   = ' *= require_tree .\n',
        file   = this.readFileAsString(path),
        insert = ' *= require default\n' + extra + ' *= require_tree .\n';

    if (file.indexOf(insert) === -1) {
      this.write(path, file.replace(hook, insert));
    }
  }
});
