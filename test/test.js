const path = require("path");
const chai = require("chai");
const sinon = require("sinon");
const loaderUtils = require("loader-utils");
const replaceAll = require("string.prototype.replaceall");
const loader = require("../");

const { expect, assert } = chai;
const getOptions = sinon.stub(loaderUtils, "getOptions");

let context = {};
let callback;

function cleanSource(source) {
  return replaceAll(source, __dirname, "");
}

beforeEach(async () => {
  callback = sinon.spy();

  context = {
    async: () => callback,
    emitWarning: sinon.stub(),
    resourcePath: path.resolve(__dirname, "mock", "test.js"),
  };

  getOptions.callsFake(() => ({
    resolve: {
      alias: {
        MODULES: "./modules",
      },
    },
  }));
});

describe("loader", () => {
  describe('import "*.js"', () => {
    it("should expand glob import files", async () => {
      await loader.call(context, 'import "MODULES/*.js*";');

      const [err, source] = callback.getCall(0).args;

      console.log("ASDASD", cleanSource(source));

      expect(err).to.be.null;
      expect(cleanSource(source)).to.equal(
        `import "/mock/modules/a.js"; import "/mock/modules/a.json"; import "/mock/modules/b.js"; import "/mock/modules/c.js";`
      );
    });
  });
});
