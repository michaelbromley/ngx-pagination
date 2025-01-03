import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import { marked } from 'marked';

@Component({
    selector: 'documentation-page',
    templateUrl: './documentation-page.component.html',
    imports: [AsyncPipe]
})
export class DocumentationPageComponent implements OnInit {

    readmeContent$: Observable<SafeHtml>;

    constructor(private sanitizer: DomSanitizer, private httpClient: HttpClient) {
    }

    ngOnInit() {

      this.readmeContent$ = this.httpClient.get(`https://raw.githubusercontent.com/michaelbromley/ngx-pagination/master/README.md`, { responseType: 'text' }).pipe(
        mergeMap(text => marked.parse(text)),
        map(res => this.sanitizer.bypassSecurityTrustHtml(res)),
      )
    }
}
