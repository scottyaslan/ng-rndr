##ng-rndr

ng-rndr is a pluggable and embeddable angular module for formatting and visualizing data.  

##Building

Developers can easily build ng-rndr using NPM.

First install or update your local project's **npm** tools:

```bash
# First install all the NPM tools:
npm install
```

For developers not interested in building the ng-rndr library you can use **bower** to install the ng-rndr distribution files.

Change to your project's root directory and for 

#### Bower

```bash
# To get the latest stable version, use Bower from the command line.
bower install ng-rndr
```

or for

#### npm

```bash
# To get the latest stable version, use npm from the command line.
npm install ng-rndr
```

Once you have all the necessary assets installed, add `ngRndr` as a dependency for your app:

```javascript
angular.module('myApp', ['ngRndr']);
```