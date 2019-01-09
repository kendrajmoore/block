import React, { Component } from "react";
import Blocks from "./Blocks";

class App extends Component {
  state = { walletInfo: {} };
  componentDidMount() {
    fetch("http://localhost:3000/api/wallet-info")
      .then(response => response.json())
      .then(json => this.setState({ walletInfo: json }));
  }
  render() {
    const { address, balance } = this.state.walletInfo;
    return (
      <div>
        Unicoins
        <div className="WalletInfo">
          <h1>Address: {address}</h1>
          <h1>Balance: {balance}</h1>
        </div>
        <br />
        <Blocks />
      </div>
    );
  }
}
export default App;