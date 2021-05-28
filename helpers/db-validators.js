
const {Role, Usuario,Categoria,Producto} = require('../models');
const producto = require('../models/producto');



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

const existeCategoria = async (id)=>{
    const existeCategoria = await Categoria.findById(id);

    if(!existeCategoria){
        throw new Error(`El ID: ${id} no Existe en la BD `);
    }
}

const existeCategoriaNombre = async (nombre='')=>{
    const existeCategoria = await Categoria.findOne({nombre:nombre.toUpperCase()});

    if(existeCategoria){
        throw new Error(`La Categoria: ${categoria} ya Existe en la BD `);
    }
}

const existeProducto = async (id)=>{
    const existeProducto = await Producto.findById(id);

    if(!existeProducto){
        throw new Error(`El ID: ${id} no Existe en la BD `);
    }
}

const existeProductoNombre = async (nombre='')=>{
    const existeProducto = await Producto.findOne({nombre:nombre.toUpperCase()});

    if(existeProducto){
        throw new Error(`El producto: "${nombre}" ya Existe en la BD `);
    }
}


module.exports={
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoria,
    existeCategoriaNombre,
    existeProducto,
    existeProductoNombre
}