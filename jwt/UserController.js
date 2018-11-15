var express=require('express');
var router=express.Router();
var bodyParser=require('body-parser');
router.use(bodyParser.urlencoded({extended:true}));
router.use(bodyParser.json())
var User=require('./User')
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config_jwt={
    'secret':'aion',
   'token_expire_time': 1
}
router.post('/verify',function(req,res,next){
    console.log(req.headers)
   var token = req.headers['x-access-token'];
   console.log(token);
    if(!token) return res.status(500).send({auth:false,message:'invalid token'});
    var tok=jwt.verify(token,config_jwt.secret);
    res.json({auth:true,token:tok});
})
router.post('/Register',function(req,res){
 var hashpashword=bcrypt.hashSync(req.body.password,8)
    User.create({
        name:req.body.name,
        email:req.body.email,
        password:hashpashword
    },
function(err,user){
    if(err) return res.status(500).send("There was fetching problem while creating basket");
    res.status(200).send(user)
})
})
router.post('/login',function(req,res){
    User.find({name:req.body.name},function(err,data){
        var password=req.body.password;
        var PassCompare = bcrypt.compareSync(password,data[0].password);
        console.log(PassCompare);
         if(!PassCompare) return res.status(401).json({auth:false,token:null})
        var token=jwt.sign({password:data[0].password},config_jwt.secret,{
            expiresIn:config_jwt.token_expire_time
        })
         res.status(200).json({auth:true,token:token});       
    })
})
router.get('/',function(req,res){
    User.find({},
function(err,user){
    if(err) return res.status(500).send("There was no data");
    res.status(200).send(user)
})
})
// router.get('/Success',authcontrol,(req,res) => {


//     var username = req.name;
//     User.findOne({username}).then(c => {

//             res.status(200).json("This is checked successfully BALA");
//     }).catch(err => {

//             res.status(401).json({auth : false , message : "Invalid token or Invalid Authroization"});
//     })

// })
module.exports=router;