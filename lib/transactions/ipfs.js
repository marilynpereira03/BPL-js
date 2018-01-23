var Crypto = require('./crypto.js'),
	constants = require('../constants.js'),
	Slots = require('../time/slots.js');

class Ipfs {
	constructor(config) {
		this.crypto = new Crypto(config);
		this.slots = new Slots(config);
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
