const { response, request } = require("express")

const esAdminRole = (req=request,res  = response,next) =>{
    if(!req.usuario){
        return res.status(500).json({
            ms:'Se quiere verificar el Role sin validar el Token'
        });
    }

    const {rol,nombre} = req.usuario;

    if(rol!== 'ADMIN_ROLE'){
        return res.status(401).json({
            msg: `${nombre} no es administrador - No puede hacer esto`
        })
    }

    next();
}

const tieneRole = (...roles) => {
    return (req=request,res  = response,next)=>{

        if(!req.usuario){
            return res.status(500).json({
                ms:'Se quiere verificar el Role sin validar el Token'
            });
        }

        if(roles.includes(req.usuario.rol)){
            return res.status(401).json({
                msg: `${req.usuario.nombre} El servicio requiere uno de estos Roles ${roles}`
            });
        }
        next();
    }
}

module.exports = {
    esAdminRole,
    tieneRole
}