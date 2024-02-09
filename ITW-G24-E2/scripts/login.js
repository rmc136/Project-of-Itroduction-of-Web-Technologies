// Grupo: 24, (Número: 54600, Nome: João Ferreira, PL: 26),(Número: 54356, Nome:Judite Ramos, PL: 26),(Número: 51660, Nome:João Torres, PL: 26)

// constants

const LOGIN = "login"
const PASSWORD = "password"
const CONTAS = "contas"
const LOGIN_NOW = "loginNow"
const PASSWORD_NOW ="passwordNow"
const PLAYER_TIMES_LEN = 15

//variables

let contas = []

// load player on load function

window.addEventListener("load", principal);

function principal(){   
    carregaPlayer()
}

// create player object contructor

function Player (username, password, times){
    this.username = username;
    this.password = password;
    this.times = {
        easy : Array(PLAYER_TIMES_LEN).fill(null),
        medium : Array(PLAYER_TIMES_LEN).fill(null),
        hard : Array(PLAYER_TIMES_LEN).fill(null)
    }
}

// new player function

function newPlayer (){
    return new Player(document.getElementById(LOGIN).value, document.getElementById(PASSWORD).value, null)
}

// load player function

function carregaPlayer(){
    contas = JSON.parse(localStorage.getItem(CONTAS)) || []
}

// save player function

function savePlayer(){
    localStorage.setItem(CONTAS ,JSON.stringify(contas))
}

// save player history function

function savePlayerHistory(){
    // if account exists return false and alert
    for(i in contas){
        if(contas[i].username == document.getElementById(LOGIN).value){
            alert("This account already exists")
            return false
    }
        }
    contas.push(newPlayer())
    savePlayer()
}

// login if account exists function

function loginAgora(){
    contaLocal()
    for(i in contas){
            if (contas[i].username == localStorage.getItem("username") && contas[i].password == localStorage.getItem("password")){
                return true
            }
    }
     // if account exists return false and alert
    alert("This account doesnt exist")
                return false
}

// save user account input fucntion

function contaLocal(){
    localStorage.setItem("username" ,document.getElementById(LOGIN_NOW).value)
    localStorage.setItem("password", document.getElementById(PASSWORD_NOW).value)
}


