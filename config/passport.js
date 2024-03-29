//node modules
const LocalStartegy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//User model
const User = require('../models/Users');

module.exports = function(passport){
    passport.use(
        new LocalStartegy({usernameField: 'email'}, (email, password, done) => {
            //Match User
            User.findOne({
                email:email
            }).then(user => {
                if(!user){
                    return(done(null, false, {message: 'That email is not Registered'}))
                }
            //Match Password
            bcrypt.compare(password, user.password, (err, isMatch)=> {
                if(err) throw err;
                if(isMatch){
                    return(done(null, user))
                }else{
                    return(done(null, false, {message: 'Password Incorrect'}));
                }
            });
        });
    }));
    passport.serializeUser(function(user, done) {
       done(null, user.id);
    });
    passport.deserializeUser(function(id, done){
        User.findById(id, function(err, user){
            done(err, user);
        });
    })
}