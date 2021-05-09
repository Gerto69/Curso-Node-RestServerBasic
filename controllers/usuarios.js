const {response,request} = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');


const usuariosGet = async(req = request,res = response)=>{

    //const {q,nombre = 'No Name'} = req.query;
    const { limite = 5,desde=0} = req.query;
    const query = {estado:true};
    
    /*const usuarios = await Usuario.find(query)
    .skip(Number(desde))
    .limit(Number(limite));*/

    //const total = await Usuario.countDocuments(query);

    const [total,usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.json(
        total,
        usuarios);
}

const usuariosPost = async (req,res = response)=>{

    const {nombre,correo,password,rol} = req.body;

    //Si envio cosas en el JSON que no esten en el Modelo Mongoose no lo lee
    const usuario = new Usuario({nombre,correo,password,rol});

    //Verificar si el correo existe
   /* const existeEmail = await Usuario.findOne({correo});

    if(existeEmail){
        return res.status(400).json({
            msg:'El Correo ya Existe.'
        })
    }*/

    //Encriptar contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password,salt);
    
    //Guarar BD
    await usuario.save();

    res.json({
        msg:'Post API - Controlador',
        usuario
    });
}

const usuariosPut = async (req,res = response)=>{

    const {id} = req.params;

    const { password, google,correo, ...resto} = req.body;

    //Todo Validad contra BD
    if(password){
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password,salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id,resto);

    res.json({
        msg:'Put API - Controlador',
        usuario
    });
}

const usuariosPatch = (req,res = response)=>{
    res.json({
        msg:'Patch API - Controlador'
    });
}

const usuariosDelete = async (req,res = response)=>{

    const {id} = req.params;

    //Borrar Fisicamente de la BD
    //const usuario = await Usuario.findByIdAndDelete(id);

    const usuario = await Usuario.findByIdAndUpdate(id,{estado:false});

    res.json({
        usuario
    });
}

module.exports={
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}