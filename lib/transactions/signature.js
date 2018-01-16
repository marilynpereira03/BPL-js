/*var crypto = require("./crypto.js"),
    constants = require("../constants.js"),
    slots = require("../time/slots.js");

function newSignature(secondSecret) {
	var keys = crypto.getKeys(secondSecret);

	var signature = {
		publicKey: keys.publicKey
	};

	return signature;
}

function createSignature(secret, secondSecret) {
	var keys = crypto.getKeys(secret);

	var signature = newSignature(secondSecret);
	var transaction = {
		type: 1,
		amount: 0,
		fee: constants.fees.secondsignature,
		recipientId: null,
		senderPublicKey: keys.publicKey,
		timestamp: slots.getTime(),
		asset: {
			signature: signature
		}
	};

	crypto.sign(transaction, keys);
	transaction.id = crypto.getId(transaction);

	return transaction;
}

module.exports = {
	createSignature: createSignature
}*/

var Crypto = require("./crypto.js"),
    constants = require("../constants.js"),
    Slots = require("../time/slots.js");

class Signature {
  constructor(config) {
    this.crypto = new Crypto(config);
    this.slots = new Slots(config);
  }

  newSignature(secondSecret) {
  	var keys = this.crypto.getKeys(secondSecret);

  	var signature = {
  		publicKey: keys.publicKey
  	};

  	return signature;
  }

  createSignature(secret, secondSecret) {
  	var keys = this.crypto.getKeys(secret);

  	var signature = this.newSignature(secondSecret);
  	var transaction = {
  		type: 1,
  		amount: 0,
  		fee: constants.fees.secondsignature,
  		recipientId: null,
  		senderPublicKey: keys.publicKey,
  		timestamp: this.slots.getTime(),
  		asset: {
  			signature: signature
  		}
  	};

  	this.crypto.sign(transaction, keys);
  	transaction.id = this.crypto.getId(transaction);

  	return transaction;
  }
}

module.exports = Signature;
