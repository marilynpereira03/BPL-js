var Crypto = require('./crypto.js'),
	constants = require('../constants.js'),
	Slots = require('../time/slots.js');

class Delegate {
	constructor(config) {
		this.crypto = new Crypto(config);
		this.slots = new Slots(config);
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
