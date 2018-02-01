const crypto = require('crypto');
const crypto_utils = require('../crypto.js');
const ECPair = require('../ecpair.js');
const ECSignature = require('../ecsignature.js');
const networks = require('../networks.js');
const bs58check = require('bs58check');
const defaultConfig = require('../../config.json');

if (typeof Buffer === 'undefined') {
	/* eslint-disable */
	Buffer = require('buffer/').Buffer;
	/* eslint-enable */
}

let ByteBuffer = require('bytebuffer');
let fixedPoint = Math.pow(10, 8);

const getSignatureBytes = (signature) => {
	let bb = new ByteBuffer(33, true);
	let publicKeyBuffer = new Buffer(signature.publicKey, 'hex');

	for (let i = 0; i < publicKeyBuffer.length; i++) {
		bb.writeByte(publicKeyBuffer[i]);
	}

	bb.flip();
	return new Uint8Array(bb.toArrayBuffer());
};

const getBytes = (transaction, skipSignature, skipSecondSignature) => {
	let assetSize = 0,
		assetBytes = null;

	switch (transaction.type) {
	case 1: // Signature
		assetBytes = (this.hasOwnProperty('getSignatureBytes') ? this.getSignatureBytes(transaction.asset.signature) : getSignatureBytes(transaction.asset.signature));
		assetSize = assetBytes.length;
		break;

	case 2: // Delegate
		assetBytes = new Buffer(transaction.asset.delegate.username, 'utf8');
		assetSize = assetBytes.length;
		break;

	case 3: // Vote
		if (transaction.asset.votes !== null) {
			assetBytes = new Buffer(transaction.asset.votes.join(''), 'utf8');
			assetSize = assetBytes.length;
		}
		break;

	case 4: { // Multi-Signature
		let keysgroupBuffer = new Buffer(transaction.asset.multisignature.keysgroup.join(''), 'utf8');
		let bb = new ByteBuffer(1 + 1 + keysgroupBuffer.length, true);

		bb.writeByte(transaction.asset.multisignature.min);
		bb.writeByte(transaction.asset.multisignature.lifetime);

		for (let i = 0; i < keysgroupBuffer.length; i++) {
			bb.writeByte(keysgroupBuffer[i]);
		}

		bb.flip();

		assetBytes = bb.toBuffer();
		assetSize  = assetBytes.length;
		break;
	}
	}

	if (transaction.requesterPublicKey) {
		assetSize += 33;
	}

	let bb = new ByteBuffer(1 + 4 + 32 + 8 + 8 + 21 + 64 + 64 + 64 + assetSize, true);
	bb.writeByte(transaction.type);
	bb.writeInt(transaction.timestamp);

	let senderPublicKeyBuffer = new Buffer(transaction.senderPublicKey, 'hex');
	for (let i = 0; i < senderPublicKeyBuffer.length; i++) {
		bb.writeByte(senderPublicKeyBuffer[i]);
	}

	if (transaction.requesterPublicKey) {
		let requesterPublicKey = new Buffer(transaction.requesterPublicKey, 'hex');

		for (let i = 0; i < requesterPublicKey.length; i++) {
			bb.writeByte(requesterPublicKey[i]);
		}
	}

	if (transaction.recipientId) {
		let recipient = bs58check.decode(transaction.recipientId);
		for (let i = 0; i < recipient.length; i++) {
			bb.writeByte(recipient[i]);
		}
	} else {
		for (let i = 0; i < 21; i++) {
			bb.writeByte(0);
		}
	}

	if (transaction.vendorField) {
		let vf = new Buffer(transaction.vendorField);
		let fillstart=vf.length;
		for (let i = 0; i < fillstart; i++) {
			bb.writeByte(vf[i]);
		}
		for (let i = fillstart; i < 64; i++) {
			bb.writeByte(0);
		}
	} else {
		for (let i = 0; i < 64; i++) {
			bb.writeByte(0);
		}
	}

	bb.writeLong(transaction.amount);

	bb.writeLong(transaction.fee);

	if (assetSize > 0) {
		for (let i = 0; i < assetSize; i++) {
			bb.writeByte(assetBytes[i]);
		}
	}

	if (!skipSignature && transaction.signature) {
		let signatureBuffer = new Buffer(transaction.signature, 'hex');
		for (let i = 0; i < signatureBuffer.length; i++) {
			bb.writeByte(signatureBuffer[i]);
		}
	}

	if (!skipSecondSignature && transaction.signSignature) {
		let signSignatureBuffer = new Buffer(transaction.signSignature, 'hex');
		for (let i = 0; i < signSignatureBuffer.length; i++) {
			bb.writeByte(signSignatureBuffer[i]);
		}
	}

	bb.flip();
	let arrayBuffer = new Uint8Array(bb.toArrayBuffer());
	let buffer = [];

	for (let i = 0; i < arrayBuffer.length; i++) {
		buffer[i] = arrayBuffer[i];
	}

	return new Buffer(buffer);
};

const getId = (transaction) => {
	let bytes = (this.hasOwnProperty('getBytes') ? this.getBytes(transaction) : getBytes(transaction));
	return crypto.createHash('sha256').update(bytes).digest().toString('hex');
};

