const request = require('request-promise')
const cheerio = require('cheerio')
const debug = require('debug')('test:yopmail')

const YP = 'YZGt1BQVlZGN1BQR2ZQtlBGV'
const YJ = 'XAGx1ZQD4ZwRlBQt3AGD1AD'
const SPAM = 'true'
const V = '2.8'

const contains = (a, b) => {
  return a.toLowerCase().indexOf(b) >= 0
}

const inbox = (id, phrase, p = 1) => {
  const url = `http://m.yopmail.com/en/inbox.php?login=${id}&p=${p}&d=&ctrl=&scrl=&spam=${SPAM}&yf=005&yp=${YP}&yj=${YJ}&v=${V}&r_c=&id=`
  debug(url)
  return request
    .get(url)
    .then(result => {
      const $ = cheerio.load(result)
      const mails = []
      let found = false

      $('.lm_m').each((index, element) => {
        const el = $(element)
        const mail = {
          index,
          when: el.find('.lmh').text(),
          from: el.find('.lmf').text(),
          subject: el.find('.lms_m').text(),
          href: 'http://m.yopmail.com/en/' + el.attr('href'),
          html: el.html()
        }

        if (phrase && !found) {
          console.log('PHRASE', phrase, mail.from, mail.subject)
          found = contains(mail.from, phrase) || contains(mail.subject, phrase)
        }

        mails.push(mail)
      })

      return { found, mails }
    })
}

const getCode = id => {
  return inbox(id).then(res => {
    const mails = res.mails
    for (var i = 0; i < mails.length; i++) {
      var mail = mails[i]
      if (mail.from === 'HP ID Support') {
        const contentUrl = mail.href
        debug('find HP mail. subject is %s', mail.subject)
        return request.get(contentUrl).then(data => {
          const $ = cheerio.load(data)
          const code = $('p.code').text()
          if (code) {
            return code
          }
        })
      }
    }
  })
}

const test = (id, cb, max = 5) => {
  debug('start to get %s code', id)
  getCode(id).then(code => {
    if (code) {
      debug('code is %s', code)
      cb(null, code)
    } else if (max > 0) {
      setTimeout(() => {
        test(id, cb, max - 1)
      }, 1000)
    } else {
      cb(new Error('No Code'))
    }
  })
}

exports.getCode = test
