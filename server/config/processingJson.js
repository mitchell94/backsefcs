const fs = require('fs');
const appRoot = require('app-root-path');
//  Since Node.js v0.12 and as of Node.js v4.0.0, there is a stable
// readline core module. That's the easiest way to read lines from a file,
// without any external modules. Credits: https://stackoverflow.com/a/32599033/1333836


const env = process.env.NODE_ENV;
let urlLog = "";
let urlFinalLog = "";

if (env === "dev") {
    urlLog = `${appRoot}/server/logs/accessDev.log`;
    urlFinalLog = `${appRoot}/server/logs/final-dev-log.json`

}
if (env === "test") {
    urlLog = `${appRoot}/server/logs/accessTest.log`;
    urlFinalLog = `${appRoot}/server/logs/final-test-log.json`
}
if (env === "pro") {
    urlLog = `${appRoot}/server/logs/accessPro.log`;
    urlFinalLog = `${appRoot}/server/logs/final-pro-log.json`
}


const readline = require('readline');

const lineReader = readline.createInterface({
    input: fs.createReadStream(urlLog)
});

const realJSON = [];
lineReader.on('line', function (line) {
    realJSON.push(JSON.parse(line))
});

lineReader.on('close', function () {
    // final-log.json is the post-processed, valid JSON file
    fs.writeFile(urlFinalLog, JSON.stringify(realJSON), 'utf8', () => {
        console.log('Done!');
    });
});

