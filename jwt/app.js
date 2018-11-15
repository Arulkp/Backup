var express =require('express');
var app=express();
var db = require('./db');
console.log("server file is run")
var Usercontroller=require('./UserController');
app.use('/users',Usercontroller);
module.exports=app;