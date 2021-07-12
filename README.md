# cwra
cwra is command which creates a boilerplate directory for react-webpack application


# Installation
```
npm install -g cwra
```

# Execute
```
cwra
```
This will prompt you a question for the Project name.<br>
**Take care that the directory is not already present**

This will create a folder structure as follows:<br>

```
project_name  
│___ node_modules
|
└─── src
│    |   index.js
|    |   index.html
│       
| .babelrc
| package-lock.json
| package.json
| webpack.config.js

```

It will also install all the dependencies for a basic react-project, create the basic configuration files for webpack and babel.
