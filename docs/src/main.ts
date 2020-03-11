import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { DemoModule } from './demo.module';

platformBrowserDynamic().bootstrapModule(DemoModule)
  .catch(err => console.error(err));
