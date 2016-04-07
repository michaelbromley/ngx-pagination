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
