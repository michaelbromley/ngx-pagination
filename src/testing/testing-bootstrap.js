/**
 * Bootstrap file for unit tests, based on the example here:
 * https://github.com/AngularClass/angular2-webpack-starter/blob/23dd27f837fd1d3f3775383beec804ffe79245bf/spec-bundle.js
 *
 * The idea is to use Webpack to dynamically require each of the `.spec.ts` files and also set the
 * test providers in a single place, allowing the testing of DOM in component tests.
 */

// @AngularClass
/*
 * When testing with webpack and ES6, we have to do some extra
 * things get testing to work right. Because we are gonna write test
 * in ES6 to, we have to compile those as well. That's handled in
 * karma.conf.js with the karma-webpack plugin. This is the entry
 * file for webpack test. Just like webpack will create a bundle.js
 * file for our client, when we run test, it well compile and bundle them
 * all here! Crazy huh. So we need to do some setup
*/
Error.stackTraceLimit = Infinity;

require('core-js');

require('reflect-metadata/Reflect');
require('zone.js/dist/zone');
require('zone.js/dist/long-stack-trace-zone');
require('zone.js/dist/proxy');
require('zone.js/dist/sync-test');
require('zone.js/dist/jasmine-patch');
require('zone.js/dist/async-test');
require('zone.js/dist/fake-async-test');

var testing = require('@angular/core/testing');
var browser = require('@angular/platform-browser-dynamic/testing');

testing.TestBed.initTestEnvironment(
    browser.BrowserDynamicTestingModule,
    browser.platformBrowserDynamicTesting()
);

Object.assign(global, testing);

// Jasmine gets into infinite loops on some of Angular's
// circular data structures. This stops a browser hang.
// See https://github.com/jasmine/jasmine/issues/424
jasmine.MAX_PRETTY_PRINT_DEPTH = 3;

/*
  Ok, this is kinda crazy. We can use the the context method on
  require that webpack created in order to tell webpack
  what files we actually want to require or import.
  Below, context will be an function/object with file names as keys.
  using that regex we are saying look in ./src/app and ./test then find
  any file that ends with spec.js and get its path. By passing in true
  we say do this recursively
*/
var testContext = require.context('..', true, /\.spec\.ts/);

/*
 * get all the files, for each file, call the context function
 * that will require the file and load it up here. Context will
 * loop and require those spec files here
 */
function requireAll(requireContext) {
  return requireContext.keys().map(requireContext);
}

// requires and returns all modules that match
var modules = requireAll(testContext);
