// Grupo: 24, (Número: 54600, Nome: João Ferreira, PL: 26),(Número: 54356, Nome:Judite Ramos, PL: 26),(Número: 51660, Nome:João Torres, PL: 26)

// constants

const BTN_SP = "btn_sp";

const BTN_EASY = "btn_easy";
const BTN_MEDIUM = "btn_medium";
const BTN_HARD = "btn_hard";
const TABELA = "tabela"
const BTN_START = "btn_start";
const BTN_RESTART = "btn_restart";

// variables

let diff_btns = [BTN_EASY, BTN_MEDIUM, BTN_HARD];
let mode_btns = [BTN_SP];
let config_btns = diff_btns.concat(mode_btns)

let config = {
    diff: null,
    mode: null,
}

let ROW_SIZE;
let COL_SIZE;
let NUMBER_OF_MINES;
let board;
let boardElement
let minesLeft
let text
let myInterval = 0
let sec = 0;

window.onload = init

// init function and difficulty

function init() {
    function easy() {
        ROW_SIZE = 9
        COL_SIZE = 9
        NUMBER_OF_MINES = 10
        document.getElementById("board").style.background = "ForestGreen"
        board = createBoard(ROW_SIZE, COL_SIZE, NUMBER_OF_MINES)
        setup()
        gameStart()
    }
    
    function medium() {
        ROW_SIZE = 16
        COL_SIZE = 16
        NUMBER_OF_MINES = 40
        document.getElementById("board").style.background = "GoldenRod"
        board = createBoard(ROW_SIZE, COL_SIZE, NUMBER_OF_MINES)
        setup()
        gameStart()
    }
    
    function hard() {
        ROW_SIZE = 30
        COL_SIZE = 16
        NUMBER_OF_MINES = 99
        document.getElementById("board").style.background = "LightCoral"
        board = createBoard(ROW_SIZE, COL_SIZE, NUMBER_OF_MINES)  
        setup()
        gameStart()
    }
    
    showbtns(config_btns);
// add listeners to  diff btns
    diff_btns.forEach(function(btn) {
    document.getElementById(btn).addEventListener(
        "click", () => { 
            configbtn_onClick(btn, diff_btns); })});
// add listeners to game mode btns
    mode_btns.forEach(function(btn) { document.getElementById(btn).addEventListener(
        "click", () => {
            configbtn_onClick(btn, mode_btns); })});
// when start btn is clicked call chosen difficulty()
    document.getElementById(BTN_START).addEventListener("click", () => { eval(config.diff)();}); 
}

// show/hide buttons functions

function showbtns (btn_ls) {
    for (let i = 0; i < btn_ls.length; i++) { document.getElementById(
            btn_ls[i]).style.visibility = 'visible'; 
    }
}

function hidebtns (btn_ls) {
    for (let i = 0; i < btn_ls.length; i++) { 
    document.getElementById(btn_ls[i]).style.visibility = 'hidden'; 
    }
}

// setup board/time/mines left function

function setup () {
    hidebtns(config_btns);
    boardElement = document.querySelector(".board")
    minesLeft = document.querySelector("[data-mine-count]")
    
    text = document.querySelector(".text")
    boardElement.addEventListener('click', () => {
    myInterval = setInterval(myTimer, 10);
    }, { once: true });    
    
    document.getElementById(BTN_START).style.visibility = 'hidden'; 
    document.getElementById(BTN_RESTART).style.visibility = 'visible'; 
}

//timer function

function myTimer() {
  timer.innerHTML = sec.toFixed(2);
  sec += 0.01;
}

// game start fucntion with left/right click event listeners

