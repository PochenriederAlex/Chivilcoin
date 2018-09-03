const Chivilcoin = artifacts.require("./Chivilcoin.sol");
const {assertRevert} = require("openzeppelin-solidity/test/helpers/assertRevert");

contract('Chivilcoin', function(accounts) {
  it("should put 100000 Chivilcoin in the first account", function() {
    return Chivilcoin.deployed().then(function(instance) {
      return instance.balanceOf(accounts[0]);
    }).then(function(balance) {
      assert.equal(balance.valueOf(), 100000, "100000 wasn't in the first account");
    });
  });
  it("should send coin correctly", function() {
    var chivil;

    // Get initial balances of first and second account.
    var account_one = accounts[0];
    var account_two = accounts[1];

    var account_one_starting_balance;
    var account_two_starting_balance;
    var account_one_ending_balance;
    var account_two_ending_balance;

    var amount = 130;

    return Chivilcoin.deployed().then(function(instance) {
      chivil = instance;
      chivil.addAddressToWhitelist(account_one);
      chivil.addAddressToWhitelist(account_two);

      return chivil.balanceOf(account_one);
    }).then(function(balance) {
      account_one_starting_balance = balance.toNumber();
      return chivil.balanceOf(account_two);
    }).then(function(balance) {
      account_two_starting_balance = balance.toNumber();
      return chivil.transfer(account_two, amount, {from: account_one});
    }).then(function() {
      return chivil.balanceOf(account_one);
    }).then(function(balance) {
      account_one_ending_balance = balance.toNumber();
      return chivil.balanceOf(account_two);
    }).then(function(balance) {
      account_two_ending_balance = balance.toNumber();

      assert.equal(account_one_ending_balance, account_one_starting_balance - amount* 0.8, "Amount wasn't correctly taken from the sender");
      assert.equal(account_two_ending_balance, account_two_starting_balance + amount* 0.8, "Amount wasn't correctly sent to the receiver");
    });
  });
  it("should reject transfer for min amount", function() {
    return Chivilcoin.deployed().then(async (instance) => {
      instance.addAddressToWhitelist(accounts[0]);
      instance.addAddressToWhitelist(accounts[1]);
      const promise = instance.transfer(accounts[1], 30);
      await assertRevert(promise);
    });
  });
  it("should reject transfer for sender non whitelisted", function() {
    return Chivilcoin.deployed().then(async (instance) => {
      instance.addAddressToWhitelist(accounts[1]);
      const promise = instance.transfer(accounts[1], 30);
      await assertRevert(promise);
    });
  });
  it("should reject transfer for receiver non whitelisted", function() {
    return Chivilcoin.deployed().then(async (instance) => {
      instance.addAddressToWhitelist(accounts[0]);
      const promise = instance.transfer(accounts[1], 30, {from:accounts[0]});
      await assertRevert(promise);
    });
  });
  it("should reject eth transfer", function() {
    return Chivilcoin.deployed().then(async (instance) => {
      const promise = instance.sendTransaction({
        from: accounts[0],
        value: 1
      });
      await assertRevert(promise);
    });
  });
});
