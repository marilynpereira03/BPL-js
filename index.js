var Crypto = require('./lib/transactions/crypto.js');
var Delegate = require('./lib/transactions/delegate.js');
var Signature = require('./lib/transactions/signature.js');
var Transaction = require('./lib/transactions/transaction.js');
var Vote = require('./lib/transactions/vote.js');
var Ipfs = require('./lib/transactions/ipfs.js');
var Networks = require('./lib/networks.js');
var Slots = require('./lib/time/slots.js');
var ECPair = require('./lib/ecpair.js');
var HDNode = require('./lib/hdnode.js');
var ECSignature = require('./lib/ecsignature.js');

//default config for BPL
var defaultConfig = require('./config.json');

class Bpl {
	constructor(config = {}) {
		var finalConfig = {
			interval: config.interval || defaultConfig.interval,
			delegates: config.delegates || defaultConfig.delegates,
			networkVersion: config.networkVersion || defaultConfig.networkVersion
		};

		this.crypto = new Crypto(finalConfig);
		this.delegate = new Delegate(finalConfig);
		this.signature = new Signature(finalConfig);
		this.transaction = new Transaction(finalConfig);
		this.vote = new Vote(finalConfig);
		this.ipfs = new Ipfs(finalConfig);
		this.networks = Networks;
		this.slots = new Slots(finalConfig);
		this.ECPair = ECPair;
		this.HDNode = HDNode;
		this.ECSignature = ECSignature;
	}
}

module.exports = Bpl;
