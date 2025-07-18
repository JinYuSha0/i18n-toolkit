const { getProxySettings } = require("get-proxy-settings");
const { SocksProxyAgent } = require("socks-proxy-agent");
const { HttpsProxyAgent } = require("https-proxy-agent");

async function getAgent(proxy) {
  if (!proxy) {
    const { http, https } = await getProxySettings();
    if (https) proxy = https.toString();
    if (!proxy && http) proxy = http.toString();
  }

  const lower = proxy.toLowerCase();

  if (
    lower.startsWith("socks4://") ||
    lower.startsWith("socks5://") ||
    lower.startsWith("socks://")
  ) {
    return new SocksProxyAgent(proxy);
  }

  if (lower.startsWith("http://") || lower.startsWith("https://")) {
    return new HttpsProxyAgent(proxy);
  }

  return null;
}

module.exports = { getAgent };
