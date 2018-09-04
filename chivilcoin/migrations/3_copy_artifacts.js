const fs = require('fs-extra');

var Chivilcoin = artifacts.require("./Chivilcoin.sol");

module.exports = function(deployer) {

  const build_path = './build/contracts';
  const new_path = '../client/src/contracts';

  fs.remove(new_path, err => {
    if (err) return console.error(err)

    console.log('Folder remove success!')
  })

  fs.move(build_path, new_path, err => {
    if(err) return console.error(err);
    console.log('Copy success!');
  });
};
