import React, { Component } from "react";
import ChivilcoinContract from "./contracts/Chivilcoin.json";
import getWeb3 from "./utils/getWeb3";
import truffleContract from "truffle-contract";

import "./App.css";

class App extends Component {
  state = { name: '', web3: null, accounts: null, contract: null };

  constructor(props)  {
    super(props);
    this.setAddress = this.setAddress.bind(this);
  }
  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const Contract = truffleContract(ChivilcoinContract);
      Contract.setProvider(web3.currentProvider);
      const instance = await Contract.deployed();

      // Get the value from the contract to prove it worked.
      const contractName = await instance.name();

      const address = accounts[0];
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({address,web3, accounts, contract: instance, contractName });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.log(error);
    }
  };

  setAddress = async (event) => {
    const address =  event.target.value;
    this.setState({address});
  }

  getBalance = async () => {
    const {accounts, contract } = this.state;

    contract.balanceOf(this.state.address).then((numberBalance) => {
      const balance = numberBalance.div(10000).toString();
      this.setState({balance});
    });
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <h2>{this.state.contractName} is ready to use</h2>
        <p>
          This is the amazing Chivilcoin. When the Argentine Peso falls into deep shit
          you'll still be able to use Chivilcoin and buy all the Chorizo secos you can eat.
        </p>
        <p>Check your balance, enter your address</p>
        <input type='text' onChange={ this.setAddress } value={this.state.address}/>
        <div>Your balance is: {this.state.balance}</div>
        <button onClick={this.getBalance}> Get balance </button>
      </div>
    );
  }
}

export default App;
