const info = require('debug')('test:sign-up:info')
var config = require('../config')
const utils = require('../utils')
const captchaHelper = require('../utils/helpers/captcha.js')
const loginHelper = require('../utils/helpers/login')
const userHelper = require('../utils/helpers/user.js')

xdescribe('HPID Parameter Features', function () {
    it('should display create account page and client name using target=create param', function () {
        browser.url(utils.getLoginUI(config.create))
        browser.waitForExist('.sign-up-header h5')
        expect(browser.getText('.client-name div')).toContain(config.clientName)
        expect(browser.getText('.sign-up-header h5')).toContain(config.signUpHeader)
    })

    it('should fill email field using email target on create account page', function () {
        browser.url(utils.getLoginUI(config.createEmail))
        browser.waitForExist('.sign-up-header h5')
        expect(browser.getAttribute('#email', 'value')).toContain(config.user)
    })

    it('should display username page after using email param without target=create', function () {
        browser.url(utils.getLoginUI(config.createEmailNeg))
        browser.waitForExist('#username')
        expect(browser.getText('.hpid-header h6')).toContain(config.signInDesc)
        expect(browser.elementActive().getAttribute('name')).toContain('username')
    })

    it('should pre-populate first name, last name, and email fields on create account page', function () {
        browser.url(utils.getLoginUI(config.createNamesAndEmail))
        browser.waitForExist('.sign-up-header h5')
        expect(browser.getAttribute('#firstName', 'value')).toContain(config.createFirstName)
        expect(browser.getAttribute('#lastName', 'value')).toContain(config.createLastName)
        expect(browser.getAttribute('#email', 'value')).toContain(config.user)
    })

    it('should display create account page with "not now" link via allow_return param that redirects app with error', function () {
        browser.url(utils.getLoginUI(config.return))
        browser.waitForExist('.account-creation a')
        browser.click('.account-creation a')
        browser.waitForExist('.sign-up-header h5')
        browser.scroll(0, 250)
        expect(browser.waitForVisible('.back-link a')).toBe(true)
        browser.click('.back-link a')
        browser.waitForExist('script[src="/uaa/main.c9618e78.js"]')
        expect(browser.getUrl()).toContain('error_description=User+denied+request')
    })

    it('should display password page using target=password and login_hint=user with cursor in password field', function () {
        browser.url(utils.getLoginUI(config.password))
        browser.waitForExist('#password')
        expect(browser.getText('.panel-item-body p')).toContain(config.helloPasswordDesc)
        expect(browser.getText('.panel-item-body h4')).toContain(config.user)
        expect(browser.elementActive().getAttribute('name')).toContain('password')
    })

    it('should display username page after solely using target=password with cursor in username field', function () {
        browser.url(utils.getLoginUI(config.passwordNegCase))
        browser.waitForExist('#username')
        expect(browser.getText('.hpid-header h6')).toContain(config.signInDesc)
        expect(browser.elementActive().getAttribute('name')).toContain('username')
    })

    it('should display username page after using an invalid target with cursor in username field', function () {
        browser.url(utils.getLoginUI(config.invalidTarget))
        browser.waitForExist('#username')
        expect(browser.getText('.hpid-header h6')).toContain(config.signInDesc)
        expect(browser.elementActive().getAttribute('name')).toContain('username')
    })

    it('should display recover your creds page with password radio button pre-selected and cursor in username field', function () {
        browser.url(utils.getLoginUI(config.forgotPassword))
        browser.waitForExist('#username')
        expect(browser.getAttribute('label[for="radio-password"] > svg', 'class')).toContain('vn-radio-button-box__icon--checked')
        expect(browser.elementActive().getAttribute('name')).toContain('username')
    })

    it('should display sign in page relative to allow_return, target=password, and login_hint parameters with cursor in password field', function () {
        browser.url(utils.getLoginUI(config.signInReturnAndBackParams))
        browser.waitForExist('#password')
        expect(browser.getText('.panel-item-body p')).toContain(config.helloPasswordDesc)
        expect(browser.getText('.panel-item-body h4')).toContain(config.user)
        expect(browser.elementActive().getAttribute('name')).toContain('password')
        expect(browser.waitForVisible('.back-link a')).toBe(true)
        browser.click('.back-link a')
        browser.waitForExist('script[src="/uaa/main.c9618e78.js"]')
        expect(browser.getUrl()).toContain('error_description=User+denied+request')
    })

    it('should display sign in page with a back link and when navigating to password page, can tap back to go to sign in page', function () {
        browser.url(utils.getLoginUI(config.return))
        browser.waitForExist('#username')
        expect(browser.waitForVisible('.back-link a')).toBe(true)
        browser.setValue('#username', config.user)
        browser.click('#next_button')
        browser.waitForExist('#password')
        browser.click('.back-link a')
        browser.waitForVisible('#username')
        expect(browser.waitForExist('#username')).toBe(true)
    })

    xit('should display create account page with omen default colors', function () {
        browser.url(utils.getLoginUI(config.theme))
        browser.waitForExist('.account-creation a')
        browser.click('.account-creation a')
        browser.call(function () {
            browser.getCssProperty('.sign-up-default-bg', 'background-color').then(function (color) {
              expect(color.parsed.hex).toBe(config.defaultBannerColor)
            })
        })
        browser.call(function () {
            browser.getCssProperty('.vn-background-color--canvas', 'background-color').then(function (color) {
              expect(color.parsed.hex).toBe(config.omenBodyColor)
            })
        })
        browser.call(function () {
            browser.getCssProperty('.hp-icon', 'color').then(function (color) {
              expect(color.parsed.hex).toBe(config.omenIconColor)
            })
        })
    })

    // xit('should see error page after inserting email param with spaces', function () {
    //     browser.url(utils.getLoginUI(config.createNamesAndEmailNeg))
    //     //browser.debug()
    //     //PI-28 C341220
    //     ////////////////////////////////// ALLOWING SPACED EMAIL //////////////////////////////////// <script type="text/javascript" src="/uaa/main.c9618e78.js"></script>
    // })

})

