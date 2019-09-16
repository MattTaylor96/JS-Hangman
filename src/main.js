const WORD_LIST = ["Cat", "Hello", "Bacon", "Testing", "Foundation", "Heart", "Purpose", "Simple", "Sliding", "Javascript", "Monkey", "Amazing",
"Pancake", "Cohort", "Concatenate", "Iteration", "Index", "Code", "React", "Python"];
const GAME_CONTAINER = document.getElementById("game-container");
const SETTINGS_CONTAINER = document.getElementById("game-settings");
const GAME_AREA = document.getElementById("current-state");
const GAME_INFO = document.getElementById("game-info");
const PREVIOUS_GUESSES = document.getElementById("previous-guesses");
const SUBMIT_BTN = document.getElementById("submit-guess");
const USER_INPUT = document.getElementById("user-guess");
const CONFIRM_CONFIG_BTN = document.getElementById("confirm-settings");
const USER_DIFFICULTY = document.getElementById("difficulty");
const MAX_WORD_LENGTH = document.getElementById("word-length");

// Current state of the game 
let gameState = {
	word: "",
	lives: 0,
	wordDisplay: [],
	currentGuesses: [],
	inPlay: true
};

function launchGame(){
	// Pick new word and set difficulty
	gameState.word = chooseRandomWord(MAX_WORD_LENGTH.value).toLowerCase()
	switch(USER_DIFFICULTY.value){
		case "E":
			gameState.lives = 7;
			break;
		case "M":
			gameState.lives = 5;
			break;
		case "H":
			gameState.lives = 3;
			break;
		default:
			alert("Invalid Input. Please enter 'E', 'M' or 'H'");
			break;
	}
	// Initialise Display
	for(let i = 0; i < gameState.word.length; i++){
		gameState.wordDisplay.push("_");
	}
	// Manipulate DOM
	SETTINGS_CONTAINER.classList.add("hidden");
	GAME_CONTAINER.classList.remove("hidden");
	GAME_AREA.innerHTML = `<p class="game-info">Word with ${gameState.word.length} letters has been chosen:</p><br>
		<p id="game-word">${gameState.wordDisplay.join(" ")}</p><br>
		<p class="game-info">You Have ${gameState.lives} lives left.</p>`
}

let userGuess = (guess) => {
	// Take user input
	guess = USER_INPUT.value.toLowerCase();
	USER_INPUT.value = "";
	// Validate guess & Display in DOM
	let regex = /[a-z]/i;
	if(guess.length > 1){
		GAME_INFO.innerHTML = `<p class="game-info">Too Many Letters Entered. Please refine your guess.</p>`;
		return;
	} else if(guess.length < 1){
		GAME_INFO.innerHTML = `<p class="game-info">Too Few Letters Entered. Please refine your guess.</p>`;
		return;
	} else if(regex.test(guess) != true){
		GAME_INFO.innerHTML = `<p class="game-info">Invalid Character Entered. Please enter a valid letter (A-Z).</p>`;
		return;
	}else if(gameState.currentGuesses.indexOf(guess) != -1){
		GAME_INFO.innerHTML = `<p class="game-info">Letter already used, please choose a new letter.</p>`;
		return;
	}
	// Check input for matching letter
	if(gameState.word.indexOf(guess) != -1){
		// If correct replace each correct instance of "_"
		for(let i = 0; i < gameState.word.length; i++){
			if(guess.toLowerCase() == gameState.word[i]){
				gameState.wordDisplay[i] = guess;
			}
		}
		GAME_INFO.innerHTML = `<p class="game-info">Correct Guess!</p>`;
	} else{
		gameState.lives--;
		GAME_INFO.innerHTML = `<p class="game-info">Incorrect Guess!</p>`;
	}
	// Add to previous guesses
	gameState.currentGuesses.push(guess);
	// Display the results of the guess (1 = Win, -1 = Lose)
	if(gameState.wordDisplay.indexOf("_") === -1){
		gameResult(1);
	} else if(gameState.lives <= 0){
		gameResult(-1);
	}else{
		// Not yet decided
		userDisplay();
	}
}

let userDisplay = () => {
	// Display the interface in the DOM
	gameState.wordDisplay[0] = gameState.wordDisplay[0].toUpperCase();
	GAME_AREA.innerHTML = `<p class="game-info" id="game-word">${gameState.wordDisplay.join(" ")}</p>`;
	PREVIOUS_GUESSES.innerHTML = `<p class="game-info">Previous Guesses:</p>
		<p class="game-info">${gameState.currentGuesses.join(" | ")}</p>
		<p class="game-info">You have ${gameState.lives} lives left.</p>`;
}

let gameResult = (outcome) => {
	switch (outcome){
		// Win
		case 1:
			gameState.inPlay = false;
			userDisplay();
			GAME_AREA.innerHTML = `<p class="game-info">Game Won! You guessed "${gameState.word}" in ${gameState.currentGuesses.length} 
				turns.</p>`;
			SUBMIT_BTN.disabled = true;
			GAME_INFO.innerHTML = "";
			break;
		// Lose
		case -1:
			gameState.inPlay = false;
			userDisplay();
			GAME_AREA.innerHTML = `<p class="game-info">Game Lost, you've run out of lives! The word was "${gameState.word}".</p>`;
			SUBMIT_BTN.disabled = true;
			break;
	}
}

function chooseRandomWord(maxWordLength){
	// Prevent overloading error with invalid value
	if(maxWordLength < 3){
		maxWordLength = 3;
	}
	// Select a random word from the word list
	chosenWord = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
	// Ensure word is within limit
	if(chosenWord.length > maxWordLength){
		chooseRandomWord(maxWordLength);
	}
	return chosenWord;
}

// Event listeners
SUBMIT_BTN.addEventListener("click", userGuess);
USER_INPUT.addEventListener("keypress", function (e) {
	var key = e.which || e.keyCode;
	if(key === 13){
		userGuess();
	}
});
CONFIRM_CONFIG_BTN.addEventListener("click", launchGame);
