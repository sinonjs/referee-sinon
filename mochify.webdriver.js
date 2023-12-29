"use strict";

module.exports = {
  driver: "webdriver",
  // eslint-disable-next-line camelcase
  driver_options: {
    hostname: "ondemand.saucelabs.com",
    path: "/wd/hub",
    port: 80,
    capabilities: {
      browserName: process.env.BROWSER_NAME,
      browserVersion: "latest",
      "sauce:options": {
        build: `${process.env.BROWSER_NAME} ${
          process.env.GITHUB_RUN_NUMBER || Date.now()
        }`,
        username: process.env.SAUCE_USERNAME,
        accessKey: process.env.SAUCE_ACCESS_KEY,
      },
    },
  },
};
