const{Schema,model}= require('mongoose');

const UsuarioSchema = Schema({
    nombre:{
        type:String,
        required:[true,'El nombre es Obligatorio']
    },
    correo:{
        type:String,
        required:[true,'El correo es Obligatorio'],
        unique:true
    },
    password:{
        type:String,
        required:[true,'La contraseña es Oblitaria']
    },
    createImageBitmap:{
        type:String
    },
    rol:{
        type:String,
        required:true,
        default:'USER_ROLE',
        enum:['ADMIN_ROLE','USER_ROLE']
    },
    estado:{
        type:Boolean,
        default:true
    },
    google:{
        type:Boolean,
        default:false
    },
    img:{type:String}
});

UsuarioSchema.methods.toJSON = function(){
    const {__v,password,_id,...usuario} = this.toObject();
    usuario.uid= _id;

    return usuario;
}

module.exports=model('Usuario',UsuarioSchema);