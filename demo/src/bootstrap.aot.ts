import 'reflect-metadata';
import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {DemoModule} from './demo.module';

enableProdMode();
platformBrowserDynamic().bootstrapModule(DemoModule);
