const Role = require('../models/role');
const Usuario = require('../models/usuario');

const esRoleValido = async(rol='') =>{
    const existeRol = await Role.findOne({rol});
    if(!existeRol){
        throw new Error(`El rol ${rol} no esta registrado en DB`)
    }
}


const emailExiste = async (correo ='')=>{
    const existeEmail = await Usuario.findOne({correo});

    if(existeEmail){
        throw new Error(`El correo: ${correo} ya Existe en la BD `);
    }
}

const existeUsuarioPorId = async (id)=>{
    const existeUsuario = await Usuario.findById(id);

    if(!existeUsuario){
        throw new Error(`El ID: ${id} no Existe en la BD `);
    }
}


module.exports={
    esRoleValido,
    emailExiste,
    existeUsuarioPorId
}