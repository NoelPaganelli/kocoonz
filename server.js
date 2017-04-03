var express = require('express');
var mongoose= require('mongoose');
var session = require("express-session");
mongoose.connect('mongodb://localhost/kocoonz' , function(err) {

});
var userSchema = mongoose.Schema({
    email: String,
    password: String
});
var UserModel = mongoose.model('User', userSchema);

var app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(
 session({ 
  secret: 'a4f8071f-c873-4447-8ee2',
  resave: false,
  saveUninitialized: false,
 })
);


app.get('/', function(req, res) {
  res.render("home");
})
app.get('/find', function(req, res) {
  res.render("find");
})
app.get('/login', function(req, res) {
  res.render("login");
})


app.get('/register', function(req, res) {
  console.log(req.query.email+'//'+req.query.password);

  var user = new UserModel ({
   email: req.query.email, 
   password: req.query.password
  });
  user.save(function (error, contact) {
      
      req.session.islogue = true;
      req.session.email =  req.query.email;
      req.session.password = req.query.password;
      
      res.redirect("/");
  });

})


app.get('/register-form', function(req, res) {
  res.render("register");
})

app.get('/hote', function(req, res) {
  
  console.log(req.session.islogue+' / '+req.session.email+' / '+req.session.password);
  
  res.render("hote");
})


app.listen(80, function () {
  console.log("Server listening on port 80");
});