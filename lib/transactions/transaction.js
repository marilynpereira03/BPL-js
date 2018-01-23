var Crypto = require('./crypto.js'),
	constants = require('../constants.js'),
	Slots = require('../time/slots.js');

class Transaction {
	constructor(config) {
		this.crypto = new Crypto(config);
		this.slots = new Slots(config);
	}

	createTransaction(recipientId, amount, vendorField, secret, secondSecret) {
		if(!this.crypto.validateAddress(recipientId)){
			throw new Error('Wrong recipientId');
		}
		var transaction = {
			type: 0,
			amount: amount,
			fee: constants.fees.send,
			recipientId: recipientId,
			timestamp: this.slots.getTime(),
			asset: {}
		};

		if(vendorField){
			transaction.vendorField=vendorField;
			if(transaction.vendorField.length > 64){
				return null;
			}
		}

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

module.exports = Transaction;
