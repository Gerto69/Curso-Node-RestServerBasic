
const { response, request } = require('express');
const Usuario = require("../models/usuario");
const jwt = require('jsonwebtoken');

const validarJWT = async (req=request,res = response,next)=>{

    const token = req.header('x-token');

    if(!token){
        return res.status(401).json({
            msg:'No hay token Papu!'
        });
    }

    try {
        const {uid} = jwt.verify(token,process.env.SECRETORPRIVATEKEY);

        const usuario = await Usuario.findById(uid);

        if(!usuario){
            return res.status(401).json({
                msg:"Token no Valido - Usuario no existe en la DB"
            })
        }

        //Verificar si el UID esta activo "ESTADO:TRUE"
        if(!usuario.estado){
            return res.status(401).json({
                msg:"Token no Valido - Usuario Eliminado"
            })
        }

        req.usuario = usuario;

        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            msg:'Token no valido Papu!'
        });

    }

    
}

module.exports={
    validarJWT
}