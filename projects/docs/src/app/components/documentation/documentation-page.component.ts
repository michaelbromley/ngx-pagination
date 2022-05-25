import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
    selector: 'documentation-page',
    templateUrl: './documentation-page.component.html'
})
export class DocumentationPageComponent {

    readmeContent: SafeHtml;

    constructor(private sanitizer: DomSanitizer) {
        this.readmeContent = sanitizer.bypassSecurityTrustHtml('parsedReadme');
    }
}
