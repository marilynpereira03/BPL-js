const defaultConfig = require('../../config.json');

function getEpochTime(time) {
	if (time === undefined) {
		time = (new Date()).getTime();
	}
	var d = this.beginEpochTime();
	var t = d.getTime();
	return Math.floor((time - t) / 1000);
}

function beginEpochTime() {
	var d = new Date(Date.UTC(1970, 0, 1, 0, 0, 0, 0));

	return d;
}

function getTime(time) {
	return this.getEpochTime(time);
}

function getRealTime(epochTime) {
	if (epochTime === undefined) {
		epochTime = this.getTime();
	}
	var d = this.beginEpochTime();
	var t = Math.floor(d.getTime() / 1000) * 1000;
	return t + epochTime * 1000;
}

function getSlotNumber(epochTime) {
	if (epochTime === undefined) {
		epochTime = this.getTime();
	}

	let interval = this.interval || defaultConfig.interval;
	return Math.floor(epochTime / interval);
}

function getSlotTime(slot) {
	let interval = this.interval || defaultConfig.interval;
	return slot * interval;
}

function getNextSlot() {
	var slot = this.getSlotNumber();

	return slot + 1;
}

function getLastSlot(nextSlot) {
	let delegates = this.delegates || defaultConfig.delegates;
	return nextSlot + delegates;
}

class SlotsClass {
	constructor(config) {
		this.interval = config.interval;
		this.delegates = config.delegates;
		this.getEpochTime = getEpochTime;
		this.beginEpochTime = beginEpochTime;
		this.getTime = getTime;
		this.getRealTime = getRealTime;
		this.getSlotNumber = getSlotNumber;
		this.getSlotTime = getSlotTime;
		this.getNextSlot = getNextSlot;
		this.getLastSlot = getLastSlot;
	}


}

module.exports = {
	getEpochTime,
	beginEpochTime,
	getTime,
	getRealTime,
	getSlotNumber,
	getSlotTime,
	getNextSlot,
	getLastSlot,
	SlotsClass
};
