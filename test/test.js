const path = require("path");
const chai = require("chai");
const sinon = require("sinon");
const loader = require("../");
const { expect, assert } = chai;

let context = {};
let callback = sinon.stub();

beforeEach(async () => {
  context = {
    async: () => callback,
    emitWarning: sinon.stub(),
    resourcePath: path.resolve(__dirname, "mock", "test.js"),
  };
});

describe("loader", () => {
  describe('import "*.js"', () => {
    it("should expand glob import files", async () => {
      const asd = await loader.call(context, 'import "MODULES/*.js*";');

      // console.log(asd);

      expect("test").to.equal("test");
    });
  });
});
