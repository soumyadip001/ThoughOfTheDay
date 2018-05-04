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
	var errorMsg 	= req.query.errorMsg;
	var successMsg 	= req.query.successMsg;

	if(session.user_name) 
    {
        var site_header = 'Content writer page '+ session.user_name;
        var title = 'Mailer - Content Writer Page';

        // user is logged in, check authorization
        // It doesn't work inside a callback function
        var isAuthorized = await authorization.sync_is_authorized("ADDRESSBOOK", session.user_role);
        if(!isAuthorized)
        {
            return res.render('not_authorized', { title: title, site_header: site_header });
        }

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

            // user is logged in, getting address list
            connection.query("SELECT * FROM user WHERE role = 'CW'", function(err, rows)
            {
                var user_cw_data = [];
                if (err){
                    return res.render('user_login', { title: 'Mailer Login', flashMessage: 'Database Error on getting content_writer.' });
                }

                if(rows.length)
                {
                    user_cw_data = rows;
                }
                // all is well, return content_writer page
                res.render('content_writer', { 
                	title: title, 
                	username: session.user_name, 
                    site_header: site_header,
                	user_data: user_data, 
                	user_cw_data: user_cw_data,
                	user_cw_count: user_cw_data.length,
                	errorMsg: errorMsg,
                	successMsg: successMsg,
               	});
            });
        });
    }
    else
    {
    	return res.render('user_login', { title: 'Mailer Login', flashMessage: 'You need to login first.' });
    }
});

router.post('/', function(req, res, next)
{
	// get variables
	user_name	= req.body.username;
	password 	= req.body.password;

	// validation part
	if (user_name == null || user_name =='')
	{
		errorMsg = "Please specify your user_name";
        return res.redirect('/content_writer?errorMsg='+errorMsg);
    }

    if (password == null || password =='')
    {
    	errorMsg = "Please specify your password";
        return res.redirect('/content_writer?errorMsg='+errorMsg);
    }

    session = req.session;
    if(!session.user_name)
    {
    	return res.redirect('/users/login');
    }

    // check in database for duplicate entry
	connection.query("SELECT * FROM user WHERE username = ? AND password = ? AND role = 'CW'",[user_name, password], function(err, rows){
        if (err)
        {
            errorMsg = "DB error on getting user list!";
        	return res.redirect('/content_writer?errorMsg='+errorMsg);
        }
        if (rows.length)
        {
        	errorMsg = "Same user already exist!";
        	return res.redirect('/content_writer?errorMsg='+errorMsg);
        }
        else
        {
	        // all is well, return successful user
        	connection.query("INSERT INTO user SET username = ?, password = ?, full_name = 'Content Writer', role = 'CW', status = 'A'",[user_name, password], function(err, rows)
            {
                if (err)
                {
                    errorMsg = 'Database Error on getting addressbook.';
                    return res.redirect('/content_writer?errorMsg='+errorMsg);
                }
                else
                {
                	successMsg = "Added Successfully!";
        			res.redirect('/content_writer?successMsg='+successMsg);
                }
            });
        }
    });
});

router.get('/remove/:user_id', function(req, res, next)
{
	session = req.session;
	if(session.user_name) 
    {
    	// check in database
        connection.query("SELECT * FROM user WHERE username = ?",[session.user_name], function(err, rows){
            if (err){
                errorMsg = "DB error on getting user list!";
        		return res.redirect('/content_writer?errorMsg=' + errorMsg);
            }
            if (!rows.length) {
                errorMsg = "Invalid username/password";
                return res.redirect('/content_writer?errorMsg=' + errorMsg);
            }

            // user is logged in
            user_id = req.params.user_id;
            console.log(user_id);
            connection.query("DELETE FROM user WHERE id = ?",[user_id], function(err, rows)
            {
                if (err)
                {
                    errorMsg = "DB error on getting user list!";
        			return res.redirect('/content_writer?errorMsg=' + errorMsg);
                }
                console.log("Deleted!");
                successMsg = "Deleted Successfully!";
                res.redirect('/content_writer?successMsg=' + successMsg);
            });
        });
    }
    else
    {
    	return res.render('user_login', { title: 'Mailer Login', flashMessage: 'You need to login first.' });
    }
});

module.exports = router;