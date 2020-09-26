const path = require("path");
const fs = require("fs");
const glob = require("glob");
const loaderUtils = require("loader-utils");
const enhancedResolver = require("enhanced-resolve");

module.exports = function (source) {
  let updatedSource = source;

  this.callback(null, updatedSource);
};
