#!/usr/bin/env node

const {exec} = require('child_process');
const inquirer = require('inquirer');
const {writeFileSync, mkdir} = require('fs');
const process = require('process');
const path = require('path');

const webpackData = `
const path =  require('path');
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

const babelData = `
{
    "presets": [
        "@babel/preset-react",
        "@babel/preset-env"
    ]
}`

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
            process.chdir(`./src`);
            writeFileSync('index.js',"");
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
