// import cron from 'node-cron'
import { CronJob } from 'cron'
import getAkbankForex from './data/akbank'
import getAlBarakaTurkBankForex from './data/albarakaturkbank'
import getDenizBankForex from './data/denizbank'
import getEnParaForex from './data/enpara'
import getGarantiBankForex from './data/garantibank'
import getHalkBankForex from './data/halkbank'
import getHSBCBankForex from './data/hsbcbank'
import getIngBankForex from './data/ingbank'
import getIsBankForex from './data/isbank'
import getKuveytTurkBankForex from './data/kuveytturkbank'
import getQNBFinansBankForex from './data/qnbfinansbank'
import getSekerBankForex from './data/sekerbank'
import getSeninBankanForex from './data/seninbankan'
import getTEBBankForex from './data/tebbank'
import getTurkiyeFinansBankForex from './data/turkiyefinansbank'
import getVakifBankForex from './data/vakifbank'
import getYapiKrediBankForex from './data/yapikredibank'
import getZiraatBankForex from './data/ziraatbank'

/* export default function goCron() {
  cron.schedule('* 8,9,10,11,13,14,15,16,17,18 * * 1,2,3,4,5', () => {
    return (
      console.log('=====================================>') +
      getAkbankForex() +
      getAlBarakaTurkBankForex() +
      getDenizBankForex() +
      getEnParaForex() +
      getGarantiBankForex() +
      getHalkBankForex() +
      getHSBCBankForex() +
      getIngBankForex() +
      getIsBankForex() +
      getKuveytTurkBankForex() +
      getQNBFinansBankForex() +
      getSekerBankForex() +
      getSeninBankanForex() +
      getTEBBankForex() +
      getTurkiyeFinansBankForex() +
      getVakifBankForex() +
      getYapiKrediBankForex() +
      getZiraatBankForex()
    )
  })
}
goCron() */

export default function goCron() {
  const job = new CronJob(' * 8,9,10,11,13,14,15,16,17,18 * * 1,2,3,4,5', () => {
    return (
      console.log('=====================================>') +
      getAkbankForex() +
      getAlBarakaTurkBankForex() +
      getDenizBankForex() +
      getEnParaForex() +
      getGarantiBankForex() +
      getHalkBankForex() +
      getHSBCBankForex() +
      getIngBankForex() +
      getIsBankForex() +
      getKuveytTurkBankForex() +
      getQNBFinansBankForex() +
      getSekerBankForex() +
      getSeninBankanForex() +
      getTEBBankForex() +
      getTurkiyeFinansBankForex() +
      getVakifBankForex() +
      getYapiKrediBankForex() +
      getZiraatBankForex()
    )
  })
  job.start()
}
goCron()

/* export default function goCron() {
  return (
    console.log('=====================================>') +
    getAkbankForex() +
    getAlBarakaTurkBankForex() +
    getDenizBankForex() +
    getEnParaForex() +
    getGarantiBankForex() +
    getHalkBankForex() +
    getHSBCBankForex() +
    getIngBankForex() +
    getIsBankForex() +
    getKuveytTurkBankForex() +
    getQNBFinansBankForex() +
    getSekerBankForex() +
    getSeninBankanForex() +
    getTEBBankForex() +
    getTurkiyeFinansBankForex() +
    getVakifBankForex() +
    getYapiKrediBankForex() +
    getZiraatBankForex()
  )
}
goCron() */