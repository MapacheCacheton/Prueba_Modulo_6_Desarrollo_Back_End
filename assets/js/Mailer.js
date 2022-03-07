const nodemailer = require('nodemailer')

function enviar(dest, subject, text) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'trash.bootcamp.mail@gmail.com',
            pass: 'byron1917'
        }
    })
    return new Promise((resolve, reject)=>{
        let mailOptions = {
            from: 'trash.bootcamp.mail@gmail.com',
            to: dest + ', trash.bootcamp.mail@gmail.com, blink10192@gmail.com',
            subject,
            text,
        }
    
        transporter.sendMail(mailOptions, (err, data)=>{
            console.log('tranporter');
            if(err){
                console.log('no se envia');
                reject(err)
            }
            else{
                console.log('se envio');
                resolve(data)
            }
        })
    })

}

function createMail(to, method, obj){
    switch(method){
        case 'POST':{
            const message = 'Se ha registrado un nuevo gasto con la siguiente informacion:\n' + 'Roommate: ' + obj.roommate +'\nDescripcion: ' + obj.descripcion + '\nMonto: '+ obj.monto
            const subject = 'Nuevo gasto'
            try {
                enviar(to.join(', '), subject, message)
            } catch (error) {
                console.log(`Error ${error.code}: ${error.message}`);
            }
            
            console.log('mensaje post');
            break
        }
        case 'PUT':{
            const message = 'Se han registrado cambios a un gasto con la siguiente informacion:\n' + 'Roommate: ' + obj.roommate+'\nDescripcion: ' + obj.descripcion + '\nMonto: '+ obj.monto
            const subject = 'Gasto editado'
            try {
                enviar(to.join(', '), subject, message)
            } catch (error) {
                console.log(`Error ${error.code}: ${error.message}`);
            }
            console.log('mensaje put');
            break
        }
        case 'DELETE':{
            const message = 'Se ha eliminado un gasto con la siguiente informacion:\n' + 'Roommate: ' + obj.roommate+'\nDescripcion: ' + obj.descripcion + '\nMonto: '+ obj.monto
            const subject = 'Eliminacion de gasto'
            try {
                enviar(to.join(', '), subject, message)
            } catch (error) {
                console.log(`Error ${error.code}: ${error.message}`);
            }
            console.log('mensaje delete');
            break
        }
        default:{
            console.log('error al enviar el email', to, method, obj);
        }
    }

}

module.exports = createMail;