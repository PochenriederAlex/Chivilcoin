import React, { Component } from "react";
import ChivilcoinContract from "./contracts/Chivilcoin.json";
import getWeb3 from "./utils/getWeb3";
import truffleContract from "truffle-contract";

import "./App.css";

class App extends Component {
  state = {events:[], name: '', web3: null, accounts: null, contract: null };

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
      const accounts = {};
      const address = "ADDRESS";

      // Get the contract instance.
      const Contract = truffleContract(ChivilcoinContract);
      Contract.setProvider(web3.currentProvider);
      const instance = await Contract.deployed();

      // Get contract name
      const contractName = ''; //Get contract Name


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

  addEvent = async(event)=> {
    const events = this.state.events.concat(event);
    this.setState({events});
  }

  setReceiver = async (event) => {
    const receiver =  event.target.value;
    this.setState({receiver});
  }

  getBalance = async () => {

  }

  sendChivilcoin = async () => {
    const {contract, receiver, address, amount } = this.state;

  }

  updatePrice = async () => {
    const {contract, receiver, address, amount } = this.state;
  }

  render() {
    const {events} = this.state;
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
          <div className='btcPricePanel'>
            <div> BTC price: {this.state.btcPrice}</div>
            <button onClick={this.updatePrice}> Update </button>
          </div>
          <p>Your address: {this.state.address}</p>
          <div>Your CHV balance: {this.state.balance}</div>
          <div>Your ETH balance: {this.state.ethBalance}</div>
        </div>
        <div className='sendPanel'>
          <div className='sendInputs'>
            <h3>Receiver</h3>
            <input type='text' onChange={this.setReceiver} value={this.state.receiver}/>
            <h3>Amount</h3>
            <input type='number' onChange={ this.setAmount } value={this.state.amount}/>
            <button onClick={this.sendChivilcoin}> Send </button>
          </div>
        </div>
        <div className='txHistoryPanel'>
            <h1>Tx History</h1>
            {
                events.map(function(event) {
                  return (
                    <li>
                      <a>{`${event.args.value} Chivilcoin sent from ${event.args.from} to ${event.args.to}`}</a>
                    </li>
                  );
                })
            }
          </div>
      </div>
    );
  }
}

export default App;
