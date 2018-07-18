const config = require('../config')
const utils = require('../utils')
const loginHelper = require('../utils/helpers/login')
const captchaHelper = require('../utils/helpers/captcha.js')

xdescribe('HPID Login', function () {
  it('should have the right title - HP Login', function () {
    browser.url(utils.getLoginUI())
      .waitForExist('.footer-flag')

    const title = browser.getTitle()
    expect(title).toBe(config.title)
  })

  it('should have the right client display name', function () {
    const displayName = browser.getText('.panel-item-body h4')
    expect(displayName).toContain(config.clientName)
  })

  it('should have the Username input and Next button', function () {
    expect(browser.isExisting('#username')).toBe(true)
    expect(browser.isExisting('#next_button')).toBe(true)
  })

  it('should have the Remember Me checkbox', function () {
    expect(browser.isExisting('.vn-checkbox__span')).toBe(true)
  })

  it('should link to the privacy page', function () {
    browser.url(utils.getLoginUI())
    browser.click('a[href="https://ssl.www8.hp.com/us/en/privacy/privacy.html"]')
    var x = browser.getTabIds()
    browser.switchTab(x[1])
    browser.waitForVisible('.font-lh3')
    expect(browser.getUrl()).toContain('/privacy.html')
  })

  it('should not log in with password field empty', function () {
    browser.url(utils.getLoginUI())
    loginHelper.userLogin(config.user)
    loginHelper.userPassword('')
    browser.waitForExist('.vn-textbox--error')
    expect(browser.getText('.vn-form-field')).toContain(config.passwordErr)
  })

  it('should not log in with incorrect password', function () {
    browser.url(utils.getLoginUI())
    loginHelper.userLogin(config.user)
    loginHelper.userPassword(config.incorrectPassword)
    browser.waitForExist('.vn-textbox--error')
    expect(browser.getText('.vn-form-field')).toContain(config.credsErr)
  })

  it('should not log in with incorrect password capitalization', function () {
    browser.url(utils.getLoginUI())
    loginHelper.userLogin(config.user)
    loginHelper.userPassword(config.incorrectCasePassword1)
    browser.waitForExist('.vn-textbox--error')
    expect(browser.getText('.vn-form-field')).toContain(config.credsErr)
    loginHelper.userPassword(config.incorrectCasePassword2)
    browser.waitForExist('.vn-textbox--error')
    expect(browser.getText('.vn-form-field')).toContain(config.credsErr)
  })

  it('should not log in with invalid spacing in password', function () {
    browser.url(utils.getLoginUI())
    loginHelper.userLogin(config.user)
    captchaHelper.validateCaptcha()
    loginHelper.userPassword(config.invalidSpacingPassword)
    browser.waitForExist('.vn-textbox--error')
    expect(browser.getText('.vn-form-field')).toContain(config.credsErr)
  })

  it('should not log in with username field left blank', function () {
    browser.url(utils.getLoginUI())
    loginHelper.userLogin('')
    browser.waitForExist('.vn-textbox--error')
    expect(browser.getText('.vn-form-field')).toContain(config.usernameErr)
  })

  it('should not log in with only spaces entered for username', function () {
    browser.url(utils.getLoginUI())
    loginHelper.userLogin(config.spacesInField)
    browser.waitForExist('.vn-textbox--error')
    expect(browser.getText('.vn-form-field')).toContain(config.usernameErr)
  })

  it('should not log in with only spaces entered for username', function () {
    browser.url(utils.getLoginUI())
    loginHelper.userLogin(config.spacesInField)
    browser.waitForExist('.vn-textbox--error')
    expect(browser.getText('.vn-form-field')).toContain(config.usernameErr)
  })

  it('should not log in with nonexisting username', function () {
    browser.url(utils.getLoginUI())
    loginHelper.userLogin(config.incorrectUser)
    loginHelper.userPassword(config.password)
    browser.waitForExist('.vn-textbox--error')
    expect(browser.getText('.vn-form-field')).toContain(config.credsErr)
  })

  it('should not log in with invalidly spaced username', function () {
    browser.url(utils.getLoginUI())
    loginHelper.userLogin(config.invalidSpacingUser)
    loginHelper.userPassword(config.password)
    browser.waitForExist('.vn-textbox--error')
    expect(browser.getText('.vn-form-field')).toContain(config.credsErr)
  })

  it('should not log in with nonexisting credentials', function () {
    browser.url(utils.getLoginUI())
    loginHelper.userLogin(config.incorrectUser)
    loginHelper.userPassword(config.incorrectPassword)
    browser.waitForExist('.vn-textbox--error')
    expect(browser.getText('.vn-form-field')).toContain(config.credsErr)
  })

  it('should log in with valid credentials', function () {
    browser.url(utils.getLoginUI())
    loginHelper.userLogin(config.user)
    loginHelper.userPassword(config.password)
    browser.waitForExist('.headerPart h4')
    expect(browser.getText('.headerPart h4')).toBe(config.accountHeader)
    browser.click('.vn-icon')
    browser.click('.signOut_clickable')
  })

  it('should log in with valid credentials that have trailing spaces', function () {
    browser.url(utils.getLoginUI())
    loginHelper.userLogin(config.userTrailingSpace)
    loginHelper.userPassword(config.passwordTrailingSpace)
    browser.waitForExist('.headerPart h4')
    expect(browser.getText('.headerPart h4')).toBe(config.accountHeader)
    browser.click('.vn-icon')
    browser.click('.signOut_clickable')
  })

  xit('should force password change ', function () {
    browser.url(utils.getLoginUI())
    loginHelper.userLogin(config.user)
    loginHelper.userPassword(config.password)
    browser.waitForExist('#newPassword')
    expect(browser.getUrl()).toContain('/change-password')
  })
})

