import express from 'express'
import logger from'morgan'
import dotenv from 'dotenv'
import mysql from 'mysql2'
// import path from 'path';
// import { fileURLToPath } from 'url';

import {Server} from 'socket.io'    
import { createServer } from 'node:http'
dotenv.config();
const port = process.env.PORT || 3031
const app = express()
// server va contener la app de express para que este habilitado para socket.io
const server = createServer(app)
// io va a ser el servidor de socket.io i - input o - output
const io = new Server(server, {
connectionStateRecovery:{maxDisconnectionDuration :10}
})

// conexión a la base de datos

const db = mysql.createConnection({
    user: process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
})

// conectarnos a la base de datos
db.connect(function(error){                                                                                                 
    try{ 
       //si error es true mandamos el mesaje de error
       if(error){ 

           console.log("Error al establecer la conexión a la BD -- " + error); 

       //conexión exitosa, en este punto ya hemos establecido la conexión a base de datos
       }else{  
           console.log("Conexión exitosa"); 
            //Aquí debes escribir el código que necesites, un INSERT, SELECT etc.
            // simple query
            db.query(
                'SELECT * FROM mensajes WHERE mensajes.id = 1',
                function(err, results, fields) {
                console.log(results); // results contains rows returned by server
                console.log(fields); // fields contains extra meta data about results, if available
                }
            );

            db.query('INSERT INTO mensajes (texto) VALUES(?)', ['toca estudiar más'], function (error, results, fields) {
                if (error) throw error;
                console.log(results)
                console.log(fields)
                // Neat!
              });
              console.log("Nuevo mensaje");
        } 
   }
   catch(x){ 
       console.log("Contacto.agregarUsuario.connect --Error-- " + x); 
   } 
});



// se cera laconexion de socket.io 
io.on('connection', (socket) => {
    console.log('usuario se conecto')
    socket.on('disconnect', () => {
        console.log('usuario se desconecto')
    })
    // recibir mensaje del usuario
    socket.on('mensaje Usuario', (arg) => {
        console.log (arg)
        //se puede hacer un io
        io.emit('mensaje Usuario',arg)
    })
    //mandar mensaje al usuario
    socket.emit('recibir mensaje del server' , "Es un gusto verte de nuevo")
})

// dejar carpeta public 
// Configurar Express para servir archivos estáticos
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public')) 

// acá se utiliza morgan especificamente lo que sería logger para que nos muestre por consola las peticiones que se hacen al servidor y el tiempo de respuesta
app.use(logger('dev'))

app.get('/', (req, res) => {
    res.sendFile(process.cwd()+ '/client/index.html')
    })




server.listen(port, () =>{
    console.log(`Server running on port ${port}`)
})