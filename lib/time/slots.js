const defaultConfig = require('../../config.json');

const getEpochTime = (time) => {
	if (time === undefined) {
		time = (new Date()).getTime();
	}
	let d = (this.hasOwnProperty('beginEpochTime') ? this.beginEpochTime() : beginEpochTime());
	let t = d.getTime();
	return Math.floor((time - t) / 1000);
};

const beginEpochTime = () => {
	let d = new Date(Date.UTC(1970, 0, 1, 0, 0, 0, 0));

	return d;
};

const getTime = (time) => {
	if(this.hasOwnProperty('getEpochTime'))
		return this.getEpochTime(time);
	else
		return getEpochTime(time);
};

const getRealTime = (epochTime) => {
	if (epochTime === undefined) {
		epochTime = (this.hasOwnProperty(getTime) ? this.getTime() : getTime());
	}
	let d = (this.hasOwnProperty('beginEpochTime') ? this.beginEpochTime() : beginEpochTime());
	let t = Math.floor(d.getTime() / 1000) * 1000;
	return t + epochTime * 1000;
};

const getSlotNumber = (epochTime)=>  {
	if (epochTime === undefined) {
		epochTime = (this.hasOwnProperty('getTime') ? this.getTime() : getTime());
	}

	let interval = this.interval || defaultConfig.interval;
	return Math.floor(epochTime / interval);
};

const getSlotTime = (slot) => {
	let interval = this.interval || defaultConfig.interval;
	return slot * interval;
};

const getNextSlot = () => {
	let slot = (this.hasOwnProperty('getSlotNumber') ? this.getSlotNumber() : getSlotNumber());

	return slot + 1;
};

const getLastSlot = (nextSlot) => {
	let delegates = this.delegates || defaultConfig.delegates;
	return nextSlot + delegates;
};

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
