const Crypto = require('./crypto.js'),
constants = require('../constants.js'),
Slots = require('../time/slots.js');

function createSidechain(secret, hash, delegate, blockTime, reward, rewardType, tokenShortName, secondSecret,offset,distance,totalAmount,fixedLastReward) {
	let crypto = this.crypto || Crypto;
	let slots = this.slots || Slots;
	let keys = crypto.getKeys(secret);

	let transaction = {
		type: 7,
		amount: 0,
		fee: constants.fees.sidechain,
		recipientId: null,
		senderPublicKey: keys.publicKey,
		timestamp: slots.getTime(),
		asset: {
			hash: hash || null,
			config:
			{
				blockTime: blockTime || null,
				delegate: delegate || null,
				distance: distance || null,
				fixedLastReward: fixedLastReward,
				reward: reward || null,
				rewardType: rewardType || null,
				tokenShortName: tokenShortName || null,
				offset: offset || null,
				totalAmount: totalAmount || null,
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

