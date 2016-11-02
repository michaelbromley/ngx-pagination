import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {DemoAppComponent} from './demo-app.component';
import {BasicExampleComponent} from './examples/basic-example.component';
import {AdvancedExampleComponent} from './examples/advanced-example.component';
import {CustomTemplateExampleComponent} from './examples/custom-template-example.component';
import {ServerExampleComponent} from './examples/server-example.component';
import {StringFilterPipe} from './string-filter.pipe';
import {Ng2PaginationModule} from '../../src/ng2-pagination';

@NgModule({
    imports: [BrowserModule, FormsModule, Ng2PaginationModule],
    declarations: [
        DemoAppComponent,
        BasicExampleComponent,
        AdvancedExampleComponent,
        CustomTemplateExampleComponent,
        ServerExampleComponent,
        StringFilterPipe
    ],
    bootstrap: [DemoAppComponent]
})
export class DemoModule {}
