'use strict';

const request = require('request')
const cheerio = require('cheerio')
const TurndownService = require('turndown')
const turndownInstance = new TurndownService()

function parseStory ($) {
  $('.uiScale').remove()

  var $content = $('.postArticle-content')
  var $title = $content.find('.graf--title')
  var $subtitle = $content.find('.graf--subtitle')
  var $firstSection = $content.find('.section--first')

  if ($firstSection.length) {
    $firstSection.find('div.section-divider').first().remove()
  }

  var title = $title.text()
  var subtitle = $subtitle.text()

  $title.remove()
  $subtitle.remove()

  var html = $content.html()
  var markdown = turndownInstance.turndown(html)

  return {
    title,
    subtitle,
    markdown,
    html
  }
}

function download (url) {
  return new Promise((resolve, reject) => {
    request({
      uri: url,
      method: 'GET'
    }, function (err, httpResponse, body) {
      if (err) {
        return reject(err)
      }

      var $ = cheerio.load(body)
      var result = parseStory($)

      resolve(result)
    })
  })
}

module.exports = download
