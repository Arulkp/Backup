var mongoose =require('mongoose');

var Userschme=new mongoose.Schema({
    name:String,
    email:String,
    password:String,
});
//mongoose.model('User',Userschme);
module.exports=mongoose.model('User',Userschme);