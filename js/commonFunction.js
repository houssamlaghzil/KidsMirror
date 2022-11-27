//region apply css class to element
function elementApplyClass(element, className, shouldApply){
	try {
		element.applyClass(className, shouldApply)
	}catch (e) {
	}
}


HTMLElement.prototype.hasClass = function(className){
	return (new RegExp(className)).test(this.classList.value)
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

function handleOptions(options, field, defaultVal, ignoreEmptyField){
	if (!isNullOrUndefined(options) && !isNullOrUndefined(options[field])
		&& ( (!isNullOrUndefined(options[field])  || options[field]===false || options===0) || ignoreEmptyField)){
		return options[field];
	}
	else{
		return defaultVal;
	}
}

function HO(options, field, defaultVal=null, ignoreEmptyField=false){
	if (isNullOrUndefined(defaultVal)){
		defaultVal = null;
	}
	if (isNullOrUndefined(ignoreEmptyField)){
		ignoreEmptyField = false;
	}
	return handleOptions(options, field, defaultVal, ignoreEmptyField);
}

function getTimeFormatted(timeInSec, options={}){
	const mn = Math.floor(timeInSec / 60)
	const sec = timeInSec%60
	const displayUnit = HO(options, "displayTimeUnit", false)
	return (mn >0 ? mn.toString().padStart(2 , "0") + (displayUnit ? "mn" : ":") : "") + sec.toString().padStart(2 , "0") + (displayUnit && mn <=0? "s" : "")
}

function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}


//region animation
HTMLElement.prototype.animAppear = function(options={}){
	const duration = HO(options, "duration", 600)
	this.animate([{display:"none !important", opacity:"0"}, {display: "initial !important", opacity: "1"}], {duration:duration, iterations:1, fill:"forwards"})
	return duration
}
HTMLElement.prototype.animDisappear = function(options={}){
	const duration = HO(options, "duration", 600)
	this.animate([ {display: "initial !important", opacity: "1"}, {display:"none !important", opacity:"0"},], {duration:duration, iterations:1, fill:"forwards"})
	return duration
}
HTMLElement.prototype.animateShow = function (shouldDisplay){
	if(shouldDisplay){
		elementApplyClass(this, "hiddenItem", !shouldDisplay)
		this.animAppear()
	}
	else{
		const duration = this.animDisappear()
		setTimeout(function(){elementApplyClass(this, "hiddenItem", !shouldDisplay)}.bind(this),duration+10)
	}
}


HTMLElement.prototype.animTimer = function(){
	this.animate([{fontSize:"6em"}, {fontSize: "1em"}], {duration:600, iterations:1})
}

//endregion

HTMLAudioElement.prototype.stopIt = function(){
	this.pause()
	this.currentTime = 0
}
