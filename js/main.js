function showInstructions(){
    const screenBlocker = document.querySelector('#screenBlocker'); 
    const onStartMessage = document.querySelector('#onStartMessage');
    screenBlocker.style.display = 'block';
    onStartMessage.style.display = 'block';
    document.querySelector('#onStartMessageTitle').innerText = 'Welcome to The Crystal Snatcher';
    document.querySelector('#onStartMessageText').innerText = 'You are mighty Highlord Alarak, and your mission is to snatch more crystals than your opponents. After clicking \'Start\' button, a Crystal will appear in a random place of the battlefield for a short period of time. You must snatch it by clicking on it, if you fail the Crystal is automatically snatched by the enemy. Be aware, with each level the Crystal will appear and disappear faster. Don\'t forget to click \'Start\' button in the beginning of each round. GL HF';
    document.querySelector('#onStartMessageButton').addEventListener('click', () => {
        screenBlocker.style.display = 'none'; 
        onStartMessage.style.display = 'none';
    });
}

showInstructions();

//classic random function with the maximum and the minimum inclusive
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); 
  }

//saves data to localStorage, for future versions of game
function saveItemToLocalStorage(item, value) {
    localStorage.setItem(item, JSON.stringify(value));
}

//level settings
const gameData = {
    level1:{
        target: 3,
        enemyName: 'Zagara',
        enemyImage: 'zagara.png',
    },
    level2:{
        target: 5,
        enemyName: 'Dehaka',
        enemyImage: 'dehaka.png'
    },
    level3:{
        target: 7,
        enemyName: 'Stukov',
        enemyImage: 'stukov.png'
    },
    level4:{
        target: 9,
        enemyName: 'Abathur',
        enemyImage: 'abathur.png'
    },
    level5:{
        target: 11,
        enemyName: 'Kerrigan',
        enemyImage: 'kerrigan.png'
    }
}

//get user data from storage
const userEmail = localStorage.getItem('email');
const userName = localStorage.getItem('name');

//add user info to userData object
const userData = {
    userName,
    userEmail
}

//display user's name
document.querySelector('#userNameField').innerText = userData.userName;

//variables used throughout the code
const gameEndPoint = Object.keys(gameData).length + 1; //get quantity of available levels, used in increasePlayersClicksCount function
let currentLevel = 1;
let intervalTimeout = 3000;
let hideCrystalTimeout = 2000;
let playerClicksCounter = 0;
let userTotalScore = 0;
let enemyClicksCounter = 0;
let enemyTotalScore = 0;
let enemyName;

//selecting elements to be used for displaying data
const enemyImagePath = document.querySelector('.enemyImage');
const userLevelScoreField = document.querySelector('#userLevelScoreField');
const userTotalScoreField = document.querySelector('#userTotalScoreField');
const levelField = document.querySelector('#levelNumber');
const levelTargetField = document.querySelector('#levelTarget');
const enemyNameField = document.querySelector('#enemyName');
const enemyScoreField = document.querySelector('#enemyScore');
const enemyTotalScoreField = document.querySelector('#enemyTotalScore');

//will contain target number of crystals to be snatched per each level 
let target; 

//updates the presentation of data on screen when starting the game or moving to next level
function updateScreen(currentLevel) {
    let level = `level${currentLevel}`;
    target = gameData[level].target;
    enemyImagePath.src = `./images/${gameData[level].enemyImage}`;
    userLevelScoreField.innerText = 0;
    userTotalScoreField.innerText = userTotalScore;
    levelField.innerText = currentLevel;
    levelTargetField.innerText = gameData[level].target;
    enemyName = gameData[level].enemyName; 
    enemyNameField.innerText = enemyName;
    enemyScoreField.innerText = 0;
    enemyTotalScoreField.innerText = enemyTotalScore;
    playerClicksCounter = 0;
    enemyClicksCounter = 0;
    intervalTimeout -= 300;
    hideCrystalTimeout -= 200;
}

if(currentLevel == 1){
    console.log('if(currentLevel == 1)');
    updateScreen(currentLevel)
} 

//activation of start and stop buttons
document.querySelector('#startGameBtn').addEventListener('click', () => startGame())
document.querySelector('#stopGameBtn').addEventListener('click', () => stopGame())

