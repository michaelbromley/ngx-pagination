import {Component} from "@angular/core";
import versionInfo from "./version.json";
import { RouterModule } from '@angular/router';

@Component({
    selector: 'demo-app',
    templateUrl: './demo-app.component.html',
    imports: [RouterModule]
})
export class DemoAppComponent {
    version = versionInfo.version;
}

