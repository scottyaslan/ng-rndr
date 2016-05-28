##ngRNDR

ngRNDR is an angular module for visualizing data. 

##Building

Developers can easily build ngRNDR using NPM.

First install or update your local project's **npm** tools:

```bash
# First install all the NPM tools:
npm install

# Or update
npm update
```

#### Bower

For developers not interested in building the ngRNDR library... use **bower** to install
and use the ngRNDR distribution files.

Change to your project's root directory.

```bash
# To get the latest stable version, use Bower from the command line.
bower install ngRNDR

# To get the most recent, latest committed-to-master version use:
bower install ngRNDR#master
```

Once you have all the necessary assets installed, add `ngRNDR` as a dependency for your app:

```javascript
angular.module('myApp', ['ngRNDR']);
```