const getHash = (transaction, skipSignature, skipSecondSignature) => {
	let bytes = (this.hasOwnProperty('getBytes') ?
		this.getBytes(transaction, skipSignature, skipSecondSignature) :
		getBytes(transaction, skipSignature, skipSecondSignature));
	return crypto.createHash('sha256').update(bytes).digest();
};

const getFee = (transaction) => {
	switch (transaction.type) {
	case 0: // Normal
		return 0.1 * fixedPoint;
	case 1: // Signature
		return 100 * fixedPoint;
	case 2: // Delegate
		return 10000 * fixedPoint;
	case 3: // Vote
		return 1 * fixedPoint;
	}
};

const sign = (transaction, keys) => {
	let hash = (this.hasOwnProperty('getHash') ? this.getHash(transaction, true, true) : getHash(transaction, true, true));

	let signature = keys.sign(hash).toDER().toString('hex');

	if (!transaction.signature) {
		transaction.signature = signature;
	}
	return signature;
};

const secondSign = (transaction, keys) => {
	let hash = (this.hasOwnProperty('getHash') ? this.getHash(transaction, false, true) : getHash(transaction, false, true));

	let signature = keys.sign(hash).toDER().toString('hex');

	if (!transaction.signSignature) {
		transaction.signSignature = signature;
	}
	return signature;
};

const verify = (transaction, network) => {
	network = network || networks.bpl;

	let hash = (this.hasOwnProperty('getHash') ? this.getHash(transaction, true, true) : getHash(transaction, false, true));

	let signatureBuffer = new Buffer(transaction.signature, 'hex');
	let senderPublicKeyBuffer = new Buffer(transaction.senderPublicKey, 'hex');
	let ecpair = ECPair.fromPublicKeyBuffer(senderPublicKeyBuffer, network);
	let ecsignature = ECSignature.fromDER(signatureBuffer);
	let res = ecpair.verify(hash, ecsignature);

	return res;
};

const verifySecondSignature = (transaction, publicKey, network) => {
	network = network || networks.bpl;

	let hash = (this.hasOwnProperty('getHash') ? this.getHash(transaction, false, true) : getHash(transaction, false, true));

	let signSignatureBuffer = new Buffer(transaction.signSignature, 'hex');
	let publicKeyBuffer = new Buffer(publicKey, 'hex');
	let ecpair = ECPair.fromPublicKeyBuffer(publicKeyBuffer, network);
	let ecsignature = ECSignature.fromDER(signSignatureBuffer);
	let res = ecpair.verify(hash, ecsignature);

	return res;
};

const getKeys = (secret, network) => {
	let ecpair = ECPair.fromSeed(secret, network || networks.bpl);

	ecpair.publicKey = ecpair.getPublicKeyBuffer().toString('hex');
	ecpair.privateKey = '';

	return ecpair;
};

const getAddress = (publicKey, version) => {
	console.log('BPLJS getAddress', publicKey,version,this.networkVersion,defaultConfig.networkVersion);
	let networkVersion = this.networkVersion || defaultConfig.networkVersion;
	if(!version){
		version = networkVersion;
		console.log('In if ',version);
	}
	let buffer = crypto_utils.ripemd160(new Buffer(publicKey,'hex'));

	let payload = new Buffer(21);
	payload.writeUInt8(version, 0);
	buffer.copy(payload, 1);

	return bs58check.encode(payload);
};

const setNetworkVersion = (version) => {
// todo *********************************
	defaultConfig.networkVersion = version;
	this.networkVersion = version;
};

const getNetworkVersion = () => {
	let networkVersion = this.networkVersion || defaultConfig.networkVersion;
	return networkVersion;
};

const validateAddress = (address, version) => {
	console.log('BPLJS validateAddress',this.networkVersion,defaultConfig.networkVersion);
	if(!version){
		let networkVersion = this.networkVersion || defaultConfig.networkVersion;
		console.log('BPLJS validateAddress if version is not passed',networkVersion,this.networkVersion,defaultConfig.networkVersion);
		version = networkVersion;
	}
	try {
		let decode = bs58check.decode(address);
		return decode[0] == version;
	} catch(e){
		return false;
	}
};

class CryptoClass {
	constructor(config) {
		this.networkVersion = config.networkVersion;
		this.getSignatureBytes = getSignatureBytes;
		this.getBytes = getBytes;
		this.getId = getId;
		this.getHash = getHash;
		this.getFee = getFee;
		this.sign = sign;
		this.secondSign = secondSign;
		this.verify = verify;
		this.verifySecondSignature = verifySecondSignature;
		this.getKeys = getKeys;
		this.getAddress = getAddress;
		this.setNetworkVersion = setNetworkVersion;
		this.getNetworkVersion = getNetworkVersion;
		this.validateAddress = validateAddress;
	}
}

module.exports = {
	getSignatureBytes,
	getBytes,
	getId,
	getHash,
	getFee,
	sign,
	secondSign,
	verify,
	verifySecondSignature,
	getKeys,
	getAddress,
	setNetworkVersion,
	getNetworkVersion,
	validateAddress,
	CryptoClass
};
