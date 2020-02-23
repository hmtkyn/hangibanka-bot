import cron from 'node-cron'
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
import archiveAll from './data/archive'

export default function goCron() {
  cron.schedule('* * * * *', () => {
    return (
      console.log('==========>') +
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
  }, { scheduled: true, timezone: "Europe/Istanbul" });
  cron.schedule('30 * * * *', () => {
    return (console.log('==========>') + archiveAll())
  }, { scheduled: true, timezone: "Europe/Istanbul" });
}