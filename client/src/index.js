import React from "react";
import { render } from "react-dom";
import { Router, Switch, Route } from "react-router-dom";
import history from "./history";
import App from "./components/App";
import Blocks from "./components/Blocks";
import ConductTransaction from "./components/ConductTransaction";
import TransactionPool from "./components/TransactionPool";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Landing from "./components/Landing";
import Login from "./components/Login";
import Signup from "./components/Signup";

render(
  <Router history={history}>
    <div>
      <Navbar />
      <Route exact path="/" component={Landing} />
      <Route exact path="/wallet" component={App} />
      <Route path="/blocks" component={Blocks} />
      <Route path="/conduct-transaction" component={ConductTransaction} />
      <Route path="/transaction-pool" component={TransactionPool} />
      <Route path="/login" component={Login} />
      // <Route path="/signup" component={Signup} />
      <Footer />
    </div>
  </Router>,
  document.getElementById("root")
);
