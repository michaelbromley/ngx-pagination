import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {DemoModule} from './demo.module';

// defined in webpack config
declare var PRODUCTION: any;

// Shim to make ng2 work with IE. See https://github.com/angular/angular/issues/6501#issuecomment-179502363
// TODO: remove once the framework itself handles this.
// function.name (all IE)
/*! @source http://stackoverflow.com/questions/6903762/function-name-not-supported-in-ie*/
if (!Object.hasOwnProperty('name')) {
  Object.defineProperty(Function.prototype, 'name', {
    get: function() {
      var matches = this.toString().match(/^\s*function\s*(\S[^\(]*)\s*\(/);
      var name = matches && matches.length > 1 ? matches[1] : "";
      // For better performance only parse once, and then cache the
      // result through a new accessor for repeated access.
      Object.defineProperty(this, 'name', {value: name});
      return name;
    }
  });
}

if (PRODUCTION) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(DemoModule);
