## rndr

rndr is a pluggable and embeddable framework for formatting and visualizing data.  

## Building

Developers can easily build rndr using **grunt**.

First install or update your local project's **npm** tools:

```bash
# First install all the NPM tools:
npm install
```

Next run the **grunt** task: 

```bash
grunt release
```

## Release Managment

For developers with permissions releasing a new version of rndr is simple with [grunt bump](https://github.com/vojtajina/grunt-bump)

For developers not interested in building the rndr library you can use **npm** to install the rndr distribution files.

Change to your project's root directory and for 

#### npm

```bash
# To get the latest stable version, use npm from the command line.
npm install rndr
```