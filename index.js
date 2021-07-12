#!/usr/bin/env node
// please don't criticize me ... 
// i'm going into the 'callback-hell' but since this is a very small application, 
// i thought why not just get done with it
const {exec} = require('child_process');
const inquirer = require('inquirer');
const {writeFileSync, mkdir} = require('fs');
const process = require('process');
const path = require('path');

const webpackData = `const path =  require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    mode: 'development',
    entry:"./src/index.js",
    output: {
        path: path.join(__dirname,'/public'),
        filename: 'bundle.[fullhash].js'
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: './src/index.html',
        })
    ],
    module : {
        rules: [
            {
                test: /\.(jsx|js|ts)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                }
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            }
        ]
    }
}`

const babelData = `{
    "presets": [
        "@babel/preset-react",
        "@babel/preset-env"
    ]
}`;

const htmlData = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>React Webpack App</title>
</head>
<body>
    <div id="root"></div>
</body>
</html>
`

const indexJSData = `import React from 'react';
import App from './App.js'
import ReactDom, {render} from 'react-dom';

render(
    <App/>,
    document.getElementById('root')
);`

inquirer.prompt([
    {
        type: "input",
        name: "directoryName",
        message: "Enter directory name:"
    }
]).then(answer => {
    const dirName = answer.directoryName;
    console.log('Creating Directory!');
    exec(`mkdir ${dirName}`, (err, data) => {
        if(err) {
            console.log('Something went wrong! Please try again.');
            return;
        }
        process.chdir(`./${dirName}`);
        mkdir(path.join(process.cwd(), 'src'), err => {
            if(err) {
                console.log('Something went wrong! Please try again.');
                return;
            }
            console.log('Creating setup Files!');
            process.chdir(`./src`);
            writeFileSync('index.js',indexJSData);
            writeFileSync('index.html',htmlData);
            process.chdir(`..`);
            console.log('Initializing package.json!');
            exec(`npm init -y`, (err, data) => {
                if(err) {
                    console.log('Something went wrong! Please try again.');
                    return;
                }
                console.log('Installing dependencies!');
                exec(`npm install babel-loader webpack webpack-dev-server webpack-cli css-loader style-loader @babel/core @babel/preset-env @babel/preset-react html-webpack-plugin -D && npm install react react-dom`, (err, data) => {
                    if(err) {
                        console.log('Something went wrong! Please try again.');
                        return;
                    }
                    console.log('Creating config files');
                    writeFileSync("webpack.config.js", webpackData);
                    writeFileSync(".babelrc", babelData);
                    console.log("Finished!");
                })
            })
        });
    })
});
