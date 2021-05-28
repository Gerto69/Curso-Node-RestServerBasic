const { response } = require("express");
const {Categoria} = require("../models");
const usuario = require("../models/usuario");

const crearCategoria = async (req,res=response)=>{
    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({nombre});
    if(categoriaDB){
        return res.status(400).json({
            msg: `La Cagetegoria ${categoriaDB.nombre} , ya existe.`
        });
    }

    //Generar la data a Guardar
    const data={
        nombre,
        usuario:req.usuario._id
    }

    const categoria = await new Categoria(data);

    //Guardar DB
    await categoria.save();

    res.status(201).json(categoria);
}

// obtenerCategorias - Paginado - Total - populate


const obtenerCategorias = async (req,res = response)=>{

    const { limite = 5,desde=0} = req.query;
    const query = {estado:true};
    
    const [total,categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
        .populate('usuario','nombre')
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.json({
        total,
        categorias});
}

// obtenerCategoria - Populate {}
const obtenerCategoria = async(req,res=response)=>{
    const _id = req.params.id;

    const categoria = await Categoria.findById({_id}).populate("usuario",'nombre');
    
    return res.status(200).json({
        categoria
    });
    
}

// actualizarCategoria

const actualizarCategoria = async(req,res=response) =>{

    const {id} = req.params;
    const {nombre,usuario,...data} = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id

    //const categoria = await Categoria.findByIdAndUpdate(id,{nombre:nombre.toUpperCase()});

    const categoria = await Categoria.findByIdAndUpdate(id,{data},{new:true});

    res.json({
        msg:'Put API - Controlador',
        categoria
    });
}

// BorrarCategoria - estado:false

const borrarCategoria= async (req,res=response)=>{

    const {id} = req.params;

    const categoria = await Categoria.findByIdAndUpdate(id,{estado:false},{new:true});

    res.json({
        categoria
    });

}

module.exports = {
    crearCategoria,
    obtenerCategoria,
    borrarCategoria,
    actualizarCategoria,
    obtenerCategorias
}