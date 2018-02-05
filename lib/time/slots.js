const defaultConfig = require('../../config.json');

function getEpochTime(time) {
	console.log("****************** getEpochTime ");
	if (time === undefined) {
		time = (new Date()).getTime();
	}
	let d = (this.hasOwnProperty('beginEpochTime') ? this.beginEpochTime() : beginEpochTime());
	let t = d.getTime();
	return Math.floor((time - t) / 1000);
}

function beginEpochTime() {
	console.log("****************** beginEpochTime ");
	let d = new Date(Date.UTC(1970, 0, 1, 0, 0, 0, 0));

	return d;
}

function getTime(time) {
	console.log("****************** getTime ");
	if(this.hasOwnProperty('getEpochTime'))
		return this.getEpochTime(time);
	else
		return getEpochTime(time);
}

function getRealTime(epochTime) {
	console.log("****************** getRealTime ");
	if (epochTime === undefined) {
		epochTime = (this.hasOwnProperty(getTime) ? this.getTime() : getTime());
	}
	let d = (this.hasOwnProperty('beginEpochTime') ? this.beginEpochTime() : beginEpochTime());
	let t = Math.floor(d.getTime() / 1000) * 1000;
	return t + epochTime * 1000;
}

function getSlotNumber(epochTime) {
	console.log("****************** getSlotNumber ");
	if (epochTime === undefined) {
		epochTime = (this.hasOwnProperty('getTime') ? this.getTime() : getTime());
	}

	let interval = this.interval || defaultConfig.interval;
	return Math.floor(epochTime / interval);
}

function getSlotTime(slot) {
	console.log("****************** getSlotTime ");
	let interval = this.interval || defaultConfig.interval;
	return slot * interval;
}

function getNextSlot() {
	console.log("****************** getNextSlot ");
	let slot = (this.hasOwnProperty('getSlotNumber') ? this.getSlotNumber() : getSlotNumber());

	return slot + 1;
}

function getLastSlot(nextSlot) {
	console.log("****************** getLastSlot ");
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
