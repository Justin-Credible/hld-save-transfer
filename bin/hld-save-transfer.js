"use strict";
var fs = require("fs");
var path = require("path");
function main() {
    console.log("");
    console.log("Save Transfer Tool for Hyper Light Difter - v1.0.0");
    console.log("https://github.com/Justin-Credible/hld-save-transfer");
    console.log("");
    var showHelp = process.argv.length !== 5
        || process.argv.indexOf("-h") > -1
        || process.argv.indexOf("--h") > -1
        || process.argv.indexOf("-help") > -1
        || process.argv.indexOf("--help") > -1
        || process.argv.indexOf("/h") > -1
        || process.argv.indexOf("/help") > -1
        || process.argv.indexOf("/?") > -1;
    if (showHelp) {
        console.log("Usage: hld-save-transfer <source save> <target save> <output save>");
        console.log("See readme.md for more details.");
        return;
    }
    var sourceSavePath = path.resolve(process.argv[2]);
    var targetSavePath = path.resolve(process.argv[3]);
    var outputSavePath = path.resolve(process.argv[4]);
    if (!fs.existsSync(sourceSavePath)) {
        console.log("Could not locate source save:\n" + sourceSavePath);
        return;
    }
    if (!fs.existsSync(targetSavePath)) {
        console.log("Could not locate target save:\n" + sourceSavePath);
        return;
    }
    if (sourceSavePath === targetSavePath) {
        console.log("The source save path and target save path cannot be the same.");
        return;
    }
    if (fs.existsSync(outputSavePath)) {
        console.log("A file already exists at the output save path; please specify a path that does not exist.\n" + outputSavePath);
        return;
    }
    console.log("Reading source save from: " + sourceSavePath);
    var rawSource = fs.readFileSync(sourceSavePath, { encoding: "utf-8" });
    var sourceBuffer = new Buffer(rawSource, "base64");
    var sourceDecoded = sourceBuffer.toString();
    var saveData = sourceDecoded.substr(sourceDecoded.search("{ \".+\":")).slice(0, -1);
    console.log("Parsing save data...");
    try {
        JSON.parse(saveData);
    }
    catch (exception) {
        throw new Error("Unable to parse save data from input save. " + exception.message);
    }
    console.log("Parsed OK!");
    console.log("Reading target save from: " + targetSavePath);
    var rawTarget = fs.readFileSync(targetSavePath, { encoding: "binary" });
    var targetBuffer = new Buffer(rawTarget, "base64");
    var targetDataStartIndex = null;
    var targetHeaderEndIndex = null;
    console.log("Scanning for unique file header...");
    // Here we loop over each byte in the buffer to find the start of the save data.
    // We assume the save data JSON always starts with { "mapMod":
    targetBuffer.forEach(function (value, index, array) {
        if (value === 123 // {
            && array[index + 1] === 32 // space
            && array[index + 2] === 34 // quote
            && array[index + 3] === 109 // m
            && array[index + 4] === 97 // a
            && array[index + 5] === 112 // p
            && array[index + 6] === 77 // M
            && array[index + 7] === 111 // o
            && array[index + 8] === 100 // d
            && array[index + 9] === 34 // quote
            && array[index + 10] === 58) {
            targetDataStartIndex = index;
            targetHeaderEndIndex = index - 1;
        }
    });
    if (!targetDataStartIndex || !targetHeaderEndIndex) {
        throw new Error("Unable to find the save header in the target save.");
    }
    var targetHeader = targetBuffer.slice(0, targetDataStartIndex);
    console.log("Extracted unique header from target save!");
    console.log("Building new save file...");
    var saveDataBuffer = new Buffer(saveData);
    var outputBuffer = Buffer.concat([targetHeader, saveDataBuffer, new Buffer(0)]);
    var outputEncoded = outputBuffer.toString("base64");
    console.log("Writing new save file to: " + outputSavePath);
    fs.writeFileSync(outputSavePath, outputEncoded);
    console.log("Done!");
}
main();
//# sourceMappingURL=hld-save-transfer.js.map
