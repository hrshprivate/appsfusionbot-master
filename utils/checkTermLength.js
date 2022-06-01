const AppId = require('../models/AppId')
const Term = require('../models/Term')
var mongoose = require('mongoose')

async function checkTermLength(term) {
  let key = term
  if (term.length >= 17) {
    const oldTerm = await Term.TermSchema.findOne({ where: { term: term } })
    if (!oldTerm) {
      key = term.slice(0, 17)
      await Term.TermSchema.create({ term, key })
    } else key = oldTerm.key
  }
  return key
}

async function getTerm(key) {
  const term = await Term.TermSchema.findOne({ where: { key: key } })
  if (!term) return key
  return term.term
}

async function checkAppIdLength(appId) {
  let appIdKey = appId
  if (appId.length >= 30) {
    const oldAppId = await AppId.AppIdSchema.findOne({
      where: { appId: appId },
    })
    if (!oldAppId) {
      const newAppId = await AppId.AppIdSchema.create({ appId: appId })
      appIdKey = newAppId.id
    } else appIdKey = oldAppId.id
  }
  return appIdKey
}

async function getAppId(appIdKey) {
  try {
    const appId = await AppId.AppIdSchema.findOne({ where: { id: appIdKey } })
    if (!appId) return appIdKey
    return appId.appId
  } catch (err) {
    return appIdKey
  }
}

module.exports = {
  checkTermLength,
  getTerm,
  checkAppIdLength,
  getAppId,
}
