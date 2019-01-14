//purchase individual blocks
import React, { Component } from "react";
import { Button } from "react-bootstrap";
import Transaction from "./Transaction";
import blue from "../assets/blue.png";

class Block extends Component {
  state = { displayTransaction: false };

  toggleTransaction = () => {
    this.setState({ displayTransaction: !this.state.displayTransaction });
  };

  get displayTransaction() {
    const { data } = this.props.block;

    const stringifiedData = JSON.stringify(data);

    const dataDisplay =
      stringifiedData.length > 35
        ? `${stringifiedData.substring(0, 35)}...`
        : stringifiedData;


    if (this.state.displayTransaction) {
      return (
        <div>
          {data.map(transaction => (
            <div key={tranaction.id}>
              <hr />
              <Transaction transaction={transaction} />
            </div>
          ))}
          <br />
          <Button
            bsStyle="danger"
            bsSize="small"
            onClick={this.toggleTransaction}
          >
            Show Less
          </Button>
        </div>
      );
    }

    return (
      <div>
        <div>Data: {dataDisplay}</div>
      </div>
    );
  }

  render() {
    //console.log("this.displayTransaction", this.displayTransaction);
    const { timestamp, hash, image  } = this.props.block;

    const hashDisplay = `${hash.substring(0, 15)}...`;

    return (
      <div className="Block">
        <div>Hash: {hashDisplay} </div>
        <div>Timestamp: {new Date(timestamp).toLocaleString()} </div>
        {this.displayTransaction}
        <div> <img className="card" src={blue} alt="Logo" />;</div>
      </div>
    );
  }
}

export default Block;
