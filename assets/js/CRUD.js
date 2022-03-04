const fs = require('fs')
const { brotliCompressSync } = require('zlib')

function writeRoommates(data){
    if(fs.existsSync(__dirname+'./../DB/roommates.json')){
        const arr_data = readRoommates()
        arr_data.push(data)
        calculateBills(arr_data)
        const obj = {
            roommates: arr_data
        }
        
        fs.writeFileSync(__dirname+'./../DB/roommates.json', JSON.stringify(obj, null, ' '))
        return JSON.stringify(obj)
    }else{
        const arr_data = []
        arr_data.push(data)
        const obj = {
            roommates: arr_data
        }
        
        fs.writeFileSync(__dirname+'./../DB/roommates.json', JSON.stringify(obj, null, ' '))
        return JSON.stringify(obj)
    }
    
}

function readRoommates(){
    const {roommates} = JSON.parse(fs.readFileSync(__dirname+'./../DB/roommates.json'))
    return roommates
}

function writeGastos(data){
    data.gastos.sort(sortArray)
    fs.writeFileSync(__dirname+'/../DB/gastos.json', JSON.stringify(data, null, ' '))
}

function readGastos(){
    const {gastos} = JSON.parse(fs.readFileSync(__dirname+'/../DB/gastos.json'))
    return gastos
}

function createID(){
    if(fs.existsSync(__dirname+'/../DB/gastos.json')){
        const gastos = readGastos()
        let last_id = 1
        console.log(gastos[0]);
        for (let i = 0; i < gastos.length; i++) {
            if(gastos[i].id==last_id){
                last_id ++
                if(!gastos[i+1]){
                    return last_id
                }
            }
            else if(gastos[i-1] && last_id > gastos[i-1].id && last_id < gastos[i].id){
                return last_id
            }
            else if(last_id < gastos[i].id && !gastos[i+1]){
                return last_id
            }
        } 
        return last_id   
    }
    else{
        return 1
    }
}

function deleteGasto(id){
    const {gastos} = JSON.parse(fs.readFileSync(__dirname+'/../DB/gastos.json'))
    console.log(gastos);
    const new_gastos = gastos.filter(gasto => gasto.id != id)
    console.log(new_gastos);
    const obj_gastos ={
        gastos: new_gastos
    }
    return obj_gastos
}

function updateGasto(body, id){
    const {gastos} = JSON.parse(fs.readFileSync(__dirname+'/../DB/gastos.json'))
    const gastos_mod = gastos.filter(gasto => gasto.id != id)
    const obj_new_gasto = {
        id: Number(id),
        roommate: body.roommate,
        descripcion: body.descripcion,
        monto: body.monto
    }
    gastos_mod.push(obj_new_gasto)
    const new_gastos = {
        gastos: gastos_mod.sort(sortArray)
    }
    return new_gastos
}

function sortArray(x, y){
    if (x.id < y.id) {return -1;}
    if (x.id > y.id) {return 1;}
    return 0;
}

function calculateBills(r){
    if(fs.existsSync(__dirname+'/../DB/gastos.json')){
        const gastos = readGastos()
        const roommates = r || readRoommates()
        const cantidad_rm = roommates.length
        for (const roommate of roommates) {
            roommate.debe = 0
            roommate.recibe = 0
        }
        
        for (const gasto of gastos) {
            for (const roommate of roommates) {
                if(roommate.nombre != gasto.roommate){
                    roommate.debe += Math.round((gasto.monto/cantidad_rm))
                }
                else{
                    roommate.recibe += Math.round((gasto.monto/cantidad_rm) * (cantidad_rm-1))
                }
            }
        }
        if(r){
            return roommates
        }
        else{
            fs.writeFileSync(__dirname+'./../DB/roommates.json', JSON.stringify({roommates:roommates}, null, ' '))
        }
    }
    if(r){
        return r
    }
}

module.exports = {writeRoommates, readRoommates, writeGastos, readGastos, createID, deleteGasto, updateGasto, calculateBills}