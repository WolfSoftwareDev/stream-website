const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const {ensureAuthenticated} = require('../config/auth.js');

const User = require('../models/Users');

//Get Requests
router.get('/login', function(req, res, next){
    res.render('login');
});
router.get('/register', function(req, res, next){
    res.render('register')
});
router.get('/logout', function(req, res, next){
    req.logout();
    req.flash('success_msg', 'Successfully Logged Out');
    res.redirect('/')
});

//POST REQUESTS
router.post('/register', function (req, res, next) {
    const { name, email, password, password2} = req.body
    let errors = []

    //check required fields
    if(!name || !email || !password || !password){
        errors.push({msg: 'Please fill out all fields'});
    }

    //Check passwords match
    if(password != password2){
        errors.push({msg: 'Passwords do not match'});
    }

    //Checks password length

    if(password.length < 6 || password.length > 20){
        errors.push({msg: 'Password must be between 6 and 20 charicters'});
    }

    if (errors.length > 0){
        res.render('register', {
            errors,
            name,
            email
        });
    } else {
        User.findOne({email: email}).then(user => {
            if(user){
                errors.push({msg: 'There is already a user with that email'});
                res.render(
                    errors,
                    name,
                    email
                );
            } else {
                const newUser = new User({
                    name,
                    email,
                    password
                });

                //Hash password
                bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err

                    newUser.password = hash;
                    newUser.save().then(user => {
                        req.flash('success_msg', 'Successfully Registered');
                        res.redirect('/users/login')
                    }).catch(err => console.log(err))
                }));

            }
        });
    }
});


router.post('/login', function(req, res, next) {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});


module.exports = router;