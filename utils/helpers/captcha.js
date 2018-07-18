class CaptchaHelper {
  get captcha () {
    return $('.g-recaptcha')
  }
  get checkbox () {
    return $('.recaptcha-checkbox')
  }
  get checked () {
    return $('span[aria-checked="true"]')
  }

  validateCaptcha () {
    this.captcha.waitForVisible()
    browser.frame(0)
    this.checkbox.waitForExist()
    this.checkbox.click()
    this.checked.waitForVisible()
    browser.frameParent()
  }
}

module.exports = new CaptchaHelper()
