/*var crypto = require("./crypto.js"),
    constants = require("../constants.js"),
    slots = require("../time/slots.js");

function signTransaction(trs, secret) {
	var keys = crypto.getKeys(secret);
	var signature = crypto.sign(trs, keys);

	return signature;
}

function createMultisignature(secret, secondSecret, keysgroup, lifetime, min) {
	var keys = crypto.getKeys(secret);

	var transaction = {
		type: 4,
		amount: 0,
		fee: constants.fees.multisignature,
		recipientId: null,
		senderPublicKey: keys.publicKey,
		timestamp: slots.getTime(),
		asset: {
			multisignature: {
				min: min,
				lifetime: lifetime,
				keysgroup: keysgroup
			}
		}
	};

	crypto.sign(transaction, keys);

	if (secondSecret) {
		var secondKeys = crypto.getKeys(secondSecret);
		crypto.secondSign(transaction, secondKeys);
	}

	transaction.id = crypto.getId(transaction);
	return transaction;
}

module.exports = {
	createMultisignature : createMultisignature,
	signTransaction: signTransaction
}*/

var Crypto = require("./crypto.js"),
    constants = require("../constants.js"),
    Slots = require("../time/slots.js");

class MultiSignature {
  constructor(config) {
    this.crypto = new Crypto(config);
    this.slots = new Slots(config);
  }

  signTransaction(trs, secret) {
  	var keys = this.crypto.getKeys(secret);
  	var signature = this.crypto.sign(trs, keys);

  	return signature;
  }

  createMultisignature(secret, secondSecret, keysgroup, lifetime, min) {
  	var keys = this.crypto.getKeys(secret);

  	var transaction = {
  		type: 4,
  		amount: 0,
  		fee: constants.fees.multisignature,
  		recipientId: null,
  		senderPublicKey: keys.publicKey,
  		timestamp: this.slots.getTime(),
  		asset: {
  			multisignature: {
  				min: min,
  				lifetime: lifetime,
  				keysgroup: keysgroup
  			}
  		}
  	};

  	this.crypto.sign(transaction, keys);

  	if (secondSecret) {
  		var secondKeys = this.crypto.getKeys(secondSecret);
  		this.crypto.secondSign(transaction, secondKeys);
  	}

  	transaction.id = this.crypto.getId(transaction);
  	return transaction;
  }
}


module.exports = MultiSignature;
