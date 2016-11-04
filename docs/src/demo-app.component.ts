import {Component} from "@angular/core";
const version = require('../../package.json').version;

@Component({
    selector: 'demo-app',
    templateUrl: './demo-app.component.html'
})
export class DemoAppComponent {
    version: string = version;
}
