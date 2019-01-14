//navbar needs updating
import React, { Component } from "react";
import { Link } from "react-router-dom";

class Navbar extends Component {
  render() {
    return (
      <nav className="navbar fixed-top navbar-expand-lg navbar-dark bg-dark">
        <Link className="navbar-brand" to="/">
          Unicoins
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav">
            <li className="nav-item active">
              <Link className="nav-link" to="/">
                Home <span className="sr-only">(current)</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/wallet">
                Wallet
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/blocks">
                Chain
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/conduct-transaction">
                Purchase
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/transaction-pool">
                Updates
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

export default Navbar;
