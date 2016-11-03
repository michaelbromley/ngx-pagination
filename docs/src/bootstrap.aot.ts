import 'reflect-metadata';
import {enableProdMode} from '@angular/core';
import {platformBrowser} from '@angular/platform-browser';
import {DemoModuleNgFactory} from '../ngfactory/demo/src/demo.module.ngfactory';

enableProdMode();
platformBrowser().bootstrapModuleFactory(DemoModuleNgFactory);
