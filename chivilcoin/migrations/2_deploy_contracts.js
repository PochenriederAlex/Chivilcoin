var Chivilcoin = artifacts.require("./Chivilcoin.sol");

module.exports = function(deployer) {
  deployer.deploy(Chivilcoin);
};
