import {Injectable} from '@angular/core';

const hljs = require('highlight.js');

/**
 * Wrapper for Highlight.js, should be called after a component containing code is initialized
 */
@Injectable()
export class Highlighter {

    constructor() {
        require('!!style!raw!highlight.js/styles/github-gist.css');
        require('!!style!raw!sass!../style.scss');
    }

    highlight() {
        hljs.initHighlighting.called = false;
        hljs.initHighlighting();
    }
}
