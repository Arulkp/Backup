var mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:40404/passport',function(err,db){
    if(!err){
        console.log("db is conneceted");
    }
})
