import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {DemoApp} from './demo-app';
import {BasicExampleCmp} from './examples/basic-example-cmp';
import {AdvancedExampleCmp} from './examples/advanced-example-cmp';
import {CustomTemplateExampleCmp} from './examples/custom-template-example-cmp';
import {ServerExampleCmp} from './examples/server-example-cmp';
import {StringFilterPipe} from './string-filter-pipe';
import {Ng2PaginationModule} from '../../src/ng2-pagination';

@NgModule({
    imports: [BrowserModule, FormsModule, Ng2PaginationModule],
    declarations: [
        DemoApp,
        BasicExampleCmp,
        AdvancedExampleCmp,
        CustomTemplateExampleCmp,
        ServerExampleCmp,
        StringFilterPipe
    ],
    bootstrap: [DemoApp]
})
export class DemoModule {}
