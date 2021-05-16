const {response}=require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const{generarJWT} = require('../helpers/generar-jwt');

const login = async (req,res =response)=>{

    const { correo,password } = req.body;

    try{

        //verificar si el email existe
        const usuario = await Usuario.findOne({correo});
        if(!usuario){
            return res.status(400).json({
                msg:'Usuario / Password no son correctos - Correo'
            })
        }

        // si el usuario esta activo

        if(!usuario.estado){
            return res.status(400).json({
                msg:'Usuario / Password no son correctos - Estado:False'
            })
        }

        //Verificar contraseña

        const validPassword = bcryptjs.compareSync(password,usuario.password);

        if(!validPassword){
            return res.status(400).json({
                msg:'Usuario / Password no son correctos - Password'
            })
        }

        //Genera JWT
        const token = await generarJWT(usuario.id);


        res.json({
                usuario,
                token
            })

    }catch(error){
        console.status(500).log(error);
        res.json({
            msg:'Hable con el Administrador.'
        })
    }

    
}

module.exports = {
    login
}