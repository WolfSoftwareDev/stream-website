const express = require('express');
const router = express.Router();
const passport = require('passport');
const {ensureAuthenticated} = require('../config/auth.js');

const User = require('../models/Users');

//Get Requests
router.get('/', ensureAuthenticated, function(req, res, next) {
    res.render('home');
});

router.get('/nl/', function(req, res, next) {
    res.render('home-nl');
});

module.exports = router;