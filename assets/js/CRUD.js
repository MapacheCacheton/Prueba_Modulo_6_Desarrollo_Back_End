const fs = require('fs')

function writeRoommates(data){
    fs.writeFileSync('./assets/DB/roommates.json', JSON.stringify(data, null, ' '))
}

function readRoommates(){
    const {roommates} = JSON.parse(fs.readFileSync('./assets/DB/roommates.json'))
    return roommates
}

function writeGastos(data){
    fs.writeFileSync('./assets/DB/gastos.json', JSON.stringify(data, null, ' '))
}

function readGastos(){
    const {gastos} = JSON.parse(fs.readFileSync('./assets/DB/gastos.json'))
    return gastos
}



module.exports = {writeRoommates, readRoommates, writeGastos, readGastos}