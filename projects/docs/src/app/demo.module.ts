import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { DemoAppComponent } from './demo-app.component';
import { BasicExampleComponent } from './components/basic-example/basic-example.component';
import { AdvancedExampleComponent } from './components/advanced-example/advanced-example.component';
import { CustomTemplateExampleComponent } from './components/custom-template-example/custom-template-example.component';
import { ServerExampleComponent } from './components/server-example/server-example.component';
import { StringFilterPipe } from './string-filter.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { BasicPageComponent } from './components/basic-example/basic-page.component';
import { AdvancedPageComponent } from './components/advanced-example/advanced-page.component';
import { CustomPageComponent } from './components/custom-template-example/custom-page.component';
import { ServerPageComponent } from './components/server-example/server-page.component';
import { MealsService } from './providers/meals.service';
import { DocumentationPageComponent } from './components/documentation/documentation-page.component';
import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import { HttpClientModule } from '@angular/common/http';

const ConfiguredRouterModule = RouterModule.forRoot([
  {path: '', pathMatch: 'full', component: DocumentationPageComponent},
  {path: 'basic', component: BasicPageComponent},
  {path: 'advanced', component: AdvancedPageComponent},
  {path: 'custom-template', component: CustomPageComponent},
  {path: 'server-paging', component: ServerPageComponent}
], {useHash: true});

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ConfiguredRouterModule,
    NgxPaginationModule,
    HighlightModule,
    HttpClientModule,
  ],
  declarations: [
    DocumentationPageComponent,
    DemoAppComponent,
    BasicExampleComponent,
    BasicPageComponent,
    AdvancedExampleComponent,
    AdvancedPageComponent,
    CustomTemplateExampleComponent,
    CustomPageComponent,
    ServerExampleComponent,
    ServerPageComponent,
    StringFilterPipe
  ],
  providers: [
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
    }
  ],
  bootstrap: [DemoAppComponent]
})
export class DemoModule {
}
