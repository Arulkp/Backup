var express=require('express');
var app=express();
var dbconfig=require('./db');
var bodyparser=require('body-parser');
const passport=require('passport');
var users=require('./schema');
app.use(passport.initialize());
app.use(passport.session());
// var usercontrol=require('./usercontroller');
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}))

app.get('/success',(req,res)=>{
    res.status(200).json({message:'welcome'});
})
app.get('/error',(req,res)=>{
    res.status(400).json({message:"error"})
})
app.get('/',function(req,res){
    console.log("file is showd ");
    res.sendFile('auth.html',{root:__dirname})
})
app.post('/register',function(req,res){
    console.log(req.body);
    users.create({
        name:req.body.username,
        password:req.body.password
    },function(err,user){
        if(err) return res.status(500).send("There was fetching problem while creating basket");
        res.status(200).send(user)
    })
})
app.get('/find',function(req,res){
    users.find({},function(err,data){
        res.json(data);
    })
})
passport.serializeUser(function(user,cb){
   console.log("serilized user",user);
    cb(null,user.id);
})
passport.deserializeUser(function(id,cb){
    console.log("id is",id);
   user.findById(id,function(err,user){
       cb(err,user);
   })
})
const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function(username, password, done) {
      console.log(username,password);
      users.findOne({
        name: username
      }, function(err, user) {
          console.log(err,user)
        if (err) {
          return done(err);
        }

        if (!user) {
          return done(null, false);
        }

        if (user.password != password) {
          return done(null, false);
        }
        return done(null, user);
      });
  }
));

app.post('/',passport.authenticate('local', { failureRedirect: '/error' }),
  function(req, res) {
    res.redirect('/success?username='+req.user.name);
  });
console.log(__dirname);
module.exports=app;