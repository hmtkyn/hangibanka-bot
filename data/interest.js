const cron = require('node-cron');
const getAkBank = require('./interest/akbank');
const getDenizBank = require('./interest/denizbank');
const getEnPara = require('./interest/enpara');
const getGarantiBank = require('./interest/garantibank');
const getHalkBank = require('./interest/halkbank');
const getINGBank = require('./interest/ingbank');
const getIsBank = require('./interest/isbank');
const getQNBFinansBank = require('./interest/qnbfinansbank');
const getSekerBank = require('./interest/sekerbank');
const getTEBBank = require('./interest/tebbank');
const getVakifBank = require('./interest/vakifbank');
const getYapiKrediBank = require('./interest/yapikredibank');
const getZiraatBank = require('./interest/ziraatbank');
const archiveInterest = require('./interest/archive');

function Interest() {
  cron.schedule('* * * * *', () => {
    return (
      console.log('==========>') +
      getAkBank() +
      getDenizBank() +
      getEnPara() +
      getGarantiBank() +
      getHalkBank() +
      getINGBank() +
      getIsBank() +
      getQNBFinansBank() +
      getSekerBank() +
      getTEBBank() +
      getVakifBank() +
      getYapiKrediBank() +
      getZiraatBank()
    )
  }, { scheduled: true, timezone: "Europe/Istanbul" });
  cron.schedule('0 18 * * *', () => {
    return (console.log('==========>') + archiveInterest())
  }, { scheduled: true, timezone: "Europe/Istanbul" });
}

module.exports = Interest;