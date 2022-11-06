const path = require("path");
const process = require("process");
const { GoogleSpreadsheet } = require("google-spreadsheet");
const { createDirIfNotExists, writeJsonFile } = require("./fsHelper");

const args = process.argv.slice(2);
const [configPath] = args;

const CONFIG_PATH = configPath
  ? path.join(process.cwd(), configPath)
  : path.join(process.cwd(), "i18n.config.json");

const {
  apiKey,
  outputDir,
  spreadsheetId,
  tableIndex,
  langues,
} = require(CONFIG_PATH);

const OUT_PUT_DIR = path.join(process.cwd(), outputDir);

async function getSheet() {
  try {
    console.log("\x1B[36m%s\x1B[0m", "Start download i18n");
    const doc = new GoogleSpreadsheet(spreadsheetId);
    await doc.useApiKey(apiKey);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[tableIndex];
    const rows = await sheet.getRows();
    const map = {};
    langues.forEach((lang) => (map[lang] = {}));
    rows.forEach((row) => {
      const key = row._rawData[0];
      if (!key) return;
      langues.forEach((lang) => {
        map[lang][key] = row[lang];
      });
    });
    createDirIfNotExists(OUT_PUT_DIR);
    Object.keys(map).forEach((lang) => {
      writeJsonFile(path.join(OUT_PUT_DIR, `${lang}.json`), map[lang]);
    });
  } catch (err) {
    console.log("\x1B[31m", "Download failure cause: " + err.message);
  }
}

getSheet();
