const { Router } = require('express');
const {check} = require('express-validator');
const { crearCategoria,obtenerCategoria,borrarCategoria,actualizarCategoria,obtenerCategorias } = require('../controllers/categorias');
const { existeCategoria,existeCategoriaNombre } = require('../helpers/db-validators');
const {validarCampos, validarJWT,tieneRole} = require('../middlewares');

const router = Router();

//Obtener Todas las Categorias - Publico
router.get('/',obtenerCategorias);

//Middlware para validar ID

//Obtener una categoria por ID - Publico
router.get('/:id',[
    check('id','No es un Id Valido').isMongoId(),
    check('id').custom(existeCategoria), //DB VALIDATOR
    validarCampos
],obtenerCategoria);

//Crear Categoria - privado - Cualquier persona con un Token Valido
router.post('/',[
    validarJWT,
    check('nombre','El nombre es Obligatorio').not().isEmpty(),
    validarCampos
],crearCategoria);

// Actualizar - privado - Cualquiera con Token Valido
router.put('/:id',[
    validarJWT,
    check('nombre','El nombre es Obligatorio').not().isEmpty(),
    check('nombre').custom(existeCategoriaNombre),
    check('id','No es un Id Valido').isMongoId(),
    check('id').custom(existeCategoria), //DB VALIDATOR
    validarCampos
],actualizarCategoria);

//Borrar una categoria - Admin
router.delete('/:id',[
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    check('id','No es un Id Valido').isMongoId(),
    check('id').custom(existeCategoria), //DB VALIDATOR
    validarCampos
],borrarCategoria);



module.exports = router;