describe('Multiple accounts', function () {
  it('should ignore OneHP account and so multiple accounts page does not appear', function () {
    browser.url(utils.getLoginUI())
    //expect here that hp icon doesn't exist without using ugly css selectors!!!
    loginHelper.userLogin(config.socialHPUser)
    browser.waitForExist('#password')
    expect(browser.isExisting('#password')).toBe(true)
  })

  xit('should have all UI components working in multiple accounts page for local, fb, and google accounts', function () {
    browser.url(utils.getLoginUI())
    loginHelper.userLogin(config.socialUser)
    browser.waitForExist('.list-item')
    expect(browser.isExisting('.vn-color--blue')).toBe(true)
    expect(browser.getText('h6')).toContain(config.signInDesc) //possible to refactor this using $ chaining?
    expect(browser.getText('.panel-item-body > div')).toContain(config.multAccountsDesc)
    expect(browser.isExisting('#logo_googleg_48dp')).toBe(true)
    expect(browser.getText('h5')).toContain(config.googleAccountDesc)
    expect(browser.getText('.col-xs-12')).toContain(config.googleSignInDesc)
    expect(browser.getText('.col-xs-12')).toContain(config.socialUser)

    //////////////////////////////////////// FB CASE //////////////////////////////

    expect(browser.isExisting('.vn-icon--size-48')).toBe(true)
    expect(browser.getText('h5')).toContain(config.localAccountDesc)
    expect(browser.getText('.col-xs-12')).toContain(config.localSignInDesc)
    expect(browser.getText('.col-xs-12')).toContain(config.socialUser)
    expect(browser.isExisting('#next_button')).toBe(true)
    expect(browser.getText('#footer-copyright')).toContain(config.copyrightDesc)
    expect(browser.isExisting('a[href="https://ssl.www8.hp.com/us/en/privacy/privacy.html"]')).toBe(true)
    browser.click('.footer-flag')
    browser.waitForVisible('.vn-button--secondary')
    expect(browser.getText('h4')).toContain(config.prefLangDesc)
  })

  xit('should navigate to and from multiple accounts page via local, google, and fb accounts', function () {
    browser.url(utils.getLoginUI())
    loginHelper.userLogin(config.socialUser)
    browser.waitForExist('.list-item')
    //NEED TO FINISH -> PI-29 C690949
  })

  xit('should redirect to client app after navigating to HP gateway via multiple accounts page', function () {
    browser.url(utils.getLoginUI())
    loginHelper.userLogin(config.socialHPUser)
    browser.waitForExist('.list-item')
    browser.click('.vn-icon--size-48')
    browser.waitForExist('#username')
    browser.setValue('#username', config.socialHPUser)
    browser.setValue('#password', config.socialHPPassword)
    browser.click('input[type="submit"]')
    browser.waitForExist('.headerPart h4')
    expect(browser.getText('.headerPart h4')).toBe(config.accountHeader)
    browser.click('.vn-icon')
    browser.click('.signOut_clickable')
  })

  xit('should not redirect to client app with validation failure after navigating to HP gateway via multiple accounts page', function () {
    browser.url(utils.getLoginUI())
    loginHelper.userLogin(config.socialHPUser)
    browser.waitForExist('.list-item')
    browser.click('.vn-icon--size-48')
    browser.waitForExist('#username')
    browser.setValue('#username', config.socialHPUser)
    browser.setValue('#password', config.incorrectPassword)
    browser.click('input[type="submit"]')
    //NEED TO FINISH -> PI-29 C618636
    // check if error message is displayed
  })

  it('should navigate from multiple accounts page to forgot creds and back to sign in', function () {
    browser.url(utils.getLoginUI())
    loginHelper.userLogin(config.socialUser)
    browser.waitForExist('.list-item')
    browser.click('#next_button')
    browser.waitForExist('.forgot-credential a')
    browser.click('.forgot-credential a')
    browser.waitForExist('#critical-id')
    expect(browser.isExisting('#username')).toBe(true)
  })

  it('should return to sign in from multiple accounts page via browser back', function () {
    browser.url(utils.getLoginUI())
    loginHelper.userLogin(config.socialUser)
    browser.waitForExist('.list-item')
    browser.back()
    browser.waitForExist('#username')
    expect(browser.isExisting('#username')).toBe(true)
  })

  it('should return multiple accounts page after refresh', function () {
    browser.url(utils.getLoginUI())
    loginHelper.userLogin(config.socialUser)
    browser.waitForExist('.list-item')
    browser.refresh()
    browser.waitForExist('.list-item')
    expect(browser.isExisting('.list-item')).toBe(true)
  })
})

//https://directory.qa.cd.id.hp.com/directory/v1/oauth/authorize?
//client_id=@IntTestClientHPIDOnly&response_type=code&
//redirect_uri=http://www.hp.com
