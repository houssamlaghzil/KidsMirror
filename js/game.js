/**
 * Totally depends on Html elements and structure inside gameScreenEl and endOfGameScreenEl
 */
class Game {
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
		}
		//4 : marathon?
	}

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
	start(){
		this.setTimerElementValue(true)
		elementApplyClass(this.gameScreenEl, "hiddenItem", false)
		this.showEndGameScreen(true)
		elementApplyClass(this.centerDifficultyEl, "hiddenItem", false)
		elementApplyClass(this.centerEmotionEl, "hiddenItem", true)
		elementApplyClass(this.scoreProgressBarEl, "hiddenItem", true)
	}

	/**
	 * Init game parameter (Start chrono, define emotions to reproduce, show/hide required elements)
	 * Should be executed when the party will start, after selecting a difficulty
	 * @param difficultySelected
	 */
	launchGame(difficultySelected){
		if(isNullOrUndefined(difficultySelected)){ // case redo same party
			difficultySelected = this.difficulty
		}

		this.stopChrono()
		elementApplyClass(this.centerDifficultyEl, "hiddenItem", true)
		elementApplyClass(this.centerEmotionEl, "hiddenItem", false)
		elementApplyClass(this.scoreProgressBarEl, "hiddenItem", false)
		this.showEndGameScreen(true)

		this.emotionCount = -1
		this.difficulty = difficultySelected
		this._fillEmotions()
		this.nextEmotion()

		this.chrono = 40
		this.chronoId = setInterval(this.decrementChrono.bind(this), 1000)
		this.setTimerElementValue(false)
	}
	_fillEmotions(){
		const emotionKeys = Object.keys(emotionsObj)
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
	checkEmotion(emotion){
		if(emotion === this.emotionsTodo[this.emotionCount]){
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

	//region end of game
	endOfGame(){
		this.stopChrono()
		this.setTimerElementValue(true)

		this.endGameScoreEl.innerText = "" + this.emotionCount + "/" + this.emotionsTodo.length
		let msg = ""
		const ratio = this.emotionCount/this.emotionsTodo.length*100
		if(this.emotionCount>=this.emotionsTodo.length){
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
		this.endGameMsgEl.innerHTML = msg
		this.showEndGameScreen(false)
		//display end game screen
	}
	showEndGameScreen(shouldHide){
		elementApplyClass(this.endOfGameScreenEl, "hiddenItem", shouldHide)
		setTimeout(function(){elementApplyClass(this.endOfGameScreenEl, "opacity0", shouldHide)}.bind(this), 500)
	}

	/**
	 * use to quit game mode,
	 */
	quitGame(){
		elementApplyClass(this.gameScreenEl, "hiddenItem", true)
		elementApplyClass(this.endOfGameScreenEl, "hiddenItem", true)
		this.stopChrono()
	}
	//endregion

	//region chrono
	decrementChrono(){
		this.chrono --
		if(this.chrono%1===0){
			//simulate player good reproduction
			this.nextEmotion()
		}

		if(this.chrono<=5){
			//style and animate chrono, like final countdown from smashbros
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
		this.scoreProgressBarEl.children[0].innerText = "" + (this.emotionCount+1) + "/" +  this.emotionsTodo.length
		this.scoreProgressBarEl.children[0].style.width = "" + ((this.emotionCount+1)/this.emotionsTodo.length *100) + "%"
	}
	//endregion
}
