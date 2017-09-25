# Scoring Guide

The Scoreing Guide website is a Typescript, Node, and Express Application. It allows users to quickly generate PDF documents with sample questions from the Smarter Balanced test.

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
3. Install global dependencies
```
$ npm install -g jest
$ npm install -g lessc-each
$ npm install -g typescript
```
</details>

### Building the project
Scoring Guide uses typescript and less files for both the server and the client, so these need to be compiled before running the app. 

In Visual Studio Code, you can run the launch configuration `Launch Program` (or press F5). This will build all of the necessary components before running the server. 

In any other editor or IDE, you can run the build-all bash script.
```
$ ./build all
```

### Running the project
If you're not using Visual Studio Code or don't want to rebuild, you can run the project by starting the Node server in the server directory.
```
$ node server/dist/server.js
```

### Testing
There is a script in the root directory of the project named 'test'. 
To run tests:
```
$ ./test
```

To run tests with code coverage:
```
$./test  -c
```

To update snapshot tests:
```
$./test  -u
```

