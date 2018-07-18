const config = require('../config')
const utils = require('../utils')
const yopmail = require('../utils/yopmail.js')
const captchaHelper = require('../utils/helpers/captcha.js')

describe('HPID Recover Username', function () {
  it('should display page with recover message', function () {
    browser.url(utils.getLoginUI())
    browser.waitForExist('.forgot-credential a')
    browser.click('.forgot-credential a')
    browser.waitForExist('.ForgotPwd-desc')
    expect(browser.getText('.ForgotPwd-desc')).toContain(config.recoverPageDesc)
  })

  it('should display error text for uninteracted fields', function () {
    browser.url(utils.getLoginUI())
    browser.waitForExist('.forgot-credential a')
    browser.click('.forgot-credential a')
    browser.waitForExist('#critical-id')
    browser.click('#radio-group-recover-creds > li:nth-child(1) > label > span')
    browser.click('#critical-id')
    browser.waitForText('.vn-form-field__error-message')
    expect(browser.getText('.vn-form-field__error-message')).toContain(config.emailErr)
    expect(browser.getText('.vn-form-field__error-message')).toContain(config.captchaErr) 
  })

  it('should display error text for only entering spaces in email address field', function () {
    browser.url(utils.getLoginUI())
    browser.waitForExist('.forgot-credential a')
    browser.click('.forgot-credential a')
    browser.waitForExist('#critical-id')
    browser.click('#radio-group-recover-creds > li:nth-child(1) > label > span')
    browser.waitForExist('#username')
    browser.setValue('#username', config.spacesInField)
    captchaHelper.validateCaptcha()
    browser.click('#critical-id')
    browser.waitForText('.vn-form-field__error-message')
    expect(browser.getText('.vn-form-field__error-message')).toContain(config.emailErr)
  })

  it('should display email error text for non-existing email address', function () {
    browser.url(utils.getLoginUI())
    browser.waitForExist('.forgot-credential a')
    browser.click('.forgot-credential a')
    browser.waitForExist('#critical-id')
    browser.click('#radio-group-recover-creds > li:nth-child(1) > label > span')
    browser.waitForExist('#username')
    browser.setValue('#username', config.spacesInField)
    captchaHelper.validateCaptcha()
    browser.click('#critical-id')
    browser.waitForText('.vn-form-field__error-message')
    expect(browser.getText('.vn-form-field__error-message')).toContain(config.emailErr)
  })

  it('should display email error text for invalid email address', function () {
    browser.url(utils.getLoginUI())
    browser.waitForExist('.forgot-credential a')
    browser.click('.forgot-credential a')
    browser.waitForExist('#critical-id')
    browser.click('#radio-group-recover-creds > li:nth-child(1) > label > span')
    browser.waitForExist('#username')
    browser.setValue('#username', config.invalidSpacingUser)
    captchaHelper.validateCaptcha()
    browser.click('#critical-id')
    browser.waitForText('.vn-form-field__error-message')
    expect(browser.getText('.vn-form-field__error-message')).toContain(config.emailErr)
  })

  it('should see email sent page', function () {
    browser.url(utils.getLoginUI())
    browser.waitForExist('.forgot-credential a')
    browser.click('.forgot-credential a')
    browser.waitForExist('#critical-id')
    browser.click('#radio-group-recover-creds > li:nth-child(1) > label > span')
    browser.waitForExist('#username')
    browser.setValue('#username', config.user)
    captchaHelper.validateCaptcha()
    browser.click('#critical-id')
    browser.waitForVisible('.ForgotPwd-text')
    expect(browser.getText('.ForgotPwd-text')).toContain(config.recoverUserDesc)
  })

  it('should see email sent page using valid email with trailing spaces', function () {
    browser.url(utils.getLoginUI())
    browser.waitForExist('.forgot-credential a')
    browser.click('.forgot-credential a')
    browser.waitForExist('#critical-id')
    browser.click('#radio-group-recover-creds > li:nth-child(1) > label > span')
    browser.waitForExist('#username')
    browser.setValue('#username', config.userTrailingSpace)
    captchaHelper.validateCaptcha()
    browser.click('#critical-id')
    browser.waitForVisible('.ForgotPwd-text')
    expect(browser.getText('.ForgotPwd-text')).toContain(config.recoverUserDesc)
  })
})

