import {Injectable} from '@angular/core';

import * as hljs from 'highlight.js';

/**
 * Wrapper for Highlight.js, should be called after a component containing code is initialized
 */
@Injectable()
export class Highlighter {

    constructor() {
    }

    highlight() {
        hljs.initHighlighting.called = false;
        hljs.initHighlighting();
    }
}
