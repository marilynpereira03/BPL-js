/*var crypto = require("./crypto.js"),
    constants = require("../constants.js"),
    slots = require("../time/slots.js");

function createVote(secret, delegates, secondSecret) {
	var keys = crypto.getKeys(secret);

	var transaction = {
		type: 3,
		amount: 0,
		fee: constants.fees.vote,
		recipientId: crypto.getAddress(keys.publicKey),
		senderPublicKey: keys.publicKey,
		timestamp: slots.getTime(),
		asset: {
			votes: delegates
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
	createVote: createVote
}*/

var Crypto = require("./crypto.js"),
    constants = require("../constants.js"),
    Slots = require("../time/slots.js");

class Vote {
  constructor(config) {
    this.crypto = new Crypto(config);
    this.slots = new Slots(config);
  }

  createVote(secret, delegates, secondSecret) {
  	var keys = this.crypto.getKeys(secret);

  	var transaction = {
  		type: 3,
  		amount: 0,
  		fee: constants.fees.vote,
  		recipientId: this.crypto.getAddress(keys.publicKey),
  		senderPublicKey: keys.publicKey,
  		timestamp: this.slots.getTime(),
  		asset: {
  			votes: delegates
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

module.exports = Vote;
