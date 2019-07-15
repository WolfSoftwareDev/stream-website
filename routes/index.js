const express = require('express');
const router = express.Router();
const passport = require('passport');

const User = require('../models/Users');

//Get Requests
router.get('/', function(req, res, next) {
    res.render('home');
});

module.exports = router;