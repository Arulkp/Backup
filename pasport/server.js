var app=require('./app');
var Boom=require('boom')
//console.log("Boom is",Boom)

app.listen(4000,function(err,res){
    console.log("server is running in port 4000");
})