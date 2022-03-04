const axios = require('axios')

async function apiCall(){
    const {data} = await axios.get('https://randomuser.me/api')
    const roommate = {
        nombre: `${data.results[0].name.first} ${data.results[0].name.last}`,
        email: data.results[0].email,
        debe: 0,
        recibe: 0
    }
    return roommate
}

module.exports = apiCall