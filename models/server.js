const cors = require('cors')
const express = require('express');
const { dbConnection } = require('../database/config');

class Server{

    constructor(){
        this.app = express();
        this.port = process.env.PORT;


        this.paths={
            auth:'/api/auth',
            buscar:'/api/buscar',
            categorias:'/api/categorias',
            usuarios:'/api/usuarios',
            productos:'/api/productos'
        }
        

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
        this.app.use(this.paths.auth,require('../routes/auth'));
        this.app.use(this.paths.buscar,require('../routes/buscar'));
        this.app.use(this.paths.categorias,require('../routes/categorias'));
        this.app.use(this.paths.usuarios,require('../routes/usuarios'));
        this.app.use(this.paths.productos,require('../routes/productos'));
    }
    
    listen(){

        this.app.listen(process.env.PORT,()=>{
            console.log('Servidor corriendo en el puerto ',this.port)
        })
    }

}

module.exports=Server;