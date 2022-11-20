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

	constructor(timerEl, scoreProgressBarEl,gameScreenEl, centerScreenEmotion, centerScreenDifficulty) {
		this.timerElement = timerEl
		this.gameScreen = gameScreenEl
		this.centerEmotionEl = centerScreenEmotion
		this.centerDifficulty = centerScreenDifficulty
		this.scoreProgressBar = scoreProgressBarEl
	}

	//region init game
	start(){
		this.timerElement.innerText = ""
		elementApplyClass(this.gameScreen, "hiddenItem", false)
		elementApplyClass(this.centerDifficulty, "hiddenItem", false)
		elementApplyClass(this.centerEmotionEl, "hiddenItem", true)
	}
	launchGame(difficultySelected){
		this.stopChrono()
		elementApplyClass(this.centerDifficulty, "hiddenItem", true)
		elementApplyClass(this.centerEmotionEl, "hiddenItem", false)

		this.emotionCount = -1
		this.difficulty = difficultySelected
		this._fillEmotions()
		this.nextEmotion()

		this.chrono = 40
		this.chronoId = setInterval(this.decrementChrono.bind(this), 1000)
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

	stopGame(){
		elementApplyClass(this.gameScreen, "hiddenItem", true)
		this.stopChrono()
	}

	showEmotionToDo(){
		this.centerEmotionEl.children[0].style = "background-image: url('" + emotionsObj[this.emotionsTodo[this.emotionCount]].img + "');background-position: center;\n" +
			"  background-repeat: no-repeat;\n" +
			"  background-size: cover;"
	}

	endOfGame(){
		this.stopChrono()
		if(this.emotionCount>=this.emotionsTodo.length){
			console.log("tu as fait un score parfait")
		}
		else{
			console.log("pas mal ")
		}
		//display end game screen
	}

	//region chrono
	decrementChrono(){
		this.chrono --
		if(this.chrono%5===0){
			//simulate player good reproduction
			this.nextEmotion()
		}

		if(this.chrono<=5){
			//style and animate chrono, like final countdown from smashbros
		}

		if(this.chrono<=0){
			this.endOfGame()
		}
		this.setTimerValue()
	}
	stopChrono(){
		try{
			clearInterval(this.chronoId)
		}catch (e){
		}
	}
	setTimerValue(){
		this.timerElement.innerText = getTimeFormatted(this.chrono)
	}
	//endregion

	//region score
	updateProgressBar(){
		this.scoreProgressBar.children[0].innerText = "" + (this.emotionCount+1) + "/" +  this.emotionsTodo.length
		this.scoreProgressBar.children[0].style.width = "" + ((this.emotionCount+1)/this.emotionsTodo.length *100) + "%"
	}
	//endregion
}
