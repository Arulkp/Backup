var express=require('express');
var app=express();
var multer=require('multer');
var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, './uploads');
    },
    filename: function (req, file, callback) {
      callback(null, file.fieldname + '-' + Date.now());
    }
  });
  var upload = multer({ storage : storage}).single('userPhoto');
  //var upload = multer({ storage : storage }).array('userPhoto',2);   for sharing multiple file
app.get('/',function(req,res){
 res.sendFile('index.html',{root:__dirname});
})
app.post('/photo',function(req,res){
    upload(req,res,function(err) {
        if(err) {
            console.log(err);
            return res.end("Error uploading file.");
        }
        res.end("File is uploaded");
    });
});

app.listen(3001)