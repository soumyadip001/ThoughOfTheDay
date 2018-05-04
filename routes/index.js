var express = require('express');
var session = require('express-session');
var router = express.Router();
var path = require('path');
var async = require('async');

/* GET home page. */
router.get('/', function(req, res, next) 
{
	session = req.session;
    if(session.user_name) {
    	res.redirect('/users/profile');
    }
    else
    {
    	res.render('index.html', { title: 'Mailer' });
    }
});


module.exports = router;
