const { Router } = require('express');
const {check} = require('express-validator');
const { login } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post('/login',[
    check('correo','El Correo es Obligatorio').isEmail(),
    check('password','La contrasea es Obligatoria').not().isEmpty(),
    validarCampos
] ,login);

module.exports = router;