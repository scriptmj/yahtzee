let enenScore = document.getElementById("enenScore");
let tweeenScore = document.getElementById("tweeenScore");
let drieenScore = document.getElementById("drieenScore");
let vierenScore = document.getElementById("vierenScore");
let vijvenScore = document.getElementById("vijvenScore");
let zessenScore = document.getElementById("zessenScore");
let elementEersteTotaal = document.getElementById("eersteTotaal");
let extraBonusScore = document.getElementById("extraBonusScore");
let elementBovensteHelftTotaalScore = document.getElementById("bovensteHelftTotaalScore");
let threeOfAKindScore = document.getElementById("threeOfAKindScore");
let carreScore = document.getElementById("carreScore");
let fullHouseScore = document.getElementById("fullHouseScore");
let kleineStraatScore = document.getElementById("kleineStraatScore");
let groteStraatScore = document.getElementById("groteStraatScore");
let yahtzeeScore = document.getElementById("yahtzeeScore");
let chanceScore = document.getElementById("chanceScore");
let elementTotaalDeel2Score = document.getElementById("totaalDeel2Score");
let elementTotaalDeel1Score = document.getElementById("totaalDeel1Score");
let elementTotaalScore = document.getElementById("totaalScore");
let gameOver = false;

let scoreArray = [];
createSingleScoreArray();

//Creëert een array waarin alle score elementen komen te staan zodat deze makkelijker geupdate kunnen worden bij tmpLocked.
function createSingleScoreArray(){
    scoreArray.push(enenScore);
    scoreArray.push(tweeenScore);
    scoreArray.push(drieenScore);
    scoreArray.push(vierenScore);
    scoreArray.push(vijvenScore);
    scoreArray.push(zessenScore);
    scoreArray.push(threeOfAKindScore);
    scoreArray.push(carreScore);
    scoreArray.push(fullHouseScore);
    scoreArray.push(kleineStraatScore);
    scoreArray.push(groteStraatScore);
    scoreArray.push(yahtzeeScore);
    scoreArray.push(chanceScore);
}

function checkGameOver(){
    if(scoreArray.every(item => item.getAttribute("class") === "points locked")){
        gameOver = true;
        document.getElementById("gameover").innerHTML = "Game over. Totale score: " + elementTotaalScore.textContent;
    }
}

//Gooit 5 dobbelstenen en start het spel.
//Eerst zorgt deze functie er voor dat tmpLocked elementen gelocked worden. 
//Daarna worden alle unlocked elementen gewist zodat het scorebord schoon is.
function gooiDobbelstenen(){
    lockTmplockedScore(); //Lock alle scores die in de vorige ronde tmplocked waren
    updateTotalScore();
    checkGameOver();
    if(gameOver === false){
        emptyScoreIfNoNewScore() //Zorgt dat alle unlocked scores uit de vorige ronden worden gereset
        let worpArray = [];
        for(let i = 0; i < 5 ; i++){ //Gooi 5 dobbelstenen
            let dobbelsteen = Math.floor((Math.random() * 6) + 1);
            worpArray.push(dobbelsteen);
        }
        showWorp(worpArray); //Toont de worp in de bovenste tabel
        const worpObj = convertWorpArrayToWorpObject(worpArray); //Converteert de worp naar een object zodat dit makkelijker verwerkt kan worden
        berekenScore(worpObj);
    }
}

//Zoekt het tmpLocked element uit en verandert dit naar locked wanneer er opnieuw gegooid wordt.
//Wanneer het tmpLocked element veranderd is naar 'locked' wordt de totale score geüpdated.
function lockTmplockedScore(){
    for(item of scoreArray){
        if(item.getAttribute("class").includes("tmplocked")){
            item.setAttribute("class", "points locked");
        }
    }
}

//Neemt de waarden uit de textContent van elk gelocked element en telt deze per sectie bij elkaar op.
//Wanneer de bovenste helft 63 punten of meer heeft, wordt er een bonus van 35 punten toegevoegd.
function updateTotalScore(){
    let scoreDeel1 = scoreArray.slice(0, 6);
    let scoreDeel2 = scoreArray.slice(6, 13);
    let totalScoreDeel1 = 0;
    let totalScoreDeel2 = 0;
    for(item of scoreDeel1){
        if(!item.getAttribute("class").includes("unlocked")){
            totalScoreDeel1 = Number(totalScoreDeel1) + Number(item.textContent);
        }
    }
    for(item of scoreDeel2){
        if(!item.getAttribute("class").includes("unlocked")){
            totalScoreDeel2 = Number(totalScoreDeel2) + Number(item.textContent);
        }
    }
    elementEersteTotaal.textContent = totalScoreDeel1;
    extraBonusScore.textContent = totalScoreDeel1 >= 63 ? 35 : 0;
    elementBovensteHelftTotaalScore.textContent = totalScoreDeel1 + Number(extraBonusScore.textContent);
    elementTotaalDeel1Score.textContent = Number(elementBovensteHelftTotaalScore.textContent);
    elementTotaalDeel2Score.textContent = totalScoreDeel2;
    elementTotaalScore.textContent = Number(elementTotaalDeel1Score.textContent) + Number(elementTotaalDeel2Score.textContent);
}

//Toont de worp in de kleine table bovenaan
function showWorp(worpArray){
    const worpTable = document.getElementsByClassName("worpResultaat");
    for(let i = 0 ; i < worpTable.length ; i++){
        worpTable[i].textContent = worpArray[i];
    }
}

