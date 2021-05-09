const cors = require('cors')
const express = require('express');
const { dbConnection } = require('../database/config');

class Server{

    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosRoutePath = '/api/usuarios';

        //Conectar a BD
        this.conectarDB();


        // Middlewares
        this.middlewares();

        // Rutas de mi Aplicacion
        this.routes();
    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares(){
        // Directorio Publico
        this.app.use(cors());

        //parse y Lentura del Body
        this.app.use(express.json());

        this.app.use(express.static('public'));
    }

    routes(){
        ///api/usuarios este es el Path que toma el Routes Usuarios
        this.app.use(this.usuariosRoutePath,require('../routes/usuarios'));
    }
    
    listen(){

        this.app.listen(process.env.PORT,()=>{
            console.log('Servidor corriendo en el puerto ',this.port)
        })
    }

}

module.exports=Server;