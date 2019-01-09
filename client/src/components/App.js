import React, { Component } from "react";
import { Link } from "react-router-dom";

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
        <br />
        <div>
          <Link to="/blocks">Blocks</Link>
          <Link to="/conduct-transaction">Conduct Transaction</Link>
        </div>
        <br />
        <div className="WalletInfo">
          <h1>Address: {address}</h1>
          <h1>Balance: {balance}</h1>
        </div>
      </div>
    );
  }
}
export default App;
