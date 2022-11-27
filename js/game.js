/**
 * Totally depends on Html elements and structure inside gameScreenEl and endOfGameScreenEl
 *
 * lots of actions like start game, select difficulty or quit should be executed thanks to a vocal command.
 * But for now, we use only
 */
class Game {
	MAX_CHRONO = 40
	EXCLUDE_NEUTRAL = true
	SIMULATION_COUNTDOWN = -1 // in secondes

	chrono = 0
	emotionsTodo = []
	emotionCount = -1
	difficulty = 1
	difficultyObj = {
		1:{ //easy
			"nbToDo":5
		},
		2:{ // medium
			"nbToDo":7
		},
		3:{ // hard
			"nbToDo":9
		},
		4:{ //marathon
			"nbToDo":this.MAX_CHRONO*3
		}
	}
	isMarathonMode = false

	constructor(gameScreenEl, endOfGameScreenEl) {
		this.gameScreenEl = gameScreenEl
		this.endOfGameScreenEl = endOfGameScreenEl

		this.timerEl = this.gameScreenEl.querySelector("#timer")
		this.centerEmotionEl = this.gameScreenEl.querySelector("#centerGameEmotion")
		this.centerDifficultyEl = this.gameScreenEl.querySelector("#centerGameDifficulty")
		this.scoreProgressBarEl = this.gameScreenEl.querySelector("#scoreProgressBar")

		this.endGameScoreEl = this.endOfGameScreenEl.querySelector("#endGameScore")
		this.endGameMsgEl = this.endOfGameScreenEl.querySelector("#endGameMsg")
	}


	//region init game
	/**
	 * display game screen, hide all element that should not been visible
	 */
	start(){
		this.setTimerElementValue(true)
		this.gameScreenEl.animateShow(true);
		elementApplyClass(this.centerDifficultyEl, "hiddenItem", false)

		this.endOfGameScreenEl.animateShow(false)
		elementApplyClass(this.centerEmotionEl, "hiddenItem", true)
		elementApplyClass(this.scoreProgressBarEl, "hiddenItem", true)
	}

	/**
	 * Init game parameter (Start chrono, define emotions to reproduce, show/hide required elements)
	 * Should be executed when the party will start, after having select a difficulty
	 * @param difficultySelected
	 */
	launchGame(difficultySelected){
		if(isNullOrUndefined(difficultySelected)){ // case redo same party
			difficultySelected = this.difficulty
		}

		this.difficulty = difficultySelected
		this.isMarathonMode = this.difficulty === 4
		if(this.isMarathonMode){
			this.scoreProgressBarEl.children[0].style.width = "100%"
		}

		this.stopChrono()
		elementApplyClass(this.centerDifficultyEl, "hiddenItem", true)
		elementApplyClass(this.centerEmotionEl, "hiddenItem", false)
		elementApplyClass(this.scoreProgressBarEl, "hiddenItem", false)
		this.endOfGameScreenEl.animateShow(false)

		this.emotionCount = -1
		this._fillEmotions()
		this.nextEmotion()

		this.chrono = this.MAX_CHRONO
		this.chronoId = setInterval(this.decrementChrono.bind(this), 1000)
		this.setTimerElementValue(false)
	}
	_fillEmotions(){
		const emotionsObjCopy = {... emotionsObj}
		if(this.EXCLUDE_NEUTRAL){
			delete emotionsObjCopy[3]
		}

		const emotionKeys = Object.keys(emotionsObjCopy)
		this.emotionsTodo = []
		for (let i=0; this.emotionsTodo.length<this.difficultyObj[this.difficulty].nbToDo; i++){
			const newEmotion = emotionKeys[randomInt(0, emotionKeys.length-1)]
			if(newEmotion !== this.emotionsTodo[this.emotionsTodo.length-1]){
				this.emotionsTodo.push(newEmotion);
			}
		}
		console.log("emotions to do =", this.emotionsTodo)
	}
	//endregion

