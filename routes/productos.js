const { Router, response } = require('express');
const {check} = require('express-validator');
const { crearProducto,obtenerProducto,borrarProducto,actualizarProducto,obtenerProductos } = require('../controllers/productos');
const { existeCategoria,existeProducto,existeProductoNombre } = require('../helpers/db-validators');
const {validarCampos, validarJWT,tieneRole} = require('../middlewares');

const router = Router();

//Obtener Todas las Producto - Publico
router.get('/',obtenerProductos);

//Middlware para validar ID

//Obtener una Producto por ID - Publico
router.get('/:id',[
    check('id','No es un Id Valido').isMongoId(),
    check('id').custom(existeProducto), //DB VALIDATOR
    validarCampos
],obtenerProducto);

//Crear Producto - privado - Cualquier persona con un Token Valido
router.post('/',[
    validarJWT,
    check('nombre','El nombre es Obligatorio').not().isEmpty(),
    check('categoria').custom(existeCategoria), //DB VALIDATOR
    validarCampos
],crearProducto);

// Actualizar - privado - Cualquiera con Token Valido
router.put('/:id',[
    validarJWT,
    //check('nombre','El nombre es Obligatorio').not().isEmpty(),
    //check('nombre').custom(existeProductoNombre),
    //check('id').custom(existeCategoria), //DB VALIDATOR
    check('id','No es un Id Valido').isMongoId(),
    check('id').custom(existeProducto), //DB VALIDATOR
    validarCampos
],actualizarProducto);

//Borrar una Producto - Admin
router.delete('/:id',[
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    check('id','No es un Id Valido').isMongoId(),
    check('id').custom(existeProducto), //DB VALIDATOR
    validarCampos
],borrarProducto);



module.exports = router;