const config = require('../config')
const utils = require('../utils')

describe('HPID Localization', function () {
  xit('should change language after marking specified footer flag ', function () {
    browser.waitForExist('.footer-flag')
    browser.click('.footer-flag')
    browser.click('.flag-es')
    browser.click('button[class="vn-button"]')
    browser.waitUntil(function () {
      return browser.getText('.hpid-header h6') === config.languageHeader
    })
    expect(browser.getText('.hpid-header h6')).toContain(config.language)
    browser.click('.footer-flag')
    browser.click('.flag-us')
    browser.click('button[class="vn-button"]')

  })

  //target localization PI 28 C3404

  xit('should display omen colors if language localized', function () {

  })
})