// Grupo: 24, (Número: 54600, Nome: João Ferreira, PL: 26),(Número: 54356, Nome:Judite Ramos, PL: 26),(Número: 51660, Nome:João Torres, PL: 26)

// constants

const TILE_STATUS={
  HIDDEN: "hidden",
  MINE: "mine",
  FLAG: "flag",
  NUMBER: "number",
  REPLAY: "replay",
  INT: "int"
}

const bombImage = '<img src="../images/bomb.png">'
const flagImage = '<img src="../images/flag.png">'
const questionImage = '<img src="../images/question.png">'
const timerId = null

// function to create boardS

function createBoard(rowSize, colSize) {
  let board = []
  for (let x = 0; x < rowSize; x++) {
    const row = []
    for (let y = 0; y < colSize; y++) {
      const element = document.createElement("div")
      element.dataset.status = TILE_STATUS.HIDDEN
      const tile = { 
        element,
        x,
        y,
        mine:null,
        get status(){
          return this.element.dataset.status
        },
        set status(value) {
          this.element.dataset.status = value
        },
      }
      row.push(tile)
    }
    board.push(row)
  }
  return board
}

// generate mines function

function generateMinefield(board, firstX, firstY, rowSize, colSize, numberOfMines) {
// firstX, firstY are the x and y of the first tile played
  const minePositions = getMinePositions(
      firstX, firstY, rowSize, colSize, numberOfMines)
  
  let mine
  for (let i = 0; i < minePositions.length; i++) {
    mine = minePositions[i]
    board[mine.x][mine.y].mine = true
  }
  return board
}

// get mines positions function

function getMinePositions(
    firstX, firstY, rowSize, colSize, numberOfMines) {

  const positions = []
  const firstPlay = {
      x: firstX,
      y: firstY
  }
  while(positions.length < numberOfMines) {
    
  const position = {
      x: randomNumber(rowSize),
      y: randomNumber(colSize)
    }
    if (!positions.some(positionMatch.bind(null, position)) && !positionMatch(firstPlay, position)) {positions.push(position)}
  }
  return positions
}

// mark tiles and images function

function markTile(tile) {
  if (
    tile.status !== TILE_STATUS.HIDDEN &&
    tile.status !== TILE_STATUS.FLAG &&
    tile.status !== TILE_STATUS.INT
  ) {
      return
    }
    if(tile.status === TILE_STATUS.HIDDEN){
      tile.status = TILE_STATUS.FLAG
      tile.element.innerHTML = flagImage
      document.getElementById("reveal").play()
    }
    else if(tile.status === TILE_STATUS.FLAG){
      tile.status = TILE_STATUS.INT
      tile.element.innerHTML = questionImage
      document.getElementById("reveal").play()
    }
      
     else {
      tile.status = TILE_STATUS.HIDDEN
      tile.element.innerHTML = ""
      document.getElementById("reveal").play()
      
    }
}

// reveal tiles and adjacent tiles function

 function revealTile(board, tile){
  if (tile.status !== TILE_STATUS.HIDDEN){
    
      return
  }
  if (tile.mine) {
      tile.status = TILE_STATUS.MINE
      tile.element.innerHTML = bombImage
      return
  }
  tile.status = TILE_STATUS.NUMBER
  const adjTiles = nearbyTiles(board, tile)
  const mines = adjTiles.filter(t => t.mine)
  if (mines.length === 0){
    adjTiles.forEach(revealTile.bind(null,board))
  }else{
    document.getElementById("reveal").play()
    tile.element.textContent = mines.length
  }
}

// positions function

function positionMatch(a,b){
  return a.x === b.x && a.y === b.y
}

// ramdom mines postions function

function randomNumber(size){
  return Math.floor(Math.random()*size)
}

// check nerby tiles function

function nearbyTiles(board, {x, y}) {
  const tiles = []

  for (let xOffset = -1; xOffset <=1; xOffset++){
    for(let yOffset = -1; yOffset <=1; yOffset++){
      const tile = board[x +xOffset]?.[y + yOffset]
      if(tile) tiles.push(tile)
    }
  }
  return tiles
}

// check win function

function checkWin(board){
  return board.every(row =>{
    return row.every(tile =>{
      return (
        tile.status === TILE_STATUS.NUMBER ||
      (tile.mine &&
        (tile.status === TILE_STATUS.HIDDEN ||
          tile.status === TILE_STATUS.FLAG)||
            tile.status === TILE_STATUS.INT)
      )
    })
  })
}

//check lose function

function checkLose(board){
  return board.some(row => {
    return row.some(tile =>{
      return tile.status === TILE_STATUS.MINE
    })
  })
}


