const http = require('http')
const fs = require('fs')
const url = require('url')
const apiCall = require('./ApiRelated')
const {writeRoommates, readRoommates, writeGastos, readGastos, createID, deleteGasto,updateGasto, calculateBills, getEmails} = require('./CRUD')
const createMail = require('./Mailer')

function Server(){
    http.createServer(async (req, res)=>{
        if(req.url=='/'){
            res.setHeader('content-type', 'text/html')
            try {
                fs.readFile(__dirname + '/../../index.html', (err, html)=>{
                    if(err) throw err
                    res.end(html)
                })
            } catch (error) {
                console.log(`Error ${error.code}: ${error.message}`);
            }
            
        }
        if(req.url.startsWith('/roommate') && req.method == 'POST'){
            try {
                const roommate = await apiCall()
                res.end(writeRoommates(roommate))
            } catch (error) {
                console.log(`Error ${error.code}: ${error.message}`);
            }
        }

        if(req.url.startsWith('/roommate') && req.method == 'GET'){
            res.setHeader('content-type', 'application/json')
            try {
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
            } catch (error) {
                console.log(`Error ${error.code}: ${error.message}`);
            }
            
        }
        if(req.url.startsWith('/gasto') && req.method == 'POST'){
            try {
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
                        createMail(getEmails(), req.method, gasto)
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
                        createMail(getEmails(), req.method, gasto)
                        calculateBills()
                        res.end()
                    }
                })
            } catch (error) {
                console.log(`Error ${error.code}: ${error.message}`);
            }
        }

        if (req.url.startsWith("/gasto") && req.method == "GET") {
            res.setHeader("Content-Type", "application/json");
            try {
                fs.readFile(__dirname+'/../DB/gastos.json', "utf8", (err, roommates) => {
                  if (err) (res.statusCode = 500), res.end();
                  calculateBills()
                  res.end(roommates);
                })
            } catch (error) {
                console.log(`Error ${error.code}: ${error.message}`);
            }
          }
      
        if(req.url.startsWith('/gasto') && req.method == 'DELETE'){
            try {
                const {id} = url.parse(req.url, true).query
                const gastos = deleteGasto(id, req)
                writeGastos(gastos)
                calculateBills()
                res.end()
            } catch (error) {
                console.log(`Error ${error.code}: ${error.message}`);
            }
        }
        if(req.url.startsWith('/gasto') && req.method == 'PUT'){
            try {
                const {id} = url.parse(req.url, true).query
                let body
    
                req.on('data', (payload)=>{
                    body = JSON.parse(payload)
                })
                req.on('end', ()=>{
                    const new_gastos = updateGasto(body, id, req)
                    writeGastos(new_gastos)
                    calculateBills()
                    res.end()
                })
            } catch (error) {
                console.log(`Error ${error.code}: ${error.message}`);
            }
        }
    }).listen(3000, ()=>{console.log('Server on - Port: 3000 - Process: '+ process.pid);})
}

module.exports = Server