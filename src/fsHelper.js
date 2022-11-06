const fs = require("fs");
const path = require("path");

function createDirIfNotExists(dirname) {
  function mkdirsSync(dirname) {
    if (fs.existsSync(dirname)) {
      return true;
    } else {
      if (mkdirsSync(path.dirname(dirname))) {
        fs.mkdirSync(dirname);
        return true;
      }
    }
  }
  mkdirsSync(dirname);
  return dirname;
}

function writeJsonFile(filepath, json) {
  fs.writeFileSync(filepath, JSON.stringify(json, null, 2));
}

module.exports = {
  createDirIfNotExists,
  writeJsonFile,
};
