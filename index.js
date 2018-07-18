const Launcher = require('webdriverio').Launcher
const info = require('debug')('test:index:info')
const wdio = new Launcher('./wdio.conf')

info('Starting functional test...')

info('Checking the environment')
info('GCD_ENVIRONMENT: %s', process.env.GCD_ENVIRONMENT)
info('GCD_SERVICE_GLOBAL_FQDN: %s', process.env.GCD_SERVICE_GLOBAL_FQDN)
info('GCD_K8S_SERVICE_LOAD_BALANCER: %s', process.env.GCD_K8S_SERVICE_LOAD_BALANCER)
info('GCD_PROJECT_VERSION: %s', process.env.GCD_PROJECT_VERSION)

wdio.run().then(function (code) {
  process.exit(code)
}, function (error) {
  console.error('Launcher failed to start the test', error.stacktrace)
  process.exit(1)
})
