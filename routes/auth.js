const { Router } = require('express');
const {check} = require('express-validator');
const { login,googleSignin } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post('/login',[
    check('correo','El Correo es Obligatorio').isEmail(),
    check('password','La contrasea es Obligatoria').not().isEmpty(),
    validarCampos
] ,login);

router.post('/google',[
    check('id_token','El id_token es Necesario').not().isEmpty(),
    validarCampos
] ,googleSignin);

module.exports = router;