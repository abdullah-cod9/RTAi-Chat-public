import { join } from 'path';

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // Download Chrome (default `skipDownload: false`).
  chrome: {
    skipDownload: false,
  },
  // Download Firefox (default `skipDownload: true`).
  firefox: {
    skipDownload: true,
  },
  cacheDirectory: join('C:\\Users\\abdullah\\.cache\\puppeteer\\chrome\\win64-133.0.6943.126\\chrome-win64\\chrome.exe', '.cache', 'puppeteer'),

};