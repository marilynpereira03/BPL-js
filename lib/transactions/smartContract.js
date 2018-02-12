const Crypto = require('./crypto.js'),
constants = require('../constants.js'),
Slots = require('../time/slots.js');

function createSmartContract(secret, hash, secondSecret) {
	let crypto = this.crypto || Crypto;
	let slots = this.slots || Slots;
	let keys = crypto.getKeys(secret);

	let transaction = {
		type: 5,
		amount: 0,
		fee: constants.fees.smartContract,
		recipientId: null,
		timestamp: slots.getTime(),
		asset: {
			hash: hash || null
		}
	};

	crypto.sign(transaction, keys);

	if (secondSecret) {
		let secondKeys = crypto.getKeys(secondSecret);
		crypto.secondSign(transaction, secondKeys);
	}

	transaction.id = crypto.getId(transaction);
	return transaction;
}

class SmartContractClass {
	constructor(config) {
		this.crypto = new Crypto.CryptoClass(config);
		this.slots = new Slots.SlotsClass(config);
		this.createSmartContract = createSmartContract;
	}
}

module.exports = {
	createSmartContract,
	SmartContractClass
};
