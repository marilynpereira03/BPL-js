var Buffer = require('buffer/').Buffer;
var should = require('should');
var bpl = require('../../index.js');

describe('vote.js', function () {

	var vote = bpl.vote;

	it('should be ok', function () {
		(vote).should.be.ok;
	});

	it('should be object', function () {
		(vote).should.be.type('object');
	});

	it('should have createVote property', function () {
		(vote).should.have.property('createVote');
	});

	describe('#createVote', function () {
		var createVote = vote.createVote,
			vt = null,
			publicKey = bpl.crypto.getKeys('secret').publicKey,
			publicKeys = ['+' + publicKey];

		it('should be ok', function () {
			(createVote).should.be.ok;
		});

		it('should be function', function () {
			(createVote).should.be.type('function');
		});

		it('should create vote', function () {
			vt = createVote('secret', publicKeys, 'second secret');
		});

		describe('returned vote', function () {
			it('should be ok', function () {
				(vt).should.be.ok;
			});

			it('should be object', function () {
				(vt).should.be.type('object');
			});

			it('should have recipientId string equal to sender', function () {
				(vt).should.have.property('recipientId').and.be.type('string').and.equal(bpl.crypto.getAddress(publicKey));
			});

			it('should have amount number equal to 0', function () {
				(vt).should.have.property('amount').and.be.type('number').and.equal(0);
			});

			it('should have type number equal to 3', function () {
				(vt).should.have.property('type').and.be.type('number').and.equal(3);
			});

			it('should have timestamp number', function () {
				(vt).should.have.property('timestamp').and.be.type('number');
			});

			it('should have senderPublicKey hex string equal to sender public key', function () {
				(vt).should.have.property('senderPublicKey').and.be.type('string').and.match(function () {
					try {
						new Buffer(vt.senderPublicKey, 'hex');
					} catch (e) {
						return false;
					}

					return true;
				}).and.equal(publicKey);
			});

			it('should have signature hex string', function () {
				(vt).should.have.property('signature').and.be.type('string').and.match(function () {
					try {
						new Buffer(vt.signature, 'hex');
					} catch (e) {
						return false;
					}

					return true;
				});
			});

			it('should have second signature hex string', function () {
				(vt).should.have.property('signSignature').and.be.type('string').and.match(function () {
					try {
						new Buffer(vt.signSignature, 'hex');
					} catch (e) {
						return false;
					}

					return true;
				});
			});

			it('should be signed correctly', function () {
				var result = bpl.crypto.verify(vt);
				(result).should.be.ok;
			});

			it('should be second signed correctly', function () {
				var result = bpl.crypto.verifySecondSignature(vt, bpl.crypto.getKeys('second secret').publicKey);
				(result).should.be.ok;
			});

			it('should not be signed correctly now', function () {
				vt.amount = 100;
				var result = bpl.crypto.verify(vt);
				(result).should.be.not.ok;
			});

			it('should not be second signed correctly now', function () {
				vt.amount = 100;
				var result = bpl.crypto.verifySecondSignature(vt, bpl.crypto.getKeys('second secret').publicKey);
				(result).should.be.not.ok;
			});

			it('should have asset', function () {
				(vt).should.have.property('asset').and.not.empty;
			});

			describe('vote asset', function () {
				it('should be ok', function () {
					(vt.asset).should.have.property('votes').and.be.ok;
				});

				it('should be object', function () {
					(vt.asset.votes).should.be.type('object');
				});

				it('should be not empty', function () {
					(vt.asset.votes).should.be.not.empty;
				});

				it('should contains one element', function () {
					(vt.asset.votes.length).should.be.equal(1);
				});

				it('should have public keys in hex', function () {
					vt.asset.votes.forEach(function (v) {
						(v).should.be.type('string').startWith('+').and.match(function () {
							try {
								new Buffer(v.substring(1, v.length), 'hex');
							} catch (e) {
								return false;
							}

							return true;
						});
					});
				});

				it('should be equal to sender public key', function () {
					var v = vt.asset.votes[0];
					(v.substring(1, v.length)).should.be.equal(publicKey);
				});
			});
		});
	});

});
