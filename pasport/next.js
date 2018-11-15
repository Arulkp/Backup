var express=require('express');
var app=express();
app.use((req, res, next) => {
    console.log('This is a middleware')
    next()
    console.log('This is first-half middleware')
  })
  
  app.use((req, res) => {
    console.log('This is second middleware')
  })
  
//   app.use((req, res, next) => {
//     console.log('This is third middleware')
//     next()
//   })
  app.listen(4000);