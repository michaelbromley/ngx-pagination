import { enableProdMode, importProvidersFrom } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { environment } from './environments/environment';
import { MealsService } from './app/providers/meals.service';
import { HIGHLIGHT_OPTIONS, HighlightModule } from 'ngx-highlightjs';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DocumentationPageComponent } from './app/components/documentation/documentation-page.component';
import { BasicPageComponent } from './app/components/basic-example/basic-page.component';
import { AdvancedPageComponent } from './app/components/advanced-example/advanced-page.component';
import { CustomPageComponent } from './app/components/custom-template-example/custom-page.component';
import { ServerPageComponent } from './app/components/server-example/server-page.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { withInterceptorsFromDi, provideHttpClient } from '@angular/common/http';
import { DemoAppComponent } from './app/demo-app.component';

const ConfiguredRouterModule = RouterModule.forRoot([
  {path: '', pathMatch: 'full', component: DocumentationPageComponent},
  {path: 'basic', component: BasicPageComponent},
  {path: 'advanced', component: AdvancedPageComponent},
  {path: 'custom-template', component: CustomPageComponent},
  {path: 'server-paging', component: ServerPageComponent}
], {useHash: true});



if (environment.production) {
  enableProdMode();
}

bootstrapApplication(DemoAppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, FormsModule, ConfiguredRouterModule, NgxPaginationModule, HighlightModule),
        MealsService,
        {
            provide: HIGHLIGHT_OPTIONS,
            useValue: {
                coreLibraryLoader: () => import('highlight.js/lib/core'),
                languages: {
                    typescript: () => import('highlight.js/lib/languages/typescript'),
                    xml: () => import('highlight.js/lib/languages/xml')
                },
            }
        },
        provideHttpClient(withInterceptorsFromDi())
    ]
})
  .catch(err => console.error(err));
