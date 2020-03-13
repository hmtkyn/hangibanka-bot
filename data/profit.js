const cron = require('node-cron');
const getAlbarakaTurk = require('./profit/albarakaturk');
const getEmlakKatilim = require('./profit/emlakkatilim');
const getKuveytTurk = require('./profit/kuveytturk');
const getSeninBankan = require('./profit/seninbankan');
const getTurkiyeFinans = require('./profit/turkiyefinans');
const getVakifKatilim = require('./profit/vakifkatilim');
const getZiraatKatilim = require('./profit/ziraatkatilim');
const archiveProfit = require('./profit/archive');

/* function Profit() {
  cron.schedule('0 9,12,13,17 * * *', () => {
    return (
      console.log('==========>') +
      getAlbarakaTurk() +
      getEmlakKatilim() +
      getKuveytTurk() +
      getSeninBankan() +
      getTurkiyeFinans() +
      getVakifKatilim() +
      getZiraatKatilim()
    )
  }, { scheduled: true, timezone: "Europe/Istanbul" });
  cron.schedule('0 18 * * *', () => {
    return (console.log('==========>') + archiveProfit())
  }, { scheduled: true, timezone: "Europe/Istanbul" });
}

module.exports = Profit; */

function Profit() {
  cron.schedule('* * * * *', () => {
    return (
      console.log('==========>') +
      getAlbarakaTurk() +
      getEmlakKatilim() +
      getKuveytTurk() +
      getSeninBankan() +
      getTurkiyeFinans() +
      getVakifKatilim() +
      getZiraatKatilim()
    )
  }, { scheduled: true, timezone: "Europe/Istanbul" });
  cron.schedule('* * * * *', () => {
    return (console.log('==========>') + archiveProfit())
  }, { scheduled: true, timezone: "Europe/Istanbul" });
}

module.exports = Profit;