
const path = require('path');
const fs = require('fs');

var cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);

const {subirArchivo}=require('../helpers')
const { response } = require("express");
const { Usuario,Producto}=require('../models');


const cargarArchivo = async (req,res=response)=>{
    /*
  Lo hace el Middlewares en Reoutes
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
    res.status(400).json({msg:'No hay archivos que Subir.'});
    return;
  }*/

    try {
      const nombre = await subirArchivo(req.files,undefined,'img');
      res.json({nombre})
    } catch (msg) {
      res.json({msg});
    }
    
}

const actualizarImagen = async (req,res = response)=>{

  /*
  Lo hace el Middlewares en Reoutes
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
    res.status(400).json({msg:'No hay archivos que Subir.'});
    return;
  }*/

  const {id,coleccion} = req.params;

  let modelo;

  switch (coleccion) {
    case 'usuarios':

      modelo = await Usuario.findById(id);
      if(!modelo){
        return res.status(400).json({
          msg:`No Existe un usuario con el Id ${id}`
        });
      }
      
      break;

      case 'productos':

        modelo = await Producto.findById(id);
        if(!modelo){
          return res.status(400).json({
            msg:`No Existe un Producto con el Id ${id}`
          });
        }
      
      break;
  
    default:
      return res.status(500).json({msg:`Se me Olvido validar Esto`});
    
  }

  // Limpiar Imagenes previas
  if(modelo.img){
    // Hay que Borrar la imagen del servidor
    const pathImagen =  path.join( __dirname,'../uploads',coleccion,modelo.img);

    if(fs.existsSync(pathImagen)){
      fs.unlinkSync(pathImagen);
    }
  }

  const nombre = await subirArchivo(req.files,['jpg','png','PNG','jpeg'],coleccion);
  modelo.img = nombre;

  await modelo.save();

  res.json(modelo);
}

const mostrarImagen =  async (req,res=response) =>{
  const {id,coleccion} = req.params;

  let modelo;

  switch (coleccion) {
    case 'usuarios':

      modelo = await Usuario.findById(id);
      if(!modelo){
        return res.status(400).json({
          msg:`No Existe un usuario con el Id ${id}`
        });
      }
      
      break;

      case 'productos':

        modelo = await Producto.findById(id);
        if(!modelo){
          return res.status(400).json({
            msg:`No Existe un Producto con el Id ${id}`
          });
        }
      
      break;
  
    default:
      return res.status(500).json({msg:`Se me Olvido validar Esto`});
    
  }

  // Limpiar Imagenes previas
  if(modelo.img){
    // Hay que Borrar la imagen del servidor
    const pathImagen =  path.join( __dirname,'../uploads',coleccion,modelo.img);

    if(fs.existsSync(pathImagen)){
      return res.sendFile(pathImagen);
    }
  }

  return res.sendFile(path.join( __dirname,'../assets/no-image.jpg'));

}

const actualizarImagenCloudinary = async (req,res = response)=>{

  /*
  Lo hace el Middlewares en Reoutes
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
    res.status(400).json({msg:'No hay archivos que Subir.'});
    return;
  }*/

  const {id,coleccion} = req.params;

  let modelo;

  switch (coleccion) {
    case 'usuarios':

      modelo = await Usuario.findById(id);
      if(!modelo){
        return res.status(400).json({
          msg:`No Existe un usuario con el Id ${id}`
        });
      }
      
      break;

      case 'productos':

        modelo = await Producto.findById(id);
        if(!modelo){
          return res.status(400).json({
            msg:`No Existe un Producto con el Id ${id}`
          });
        }
      
      break;
  
    default:
      return res.status(500).json({msg:`Se me Olvido validar Esto`});
    
  }
  
  // Limpiar Imagenes previas
 // Limpiar imágenes previas
 if ( modelo.img ) {
  const nombreArr = modelo.img.split('/');
  const nombre    = nombreArr[ nombreArr.length - 1 ];
  const [ public_id ] = nombre.split('.');
  cloudinary.uploader.destroy( public_id );
}

  const {tempFilePath} = req.files.archivo

  const {secure_url}= await cloudinary.uploader.upload(tempFilePath);
  modelo.img = secure_url;

  await modelo.save();

  res.json(modelo);
}

module.exports ={
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}