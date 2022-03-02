const fs = require('fs')

function writeRoommates(data, res){
    fs.writeFile('./assets/DB/roommates.json', JSON.stringify(data, null, ' '), ()=>{
        res.end()
    })
}

function readRoommates(){
    const data = fs.readFileSync('./assets/DB/roommates.json')
    return JSON.parse(data)
}

module.exports = {writeRoommates, readRoommates}