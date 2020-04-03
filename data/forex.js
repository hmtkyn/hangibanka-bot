const cron = require('node-cron');
const getAkbankForex = require('./forex/akbank');
const getAlBarakaTurkBankForex = require('./forex/albarakaturkbank');
const getDenizBankForex = require('./forex/denizbank');
const getEnParaForex = require('./forex/enpara');
const getGarantiBankForex = require('./forex/garantibank');
const getHalkBankForex = require('./forex/halkbank');
const getHSBCBankForex = require('./forex/hsbcbank');
const getIngBankForex = require('./forex/ingbank');
const getIsBankForex = require('./forex/isbank');
const getKuveytTurkBankForex = require('./forex/kuveytturkbank');
const getQNBFinansBankForex = require('./forex/qnbfinansbank');
const getSekerBankForex = require('./forex/sekerbank');
const getSeninBankanForex = require('./forex/seninbankan');
const getTEBBankForex = require('./forex/tebbank');
const getTurkiyeFinansBankForex = require('./forex/turkiyefinansbank');
const getVakifBankForex = require('./forex/vakifbank');
const getYapiKrediBankForex = require('./forex/yapikredibank');
const getZiraatBankForex = require('./forex/ziraatbank');
const archiveAll = require('./forex/archive');

function Forex() {
  cron.schedule('* * * * *', () => {
    return (
      console.log('==========>') +
      console.log('1 == ' + Date.now()) +
      console.log('2 == ' + new Date().getTime()) +
      console.log('3 == ' + new Date().getHours() + ':' + new Date().getMinutes()) +
      console.log('4 == ' + parseInt((new Date().getTime() / 1000).toString().slice(0, -4))) +
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

module.exports = Forex;