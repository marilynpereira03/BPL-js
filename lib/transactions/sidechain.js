const Crypto = require('./crypto.js'),
constants = require('../constants.js'),
Slots = require('../time/slots.js');
var JSONC = require('jsoncomp');

function createSidechain(secret, activeDelegates, blockTime, milestones, type, tokenShortName, secondSecret,offset,distance,totalAmount,fixedLastReward,genesis,status,seedPeers,nethash) {
	let crypto = this.crypto || Crypto;
	let slots = this.slots || Slots;
	let keys = crypto.getKeys(secret);
	genesis = JSONC.compress( genesis );
	let transaction = {
		type: 7,
		amount: 0,
		fee: constants.fees.sidechain,
		recipientId: null,
		senderPublicKey: keys.publicKey,
		timestamp: slots.getTime(),
		asset: {
		  constants:{
				blockTime: blockTime || null,
				activeDelegates: activeDelegates || null,
				rewards: {
				    type: type || null,
				    fixedLastReward: fixedLastReward || null,
				    milestones: milestones || null,
				    offset: offset || null,
				    distance: distance || null
				  },
				totalAmount: totalAmount || null
			},
			config:
			{
				peersList: seedPeers || null,
				nethash: nethash || null,
				tokenShortName: tokenShortName || null
			},
			genesis: genesis || null,
			networks: networks || null,
			status: status || null
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