//selecting elements for placing crystal on screen
const gameField = document.querySelector('.gameField');
const crystal = document.querySelector('#crystal');

//function that changes crystal position by clicking on it
function setCrystalPosition(element) {
    element.style.top = `${getRandomIntInclusive(0,gameField.offsetHeight - 100)}px`;
    element.style.right = `${getRandomIntInclusive(0,gameField.offsetWidth - 80)}px`;
}

//shows window with game/level results
function showResults(message, levelup, currentLevel){
    document.querySelector('#screenBlocker').style.display = 'block';
    document.querySelector('#messageWindow').style.display = 'block';
    document.querySelector('#message__title').innerText = message ? 'Congratulations! ' + message: 'You failed, keep up practicing';
    document.querySelector('#message__userName').innerText = userData.userName;
    document.querySelector('#message__user__score').innerText = playerClicksCounter;
    document.querySelector('#message__enemyName').innerText = enemyName;
    document.querySelector('#message__enemy__score').innerText = enemyClicksCounter;

    //function adds and removes listener, to avoid multiple adding
    function addUpdateScreenListener(){
        updateScreen(currentLevel);
        document.querySelector('#messageWindow').style.display = 'none';
        document.querySelector('#screenBlocker').style.display = 'none';
        document.querySelector('#messageButton').removeEventListener('click', addUpdateScreenListener)
    }

    if(!levelup){
        document.querySelector('#messageButton').addEventListener('click', () => 
        window.location.reload())  
    } else {
        document.querySelector('#messageButton').addEventListener('click', addUpdateScreenListener)
    }
}


let intervalId;
let timeoutId;

//function that starts the game on each level
function startGame(){
    if (!intervalId) {
        console.log('intervalTimeout >> ', intervalTimeout);
        console.log('hideCrystalTimeout >> ', hideCrystalTimeout);
        //set interval of appearance of the crystal on screen, intervalTimeout
        intervalId = setInterval(() => {
            setCrystalPosition(crystal);
            crystal.style.opacity = "1";
            crystal.style.display = 'block';

            //crystal display time, hideCrystalTimeout  
        timeoutId = setTimeout(() => {
            crystal.style.opacity = "0";
            crystal.style.display = 'none';
            enemyClicksCounter++;
            enemyTotalScore++;
            enemyScoreField.innerText = enemyClicksCounter;
            enemyTotalScoreField.innerText = enemyTotalScore;
                if(enemyClicksCounter >= target){
                    stopGame()
                    setTimeout(() => {
                        showResults()
                    }, 1000);
                }
            }, hideCrystalTimeout)
        }, intervalTimeout);
    }
}

//function that stops the game: if there are next levels - shows score and redirects to next level, if final level shows congratulation message
function stopGame() {
    clearInterval(intervalId);
    clearTimeout(timeoutId);
    // release intervalId and timeoutId from variables
    intervalId = null;
    timeoutId = null;
}

function stopTimeout() {
    clearTimeout(timeoutId);
    timeoutId = null;
}


// function that increments player's clicks quantity, updates that number on screen, hides crystal element, contains logic game finale
function increasePlayersClicksCount() {
    stopTimeout();
    crystal.style.opacity = '0';
    crystal.style.display = 'none';
    playerClicksCounter++;
    userTotalScore++;
    userLevelScoreField.innerText = playerClicksCounter;
    userTotalScoreField.innerText = userTotalScore;
    

    if(playerClicksCounter >= target){
        stopGame()
        //save progress to localStorage
        userData.userTotalScore = userTotalScore;
        userData.enemyTotalScore = enemyTotalScore;
        saveItemToLocalStorage('userData', userData);
        
        if(currentLevel < gameEndPoint){
            currentLevel++;
            if(currentLevel === gameEndPoint){
                stopGame()
                setTimeout(() => {
                    showResults('You Win!')
                   }, 1000);
                return;
            }
            showResults('You move to the next level', true, currentLevel)
        } 
    }
}

//setting an event listener for crystal element
crystal.addEventListener('click', () =>
    increasePlayersClicksCount()
);
