/*var crypto = require("./crypto.js"),
    constants = require("../constants.js"),
    slots = require("../time/slots.js");

function createHashRegistration(ipfshash, secret, secondSecret) {
	var transaction = {
		type: 5,
    amount:0,
		fee: constants.fees.send,
		timestamp: slots.getTime(),
		asset: {}
	};

  transaction.vendorField=ipfshash;

	var keys = crypto.getKeys(secret);
	transaction.senderPublicKey = keys.publicKey;

	crypto.sign(transaction, keys);

	if (secondSecret) {
		var secondKeys = crypto.getKeys(secondSecret);
		crypto.secondSign(transaction, secondKeys);
	}

	transaction.id = crypto.getId(transaction);
	return transaction;
}

module.exports = {
	createHashRegistration: createHashRegistration
}*/
var Crypto = require("./crypto.js"),
    constants = require("../constants.js"),
    Slots = require("../time/slots.js");

class Ipfs {
  constructor() {
    this.crypto = new Crypto();
    this.slots = new Slots();
  }

  createHashRegistration(ipfshash, secret, secondSecret) {
  	var transaction = {
  		type: 5,
      amount:0,
  		fee: constants.fees.send,
  		timestamp: this.slots.getTime(),
  		asset: {}
  	};

    transaction.vendorField=ipfshash;

  	var keys = this.crypto.getKeys(secret);
  	transaction.senderPublicKey = keys.publicKey;

  	this.crypto.sign(transaction, keys);

  	if (secondSecret) {
  		var secondKeys = this.crypto.getKeys(secondSecret);
  		this.crypto.secondSign(transaction, secondKeys);
  	}

  	transaction.id = this.crypto.getId(transaction);
  	return transaction;
  }
}

module.exports = Ipfs;
