/*function getEpochTime(time) {
	if (time === undefined) {
		time = (new Date()).getTime();
	}
	var d = beginEpochTime();
	var t = d.getTime();
	return Math.floor((time - t) / 1000);
}

function beginEpochTime() {
	var d = new Date(Date.UTC(1970, 0, 1, 0, 0, 0, 0))

	return d;
}

var interval = 8,
    delegates = 51;

function getTime(time) {
	return getEpochTime(time);
}

function getRealTime(epochTime) {
	if (epochTime === undefined) {
		epochTime = getTime()
	}
	var d = beginEpochTime();
	var t = Math.floor(d.getTime() / 1000) * 1000;
	return t + epochTime * 1000;
}

function getSlotNumber(epochTime) {
	if (epochTime === undefined) {
		epochTime = getTime()
	}

	return Math.floor(epochTime / interval);
}

function getSlotTime(slot) {
	return slot * interval;
}

function getNextSlot() {
	var slot = getSlotNumber();

	return slot + 1;
}

function getLastSlot(nextSlot) {
	return nextSlot + delegates;
}

module.exports = {
	interval: interval,
	delegates: delegates,
	getTime: getTime,
	getRealTime: getRealTime,
	getSlotNumber: getSlotNumber,
	getSlotTime: getSlotTime,
	getNextSlot: getNextSlot,
	getLastSlot: getLastSlot
}*/

class Slots {
	// setConfig (config) {
	// 	this.interval = config.interval;
	// 	this.delegates = config.delegates;
	// }
	constructor(config) {
			this.interval = config.interval;
			this.delegates = config.delegates;
	}

	getEpochTime(time) {
		if (time === undefined) {
			time = (new Date()).getTime();
		}
		var d = this.beginEpochTime();
		var t = d.getTime();
		return Math.floor((time - t) / 1000);
	}

	beginEpochTime() {
		var d = new Date(Date.UTC(1970, 0, 1, 0, 0, 0, 0))

		return d;
	}

	getTime(time) {
		return this.getEpochTime(time);
	}

	getRealTime(epochTime) {
		if (epochTime === undefined) {
			epochTime = this.getTime()
		}
		var d = this.beginEpochTime();
		var t = Math.floor(d.getTime() / 1000) * 1000;
		return t + epochTime * 1000;
	}

	getSlotNumber(epochTime) {
		if (epochTime === undefined) {
			epochTime = this.getTime()
		}

		return Math.floor(epochTime / this.interval);
	}

	getSlotTime(slot) {
		return slot * this.interval;
	}

	getNextSlot() {
		var slot = this.getSlotNumber();

		return slot + 1;
	}

	getLastSlot(nextSlot) {
		return nextSlot + this.delegates;
	}
}

module.exports = Slots;
