const { Router } = require('express');
const {check} = require('express-validator');
const { cargarArchivo,actualizarImagen, mostrarImagen,actualizarImagenCloudinary } = require('../controllers/uploads');
const { validarCampos,validarArchivoSubir } = require('../middlewares');
const {coleccionesPermitidas} = require('../helpers')

const router = Router();

router.post('/',validarArchivoSubir,cargarArchivo);

router.put ('/:coleccion/:id',[
    check('id','El Id debe ser de Mongo').isMongoId(),
    check('coleccion').custom(c=>coleccionesPermitidas(c,['usuarios','productos'])),
    validarCampos
],actualizarImagenCloudinary);
//],actualizarImagen);

router.get('/:coleccion/:id',[
    check('id','El Id debe ser de Mongo').isMongoId(),
    check('coleccion').custom(c=>coleccionesPermitidas(c,['usuarios','productos'])),
    validarCampos
],mostrarImagen)

module.exports = router;