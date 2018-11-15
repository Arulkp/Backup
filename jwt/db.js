//var mongoose=require('mongoose');
//var MongoClient = require('mongodb').MongoClient;
var mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/one',function(err,client){
    if(err){
        console.log(err);
    }
    else{
        console.log("db is connected");
    }
// let dbo=client.db('aion');
// dbo.createCollection('ak');
})
