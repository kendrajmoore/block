//file creates publisher/subscriber network
const redis = require("redis");
//establish a channel
const CHANNELS = {
  //test to make sure I downloaded correctly
  TEST: "TEST",
  BLOCKCHAIN: "BLOCKCHAIN",
  TRANSACTION: "TRANSACTION"
};

class PubSub {
  //make the connection
  constructor({ blockchain, transactionPool, redisUrl }) {
    this.blockchain = blockchain;
    //records transaction
    this.transactionPool = transactionPool;
    //pubsub network
    this.publisher = redis.createClient(redisUrl);
    this.subscriber = redis.createClient(redisUrl);
    //can now receive messages on the channel
    this.subscribeToChannels();
    //people on channel receive information
    this.subscriber.on("message", (channel, message) =>
      this.handleMessage(channel, message)
    );
  }
  //log message received in terminal
  handleMessage(channel, message) {
    console.log(`Message received. Channel: ${channel}. Message: ${message}`);

    const parsedMessage = JSON.parse(message);
    //ability to purchase blockchain and then see transaction
    switch (channel) {
      case CHANNELS.BLOCKCHAIN:
        this.blockchain.replaceChain(parsedMessage, true, () => {
          this.transactionPool.clearBlockchainTransactions({
            chain: parsedMessage
          });
        });
        break;
      case CHANNELS.TRANSACTION:
        this.transactionPool.setTransaction(parsedMessage);
        break;
      default:
        return;
    }
  }
  //enter channel
  subscribeToChannels() {
    Object.values(CHANNELS).forEach(channel => {
      this.subscriber.subscribe(channel);
    });
  }
  //do not receive duplicate updates
  publish({ channel, message }) {
    this.subscriber.unsubscribe(channel, () => {
      this.publisher.publish(channel, message, () => {
        this.subscriber.subscribe(channel);
      });
    });
  }
  //send to everyone
  broadcastChain() {
    this.publish({
      channel: CHANNELS.BLOCKCHAIN,
      message: JSON.stringify(this.blockchain.chain)
    });
  }
  broadcastTransaction(transaction) {
    this.publish({
      channel: CHANNELS.TRANSACTION,
      message: JSON.stringify(transaction)
    });
  }
}

module.exports = PubSub;
