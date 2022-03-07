const axios = require('axios')
const {v4:uuidv4} = require('uuid')

async function apiCall(){
    const {data} = await axios.get('https://randomuser.me/api')
    const roommate = {
        id: uuidv4().slice(0,6),
        nombre: `${data.results[0].name.first} ${data.results[0].name.last}`,
        email: data.results[0].email,
        debe: 0,
        recibe: 0
    }
    return roommate
}

module.exports = apiCall