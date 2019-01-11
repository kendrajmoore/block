//crypto package
const crypto = require("crypto");

const cryptoHash = (...inputs) => {
  //make the numerical block
  const hash = crypto.createHash("sha256");
  hash.update(
    inputs
      .map(input => JSON.stringify(input))
      .sort()
      .join(" ")
  );
  //make hash into hex code
  return hash.digest("hex");
};

module.exports = cryptoHash;
