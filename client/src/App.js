import React, { Component } from "react";
import ChivilcoinContract from "./contracts/Chivilcoin.json";
import getWeb3 from "./utils/getWeb3";
import truffleContract from "truffle-contract";

import "./App.css";

class App extends Component {
  state = { name: '', web3: null, accounts: null, contract: null };

  constructor(props)  {
    super(props);

    this.setAmount = this.setAmount.bind(this);
    this.setReceiver = this.setReceiver.bind(this);
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
      this.setState({address,web3, accounts, contract: instance, contractName } , ()=> this.getBalance());
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.log(error);
    }
  };

  setAmount = async (event) => {
    const amount =  event.target.value;
    this.setState({amount});
  }


  setReceiver = async (event) => {
    const receiver =  event.target.value;
    this.setState({receiver});
  }

  getBalance = async () => {
    const {address, contract } = this.state;

    contract.balanceOf(address).then((numberBalance) => {
      const balance = numberBalance.div(10000).toString();
      this.setState({balance});
    });
  }

  sendChivilcoin = async () => {
    const {contract, receiver, amount } = this.state;

    contract.transfer(receiver, amount);
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <div className="title">
          <h1>{this.state.contractName}</h1>
        </div>
        <div className="subtitle">
          <p>
            This is the amazing Chivilcoin. When the Argentine Peso falls into deep shit
            you'll still be able to use Chivilcoin to buy all the Chorizo seco you can eat.
          </p>
        </div>
        <div>
          <p>Your address: {this.state.address}</p>
          <div>Your balance: {this.state.balance}</div>
        </div>
        <div className='sendPanel'>
          <div className='sendInputs'>
            <h3>Receiver</h3>
            <input type='text' onChange={ this.setReceiver } value={this.state.receiver}/>
            <h3>Amount</h3>
            <input type='number' onChange={ this.setAmount } value={this.state.amount}/>
            <button onClick={this.sendChivilcoin}> Send </button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
