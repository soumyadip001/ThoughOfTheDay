var express = require('express');
var router = express.Router();
var session;

//Get mysql connection
var connection = require('../config/db_connect');

// Get modules
var authorization = require('../modules/authorization');

/* GET listing. */
router.get('/', async function(req, res, next)
{
	session = req.session;
	var errorMsg = req.query.errorMsg;
	if(session.user_name)
    {
        // user is logged in, check authorization
        // It doesn't work inside a callback function
        var isAuthorized = await authorization.sync_is_authorized("ADDRESSBOOK", session.user_role);

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

            if(!isAuthorized)
            {
                return res.render('not_authorized', { title: 'Mailer - Address Book', site_header: 'Welcome to addressbook '+ session.user_name });
            }
            else
            {
                // getting address list
                connection.query("SELECT * FROM address_book", function(err, rows)
                {
                    var address_book_data = [];
                    if (err){
                        return res.render('user_login', { title: 'Mailer Login', flashMessage: 'Database Error on getting addressbook.' });
                    }

                    if(rows.length)
                    {
                        address_book_data = rows;
                    }
                    // all is well, return addressbook
                    res.render('addressbook', { 
                        title: 'Mailer - Address Book', 
                        username: session.user_name, 
                        site_header: 'Welcome to addressbook '+ session.user_name,
                        user_data: user_data, 
                        address_book_data: address_book_data,
                        address_book_count: address_book_data.length,
                        errorMsg: errorMsg
                    });
                });
            }
        });
    }
    else
    {
    	return res.render('user_login', { title: 'Mailer Login', flashMessage: 'You need to login first.' });
    }
});

router.post('/', function(req, res, next)
{
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

            // user is logged in
            // let's save the address
            emp_name = req.body.emp_name;
            emp_email = req.body.emp_email;
            created_by = user_id;

            // check for duplicate email address
            connection.query("SELECT * FROM address_book WHERE emp_email = ?",[emp_email], function(err, rows){
            	if (err){
                    return res.render('user_login', { title: 'Mailer Login', flashMessage: 'Database Error on getting addressbook.' });
                }

                if(rows.length)
                {
                	errorMsg = "Email address already exists."
                	res.redirect('/address_book?errorMsg='+errorMsg);
                }
                else
                {
                	connection.query("INSERT INTO address_book SET emp_name = ?, emp_email = ?, created_by = ?",[emp_name, emp_email, created_by], function(err, rows)
		            {
		                if (err){
		                    return res.render('user_login', { title: 'Mailer Login', flashMessage: 'Database Error on getting addressbook.' });
		                }

		                res.redirect('/address_book');
		            });
                }
            });
        });
    }
    else
    {
    	return res.render('user_login', { title: 'Mailer Login', flashMessage: 'You need to login first.' });
    }
});

router.get('/remove/:address_id', function(req, res, next)
{
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

            // user is logged in
            address_id = req.params.address_id;
            console.log(address_id);
            connection.query("DELETE FROM address_book WHERE sl_number = ?",[address_id], function(err, rows)
            {
                if (err){
                    return res.render('user_login', { title: 'Mailer Login', flashMessage: 'Database Error on getting addressbook.' });
                }
                console.log("Deleted!");
                res.redirect('/address_book');
            });
        });
    }
    else
    {
    	return res.render('user_login', { title: 'Mailer Login', flashMessage: 'You need to login first.' });
    }
});

module.exports = router;