	/**
	 * should be called when user do a new emotion
	 * @param emotion
	 */
	checkEmotion(emotion){
		console.log("CHECK EMOTION", emotion, this.emotionsTodo[this.emotionCount])
		if(emotion == this.emotionsTodo[this.emotionCount]){
			this.nextEmotion()
		}
	}

	nextEmotion(){
		this.emotionCount++
		if(this.emotionCount>=this.emotionsTodo.length){
			this.endOfGame()
		}
		else{
			this.showEmotionToDo()
			this.updateProgressBar()
		}
	}



	showEmotionToDo(){
		this.centerEmotionEl.children[0].style = "background-image: url('" + emotionsObj[this.emotionsTodo[this.emotionCount]].img + "');background-position: center;\n" +
			"  background-repeat: no-repeat;\n" +
			"  background-size: cover;"
	}
	showUserEmotion(emotion){
		this.centerEmotionEl.children[1].style = "background-image: url('" + emotion.img + "');background-position: center;\n" +
			"  background-repeat: no-repeat;\n" +
			"  background-size: cover;"
	}

	//region end of game
	endOfGame(){
		this.stopChrono()
		this.setTimerElementValue(true)
		let msg = ""

		this.endGameScoreEl.innerText = "" + this.emotionCount + (this.isMarathonMode ? " en " + getTimeFormatted(this.MAX_CHRONO) :  "/" + this.emotionsTodo.length)
		const ratio = (this.isMarathonMode ? this.emotionCount / this.MAX_CHRONO : this.emotionCount / this.emotionsTodo.length) * 100

		//region messages depending on ratio
		if(ratio>=100){
			msg = "Tu as fait un score parfait. Bravo !"
		}
		else if(ratio>=70){
			msg = "Tu as fait un beau score. Bravo !"
		}
		else if(ratio>=40){
			msg = "Tu peux encore progressé.<br> Continue sur cette voie là"
		}
		else{
			msg = "On dirait que tu ne me maîtrises pas encore très bien.<br>N'hésite pas à demander de l'aide"
		}
		//endregion

		this.endGameMsgEl.innerHTML = msg
		this.endOfGameScreenEl.animateShow(true)
		//display end game screen
	}

	/**
	 * use to quit game mode,
	 */
	quitGame(){
		if(this.endOfGameScreenEl.hasClass("hiddenItem")){
			this.gameScreenEl.animateShow(false)
		}
		else{
			elementApplyClass(this.gameScreenEl, "hiddenItem", true)
			this.endOfGameScreenEl.animateShow(false)
		}
		this.stopChrono()
	}
	//endregion

	//region chrono
	decrementChrono(){
		this.chrono --
		if(this.SIMULATION_COUNTDOWN>0 && this.chrono % this.SIMULATION_COUNTDOWN === 0){
			//simulate player success to do an emotion
			this.nextEmotion()
		}

		if(this.chrono<=5){
			this.timerEl.animTimer()
		}

		if(this.chrono<=0){
			this.endOfGame()
		}
		this.setTimerElementValue(false)
	}
	stopChrono(){
		try{
			clearInterval(this.chronoId)
		}catch (e){
		}
	}
	setTimerElementValue(isReset){
		this.timerEl.innerText = isReset ? "" : getTimeFormatted(this.chrono)
	}
	//endregion

	//region score
	updateProgressBar(){
		if(this.isMarathonMode){
			this.scoreProgressBarEl.children[0].innerText = "" + (this.emotionCount+1)
		}
		else{
			this.scoreProgressBarEl.children[0].innerText = "" + (this.emotionCount+1) + "/" +  this.emotionsTodo.length
			this.scoreProgressBarEl.children[0].style.width = "" + ((this.emotionCount+1)/this.emotionsTodo.length *100) + "%"
		}
	}
	//endregion
}
