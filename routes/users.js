var express = require('express');
var router = express.Router();
var session;
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());
var env = process.env.NODE_ENV || 'development_windows';
var config = require('../config/config')[env];


//Get mysql connection
var connection = require('../config/db_connect');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.redirect('/');
});

router.get('/login', function(req, res, next){
	res.render('user_login', { title: 'Mailer Login' });
});

router.post('/login', function(req, res, next)
{
	// get variables
	user_name	= req.body.user_name;
	password 	= req.body.password;


	// validation part
	if (user_name == null || user_name ==''){
        return res.render('user_login', { title: 'Mailer Login', flashMessage: 'Please specify your user_name.' });
    }

    if (password == null || password ==''){
        return res.render('user_login', { title: 'Mailer Login', flashMessage: 'Please specify your password.' });
    }


    // check in database
	connection.query("SELECT * FROM user WHERE username = ? AND password = ?",[user_name, password], function(err, rows){
        if (err){
            return res.render('user_login', { title: 'Mailer Login', flashMessage: 'Database Not Connected.' });
        }
        if (!rows.length) {
            return res.render('user_login', { title: 'Mailer Login', flashMessage: 'Invalid username/password.' });
        }

        // all is well, return successful user
        session=req.session;
        session.user_name = user_name;


        // Now we need to check and set the role
        session.user_role = rows[0]["role"];

        res.redirect('/users/profile');
    });
});

router.get('/signup', function(req, res, next){
	res.render('user_registration', { title: 'Mailer Registration' });
});

router.post('/signup', function(req, res, next)
{
    // get variables
    user_name   = req.body.user_name;
    password    = req.body.password;
    full_name   = req.body.full_name;
    age         = req.body.age;

    // input validation
    if (user_name == null || user_name ==''){
        return res.render('user_registration', { title: 'Mailer Registration', flashMessage: 'Please specify your user_name.' });
    }

    if (password == null || password ==''){
        return res.render('user_registration', { title: 'Mailer Registration', flashMessage: 'Please specify your password.' });
    }

    if (full_name == null || full_name ==''){
        return res.render('user_registration', { title: 'Mailer Registration', flashMessage: 'Please specify your Full Name.' });
    }

    if (age == null || age ==''){
        return res.render('user_registration', { title: 'Mailer Registration', flashMessage: 'Please specify your age.' });
    }


    // check in database for duplicate user_name
    connection.query("SELECT * FROM user WHERE username = ?",[user_name], function(err, rows){
        if (err){
            return res.render('user_registration', { title: 'Mailer Registration', flashMessage: 'Database Not Connected.' });
        }
        if (rows.length) {
            return res.render('user_registration', { title: 'Mailer Registration', flashMessage: 'Username already exists, please choose anther.' });
        }
        else
        {
            // all is well, return successful user
            // insert into database
            connection.query("INSERT INTO user SET username = ?, password = ?, full_name = ?, age = ?",[user_name, password, full_name, age], function(err, rows){
                if (err){
                    return res.render('user_registration', { title: 'Mailer Registration', flashMessage: 'Database Error During Registration.' });
                }

                // setting session
                session=req.session;
                session.user_name = user_name;

                res.redirect('/users/profile');
            });
        }
        
    });

});

router.get('/profile', function(req, res, next){
    session = req.session;
    if(session.user_name) 
    {
        // check in database
        connection.query("SELECT * FROM user WHERE username = ?",[session.user_name], function(err, rows){
            if (err){
                return res.render('user_login', { title: 'Mailer Login', flashMessage: 'Database Error.' });
            }
            if (!rows.length) {
                return res.render('user_login', { title: 'Mailer Login', flashMessage: 'Invalid username/password.' });
            }

            user_data = rows[0];
            user_id = user_data["id"];

            // user is logged in, getting images
            connection.query("SELECT * FROM uploads WHERE status = 'A'", function(err, rows)
            {
                var uploaded_images_data = [];
                if (err){
                    return res.render('user_login', { title: 'Mailer Login', flashMessage: 'Database Error on getting Images.' });
                }

                if(rows.length) {
                    uploaded_images_data = rows;
                }

                // all is well, return successful user
                res.render('user_profile', { 
                    title: 'Mailer - Profile', 
                    site_header: 'Welcome to your profile '+ session.user_name,
                    username: session.user_name, 
                    user_data: user_data, 
                    uploaded_images_data: uploaded_images_data 
                });
            });
        });
    }
    else
    {
        return res.render('user_login', { title: 'Mailer Login', flashMessage: 'You need to login first.' });
    }
});

router.get('/logout',function(req, res, next){
    
    req.session.destroy(function(err) {
        if(err) {
            console.log(err);
        } else {
            res.redirect('/users/login');
        }
    });
});



module.exports = router;
