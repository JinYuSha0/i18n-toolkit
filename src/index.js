const path = require("path");
const process = require("process");
const { GoogleSpreadsheet } = require("@shaojinyu/google-spreadsheet");
const { createDirIfNotExists, writeJsonFile } = require("./fsHelper");
const { getAgent } = require("./agent");

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
  socksProxy,
  folderExpand = false,
} = require(CONFIG_PATH);

const OUT_PUT_DIR = path.join(process.cwd(), outputDir);

async function getSheet() {
  try {
    console.log("\x1B[36m%s\x1B[0m", "Start download i18n");
    const agent = await getAgent(socksProxy);
    const doc = new GoogleSpreadsheet(spreadsheetId, agent);
    await doc.useApiKey(apiKey);
    await doc.loadInfo();
    async function processSheet(index) {
      const sheet = doc.sheetsByIndex[index];
      if (!sheet) return;
      let suffix = Array.isArray(tableIndex) ? `${sheet.title}.` : "";
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
      Object.keys(map).forEach((lang) => {
        const CURR_OUT_PUT_DIR = folderExpand
          ? path.join(OUT_PUT_DIR, lang)
          : OUT_PUT_DIR;
        createDirIfNotExists(CURR_OUT_PUT_DIR);
        writeJsonFile(
          path.join(
            CURR_OUT_PUT_DIR,
            folderExpand ? `${suffix}json` : `${lang}.${suffix}json`
          ),
          map[lang]
        );
      });
    }
    if (Array.isArray(tableIndex)) {
      const promises = [];
      tableIndex.forEach((index) => {
        promises.push(processSheet(index));
      });
      await Promise.all(promises);
    } else {
      await processSheet(tableIndex);
    }
    console.log("\x1b[32m", "Done");
  } catch (err) {
    console.log("\x1B[31m", "Download failure cause: " + err.message);
  }
}

getSheet();
