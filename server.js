var express = require('express');
var mongoose= require('mongoose');
var session = require("express-session");
mongoose.connect('mongodb://localhost/kocoonz' , function(err) {

});

var homeSchema = mongoose.Schema({
  title:String,
  desc: String,
  location: String,
  price: Number
});

var userSchema = mongoose.Schema({
    email: String,
    password: String,
    home: [homeSchema]
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


app.get('/check-login', function(req, res) {

  UserModel.find( { email: req.query.email, password: req.query.password} , function (err, user) {
    if(user.length > 0) {
      req.session.islogue = true;
      req.session.email =  user[0].email;
      req.session.password = user[0].password;  
      res.redirect("/");
    } else {
     res.redirect("/login");
    }

  });

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
  
  if(req.session.islogue == true) {
    res.render("hote");
  } else {
    res.redirect("/login");
  }
})

app.get('/register-hote', function(req, res) {
  console.log(req.query.title+'/'+req.query.desc+'/'+req.query.location+'/'+req.query.price);

  UserModel.find( { email: req.session.email, password: req.session.password} , function (err, user) {

    user[0].home.push({  
      title: req.query.title,
      desc: req.query.desc,
      location: req.query.location,
      price: req.query.price
    });

    user[0].save();
    res.redirect("/");
    
  })
  
})

app.listen(80, function () {
  console.log("Server listening on port 80");
});