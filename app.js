var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var passportLocalMongoose = require('passport-local-mongoose');
var User = require("./models/User");
const app = express();
app.set("view engine", "pug");
app.use(express.urlencoded({ extended: true }));
app.use(require("express-session")({
    secret: "Koddunyam ile yaparsin",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

require('dotenv').config();
const { listenerCount } = require('process');

mongoose.connect(process.env.DATABASE, {
   useNewUrlParser: true,
   useUnifiedTopology: true   
});

mongoose.connection
    .on('open', () => {
        console.log('Mongoose baglantisi olusturuldu!');
    })
    .on('error', (err) => {
        console.log(`Baglanti hatasi: ${err.message}`);
    });





//################
// Yönlendirmeler:
//################

// AnaSayfaya
app.get('/', function (req, res){
    res.render("anasayfa");
});

// Giris Yapilan icerik sayfasi
app.get('/icerik', isLoggedIn, function (req, res){
    res.render('icerik');
});

// Kayit Sayfasina Yönlendirme
app.get('/kayit', function (req, res){
    res.render('kayit');
});

// Kayit Post verisi:
app.post('/kayit', function (req, res){
    var username = req.body.username
    var password = req.body.password
    User.register(new User({username: username }),
            password, function (err, user){
                if (err) {
                    console.log(err);
                    return res.render("kayit");
                }

                passport.authenticate('local')(
                    req, res, function(){
                        res.render("giris");
                });
        });
});

// Giris Yapma Formu
app.get('/giris', function (req, res){
    res.render('giris');
});

// Kullanici girisi Post Verisi
app.post('/giris', passport.authenticate("local", {
    successRedirect: '/icerik',
    failureRedirect: '/giris'
    }), function (req, res){
});

// Kullanici Cikis Yönlendirmesi
app.get('/cikis', function (req,res){
    req.logout();
    res.redirect('/');
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/giris');
}

var port = process.env.PORT || 3000;
app.listen(port, function(){
    console.log(`Server Servisi Port: ${port} üzerinde baslatildi!`)
});