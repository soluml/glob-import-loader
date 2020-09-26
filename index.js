const path = require("path");
const glob = require("glob");
const replaceAsync = require("string-replace-async");
const loaderUtils = require("loader-utils");
const enhancedResolver = require("enhanced-resolve");
const { rejects } = require("assert");

module.exports = async function (source) {
  this.cacheable && this.cacheable(true);

  const callback = this.async();
  const regex = /.?import + ?((\w+) +from )?([\'\"])(.*?);?\3/gm;
  const importModules = /import +(\w+) +from +([\'\"])(.*?)\2/gm;
  const importFiles = /import +([\'\"])(.*?)\1/gm;
  const importSass = /@import +([\'\"])(.*?)\1/gm;
  const options = Object.assign({}, loaderUtils.getOptions(this));
  const resolvePath = (pathToResolve) => {
    return new Promise((resolve, reject) => {
      enhancedResolver.create(options.resolve || {})(
        this,
        path.dirname(this.resourcePath),
        pathToResolve,
        (err, result) => {
          if (err && !result) {
            console.log("MY MISSING", err.missing);

            if (Array.isArray(err.missing)) {
              // Use the path without extensions
              resolve(err.missing.sort()[0]);
            } else {
              callback(new Error("Could not resolve the wildcard path."));
            }

            resolve(result);
          }
        }
      );
    });
  };

  await replaceAsync(
    source,
    regex,
    async (match, fromStatement, obj, quote, filename) => {
      // If there are no wildcards, return early
      if (!filename.match(/\*/)) {
        return match;
      }

      const modules = [];
      const withModules = false;
      const globRelativePath = filename.match(/!?([^!]*)$/)[1];
      const prefix = filename.replace(globRelativePath, "");

      const temp = await resolvePath(globRelativePath);

      console.log("NAME", globRelativePath, temp);

      // var result = glob
      //   .sync(globRelativePath, {
      //     cwd: cwdPath,
      //   })
      //   .map((file, index) => {
      //     var fileName = quote + prefix + file + quote;

      //     if (match.match(importSass)) {
      //       return "@import " + fileName;
      //     } else if (match.match(importModules)) {
      //       var moduleName = obj + index;
      //       modules.push(moduleName);
      //       withModules = true;
      //       return "import * as " + moduleName + " from " + fileName;
      //     } else if (match.match(importFiles)) {
      //       return "import " + fileName;
      //     } else {
      //       self.emitWarning('Unknown import: "' + match + '"');
      //     }
      //   })
      //   .join("; ");

      // if (result && withModules) {
      //   result += "; var " + obj + " = [" + modules.join(", ") + "]";
      // }

      // if (!result) {
      //   self.emitWarning('Empty results for "' + match + '"');
      // }

      // return result;
    }
  );

  // console.log(source);

  callback(null, source);
};
