const Block = require("./block");
const cryptoHash = require("./crypto-hash");

//make blockchain
class Blockchain {
  constructor() {
    //first block
    this.chain = [Block.genesis()];
  }
  //additional blocks
  addBlock({ data }) {
    const newBlock = Block.mineBlock({
      lastBlock: this.chain[this.chain.length - 1],
      data
    });
    this.chain.push(newBlock);
  }
  //function to validate the blockchain
  static isValidChain(chain) {
    //verify that the first block matches
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
      return false;
    }
    for (let i = 1; i < chain.length; i++) {
      const { timestamp, lastHash, hash, nonce, difficulty, data } = chain[i];

      const actualLastHash = chain[i - 1].hash;

      if (lastHash !== actualLastHash) return false;

      const validatedHash = cryptoHash(
        timestamp,
        lastHash,
        data,
        nonce,
        difficulty
      );

      if (hash !== validatedHash) return false;
    }
    return true;
  }
}

module.exports = Blockchain;
