const HDWalletProvider = require("truffle-hdwallet-provider");
const mnemonic = "lab direct float merit wall huge wheat loyal maple cup battle butter";
const fullPathBuildDirectory = `${__dirname}/build/contracts`;

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  contracts_build_directory: fullPathBuildDirectory,
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  },
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: 5777,
      gas: 6721975,
      gasPrice: 20000000000,
    },
    ropsten: {
      provider: new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/2663eb5039be4b6d919460ca08e0e26c"),
      network_id: 3,
      gas: 4600000
    },
    rinkeby: {
      provider: new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/v3/2663eb5039be4b6d919460ca08e0e26c"),
      network_id: 4
    }
  }
};
