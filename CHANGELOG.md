# 0.3.5 (2016-07-14)
* Update codebase to **Angular 2 rc.4**.
* Fix default template showing up when using custom templates (#45)
* Fix buggy autoHide behaviour (#57)

# 0.3.4 (2016-06-16)
* Fix infinite loop in PaginatePipe when used with other impure pipes.
* (build) Remove postinstall script which caused errors when using npm install. (moved to Travis file)

# 0.3.3 (2016-06-10)
* Fix issue with custom templates still showing default template initially.

# 0.3.2 (2016-06-09)
* Use OnPush change detection strategy for big efficiency gains ([PR #40](https://github.com/michaelbromley/ng2-pagination/pull/40))
* Occasional flickering of active page link when changing pages also handled by the above.
* (build) Update Typings to 1.x

# 0.3.1 (2016-06-02)
* Fix broken change detechtion when replacing collection items with new values ([PR #36](https://github.com/michaelbromley/ng2-pagination/pull/36)).
* Various small fixes and added a test ([PR #33](https://github.com/michaelbromley/ng2-pagination/pull/33)).

# 0.3.0 (2016-05-12)
* Update to **Angular 2 rc.1**

# 0.2.0 (2016-04-29)
* **Note:** This version is only compatible with Angular 2 **beta.17** and above!
* Update `*ngFor` syntax to align with beta.17.
* Update PaginatePipe to use new pipe API from beta.16 ([PR #24](https://github.com/michaelbromley/ng2-pagination/pull/24)).
* Update tests to reflect changes to async / inject API in beta.16 
* Add missing devDependiencies to package.json

# 0.1.0 (2016-04-28)
* Compatible with Angular 2 **beta.15** and below.
* Fix bindings of the `directionLinks` and `autoHide` attributes when used with literal values. (fixes [#20](https://github.com/michaelbromley/ng2-pagination/issues/20))
* Remove the styles which cause the links to truncate on small screens.

#  0.0.1 (2016-04-07)
* Change the default ul class name from `.pagination` to `.ng2-pagination` to avoid conflicts with existing CSS frameworks. (fixes [#18](https://github.com/michaelbromley/ng2-pagination/issues/18))

# 0.0.1-beta.3 (2016-03-24)

* Fixed PaginationControlsCmp.outOfBoundCorrection() to prevent it returning `0` when the collection is empty ([f7f9bd9](https://github.com/michaelbromley/ng2-pagination/commit/f7f9bd98544a29cfad02d4a368ac32327d62c6c5)).
* Added System.register bundle build (`dist/ng2-pagination-bundle.js`)


# 0.0.1-beta.2 (2016-02-29)

* Fixed minificaton of demo app
* Use Sass for demo styles

### Breaking Changes

* Removed `PaginationControlsDirective`, and simplified the way custom templates are specified (just put your template inside
the `<pagination-controls>` tags and use a local variable to access the API (see Readme).
* Removed `PAGINATION_DIRECTIVES` exported constant, since there is only 1 component to export now.

# 0.0.1-beta.1 (2016-02-22)

Hello world! First beta release, starting changelog from here.
