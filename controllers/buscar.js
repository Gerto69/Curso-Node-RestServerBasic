const { response}=require('express');
const{ObjectId} = require('mongoose').Types;

const { Usuario,Categoria,Producto} = require('../models');

const coleccionesPermitidas = [
    'usuarios',
    'productos',
    'categoria',
    'roles'
];

const buscarUsuarios = async (termino ='',res = response)=>{
    const esMongoID = ObjectId.isValid(termino);//true

    if(esMongoID){
        const usuario = await Usuario.findById(termino);
        return res.json({
            results:(usuario) ? [usuario]:[]
        });
    }

    const regex = new RegExp(termino,'i')

    const usuarios = await Usuario.find({
        $or:[{nombre:regex},{correo:regex}],
        $and:[{estado:true}]
    });

    return res.json({
        results:(usuarios) ? [usuarios]:[]
    });
}

const buscarCategorias = async (termino='',res=response)=>{
    const esMongoID = ObjectId.isValid(termino);//true

    if(esMongoID){
        const categoria = await Categoria.findById(termino);
        return res.json({
            results:(categoria) ? [categoria]:[]
        });
    }

    const regex = new RegExp(termino,'i')

    const categorias = await Categoria.find({nombre:regex,estado:true});

    return res.json({
        results:(categorias) ? [categorias]:[]
    });
}

const buscarProductos = async (termino='',res=response)=>{
    const esMongoID = ObjectId.isValid(termino);//true

    if(esMongoID){
        const producto = await (await Producto.findById(termino)).populate('categoria','nombre');
        return res.json({
            results:(producto) ? [producto]:[]
        });
    }

    const regex = new RegExp(termino,'i')

    const productos = await Producto.find({nombre:regex}).populate('categoria','nombre');

    return res.json({
        results:(productos) ? [productos]:[]
    });
}

const buscar = (req,res = response)=>{

    const { coleccion,termino} = req.params;

    if(!coleccionesPermitidas.includes(coleccion)){
        return res.status(400).json({
            msg:`Las colecciones Permitidas son: ${coleccionesPermitidas}`
        })
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino,res);
        break;

        case 'productos':
            buscarProductos(termino,res);
        break;

        case 'categoria':
            buscarCategorias(termino,res);
        break;
    
        default:
            res.status(500).json({
                msg:`Se me olvido hacer esta Busqueda ${coleccion}`
            })
        break;
    }

    
}

module.exports={
    buscar
}