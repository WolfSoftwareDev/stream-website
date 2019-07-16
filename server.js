//node packages
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

//Initiate Web App
const app = express()

//passport config
require('./config/passport')(passport);

//Database
const db = require('./config/keys').MongoURI;
mongoose.connect(db, {useNewUrlParser:true}).then(() => console.log('Success: Connected to the database')).catch(err => console.log(err));

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', './views');

//body parser
app.use(express.urlencoded({extended:false}));

//Express Middleware
app.use(session({
    secret: 'Stream',
    resave: true,
    saveUninitialized: true
}));

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect Flash
app.use(flash());

//Global Variables
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next()
});

//routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

app.get('*', function(req, res, next){
    res.redirect('/')
});

//Server Listener
const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`Server started on port: ${PORT}`));