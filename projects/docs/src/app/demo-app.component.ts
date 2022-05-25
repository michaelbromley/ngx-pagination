import {Component} from "@angular/core";
import versionInfo from "./version.json";

@Component({
    selector: 'demo-app',
    templateUrl: './demo-app.component.html'
})
export class DemoAppComponent {
    version = versionInfo.version;
}

