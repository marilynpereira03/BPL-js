var Crypto = require('./crypto.js'),
	constants = require('../constants.js'),
	Slots = require('../time/slots.js');

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
