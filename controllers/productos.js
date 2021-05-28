const { response } = require("express");
const {Producto,Categoria} = require("../models");


const obtenerProductos = async (req,res = response)=>{

    const { limite = 5,desde=0} = req.query;
    const query = {estado:true};

    const [total,productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
        .populate('categoria','nombre')
        .populate('usuario','nombre')
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.json({
        total,
        productos});
}

const crearProducto = async (req,res=response)=>{
    const nombre = req.body.nombre.toUpperCase();
    const categoria = req.body.categoria.toUpperCase();
    let precio = 0;

    if(req.body.precio){
        precio = req.body.precio; 
    }

    const productoDB = await Producto.findOne({nombre});
    if(productoDB){
        return res.status(400).json({
            msg: `El Producto ${productoDB.nombre} , ya existe.`
        });
    }

    //Generar la data a Guardar
    const data={
        nombre,
        categoria,
        usuario:req.usuario._id,
        precio
    }

    const producto = await new Producto(data);

    //Guardar DB
    await producto.save();

    res.status(201).json(producto);
}

const obtenerProducto = async (req,res=response)=>{
    const _id = req.params.id;

    const producto = await Producto.findById({_id}).populate("usuario",'nombre').populate("categoria",'nombre');
    
    return res.status(200).json({
        producto
    });
}

const borrarProducto= async (req,res=response)=>{

    const {id} = req.params;

    const producto = await Producto.findByIdAndUpdate(id,{estado:false},{new:true});

    res.json({
        producto
    });

}

const actualizarProducto = async(req,res=response)=>{
    const {id} = req.params;
    const {estado,usuario,...data} = req.body;

    data.usuario = req.usuario._id
    if(data.nombre){
        data.nombre = data.nombre.toUpperCase();
    }

    if(data.categoria){
        const existeCategoria = await Categoria.findById(id);

        if(!existeCategoria){
            return res.status(400).json({
                msg: `La Categoria: ${id} no Existe en la BD `
            });
        }
    }

    //const categoria = await Categoria.findByIdAndUpdate(id,{nombre:nombre.toUpperCase()});

    const producto = await Producto.findByIdAndUpdate(id,data,{new:true});

    res.json({
        msg:'Put API - Controlador',
        producto
    });
}
module.exports = {
    crearProducto,
    obtenerProducto,
    borrarProducto,
    actualizarProducto,
    obtenerProductos
}