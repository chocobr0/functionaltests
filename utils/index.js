const qs = require('querystring')
const debug = require('debug')('test:info')

const config = {
  pr: {
    client_id: 'fgS3FWft1sCMFF2uEy4xKG8JOw4bJc8b',
    redirect_uri: 'https://myaccount.dev.cd.id.hp.com/uaa/tokenCallback'
  },
  dev: {
    client_id: 'fgS3FWft1sCMFF2uEy4xKG8JOw4bJc8b',
    redirect_uri: 'https://myaccount.dev.cd.id.hp.com/uaa/tokenCallback'
  },
  qa: {
    client_id: 'OrRMFvsq3fFiCVHvN28GMvPRqQGEVCsz',
    redirect_uri: 'https://myaccount.qa.cd.id.hp.com/uaa/tokenCallback'
  },
  qaNoOneHP: {
    client_id: '@IntTestAccEmClient@',
    redirect_uri: 'http://www.hp.com'
  },
  qaMultAccs: {
    client_id: '@IntTestClientHPIDOnly',
    redirect_uri: 'http://www.hp.com'
  }
}

module.exports = {
  getServerURL () {
    let url
    if (process.env.GCD_SERVICE_GLOBAL_FQDN) {
      // global url for dev and qa
      url = 'https://' + process.env.GCD_SERVICE_GLOBAL_FQDN
    } else if (process.env.GCD_K8S_SERVICE_LOAD_BALANCER) {
      // pipeline does not have global url for pr, using load balancer
      url = 'https://' + process.env.GCD_K8S_SERVICE_LOAD_BALANCER
    }
    return url
  },

  getURL () {
    switch (process.env.GCD_ENVIRONMENT) {
      case 'pr':
      case 'dev':
        return 'https://directory.dev.cd.id.hp.com'
      case 'qa':
        return 'https://directory.qa.cd.id.hp.com'
      default:
        return 'https://directory.dev.cd.id.hp.com'
    }
  },
  getLoginUI (queryParams) {
    const baseURL = this.getURL()
    const env = process.env.GCD_ENVIRONMENT || 'dev'
    const params = qs.stringify({
      response_type: 'token',
      ...config[env],
      ...queryParams
    })
    debug(`${baseURL}/directory/v1/oauth/authorize?${params}`)
    return `${baseURL}/directory/v1/oauth/authorize?${params}`
  }
}
