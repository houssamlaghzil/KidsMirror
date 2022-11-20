//region apply css class to element
function elementApplyClass(element, className, shouldApply){
	try {
		element.applyClass(className, shouldApply)
	}catch (e) {
	}
}

HTMLElement.prototype.removeClass = function(className){
	this.classList.remove(className)
}
HTMLElement.prototype.addClass = function(className){
	this.classList.add(className)
}
HTMLElement.prototype.applyClass = function(className, shouldApply){
	if (shouldApply) {
		this.addClass(className)
	} else {
		this.removeClass(className)
	}
}
//endregion

function isNullOrUndefined(value){
	return value === undefined || value === null || value === "";
}

function getTimeFormatted(timeInSec){
	const mn = Math.floor(timeInSec / 60)
	const sec = timeInSec%60
	return (mn >0 ? mn.toString().padStart(2 , "0") + ":" : "") + sec.toString().padStart(2 , "0")
}

function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
