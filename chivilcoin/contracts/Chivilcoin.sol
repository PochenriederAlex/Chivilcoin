pragma solidity ^0.4.24;

import '../node_modules/openzeppelin-solidity/contracts/access/Whitelist.sol';
import '../node_modules/openzeppelin-solidity/contracts/token/ERC20/BasicToken.sol';

// This is just a simple example of a coin-like contract.
// It is not standards compatible and cannot be expected to talk to other
// coin/token contracts. If you want to create a standards-compliant
// token, see: https://github.com/ConsenSys/Tokens. Cheers!

contract Chivilcoin is Whitelist, BasicToken {
	uint80 internal feeNumerator = 2;
	uint80 internal feeDenominator = 10;
	uint256 internal MIN_VALUE = 100;

	string public name = "Chivilcoin";
	string public symbol = "CHV";
	uint8 public decimals = 4;

	constructor() Ownable() public {
		totalSupply_ = 100000000000;
		balances[msg.sender] = totalSupply_;
	}

	function transfer(address _to, uint256 _value) onlyIfWhitelisted(msg.sender) withMin(_value) onlyIfWhitelisted(_to) public returns (bool) {
		uint256 valueWithoutFee = sendFee(_value);
		BasicToken.transfer(_to, valueWithoutFee);
	}

	function sendFee(uint256 _value) internal returns(uint256) {
		require(_value <= balances[msg.sender]);

		uint256 fee = _value.mul(feeNumerator).div(feeDenominator);
		uint256 valueWithoutFee = _value.sub(fee);

		balances[msg.sender] = balances[msg.sender].sub(_value);
	  balances[owner] = balances[owner].add(_value);

		//BasicToken.transfer(owner,fee);
		return valueWithoutFee;
	}

  /**
   * @dev Throws if operator is not whitelisted.
   * @param _value address
   */
  modifier withMin(uint256 _value) {
    require(_value >= MIN_VALUE,"Muy pocos chivilcoins, ratón!");
    _;
  }

  function kill() onlyOwner() public {
    selfdestruct(owner);
  }

	//Fallback
	function() external payable{
	}
}
