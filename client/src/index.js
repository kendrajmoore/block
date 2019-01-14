//all my components, packages, and assets
import React from "react";
import { render } from "react-dom";
import { Provider } from 'react-redux';
import {  BrowserRouter } from "react-router-dom";
import { Router, Route } from "react-router-dom";
import { createStore } from 'redux';
import history from "./history";
import App from "./components/App";
import Blocks from "./components/Blocks";
import ConductTransaction from "./components/ConductTransaction";
import TransactionPool from "./components/TransactionPool";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Landing from "./components/Landing";


render(
  //help with back button
  <Router history={history}>
    <div>
      <Navbar />
      <Route exact path="/" component={Landing} />
      <Route exact path="/wallet" component={App} />
      <Route path="/blocks" component={Blocks} />
      <Route path="/conduct-transaction" component={ConductTransaction} />
      <Route path="/transaction-pool" component={TransactionPool} />
      <Footer />
    </div>
    </Router>,
  document.getElementById("root")
);
