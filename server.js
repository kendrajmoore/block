//start express server
const express = require("express");
const app = express();
//.env config
const dotenv = require("dotenv").config();
//for mongodb
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require("body-parser");
const request = require("request");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const morgan = require("morgan");
const isDevelopment = process.env.ENV === "development";
const User = require("./models/User");
const keys = require("./config/keys");
//redis instance
const REDIS_URL = isDevelopment
  ? "redis://127.0.0.1:6379"
  : "redis://h:p778fbc8e8cd557889a30b175f00a743dfd70b752af7d3f79dcb81c238fd4124d@ec2-3-81-188-41.compute-1.amazonaws.com:28699";
const DEFAULT_PORT = 3000;
const ROOT_NODE_ADDRESS = isDevelopment
  ? `http://localhost:${DEFAULT_PORT}`
  : `https://limitless-shelf-23870.herokuapp.com`;
//require blockchain
const Blockchain = require("./blockchain");
const PubSub = require("./app/pubsub");
const TransactionPool = require("./wallet/transaction-pool");
const Wallet = require("./wallet");
const TransactionMiner = require("./app/transaction-miner");

//create a new instance of blockchain,publisher/suscriber network, transcriber pool, wallet
const blockchain = new Blockchain();
const transactionPool = new TransactionPool();
const wallet = new Wallet();
const pubsub = new PubSub({ blockchain, transactionPool, redisUrl: REDIS_URL });
const transactionMiner = new TransactionMiner({
  blockchain,
  transactionPool,
  wallet,
  pubsub
});

//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
require("./config/passport")(passport);
app.use(passport.initialize());
app.use(express.static(path.join(__dirname, "client/dist")));
app.use(morgan("dev"));

// Mongodb Connection
const mongoUri =
  process.env.MONGODB_URI || "mongodb://localhost:27017/unicoins";
mongoose.connect(
  mongoUri,
  {
    useNewUrlParser: true
  }
);
//api for blockchain - will move in future
app.get("/api/blocks", (req, res) => {
  res.json(blockchain.chain);
});
//get some javascript blocks
app.get("/api/blocks/length", (req, res) => {
  res.json(blockchain.chain.length);
});

app.get("/api/blocks/:id", (req, res) => {
  const { id } = req.params;
  const { length } = blockchain.chain;

  const blocksReversed = blockchain.chain.slice().reverse();

  let startIndex = (id - 1) * 5;
  let endIndex = id * 5;

  startIndex = startIndex < length ? startIndex : length;
  endIndex = endIndex < length ? endIndex : length;

  res.json(blocksReversed.slice(startIndex, endIndex));
});
//ability to mine transaction
app.post("/api/mine", (req, res) => {
  const { data } = req.body;

  blockchain.addBlock({ data });

  pubsub.broadcastChain();

  res.redirect("/api/blocks");
});

app.post("/api/transact", (req, res) => {
  const { amount, recipient } = req.body;

  let transaction = transactionPool.existingTransaction({
    inputAddress: wallet.publicKey
  });

  try {
    if (transaction) {
      transaction.update({ senderWallet: wallet, recipient, amount });
    } else {
      transaction = wallet.createTransaction({
        recipient,
        amount,
        chain: blockchain.chain
      });
    }
  } catch (error) {
    return res.status(400).json({ type: "error", message: error.message });
  }

  transactionPool.setTransaction(transaction);

  pubsub.broadcastTransaction(transaction);

  res.json({ type: "success", transaction });
});

app.get("/api/transaction-pool-map", (req, res) => {
  res.json(transactionPool.transactionMap);
});

app.get("/api/mine-transactions", (req, res) => {
  transactionMiner.mineTransactions();

  res.redirect("/api/blocks");
});

//Users Route - will move in future

app.get("/api/users", (req, res) => {
  res.json({ type: "success", message: "Hi bitch" });
});

app.post("/api/signup", (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ Email: "Invalid" });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

//Login()
app.post("/api/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email }).then(user => {
    if (!user) {
      return res.status(404).json({ email: "User not found" });
    }
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        const payload = { id: user.id, name: user.name };
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        return res.status(400).json({ password: "Incorrect information" });
      }
    });
  });
});

app.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);

app.get("/api/wallet-info", (req, res) => {
  const address = wallet.publicKey;

  res.json({
    address,
    balance: Wallet.calculateBalance({ chain: blockchain.chain, address })
  });
});

app.get("/api/known-addresses", (req, res) => {
  const addressMap = {};

  for (let block of blockchain.chain) {
    for (let transaction of block.data) {
      const recipient = Object.keys(transaction.outputMap);

      recipient.forEach(recipient => (addressMap[recipient] = recipient));
    }
  }

  res.json(Object.keys(addressMap));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/dist/index.html"));
});

const syncWithRootState = () => {
  request(
    { url: `${ROOT_NODE_ADDRESS}/api/blocks` },
    (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const rootChain = JSON.parse(body);

        console.log("replace chain on a sync with", rootChain);
        blockchain.replaceChain(rootChain);
      }
    }
  );

  request(
    { url: `${ROOT_NODE_ADDRESS}/api/transaction-pool-map` },
    (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const rootTransactionPoolMap = JSON.parse(body);

        console.log(
          "replace transaction pool map on a sync with",
          rootTransactionPoolMap
        );
        transactionPool.setMap(rootTransactionPoolMap);
      }
    }
  );
};

if (isDevelopment) {
  const walletFoo = new Wallet();
  const walletBar = new Wallet();

  const generateWalletTransaction = ({ wallet, recipient, amount }) => {
    const transaction = wallet.createTransaction({
      recipient,
      amount,
      chain: blockchain.chain
    });

    transactionPool.setTransaction(transaction);
  };

  const walletAction = () =>
    generateWalletTransaction({
      wallet,
      recipient: walletFoo.publicKey,
      amount: 5
    });

  const walletFooAction = () =>
    generateWalletTransaction({
      wallet: walletFoo,
      recipient: walletBar.publicKey,
      amount: 10
    });

  const walletBarAction = () =>
    generateWalletTransaction({
      wallet: walletBar,
      recipient: wallet.publicKey,
      amount: 15
    });

  for (let i = 0; i < 20; i++) {
    if (i % 3 === 0) {
      walletAction();
      walletFooAction();
    } else if (i % 3 === 1) {
      walletAction();
      walletBarAction();
    } else {
      walletFooAction();
      walletBarAction();
    }

    transactionMiner.mineTransactions();
  }
}

let PEER_PORT;

if (process.env.GENERATE_PEER_PORT === "true") {
  PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

const PORT = process.env.PORT || PEER_PORT || DEFAULT_PORT;
app.listen(PORT, () => {
  console.log(`listening at localhost:${PORT}`);

  if (PORT !== DEFAULT_PORT) {
    syncWithRootState();
  }
});