function gameStart() {
let FIRST_PLAY = true
board.forEach(row => {
    row.forEach(tile => {
        boardElement.append(tile.element)
        tile.element.addEventListener("click",() => {
            if (FIRST_PLAY == true) 
            {
                let x = tile.x
                let y = tile.y
                board = generateMinefield(
                    board, x, y, ROW_SIZE, COL_SIZE, NUMBER_OF_MINES)
                FIRST_PLAY = false
            }
            revealTile(board, tile)
            checkGameEnd()
        })
        tile.element.addEventListener("contextmenu", e => {
            e.preventDefault()
            markTile(tile)
            lisMinesLeft()
        })
    })
})

// board size
    
boardElement.style.setProperty("--sizeRow", ROW_SIZE)
boardElement.style.setProperty("--sizeCol", COL_SIZE)

// update mines left text

minesLeft.textContent = NUMBER_OF_MINES

// restart button event listener

document.getElementById(BTN_RESTART).addEventListener("click", () => { replay()}); 

}

// mines left function

function lisMinesLeft(){
    const flagedTiles = board.reduce((count, row) => {
       return count + row.filter(tile => tile.status === TILE_STATUS.FLAG).length
    },0)

    minesLeft.textContent = NUMBER_OF_MINES - flagedTiles
}

// check game end fucntion after every tile reveal

function checkGameEnd(){
    const win = checkWin(board)
    const lose = checkLose(board)

    // stop event listeners
    if (win||lose){
        boardElement.addEventListener("click", stop, {capture: true})
        boardElement.addEventListener("contextmenu", stop, {capture: true})
        sec.toFixed(2)
        clearInterval(myInterval)
    }

    // update times in scoreboard if win
    if(win){
        document.getElementById("win").play()
        text.textContent = "You Win!"
        for(i in contas){
            if (contas[i].username == localStorage.getItem("username") && contas[i].password == localStorage.getItem("password")){
                updatePlayerTimes(i, sec.toFixed(2))
                savePlayer()
            }
        }
    }

    // reveal all tiles and remove flags/question marks if lose
    if(lose){
        document.getElementById("lose").play()
        text.textContent ="You lose!"
        board.forEach(row => {
            row.forEach(tile =>{
                if (tile.status === TILE_STATUS.FLAG) {
                    markTile(tile)
                    markTile(tile)
                }
                if (tile.status === TILE_STATUS.INT) {
                markTile(tile)
                }
                if (tile.mine) revealTile(board,tile)
            })
        })
    }
}

// update palyer times on scoreboard

function updatePlayerTimes(i) {
    const PlayerTimesLen = 15
    const old_times = contas[i].times[config.diff]
    let new_times = old_times
// contas[i].time[config.diff] -> array of times of this player in this difficulty
// get last best time at this difficulty
    for (let n = 0; n < PlayerTimesLen; n++) {                    
        if (old_times[n] == null || sec.toFixed(2) < old_times[n])
        {
            new_times = old_times.slice(0, n)
            new_times[n] = sec.toFixed(2)
            // PlayerTimesLen - 1 because we need to remove last time to insert a new one
            new_times = new_times.concat(old_times.slice(n, PlayerTimesLen - 1))
            // end loop
            n = PlayerTimesLen
        }
    }
    //localStorage.setItem(contas[i].time.config.diff, finalTime)
    contas[i].times[config.diff] = new_times
}

// function to stop clicks 

function stop(e){
    e.stopImmediatePropagation()
}

// replay button function

function replay(){
window.location.reload();
}

// function to select single/multiplayer and difficulty buttons 

function configbtn_onClick(elem, btn_ls) {
    if (document.getElementById(elem).classList.contains('selected')) {
        document.getElementById(elem).classList.remove('selected')
        if (btn_ls == diff_btns) {
            config.diff = null;
        }
        else {
            config.mode = null;
        }        document.getElementById(BTN_START).style.visibility = 'hidden'
        return
    }
    btn_ls.forEach(function(btn) {
        if (btn != elem) {
            document.getElementById(btn).classList.remove('selected');
        }
        else {
            document.getElementById(btn).classList.add('selected');
            if (btn_ls == diff_btns) {
                config.diff = elem.split("_")[1];
            }
            else {
                config.type = elem.split("_")[1];
            }
        }
    })
    if (config.diff != null && config.type != null) {       document.getElementById(
        BTN_START).style.visibility = 'visible';
    }
    else { document.getElementById(
        BTN_START).style.visibility = 'hidden';}
}