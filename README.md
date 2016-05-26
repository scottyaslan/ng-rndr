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

## Start the server

`node server.js`

A ngRNDR live demo is located [here](http://scottyaslan.github.io/?rdatasets=true).

## Explore Data From Any REST Endpoint

1. File > New > Data Source Configuration
  1. Enter URL and click `Acquire Data`
  2. Preview your data and click `Next`
  3. Format your data and click `Format`
  4. View your formatted data and verify it is in an acceptable format. Click `Save`
  5. Name your Data Source Configuration and click the check mark
2. File > New > Data Exploration 
  * You can create multiple Data Explorations
3. Play with the data, filters, and aggregates
4. File > Perspective > Dashboard Desginer
  * Drag, Drop, and resize your visualizations...switch back to the Data Exploration Perspective and add more...switch back to the Deshboard Designer...Pretty cool huh?
5. Edit you visualization by right clicking the visualization title bar

Users may also choose to install the ngRNDR demo as a Chrome App:

## Install Chrome App

1. Open Chrome and go to [chrome://flags](chrome://flags).
2. Find "Experimental Extension APIs", and click its "Enable" link.
3. Restart Chrome.

## Load Chrome App

1. Bring up the apps and extensions management page by clicking the settings icon  and choosing Tools > Extensions
2. Make sure the Developer mode checkbox has been selected
3. Click the Load unpacked extension button
4. Navigate to RNDR and click OK

## Launch Chrome App

Once you've loaded your app, open your [Chrome App Launcher](https://www.google.com/chrome/webstore/apps-launcher.html) and click on your new app icon

Or, load and launch from command line

`--load-and-launch-app=/path/to/app/` installs the unpacked application from the given path, and launches it. If the application is already running it is reloaded with the updated content.
`--app-id=ajjhbohkjpincjgiieeomimlgnll` launches an app already loaded into Chrome. It does not restart any previously running app, but it does launch the new app with any updated content.