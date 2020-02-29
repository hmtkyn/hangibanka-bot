const cron = require('node-cron');
const getAkbankForex = require('./doviz/akbank');
const getAlBarakaTurkBankForex = require('./doviz/albarakaturkbank');
const getDenizBankForex = require('./doviz/denizbank');
const getEnParaForex = require('./doviz/enpara');
const getGarantiBankForex = require('./doviz/garantibank');
const getHalkBankForex = require('./doviz/halkbank');
const getHSBCBankForex = require('./doviz/hsbcbank');
const getIngBankForex = require('./doviz/ingbank');
const getIsBankForex = require('./doviz/isbank');
const getKuveytTurkBankForex = require('./doviz/kuveytturkbank');
const getQNBFinansBankForex = require('./doviz/qnbfinansbank');
const getSekerBankForex = require('./doviz/sekerbank');
const getSeninBankanForex = require('./doviz/seninbankan');
const getTEBBankForex = require('./doviz/tebbank');
const getTurkiyeFinansBankForex = require('./doviz/turkiyefinansbank');
const getVakifBankForex = require('./doviz/vakifbank');
const getYapiKrediBankForex = require('./doviz/yapikredibank');
const getZiraatBankForex = require('./doviz/ziraatbank');
const archiveAll = require('./doviz/archive');

function Doviz() {
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

module.exports = Doviz;