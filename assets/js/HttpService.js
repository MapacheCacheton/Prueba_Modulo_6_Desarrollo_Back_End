const http = require('http')
const fs = require('fs')
const url = require('url')
const apiCall = require('./ApiRelated')
const {writeRoommates, readRoommates, writeGastos, readGastos, createID, deleteGasto,updateGasto, calculateBills} = require('./CRUD')
function Server(){
    http.createServer(async (req, res)=>{
        if(req.url=='/'){
            res.setHeader('content-type', 'text/html')
            fs.readFile(__dirname + '/../../index.html', (err, html)=>{
                if(err) throw err
                res.end(html)
            })
        }
        if(req.url.startsWith('/roommate') && req.method == 'POST'){
            const roommate = await apiCall()//devuelve objeto
            res.end(writeRoommates(roommate))
        }

        if(req.url.startsWith('/roommate') && req.method == 'GET'){
            res.setHeader('content-type', 'application/json')
            if(fs.existsSync(__dirname+'./../DB/roommates.json')){
                const data = {
                    roommates: readRoommates()
                }
                calculateBills()
                res.end(JSON.stringify(data))
            }
            else{
                res.end()
            }
            
        }
        if(req.url.startsWith('/gasto') && req.method == 'POST'){
            let body

            req.on("data", (payload)=>{
                body = JSON.parse(payload)
            })

            req.on("end", ()=>{
                let gasto = {
                    id: createID(),
                    roommate: body.roommate,
                    descripcion: body.descripcion,
                    monto: body.monto
                }
                if(fs.existsSync(__dirname+'/../DB/gastos.json')){
                    const arr_gastos = readGastos()
                    arr_gastos.push(gasto)
                    const obj = {
                        gastos: arr_gastos
                    }
                    writeGastos(obj)
                    calculateBills()
                    res.end()
                }
                else{
                    const arr_gastos = []
                    arr_gastos.push(gasto)
                    const obj = {
                        gastos: arr_gastos
                    }
                    writeGastos(obj)
                    calculateBills()
                    res.end()
                }
            })
        }

        if (req.url.startsWith("/gasto") && req.method == "GET") {
            res.setHeader("Content-Type", "application/json");
            fs.readFile(__dirname+'/../DB/gastos.json', "utf8", (err, roommates) => {
              if (err) (res.statusCode = 500), res.end();
              calculateBills()
              res.end(roommates);
            });
          }
      
        if(req.url.startsWith('/gasto') && req.method == 'DELETE'){
            const {id} = url.parse(req.url, true).query
            const gastos = deleteGasto(id)
            writeGastos(gastos)
            calculateBills()
            res.end()
        }
        if(req.url.startsWith('/gasto') && req.method == 'PUT'){
            const {id} = url.parse(req.url, true).query
            let body

            req.on('data', (payload)=>{
                body = JSON.parse(payload)
            })
            req.on('end', ()=>{
                const new_gastos = updateGasto(body, id)
                writeGastos(new_gastos)
                calculateBills()
                res.end()
            })
        }
    }).listen(3000, ()=>{console.log('Server on - Port: 3000 - Process: '+ process.pid);})
}

module.exports = Server