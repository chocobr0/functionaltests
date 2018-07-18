class LoginHelper {
  get username () {
    return $('#username')
  }
  get next () {
    return $('#next_button')
  }
  get password () {
    return $('#password')
  }
  get submit () {
    return $('.vn-button')
  }

  userLogin (username) {
    this.username.waitForExist()
    this.username.setValue(username)
    this.next.click()
  }

  userPassword (password) {
    this.password.waitForExist()
    this.password.setValue(password)
    this.submit.click()
  }
}

module.exports = new LoginHelper()