//Bekijkt elk item of deze de class 'unlocked' heeft, zoja, reset deze zodra er opnieuw gegooid wordt
function emptyScoreIfNoNewScore(){
    for(item of scoreArray){
        if(item.getAttribute("class").includes("unlocked")){
            item.textContent = 0;
        }
    }
}

//Converteert de array met de worp naar een object, met als key-value pair de waarde van de dobbelsteen met het aantal keer dat dit gegooid is
function convertWorpArrayToWorpObject(worpArray){
    let worp = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0
    };
    for(let i = 0 ; i < worpArray.length + 1; i++){
        for(let j = 1 ; j < worpArray.length + 2 ; j++){
            if(worpArray[i] === j){
                worp[j] += 1;
            }
        }
    }
    return worp;
}

//Berekent alle mogelijke scores aan de hand van het object van de vijf dobbelstenen (worpObj).
function berekenScore(worpObj){
    updateScoreElement(enenScore, worpObj[1] * 1);
    updateScoreElement(tweeenScore, worpObj[2] * 2);
    updateScoreElement(drieenScore, worpObj[3] * 3);
    updateScoreElement(vierenScore, worpObj[4] * 4);
    updateScoreElement(vijvenScore, worpObj[5] * 5);
    updateScoreElement(zessenScore, worpObj[6] * 6);
    berekenThreeOfAKind(worpObj);
    berekenCarre(worpObj);
    berekenFullHouse(worpObj);
    berekenKleineStraatMetObj(worpObj);
    berekenGroteStraat(worpObj);
    berekenYahtzee(worpObj);
    updateScoreElement(chanceScore, calculateTotalThrowScore(worpObj));
}

//Neemt het object van worp en kijkt of 1 van de cijfers 3 keer coorkomt. Berekent dan de totale score aan de hand van de volledige worp.
function berekenThreeOfAKind(worpObj){
    for(let i = 1 ; i < 7 ; i++){
        if(worpObj[i] >= 3){
            //console.log("Three of a kind");
            updateScoreElement(threeOfAKindScore, calculateTotalThrowScore(worpObj));
        }
    }
}

//Neemt het object van worp en kijkt of 1 van de cijfers 4 keer coorkomt. Berekent dan de totale score aan de hand van de volledige worp.
function berekenCarre(worpObj){
    for(let i = 1 ; i < 7 ; i++){
        if(worpObj[i] >= 4){
            //console.log("Carré");
            updateScoreElement(carreScore, calculateTotalThrowScore(worpObj));
        }
    }
}

//Neemt het object van worp en kijkt of 1 van de cijfers 3 keer voorkomt, zoja, kijkt dan of een ander cijfer 2 keer voorkomt.
function berekenFullHouse(worpObj){
    for(let i = 1 ; i < 7 ; i++){
        if(worpObj[i] === 3){
            for(let j = 1 ; j < 7 ; j++){
                if(worpObj[j] === 2){
                    //console.log("Full house");
                    updateScoreElement(fullHouseScore, 25);
                }
            }
        }
    }
}

//Neemt het object van worp en bekijkt of de opvolgende 3 cijfers 1 of meer keren voorkomt.
function berekenKleineStraatMetObj(worpObj){
    for(let i = 1 ; i < 7 ; i++){
        if(worpObj[i] >= 1 && worpObj[i + 1] >= 1 && worpObj[i + 2] >= 1 && worpObj[i + 3] >= 1) {
            //console.log("Kleine straat");
            updateScoreElement(kleineStraatScore, 30);
        }
    }
}

//Neemt het object van worp en bekijkt of de opvolgende 4 cijfers 1 of meer keren voorkomt.
function berekenGroteStraat(worpObj){
    for(let i = 1 ; i < 7 ; i++){
        if(worpObj[i] >= 1 && worpObj[i + 1] >= 1 && worpObj[i + 2] >= 1 && worpObj[i + 3] >= 1 && worpObj[i + 4] >= 1){
            //console.log("Grote straat");
            updateScoreElement(groteStraatScore, 40);
        }
    }
}

//Neemt het object van worp en kijkt of 1 van de cijfers 5 keer voorkomt.
function berekenYahtzee(worpObj){
    for(let i = 1 ; i < 7 ; i++){
        if(worpObj[i] === 5){
            //console.log("Yahtzee");
            updateScoreElement(yahtzeeScore, 50);
        }
    }
}

//Bekijkt eerst of het gekozen element unlocked is, zoja, verandert deze naar tmpLocked en update de totale score.
//Gaat tevens alle elementen bij na om alle andere tmpLocked elementen te resetten naar unlocked.
function tmplockScore(element){
    if(element.getAttribute("class") === "points unlocked"){
        const allTmplockedClasses = document.getElementsByClassName("tmplocked");
        for(item of allTmplockedClasses){
            item.setAttribute("class", "points unlocked");
        }
        element.setAttribute("class", "points tmplocked");
        updateTotalScore();
    }
}

//Update de textElement van input element en verandert deze naar input value, wanneer dit element unlocked is. Elementen die tmpLocked of locked zijn worden niet aangepast.
function updateScoreElement(element, value){
    if(element.getAttribute("class").includes("unlocked")){
        element.textContent = value;
    }
}

//Helper functions
//Berekent de totale score door de waarde van elke dobbelsteen bij elkaar op te tellen
function calculateTotalThrowScore(worpObj){
    let totalScore = 0;
    for(let i = 1 ; i < 7 ; i++){
        totalScore += worpObj[i] * i;
    }
    return totalScore;
}