const Crypto = require('./crypto.js'),
	constants = require('../constants.js'),
	Slots = require('../time/slots.js');

function createContract(secret, contract, secondSecret) {
	let crypto = this.crypto || Crypto;
	let slots = this.slots || Slots;
	let keys = crypto.getKeys(secret);

	let transaction = {
		type: 6,
		amount: 0,
		fee: constants.fees.contract,
		recipientId: null,
		senderPublicKey: keys.publicKey,
		timestamp: slots.getTime(),
		asset: {
			contract: contract || null
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

class ContractClass {
	constructor(config) {
		this.crypto = new Crypto.CryptoClass(config);
		this.slots = new Slots.SlotsClass(config);
		this.createContract = createContract;
	}
}

module.exports = {
	createContract,
	ContractClass
};