describe('HPID Recover Password', function () {
  it('should see password change page', function () {
    browser.url(utils.getLoginUI())
    browser.waitForExist('.forgot-credential a')
    browser.click('.forgot-credential a') 
    browser.waitForExist('#critical-id')
    browser.click('#radio-group-recover-creds > li:nth-child(2) > label > span')
    browser.waitForExist('#username')
    browser.setValue('#username', config.user)
    captchaHelper.validateCaptcha()
    browser.click('#critical-id')
    browser.waitForVisible('.PwdReset-desc')
    expect(browser.getText('.PwdReset-desc')).toContain(config.passwordResetDesc)
  })

  it('should display the password strength meter and field hint icon', function () {
    browser.url(utils.getLoginUI())
    browser.waitForExist('.forgot-credential a')
    browser.click('.forgot-credential a') 
    browser.waitForExist('#critical-id') 
    browser.click('#radio-group-recover-creds > li:nth-child(2) > label > span')
    browser.waitForExist('#username')
    browser.setValue('#username', config.user)
    captchaHelper.validateCaptcha()
    browser.click('#critical-id')
    browser.waitForExist('#otp')
    browser.setValue('#password', config.password)
    expect(browser.waitForVisible('.vn-icon')).toBeTruthy()
    expect(browser.waitForVisible('.vn-strength-meter')).toBeTruthy()
  })

  it('should pass each password strength meter level from Weak to Very Strong', function () {
    browser.url(utils.getLoginUI())
    browser.waitForExist('.forgot-credential a')
    browser.click('.forgot-credential a') 
    browser.waitForExist('#critical-id')
    browser.click('#radio-group-recover-creds > li:nth-child(2) > label > span')
    browser.waitForExist('#username')
    browser.setValue('#username', config.user)
    captchaHelper.validateCaptcha()
    browser.click('#critical-id')
    browser.waitForExist('#otp')

    browser.setValue('#password', 'Test')
    browser.waitForVisible('.vn-strength-meter')
    expect(browser.getHTML('.vn-strength-meter')).toContain('red')
    expect(browser.getHTML('.vn-strength-meter')).toContain('25%')

    browser.setValue('#password', 'Test1234')
    browser.waitForVisible('.vn-strength-meter')
    expect(browser.getHTML('.vn-strength-meter')).toContain('yellow')
    expect(browser.getHTML('.vn-strength-meter')).toContain('50%')

    browser.setValue('#password', 'Test1234!@#')
    browser.waitForVisible('.vn-strength-meter')
    expect(browser.getHTML('.vn-strength-meter')).toContain('green')
    expect(browser.getHTML('.vn-strength-meter')).toContain('75%')

    browser.setValue('#password', 'Test1234!@#ABCD')
    browser.waitForVisible('.vn-strength-meter')
    expect(browser.getHTML('.vn-strength-meter')).toContain('green-dark')
    expect(browser.getHTML('.vn-strength-meter')).toContain('100%')
  })

  it('should pass each password strength meter level from Very Strong to Weak', function () {
    browser.url(utils.getLoginUI())
    browser.waitForExist('.forgot-credential a')
    browser.click('.forgot-credential a') 
    browser.waitForExist('#critical-id')
    browser.click('#radio-group-recover-creds > li:nth-child(2) > label > span')
    browser.waitForExist('#username')
    browser.setValue('#username', config.user)
    captchaHelper.validateCaptcha()
    browser.click('#critical-id')
    browser.waitForExist('#otp')

    browser.setValue('#password', 'Test1234!@#ABCD')
    browser.waitForVisible('.vn-strength-meter')
    expect(browser.getHTML('.vn-strength-meter')).toContain('green-dark')
    expect(browser.getHTML('.vn-strength-meter')).toContain('100%')

    browser.setValue('#password', 'Test1234!@#')
    browser.waitForVisible('.vn-strength-meter')
    expect(browser.getHTML('.vn-strength-meter')).toContain('green')
    expect(browser.getHTML('.vn-strength-meter')).toContain('75%')

    browser.setValue('#password', 'Test1234')
    browser.waitForVisible('.vn-strength-meter')
    expect(browser.getHTML('.vn-strength-meter')).toContain('yellow')
    expect(browser.getHTML('.vn-strength-meter')).toContain('50%')

    browser.setValue('#password', 'Test')
    browser.waitForVisible('.vn-strength-meter')
    expect(browser.getHTML('.vn-strength-meter')).toContain('red')
    expect(browser.getHTML('.vn-strength-meter')).toContain('25%')
  })

  it('should display non matching passwords error text', function () {
    browser.url(utils.getLoginUI())
    browser.waitForExist('.forgot-credential a')
    browser.click('.forgot-credential a') 
    browser.waitForExist('#critical-id')
    browser.click('#radio-group-recover-creds > li:nth-child(2) > label > span')
    browser.waitForExist('#username')
    browser.setValue('#username', config.user)
    captchaHelper.validateCaptcha()
    browser.click('#critical-id')
    browser.waitForExist('#otp')
    browser.setValue('#password', config.password)
    browser.setValue('#confirmPassword', config.incorrectPassword)
    browser.click('button[type="submit"]')
    browser.waitForText('.vn-form-field__error-message')
    expect(browser.getText('.vn-form-field__error-message')).toContain(config.passwordMatchErr)
  })

  it('should display invalid password error text', function () {
    browser.url(utils.getLoginUI())
    browser.waitForExist('.forgot-credential a')
    browser.click('.forgot-credential a') 
    browser.waitForExist('#critical-id')
    browser.click('#radio-group-recover-creds > li:nth-child(2) > label > span')
    browser.waitForExist('#username')
    browser.setValue('#username', config.user)
    captchaHelper.validateCaptcha()
    browser.click('#critical-id')
    browser.waitForExist('#otp')
    browser.setValue('#password', config.invalidSingleCharPassword)
    browser.setValue('#confirmPassword', config.incorrectPassword)
    browser.click('button[type="submit"]')
    browser.waitForText('.vn-form-field__error-message')
    expect(browser.getText('.vn-form-field__error-message')).toContain(config.strongerPasswordErr)
  })

  it('should resend otp', function () {
    browser.url(utils.getLoginUI())
    browser.waitForExist('.forgot-credential a')
    browser.click('.forgot-credential a') 
    browser.waitForExist('#critical-id')
    browser.click('#radio-group-recover-creds > li:nth-child(2) > label > span')
    browser.waitForExist('#username')
    browser.setValue('#username', config.user)
    captchaHelper.validateCaptcha()
    browser.click('#critical-id')
    browser.waitForExist('#otp')
    browser.click('.text-center.resetOtp > a')
    captchaHelper.validateCaptcha()
    browser.waitForVisible('.resend-link')
    browser.click('.resend-link')
    browser.waitForText('.resend-result')
    expect(browser.getText('.resend-result')).toContain(config.resentOTPDesc)
  })

  it('should display reusing current password error text', function () {
    browser.url(utils.getLoginUI())
    browser.waitForExist('.forgot-credential a')
    browser.click('.forgot-credential a') 
    browser.waitForExist('#critical-id')
    browser.click('#radio-group-recover-creds > li:nth-child(2) > label > span')
    browser.waitForExist('#username')
    browser.setValue('#username', config.user)
    captchaHelper.validateCaptcha()
    browser.click('#critical-id')
    browser.waitForExist('#otp')
    browser.setValue('#password', config.password)
    browser.setValue('#confirmPassword', config.password)
    browser.pause(5000);
    browser.call(function () {
      return new Promise(function (resolve, reject) {
        yopmail.getCode(config.user, (err, res) => {
          if (err) {
            return reject(err)
          }
          config.verifyCode = res
          resolve(res)
        })
      })
    })
    browser.setValue('#otp', config.verifyCode)
    browser.click('button[type="submit"]')
    browser.waitForText('.vn-form-field__error-message')
    expect(browser.getText('.vn-form-field__error-message')).toContain(config.currentPasswordErr)
  })

})
