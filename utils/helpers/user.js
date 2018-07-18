var config = require('../../config')
class UserHelper {
  get firstName () {
    return $('#firstName')
  }
  get lastName () {
    return $('#lastName')
  }
  get email () {
    return $('#email')
  }
  get newPassword () {
    return $('#newPassword')
  }
  get confirmPassword () {
    return $('#confirmPassword')
  }
  get regionScroll () {
    return $('.vn-dropdown__title-text')
  }

  emailCreation () {
    const userEmail = `hpid_ft_${Date.now()}@yopmail.com`
    return userEmail
  }

  userCreation (email) {
    this.firstName.waitForVisible()
    this.firstName.setValue(config.createFirstName)
    this.lastName.setValue(config.createLastName)
    this.email.setValue(email)
    this.newPassword.setValue(config.createPassword)
    this.confirmPassword.setValue(config.createPassword)
    this.regionScroll.click()
    this.regionScroll.click()
    browser.scroll(0, 250)
  }
}

module.exports = new UserHelper()