// black background with white text, white buttons with black text. recaptcha checkbox checkmark is black.
describe('HPID Omen Theme', function () {
    it('should display omen colors in multiple accounts page', function () {
        browser.url(utils.getLoginUI(config.theme))
        loginHelper.userLogin(config.socialHPUser)
        browser.waitForExist('.list-item')
        var iconHP = $('.hp-icon')
        expect(iconHP.getCssProperty('color').parsed.hex).toContain(config.omenIconColor)
        var background = $('body')
        expect(background.getCssProperty('color').parsed.hex).toContain(config.omenBodyColor)
        var text = $('.vn-color--foreground')
        expect(text.getCssProperty('color').parsed.hex).toContain(config.omenTextColor)
        var buttonBackground = $('.vn-button--critical')
        expect(buttonBackground.getCssProperty('background-color').parsed.hex).toContain(config.omenPosButtonColor)
        var buttonText = $('.vn-button')
        expect(buttonText.getCssProperty('color').parsed.hex).toContain(config.omenLangBodyColor)
    })

    it('should display sign in page with omen colors', function () {
        browser.url(utils.getLoginUI(config.theme))
        browser.waitForExist('#username')
        var iconHP = $('.hp-icon')
        expect(iconHP.getCssProperty('color').parsed.hex).toContain(config.omenIconColor)
        var background = $('body')
        expect(background.getCssProperty('color').parsed.hex).toContain(config.omenBodyColor)
        var text = $('.vn-color--foreground')
        expect(text.getCssProperty('color').parsed.hex).toContain(config.omenTextColor)
        var buttonBackground = $('.vn-button--critical')
        expect(buttonBackground.getCssProperty('background-color').parsed.hex).toContain(config.omenPosButtonColor)
        var buttonText = $('.vn-button')
        expect(buttonText.getCssProperty('color').parsed.hex).toContain(config.omenLangBodyColor)
        var iconSocial = $('.social-icon')
        expect(iconSocial.getCssProperty('color').parsed.hex).toContain(config.omenIconColor)
        // var link = $('a')
        // expect(link.getCssProperty('color').parsed.hex).toContain(config.omenLinkColor)
    })

    it('should display preferred language list with omen colors via sign in page', function () {
        browser.click('.footer-flag')
        var background = $('.vn-modal__content')
        expect(background.getCssProperty('background-color').parsed.hex).toContain(config.omenLangBodyColor)
        var radioButton = $('.vn-radio-button-box')
        expect(radioButton.getCssProperty('color').parsed.hex).toContain(config.omenTextColor)
        var selectButton = $('.vn-button')
        var cancelButton = $('.vn-button--secondary')
        expect(selectButton.getCssProperty('background-color').parsed.hex).toContain(config.omenPosButtonColor)
        expect(selectButton.getCssProperty('color').parsed.hex).toContain(config.omenLangBodyColor)
        expect(cancelButton.getCssProperty('color').parsed.hex).toContain(config.omenTextColor)
        expect(cancelButton.getCssProperty('background-color').parsed.hex).toContain(config.omenLangBodyColor)
        browser.click('.vn-button--secondary')
    })

    it('should display omen colors in forgot credentials', function () {
        browser.waitForVisible('.forgot-credential a')
        browser.click('.forgot-credential a')
        browser.waitForExist('#critical-id')
        var iconHP = $('.hp-icon')
        expect(iconHP.getCssProperty('color').parsed.hex).toContain(config.omenIconColor)
        var background = $('body')
        expect(background.getCssProperty('color').parsed.hex).toContain(config.omenBodyColor)
        var text = $('.vn-color--foreground')
        expect(text.getCssProperty('color').parsed.hex).toContain(config.omenTextColor)
        var buttonBackground = $('.vn-button--critical')
        expect(buttonBackground.getCssProperty('background-color').parsed.hex).toContain(config.omenPosButtonColor)
        var buttonText = $('.vn-button')
        expect(buttonText.getCssProperty('color').parsed.hex).toContain(config.omenLangBodyColor)
        //recaptcha checkmark is not black, it's green
        // var link = $('a')
        // expect(link.getCssProperty('color').parsed.hex).toContain(config.omenLinkColor)
    })

    it('should display sign up page with omen colors', function () {
        browser.waitForExist('.account-creation a')
        browser.click('.account-creation a')
        browser.waitForExist('#firstName')
        var iconHP = $('.hp-icon')
        expect(iconHP.getCssProperty('color').parsed.hex).toContain(config.omenIconColor)
        var background = $('body')
        expect(background.getCssProperty('color').parsed.hex).toContain(config.omenBodyColor)
        var text = $('.vn-color--foreground')
        expect(text.getCssProperty('color').parsed.hex).toContain(config.omenTextColor)
        var textDropdown = $('.vn-dropdown__title-text')
        expect(textDropdown.getCssProperty('color').parsed.hex).toContain(config.omenTextColor)
        //recaptcha checkmark is not black, it's green
        // var link = $('a')
        // expect(link.getCssProperty('color').parsed.hex).toContain(config.omenLinkColor)
        var buttonBackground = $('.vn-button--critical')
        expect(buttonBackground.getCssProperty('background-color').parsed.hex).toContain(config.omenPosButtonColor)
        var buttonText = $('.vn-button')
        expect(buttonText.getCssProperty('color').parsed.hex).toContain(config.omenLangBodyColor)
    })

    it('should display preferred language list with omen colors via sign up page', function () {
        browser.waitForExist('.footer-flag')
        browser.click('.footer-flag')
        var background = $('.vn-modal__content')
        expect(background.getCssProperty('background-color').parsed.hex).toContain(config.omenLangBodyColor)
        var radioButton = $('.vn-radio-button-box')
        expect(radioButton.getCssProperty('color').parsed.hex).toContain(config.omenTextColor)
        var selectButton = $('.vn-button')
        var cancelButton = $('.vn-button--secondary')
        expect(selectButton.getCssProperty('background-color').parsed.hex).toContain(config.omenPosButtonColor)
        expect(selectButton.getCssProperty('color').parsed.hex).toContain(config.omenLangBodyColor)
        expect(cancelButton.getCssProperty('color').parsed.hex).toContain(config.omenTextColor)
        expect(cancelButton.getCssProperty('background-color').parsed.hex).toContain(config.omenLangBodyColor)
        browser.click('.vn-button--secondary')
    })

    it('should display terms of use page with omen colors via sign up page', function () {
        browser.scroll(0,250)
        browser.click('.sign-up-tnc > span > span')
        browser.waitForExist('.tnc-content')
        var background = $('.vn-modal__content')
        expect(background.getCssProperty('background-color').parsed.hex).toContain(config.omenLangBodyColor)
        var text = $('.vn-color--foreground')
        expect(text.getCssProperty('color').parsed.hex).toContain(config.omenTextColor)
        browser.click('.vn-modal__close')
    })

    it('should display verify email page with omen colors', function () {
        config.userEmail = userHelper.emailCreation()
        info(config.userEmail)
        userHelper.userCreation(config.userEmail)
        captchaHelper.validateCaptcha()
        browser.click('.vn-checkbox__span')
        browser.click('button[type="submit"]')
        browser.waitForExist('#otp')
        var iconHP = $('.hp-icon')
        expect(iconHP.getCssProperty('color').parsed.hex).toContain(config.omenIconColor)
        var background = $('body')
        expect(background.getCssProperty('color').parsed.hex).toContain(config.omenBodyColor)
        var text = $('.vn-color--foreground')
        expect(text.getCssProperty('color').parsed.hex).toContain(config.omenTextColor)
        var buttonBackground = $('.vn-button--critical')
        expect(buttonBackground.getCssProperty('background-color').parsed.hex).toContain(config.omenPosButtonColor)
        var buttonText = $('.vn-button')
        expect(buttonText.getCssProperty('color').parsed.hex).toContain(config.omenLangBodyColor)
        // var link = $('a')
        // expect(link.getCssProperty('color').parsed.hex).toContain(config.omenLinkColor)
    })
})