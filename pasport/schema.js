var mongoose=require('mongoose');
var Usersschema = new mongoose.Schema({
    name:{
        type:String
    },

    password:{
        type:String
    }
})
module.exports=mongoose.model('user',Usersschema);