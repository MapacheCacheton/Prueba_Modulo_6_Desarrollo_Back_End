const http = require('http')
const fs = require('fs')
const url = require('url')
const apiCall = require('./ApiRelated')
const {writeRoommates, readRoommates} = require('./CRUD')
function Server(){
    http.createServer(async (req, res)=>{
        if(req.url=='/'){
            res.setHeader('content-type', 'text/html')
            fs.readFile('./index.html', (err, html)=>{
                if(err) throw err
                res.end(html)
            })
        }
        if(req.url.startsWith('/roommate') && req.method == 'POST'){
            const roommate = await apiCall()//devuelve objeto
            if(fs.existsSync('./assets/DB/roommates.json')){
                const arr_data = readRoommates()
                arr_data.push(roommate)
                writeRoommates(arr_data, res)
            }else{
                const arr_data = []
                arr_data.push(roommate)
                writeRoommates(arr_data, res)
            }
        }
        if(req.url.startsWith('/roommates') && req.method == 'GET'){
            if(fs.existsSync('./assets/DB/roommates.json')){
                const data = readRoommates()
                res.setHeader('content-type', 'application/json')
                res.end(JSON.stringify(data))
            }
        }
        if(req.url.startsWith('/gastosGET')){

        }
        if(req.url.startsWith('/gastoPUT')){

        }
        if(req.url.startsWith('/gastoDELETE')){

        }
    }).listen(3000, ()=>{console.log('Server on - Port: 3000 - Process: '+ process.pid);})
}

module.exports = Server