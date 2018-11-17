// Karma configuration
// Generated on Mon Sep 24 2018 15:28:04 GMT+0900

const webpackConfig = require('./webpack.config');

module.exports = function(config) {
  config.set({


    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      // Test dependencies
      'node_modules/sinon-chrome/bundle/sinon-chrome-webextensions.min.js',

      // Source
      'src/modules/**/*.js',

      // Tests
      'tests/spec/**/*.js',
      'tests/fixture/**/*.html'
    ],


    // list of files / patterns to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'src/modules/**/*.js': ['webpack', 'sourcemap'],
      'tests/spec/**/*.js': ['webpack', 'sourcemap'],
      'tests/fixture/**/*.html': ['html2js']
    },


    webpack: webpackConfig,


    html2JsPreprocessor: {
      stripPrefix: 'tests/fixture/'
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Firefox'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
