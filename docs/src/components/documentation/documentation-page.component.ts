import {Component} from '@angular/core';
import {SafeHtml, DomSanitizer} from '@angular/platform-browser';
import {Highlighter} from '../../providers/highlighter.service';

const marked = require('marked');
const readme = require('!!raw-loader!../../../../README.md');
const parsedReadme = marked(readme);

@Component({
    selector: 'documentation-page',
    templateUrl: './documentation-page.component.html'
})
export class DocumentationPageComponent {

    readmeContent: SafeHtml;

    constructor(private sanitizer: DomSanitizer,
                private highlighter: Highlighter) {
        this.readmeContent = sanitizer.bypassSecurityTrustHtml(parsedReadme);
    }

    ngAfterViewInit() {
        this.highlighter.highlight();
    }
}
