const http = require('http')
const fs = require('fs')
const url = require('url')
const apiCall = require('./ApiRelated')
const {writeRoommates, readRoommates, writeGastos, readGastos} = require('./CRUD')
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
                const obj = {
                    roommates: arr_data
                }
                writeRoommates(obj)
                res.end()
            }else{
                const arr_data = []
                arr_data.push(roommate)
                const obj = {
                    roommates: arr_data
                }
                writeRoommates(obj)
                res.end()
            }
        }
        if(req.url.startsWith('/roommate') && req.method == 'GET'){
            if(fs.existsSync('./assets/DB/roommates.json')){
                const data = {
                    roommates: readRoommates()
                }
                res.setHeader('content-type', 'application/json')
                res.end(JSON.stringify(data))
            }
            res.end()
        }
        if(req.url.startsWith('/gasto') && req.method == 'POST'){
            let body

            req.on("data", (payload)=>{
                body = JSON.parse(payload)
            })

            req.on("end", ()=>{
                console.log(body);
                let gasto = {
                    roommate: body.roommate,
                    descripcion: body.descripcion,
                    monto: body.monto
                }
                if(fs.existsSync('./assets/DB/gastos.json')){
                    const arr_gastos = readGastos()
                    arr_gastos.push(gasto)
                    const obj = {
                        gastos: arr_gastos
                    }
                    writeGastos(obj)
                    res.end()
                }
                else{
                    const arr_gastos = []
                    arr_gastos.push(gasto)
                    const obj = {
                        gastos: arr_gastos
                    }
                    writeGastos(obj)
                    res.end()
                }
            })
        }

        if (req.url.startsWith("/gasto") && req.method == "GET") {
            res.setHeader("Content-Type", "application/json");
            fs.readFile("./assets/DB/gastos.json", "utf8", (err, roommates) => {
              if (err) (res.statusCode = 500), res.end();
              res.end(roommates);
            });
          }
      

        // if(req.url.startsWith('/gasto') && req.method == 'GET'){
        //     if(fs.existsSync('./assets/DB/gastos.json')){
        //         const data = {
        //             gastos: readGastos()
        //         }
        //         res.setHeader('content-type', 'application/json')
        //         res.end(JSON.stringify(data))
        //     }

        //     res.end()
        // }
        if(req.url.startsWith('/gasto') && req.method == 'PUT'){

        }
        if(req.url.startsWith('/gasto') && req.method == 'DELETE'){

        }
    }).listen(3000, ()=>{console.log('Server on - Port: 3000 - Process: '+ process.pid);})
}

module.exports = Server