# Changelog

## 5.1.1 (2020-06-07)

#### Fixes

* Fix keyboard control on default pagination controls ([#370](https://github.com/michaelbromley/ngx-pagination/issues/370))

## 5.1.0 (2020-05-10)

#### Features

* Show "1" as the default page number rather than empty when there are 0 items in collection ([#374](https://github.com/michaelbromley/ngx-pagination/pull/374))

#### Fixes

* Remove the "navigation" role from the default controls template as it is invalid markup ([#375](https://github.com/michaelbromley/ngx-pagination/pull/375)), fixes [#372](https://github.com/michaelbromley/ngx-pagination/issues/372)

## 5.0.0 (2019-12-02)

#### Features

* A new event `pageBoundsCorrection` has been added to both the `PaginationControlsDirective` and the `PaginationControlsComponent`. This is emitted when the `currentPage` value is found to be out-of-bounds (too high or too low). This change fixes [#155](https://github.com/michaelbromley/ngx-pagination/issues/155) and is intended to allow finer control over how page changes are handled by your application, which is especially important when dealing with server-side pagination in reducing network calls.

#### Breaking Changes

* The `pageChange` event will no longer emit when the `currentPage` value is found to be out-of-bounds. Instead, the new `pageBoundsCorrection` event will emit. To get the same behavior as the prior versions, make the following change:

```HTML
<!-- before -->
<pagination-controls (pageChange)="pageChanged($event)"></pagination-controls>

<!-- after -->
<pagination-controls (pageChange)="pageChanged($event)"
                     (pageBoundsCorrection)="pageChanged($event)"></pagination-controls>
```

## 4.1.0 (2019-07-11)

#### Features

*  Formats page numbers with locale-aware separators ([#307](https://github.com/michaelbromley/ngx-pagination/issues/307))

#### Fixes

* Correct the peerDependencies field for Angular > 5.0.0 ([#306](https://github.com/michaelbromley/ngx-pagination/pull/306))

# 4.0.0 (2019-06-12)

#### Breaking Changes

* Lib is now built with Angular 8. This means it uses the version 4 metadata format and will **no longer work with Angular v4** or less.

## 3.3.1 (2019-06-12)

#### Fixes
* Revert Angular version to v4 so as still use v3 metadata ([#305](https://github.com/michaelbromley/ngx-pagination/issues/305))

## 3.3.0 (2019-06-11)

#### Features
* Propagate type of collection in PaginatePipe ([#303](https://github.com/michaelbromley/ngx-pagination/issues/303))
* Improve type safety of PaginatePipe args
* Lib now built with Angular v8

## 3.2.1 (2018-10-04)

#### Fixes

* Allow a pagination id of `0` ([#277](https://github.com/michaelbromley/ngx-pagination/issues/277))

## 3.2.0 (2018-08-08)

#### Features
* Add `ellipsis` class to ellipsis link in default controls ([#263](https://github.com/michaelbromley/ngx-pagination/issues/263))
* Add `getTotalItems()` method to PaginationControlsDirective ([#258](https://github.com/michaelbromley/ngx-pagination/issues/258))
* Add `responsive` input to PaginationControlsComponent ([#256](https://github.com/michaelbromley/ngx-pagination/issues/256))

## 3.1.1 (2018-04-23)

#### Fixes
* Allow paginate pipe to work with ReadonlyArrays ([#248](https://github.com/michaelbromley/ngx-pagination/pull/248))

## 3.1.0 (2018-02-16)

#### Features
* Default pagination controls component is now accessible via keyboard controls ([#233](https://github.com/michaelbromley/ngx-pagination/pull/233))

## 3.0.3 (2017-10-23)

#### Fixes
* Revert breaking change to Angular AoT metadata version ([#210](https://github.com/michaelbromley/ngx-pagination/issues/210))

## 3.0.2 (2017-09-29)

#### Fixes
* Cast numeric inputs to numbers  ([#190](https://github.com/michaelbromley/ngx-pagination/issues/190))

## 3.0.1 (2017-06-22)

#### Fixes
* Add `cursor: pointer` to default styles ([#153](https://github.com/michaelbromley/ngx-pagination/pull/153))
* Import only `Subject` rather than whole of rxjs ([#162](https://github.com/michaelbromley/ngx-pagination/pull/162))


# 3.0.0 (2017-04-14)

#### Breaking Changes
* Project has been renamed from "ng2-pagination" to "ngx-pagination", since Angular is already way past version 2. Here are the changes you need to make:
  1. Update your package.json: 
  ```Diff
  - "ng2-pagination": "^2.0.1",
  + "ngx-pagination": "^3.0.0",
  ```
  2. Rename the NgModule in your app module (and any other places you directly `import from 'ng2-pagination'` in your app):
  ```Diff
  - import {Ng2PaginationModule} from 'ng2-pagination'; 
  + import {NgxPaginationModule} from 'ngx-pagination'; 
  ```
  3. Rename any styles which override the default component.
  ```Diff
  - .my-pagination .ng2-pagination .current {
  -   background: red;
  - }
  + .my-pagination .ngx-pagination .current {
  +   background: red;
  + }
  ```
  
* **The distribution format has changed from commonjs & system.register to ES modules & UMD.**
The primary module format being used is now "flat ES modules" (FESM), which means there is a single .js file which uses ES2015 `import`s and `export`s rather than commonjs `require` and `module.exports`. 
Tested with Webpack 2, Rollup & System.js.


## 2.0.1 (2017-02-23)
* Fix exception when config object uses accessors for itemsPerPage and currentPage ([#128](https://github.com/michaelbromley/ng2-pagination/issues/128))
* In-memory paging works even when `totalItems` is specified, fixes [#115](https://github.com/michaelbromley/ng2-pagination/issues/115)
* Warn when using an `id` which does not match any registered with a PaginatePipe, fixes [#116](https://github.com/michaelbromley/ng2-pagination/issues/116)

# 2.0.0 (2017-01-12)

#### Breaking Changes
* The module is being built with **Angular 2.4.3**. Therefore the metadata output is not compatible with Angular < 2.3.0. Attempting to use this version
in an app running Angular < 2.3.0 will result in a "ctorParameters.map is not a function" error. See [this StackOverflow answer for further information](http://stackoverflow.com/a/41444599/772859).
* `PaginationControlsComponent` no longer uses view encapsulation, making it very easy to style without the need for the `/deep/` operator.

#### Features
* Add inputs to `PaginationControlsComponent` to allow custom labels for "Previous", "Next" and screen reader labels.

## 1.0.1 (2016-11-16)
* Fix missing export of PaginationControlsDirective

# 1.0.0 (2016-11-04)
* Fix errors when using TypeScript < 2.0 ([#81](https://github.com/michaelbromley/ng2-pagination/issues/81))
* Fix change detection errors when controls are declared before the pipe in the DOM ([#91](https://github.com/michaelbromley/ng2-pagination/issues/91)).
* Create the PaginationControlsDirective, which is the basis for all controls components, including the default component and any custom components.

#### Breaking Changes
* Custom templates are now implemented with the new [PaginationControlsDirective](https://github.com/michaelbromley/ng2-pagination#paginationcontrolsdirective), rather than by putting elements inside the PaginationControlsComponent.
* Naming of files and classes has been brought into line with the official [style guide recommendations](https://angular.io/docs/ts/latest/guide/style-guide.html#!#naming)
This should not have a big impact if you are just consuming the NgModule, but the main change is that `PaginationControlsCmp` is now `PaginationControlsComponent`, and the `IPaginationInstance` is now just `PaginationInstance`.

## 0.5.2 (2016-10-13)
* Fix flash of default template when creating component with custom template ([#82](https://github.com/michaelbromley/ng2-pagination/issues/82))

## 0.5.1 (2016-10-07)
* Fix type def issue which was breaking AoT builds ([#80](https://github.com/michaelbromley/ng2-pagination/pull/80))
* (demo) Use AoT compilation for demo app
* (build) Upgrade to Webpack 2, TypeScript 2
* (build) Use mocha reporter for better unit test output.

# 0.5.0 (2016-10-06)
* Update codebase to **Angular 2.0.2**
* Use the ngc compiler and include *.metadata.json files in dist package.

### 0.4.1 (2016-09-09)
* Fix missing exports & typo.

# 0.4.0 (2016-09-09)
* Update codebase to **Angular 2 rc.6**. Breaking change: now using NgModules, see readme for new usage guide.
* Fix PaginatePipe bug when itemsPerPage is passed as a string ([#61](https://github.com/michaelbromley/ng2-pagination/pull/61))
* Fix change detection issue when correcting out-of-bounds currentPage value ([#48](https://github.com/michaelbromley/ng2-pagination/issues/48)), [#69](https://github.com/michaelbromley/ng2-pagination/issues/69)
* (build) Update karma-webpack, prune test output.

## 0.3.5 (2016-07-14)
* Update codebase to **Angular 2 rc.4**.
* Fix default template showing up when using custom templates ([#45](https://github.com/michaelbromley/ng2-pagination/issues/45))
* Fix buggy autoHide behaviour ([#57](https://github.com/michaelbromley/ng2-pagination/issues/57))

## 0.3.4 (2016-06-16)
* Fix infinite loop in PaginatePipe when used with other impure pipes.
* (build) Remove postinstall script which caused errors when using npm install. (moved to Travis file)

## 0.3.3 (2016-06-10)
* Fix issue with custom templates still showing default template initially.

## 0.3.2 (2016-06-09)
* Use OnPush change detection strategy for big efficiency gains ([PR #40](https://github.com/michaelbromley/ng2-pagination/pull/40))
* Occasional flickering of active page link when changing pages also handled by the above.
* (build) Update Typings to 1.x

## 0.3.1 (2016-06-02)
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

##  0.0.1 (2016-04-07)
* Change the default ul class name from `.pagination` to `.ng2-pagination` to avoid conflicts with existing CSS frameworks. (fixes [#18](https://github.com/michaelbromley/ng2-pagination/issues/18))

## 0.0.1-beta.3 (2016-03-24)

* Fixed PaginationControlsCmp.outOfBoundCorrection() to prevent it returning `0` when the collection is empty ([f7f9bd9](https://github.com/michaelbromley/ng2-pagination/commit/f7f9bd98544a29cfad02d4a368ac32327d62c6c5)).
* Added System.register bundle build (`dist/ng2-pagination-bundle.js`)


## 0.0.1-beta.2 (2016-02-29)

* Fixed minificaton of demo app
* Use Sass for demo styles

### Breaking Changes

* Removed `PaginationControlsDirective`, and simplified the way custom templates are specified (just put your template inside
the `<pagination-controls>` tags and use a local variable to access the API (see Readme).
* Removed `PAGINATION_DIRECTIVES` exported constant, since there is only 1 component to export now.

# 0.0.1-beta.1 (2016-02-22)

Hello world! First beta release, starting changelog from here.
