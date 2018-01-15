/*var crypto = require("./crypto.js"),
    constants = require("../constants.js"),
    slots = require("../time/slots.js");

function createDelegate(secret, username, secondSecret) {
	var keys = crypto.getKeys(secret);

	var transaction = {
		type: 2,
		amount: 0,
		fee: constants.fees.delegate,
		recipientId: null,
		senderPublicKey: keys.publicKey,
		timestamp: slots.getTime(),
		asset: {
			delegate: {
				username: username,
				publicKey: keys.publicKey
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
	createDelegate : createDelegate
}
*/
var Crypto = require("./crypto.js"),
    constants = require("../constants.js"),
    Slots = require("../time/slots.js");

class Delegate {
  constructor() {
    this.crypto = new Crypto();
    this.slots = new Slots();
  }

  createDelegate(secret, username, secondSecret) {
  	var keys = this.crypto.getKeys(secret);

  	var transaction = {
  		type: 2,
  		amount: 0,
  		fee: constants.fees.delegate,
  		recipientId: null,
  		senderPublicKey: keys.publicKey,
  		timestamp: this.slots.getTime(),
  		asset: {
  			delegate: {
  				username: username,
  				publicKey: keys.publicKey
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

module.exports = Delegate;
