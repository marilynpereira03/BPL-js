const Crypto = require('./crypto.js'),
	Constants = require('../constants.js'),
	Slots = require('../time/slots.js');
var JSONC = require('jsoncomp');

function createSidechain(secret, secondSecret, constants, config, genesis, network, prevTransactionId, status) {
	let crypto = this.crypto || Crypto;
	let slots = this.slots || Slots;
	let keys = crypto.getKeys(secret);
	genesis = JSONC.compress(genesis);

	let transaction = {
		type: 7,
		amount: 0,
		fee: Constants.fees.sidechain,
		recipientId: null,
		senderPublicKey: keys.publicKey,
		timestamp: slots.getTime(),
		asset:{
			sidechain: {
				constants: constants || null,
				config: config || null,
				genesis: genesis || null,
				network: network || null,
				prevTransactionId: prevTransactionId || null,
				status: status || null
			}
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

class SidechainClass {
	constructor(config) {
		this.crypto = new Crypto.CryptoClass(config);
		this.slots = new Slots.SlotsClass(config);
		this.createSidechain = createSidechain;
	}
}

module.exports = {
	createSidechain,
	SidechainClass
};
