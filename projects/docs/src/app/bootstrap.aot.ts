import 'reflect-metadata';
import {enableProdMode} from '@angular/core';
import {platformBrowser} from '@angular/platform-browser';
// import {DemoModuleNgFactory} from '../ngfactory/demo/src/demo.module.ngfactory';
// Disabled for now since it is buggy to build.
enableProdMode();
platformBrowser().bootstrapModuleFactory(DemoModuleNgFactory);
