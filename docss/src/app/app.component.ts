import { Component } from '@angular/core';
import * as packageInfo from '../../../package.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  version = packageInfo.default.version;
}
