//start express server
const express = require("express");
const dotenv = require("dotenv").config();
//parse json
const bodyParser = require("body-parser");
//require blockchain
const Blockchain = require("./blockchain");
const PubSub = require("./pubsub");
const app = express();
const blockchain = new Blockchain();
const pubsub = new PubSub({ blockchain });

setTimeout(() => pubsub.broadcastChain(), 1000);
//middleware
app.use(bodyParser.json());

app.get("/api/blocks", (req, res) => {
  res.json(blockchain.chain);
});
//get some javascript blocks
app.post("/api/mine", (req, res) => {
  const { data } = req.body;

  blockchain.addBlock({ data });

  res.redirect("/api/blocks");
});

//port number
const DEFAULT_PORT = 3000;
let PEER_PORT;

if (process.env.GENERATE_PEER_PORT === "true") {
  PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}
console.log(process.env.GENERATE_PEER_PORT);

const PORT = PEER_PORT || DEFAULT_PORT;
console.log(PEER_PORT);
//start server
app.listen(PORT, () => {
  console.log(`blockchain server on ${PORT}`);
});
