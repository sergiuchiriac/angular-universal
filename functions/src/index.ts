const functions = require("firebase-functions");
const path = require("path");

const mainjs = require(path.join(process.cwd(), "dist", "functions", "server", "main"));
exports.ssr = functions.https.onRequest(mainjs.app());