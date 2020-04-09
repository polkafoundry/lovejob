require('dotenv').config()

const { IceteaWeb3 } = require("@iceteachain/web3");
const rpc = process.env.ICETEA_RPC || "wss://rpc.icetea.io";
const tweb3 = new IceteaWeb3(rpc);
const { mysql } = require('../../../config/default.json')

const Sequelize = require("sequelize");

const sequelize = new Sequelize(mysql);

let CONTRACT = "teat1e75fgzzqfue8kfezlrvmpftpum2wxe0wqjgawn";

const contracts = {};

const getContract = (address = CONTRACT) => {
  if (!contracts[address]) {
    contracts[address] = tweb3.contract(address);
  }
  return contracts[address];
};

const getAliasContract = () => getContract("system.alias");

module.exports = {
  ensureContract: () => {
    const contract = CONTRACT;
    return getAliasContract()
      .methods.resolve(contract)
      .call()
      .then((c) => {
        // eslint-disable-next-line no-const-assign
        CONTRACT = c;
        const contractObject = tweb3.contract(c);
        contracts[contract] = contracts[c] = contractObject;
        return contractObject;
      });
  },

  insertDB: () => {
    // var insertQuery =
    //   "INSERT INTO `notification` (`app`,`sender`,`receiver`,`promise`,`event_name`,`created_at`) VALUES (?, ?, ?, ?, ?, ?)";
    // sequelize.query(insertQuery, {
    //   replacements: [2, 3, 4, 5, 6, 20200101],
    //   type: Sequelize.QueryTypes.UPDATE,
    // });
  },

  watchCreateLock: (contract) => {
    const filter = {};
    return contract.events.allEvents(filter, async (error, result) => {
      // if (signal && signal.cancel) return;
      if (error) {
        console.debug("err", error);
      } else {
        const repsNew = result.filter(({ eventName }) => {
          return eventName === "createLock";
        });
        console.debug("repsNew", repsNew);
        // insert data
        const data = {
          sender: repsNew[0].eventData.log.sender,
          receiver: repsNew[0].eventData.log.receiver,
          promise: repsNew[0].eventData.log.s_content,
          event_name: repsNew[0].eventName,
          created_at: repsNew[0].eventData.log.s_info.date,
        };
        // app.service("/notification")._create(data);
        // Create a new notification
        var insertQuery =
          "INSERT INTO `notification` (`app`,`sender`,`receiver`,`promise`,`event_name`,`created_at`) VALUES (?, ?, ?, ?, ?, ?)";
        if (repsNew.length > 0) {
          sequelize.query(insertQuery, {
            replacements: [
              "lovelock",
              repsNew[0].eventData.log.sender,
              repsNew[0].eventData.log.receiver,
              repsNew[0].eventData.log.s_content,
              repsNew[0].eventName,
              new Date(Number(repsNew[0].eventData.log.s_info.date)),
            ],
            type: Sequelize.QueryTypes.INSERT,
          });
        }
      }
    });
  },
};
