//wallet page
import React, { Component } from "react";
import { Link } from "react-router-dom";

class App extends Component {
  state = { walletInfo: {} };
  componentDidMount() {
    fetch(`${document.location.origin}/api/wallet-info`)
      .then(response => response.json())
      .then(json => this.setState({ walletInfo: json }));
  }
  render() {
    const { address, balance } = this.state.walletInfo;
    return (
      <div>
        <div className="WalletInfo">
          <h1>Address: {address}</h1>
          <h1>Balance: {balance}</h1>
        </div>
        <div className="fix-footer" />
      </div>
    );
  }
}
export default App;
