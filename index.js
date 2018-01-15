/*bpl = {
	crypto : require("./lib/transactions/crypto.js"),
	delegate : require("./lib/transactions/delegate.js"),
	signature : require("./lib/transactions/signature.js"),
	transaction : require("./lib/transactions/transaction.js"),
	vote : require("./lib/transactions/vote.js"),
	ipfs : require("./lib/transactions/ipfs.js"),
	networks : require("./lib/networks.js"),
	slots : require("./lib/time/slots.js"),
	ECPair : require("./lib/ecpair.js"),
	HDNode : require("./lib/hdnode.js"),
	ECSignature : require("./lib/ecsignature.js"),
}

// extra aliases for bitcoinlib-js compatibility
var libCrypto = require('./lib/crypto.js')
for (var method in libCrypto) {
	bpl.crypto[method] = libCrypto[method]
}

module.exports = bpl;*/

let Crypto = require("./lib/transactions/crypto.js");
let Delegate = require("./lib/transactions/delegate.js");
let Signature = require("./lib/transactions/signature.js");
let Transaction = require("./lib/transactions/transaction.js");
let Vote = require("./lib/transactions/vote.js");
let Ipfs = require("./lib/transactions/ipfs.js");
let Networks = require("./lib/networks.js");
let Slots = require("./lib/time/slots.js");
let ECPair = require("./lib/ecpair.js");
let HDNode = require("./lib/hdnode.js");
let ECSignature = require("./lib/ecsignature.js");

class Bpl {
  constructor(config) {
		//default config for wbx
    let defaultConfig = {
      interval: 15,
      delegates: 4,
			networkVersion: 73
    };

    let finalConfig = {
      interval: config.interval || defaultConfig.interval,
      delegates: config.delegates || defaultConfig.delegates,
			networkVersion: config.networkVersion || defaultConfig.networkVersion
    };

		this.crypto = new Crypto();
		this.delegate = new Delegate();
		this.signature = new Signature();
		this.transaction = new Transaction();
		this.vote = new Vote();
		this.ipfs = new Ipfs();
		this.networks = new Networks();
    this.slots = new Slots();
		this.ECPair = new ECPair();
		this.HDNode = new HDNode();
		this.ECSignature = new ECSignature();

    this.slots.setConfig(finalConfig);
		this.crypto.setConfig(finalConfig);
  }

//TODO
	// extra aliases for bitcoinlib-js compatibility
	// var libCrypto = require('./lib/crypto.js')
	// for (var method in libCrypto) {
	// 	bpl.crypto[method] = libCrypto[method]
	// }
}

module.exports = Bpl;
