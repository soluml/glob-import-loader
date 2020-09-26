const path = require("path");
const fs = require("fs");
const glob = require("glob");
const replaceAsync = require("string-replace-async");
const loaderUtils = require("loader-utils");
const enhancedResolver = require("enhanced-resolve");

module.exports = async function (source) {
  this.cacheable && this.cacheable(true);

  const regex = /.?import + ?((\w+) +from )?([\'\"])(.*?);?\3/gm;
  const importModules = /import +(\w+) +from +([\'\"])(.*?)\2/gm;
  const importFiles = /import +([\'\"])(.*?)\1/gm;
  const importSass = /@import +([\'\"])(.*?)\1/gm;

  source.replace(regex, (match, fromStatement, obj, quote, filename) => {
    console.log("1", match);
    console.log("2", fromStatement);
    console.log("3", obj);
    console.log("4", quote);
    console.log("5", filename);
  });

  await replaceAsync(
    source,
    regex,
    (match, fromStatement, obj, quote, filename) => {
      console.log("A1", match);
      console.log("A2", fromStatement);
      console.log("A3", obj);
      console.log("A4", quote);
      console.log("A5", filename);
    }
  );

  console.log(source);

  this.callback(null, source);
};

//   function resolvePath(pathToResolve) {
//     return new Promise((resolve, reject) => {
//       myEnhancedResolver(self, path.dirname(self.resourcePath), pathToResolve, (err, result) => {
//         if (err && !result) {
//           if(Array.isArray(err.missing)) {
//             result = err.missing.sort()[0];
//           } else {
//             reject(err);
//           }
//         }

//         resolve(result);
//       });
//     });
//   }
