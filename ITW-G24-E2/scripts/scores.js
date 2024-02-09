// Grupo: 24, (Número: 54600, Nome: João Ferreira, PL: 26),(Número: 54356, Nome:Judite Ramos, PL: 26),(Número: 51660, Nome:João Torres, PL: 26)

// constants

const SCORES = "scores"
const CONTAS = "contas"
const MAX_SCORES = 15
const PLAYER_TIMES_LEN = 15
const TABELA = "tabela_"

const EASY = "easy"
const MEDIUM = "medium"
const HARD = "hard"
const difficulties = [EASY, MEDIUM, HARD]

// main function on load

window.onload = main

function main () {
    //localStorage.removeItem(`${SCORES}`)
    updateScores()
    drawScoreboard()
    return
}

// draw scoreboard function

function drawScoreboard() {
// assumes scores is ordered
    scores = JSON.parse(localStorage.getItem(`${SCORES}`))
    let scoreboard, row, name, time, max
    
    for (let d = 0; d < difficulties.length ; d++) {
        scoreboard = document.getElementById(`${TABELA}${difficulties[d]}`)
        max = (scores[difficulties[d]].length > MAX_SCORES) ? MAX_SCORES : scores[difficulties[d]].length
        for (let i = 0; i <= max ; i++) {
            row = scoreboard.insertRow(i)
            if (i == 0) {
                difficultyRow = row.insertCell(0)
                difficultyRow.colSpan = "2"
                difficultyRow.innerHTML = `${difficulties[d]}`
            }
            else {
                
                name = row.insertCell(0)
                time = row.insertCell(1)
                name.innerHTML = `${scores[difficulties[d]][i - 1][0]}`
                time.innerHTML = `${scores[difficulties[d]][i - 1][1]} seconds`
            }
        }
    }
}

// update scores function

function updateScores() {    
// sets item 'scores' in local storage where each score is an array [name, time], and sets it ordered by time
    const contas = JSON.parse(localStorage.getItem(`${CONTAS}`)) || []
    let contaslen = contas.length

    const scores = {
        easy : [],
        medium : [],
        hard : []
    }
    
    for (let z = 0; z < contaslen; z++) {
        for (let d = 0; d < difficulties.length; d++) {
            let times = []
            let name = contas[z].username
            contas[z].times[difficulties[d]].forEach(function(time) {
                if (time != null) { times.push([name, time]) } } )
            scores[difficulties[d]].push(...times)
        }
    }
    scores.easy.sort(function(a, b) {return a[1] - b[1]})
    scores.medium.sort(function(a, b) {return a[1] - b[1]})
    scores.hard.sort(function(a, b) {return a[1] - b[1]})
    
    localStorage.setItem(`${SCORES}`, JSON.stringify(scores))
}

