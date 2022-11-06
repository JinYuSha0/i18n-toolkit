Google sheet 授权步骤

1.新建 google cloud 项目
[点击此处](https://console.cloud.google.com/projectcreate)

2.启用 Google sheet API 、Apps Script API 服务 [点击此处](https://console.cloud.google.com/apis/library/sheets.googleapis.com)

3.在 OAuth 同意屏幕中添加测试用户并且在添加授权范围筛选 Google sheet API 、Apps Script API 全部勾选
[点击此处](https://console.cloud.google.com/apis/credentials/consent)

4.创建凭证选择 API 密钥, 添加 Google Sheets API 限制[点击此处](https://console.cloud.google.com/apis/credentials)

5.创建 Google sheet，扩展程序 -> Apps 脚本 粘贴以下代码

```javascript
function onEdit(e) {
  AutoGenerateKey(e.range.getRowIndex(), e.value);
}

// 自动生成hash key
function AutoGenerateKey(rowIndex, value) {
  if (value == undefined) return;
  var targetColumn = "A";
  var sheet = SpreadsheetApp.getActive();
  var keyRange = sheet.getRange(targetColumn + rowIndex);
  var keyValue = keyRange.getValue();
  if (!!keyValue) return;
  var dateStr = new Date().toISOString();
  var rawHash = Utilities.computeDigest(
    Utilities.DigestAlgorithm.MD5,
    value + dateStr
  );
  var txtHash = "";
  for (i = 0; i < rawHash.length; i++) {
    var hashVal = rawHash[i];
    if (hashVal < 0) {
      hashVal += 256;
    }
    if (hashVal.toString(16).length == 1) {
      txtHash += "0";
    }
    txtHash += hashVal.toString(16);
  }
  sheet.getRange(targetColumn + rowIndex).setValue(txtHash);
}
```

6.添加配置文件`i18n.config.json`到项目根目录

```json
{
  "apiKey": "<你新增的API 密钥>",
  "outputDir": "i18n", // 输出目录
  "spreadsheetId": "<google表格url中很长的那一顿>",
  "tableIndex": 0, // 谷歌表格第一个子表
  "langues": ["zh-CN", "en-US"] // 支持的语言
}
```

7.执行 i18n-tookit 拉取多语言文件`i18n-tookit`或`yarn i18n-tookit`
