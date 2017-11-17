# Scoring Guide

The Scoring Guide website is a Typescript, Node, and Express Application. It allows users to quickly generate PDF documents with sample questions from the Smarter Balanced test.

## Getting Started

This project was developed using VS Code, but any editor would work. If you are using VS Code, make sure your integrated terminal is set to bash. [This link](https://code.visualstudio.com/docs/editor/integrated-terminal#_configuration) shows you how to change your integrated terminal. 

### Installation
You can install most of the necessary dependencies with the install bash script. Note that you must have Node installed on your machine (version 8 is required for puppeteer). 
```
$ ./install
```

You also need to install [wkhtmltopdf](https://wkhtmltopdf.org/downloads.html) and add it to your path. 

<details> 
  <summary>Installing by hand</summary>

1. In the **client** directory, install npm dependencies.
```
$ cd client/
$ npm install
```
2. In the **server** directory, install npm dependencies. Note that you may need to go back to the project's root directory before running the following commands. 
```
$ cd server/
$ npm install
```
</details>

### Building the project
Scoring Guide uses typescript and less files for both the server and the client, so these need to be compiled before running the app. 

In Visual Studio Code, you can run the launch configuration **Launch Program** (or press F5). This will build all of the necessary server components, and then run the server. You can run the **webpack-watch** task to start a service to watch for changes to the client side code and recompile with Webpack. 

In any other editor or IDE, you can use the following commands to get the same result. Note you only need to start watching for changes to webpack once, and that you must keep the process alive to continue watching. It is recommended to run the webpack command in a separate terminal window. 
```
$ cd server/
$ npm run build

$ cd ../client/
$ npm run watch
```

### Running the project
If you're not using Visual Studio Code or don't want to rebuild, you can run the project by starting the Node server in the server directory.
```
$ node server/dist/Server.js
```

You could also run 
```
$ npm start
```
From server folder

### Testing
There is a script in the root directory of the project named 'test'. We're using Jest as our test framework and run two types of tests.  
The first is a deterministic snapshot test. Jest takes a snapshot of the component in it's rendered form and compares it to the 
last known snapshot. When you make changes to a component, the test for that component is DESIGNED TO FAIL. It is your responsibility to 
examine the differences in the snapshots, which will be displayed for you by Jest. If the changes to the snapshot are correct you must 
UPDATE the tests and check in the updated snapshot files into source control WITH YOUR COMMIT.

We are also running unit tests where we render the component in a virtual DOM and simulate click event on buttons and functional pieces 
of the UI. These tests will fail when making changes to the component, it is your responsibility to update these tests to reflect the 
expected behavior, and check them in WITH YOUR COMMIT.

Do not push your changes until you have run and updated the tests.

To run tests:
```
$ ./test
```

To run tests with code coverage:
```
$ ./test -c
```

To update snapshot tests:
```
$ ./test -u
```

