const { IceteaWeb3 } = require("@iceteachain/web3");
const app = require('../../src/app');

const rpc = process.env.ICETEA_RPC || "https://rpc.icetea.io";
const tweb3 = new IceteaWeb3(rpc);

const CONTRACT = process.env.LOVELOCK_CONTRACT;

const contracts = {};

const getContract = (address = CONTRACT) => {
  if (!contracts[address]) {
    contracts[address] = tweb3.contract(address);
  }
  return contracts[address];
};

const getAliasContract = () => getContract("system.alias");

const ensureContract = () => {
  const contract = CONTRACT;
  if (contract.indexOf(".") < 0) return Promise.resolve(getContract(contract));
  return getAliasContract()
    .methods.resolve(contract)
    .call()
    .then((c) => {
      CONTRACT = c;
      const contractObject = tweb3.contract(c);
      contracts[contract] = contracts[c] = contractObject;
      return contractObject;
    });
};

const watchCreateLock = (contract, signal) => {
  const filter = {};
  return contract.events.allEvents(filter, async (error, result) => {
    if (signal && signal.cancel) return;
    if (error) {
      console.log("err", error);
    } else {
      const repsNew = result.filter(({ eventName }) => {
        return eventName === "createLock";
      });
      console.log("repsNew", repsNew);
      // add to db: data from repsNew
      const data = {};
      app.service('notification').create(data);
    }
  });
};

module.exports = () => {
  const signal = {};
  let sub;
  ensureContract().then((c) => {
    sub = watchCreateLock(c, signal);
  });

  return sub;
};
