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
        var site_header = 'Here is the holiday list';
        var title = 'Mailer - Holiday List';

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
                return res.render('not_authorized', { title: title, site_header: site_header });
            }
            else
            {
                connection.query("SELECT * FROM holiday", function(err, rows)
                {
                    var holiday_data = [];
                    if (err){
                        return res.render('user_login', { title: 'Mailer Login', flashMessage: 'Database Error on getting holiday list.' });
                    }

                    if(rows.length)
                    {
                        holiday_data = rows;
                    }
                    // all is well, return holiday
                    res.render('holiday', { 
                        title: title, 
                        username: session.user_name, 
                        site_header: site_header,
                        user_data: user_data, 
                        holiday_data: holiday_data,
                        holiday_count: holiday_data.length,
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
            name = req.body.holiday_name;
            holiday_day = req.body.holiday_day;
            holiday_month = req.body.holiday_month;

            // validation part
			if (name == null || name ==''){
				errorMsg = "Please specify a holiday name";
		        return res.redirect('/holiday/?errorMsg='+errorMsg);
		    }

		    if (holiday_day == null || holiday_day ==''){
		        errorMsg = "Please specify a valid day for the holiday";
		        return res.redirect('/holiday/?errorMsg='+errorMsg);
		    }

		    if (holiday_month == null || holiday_month ==''){
		        errorMsg = "Please specify a valid month for the holiday";
		        return res.redirect('/holiday/?errorMsg='+errorMsg);
		    }

            // check for duplicate holiday entry
            connection.query("SELECT * FROM holiday WHERE holiday_day = ? AND holiday_month = ?",[holiday_day, holiday_month], function(err, rows){
            	if (err){
                    return res.render('user_login', { title: 'Mailer Login', flashMessage: 'Database Error on getting holiday list #1.' });
                }

                if(rows.length)
                {
                	errorMsg = "A holiday with the same date and month already exists!"
                	res.redirect('/holiday?errorMsg='+errorMsg);
                }
                else
                {
                	connection.query("INSERT INTO holiday SET name = ?, holiday_day = ?, holiday_month = ?",
                		[name, holiday_day, holiday_month], 
                		function(err, rows)
			            {
			                if (err){
			                    return res.render('user_login', { title: 'Mailer Login', flashMessage: 'Database Error on inserting into holiday! '+ err});
			                }

			                res.redirect('/holiday');
			            }
			        );
                }
            });
        });
    }
    else
    {
    	return res.render('user_login', { title: 'Mailer Login', flashMessage: 'You need to login first.' });
    }
});

router.get('/remove/:id', function(req, res, next)
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
            id = req.params.id;
            connection.query("DELETE FROM holiday WHERE id = ?",[id], function(err, rows)
            {
                if (err){
                    errorMsg = "Database Error on getting holiday";
		        	return res.redirect('/holiday/?errorMsg='+errorMsg);
                }
                res.redirect('/holiday');
            });
        });
    }
    else
    {
    	return res.render('user_login', { title: 'Mailer Login', flashMessage: 'You need to login first.' });
    }
});


module.exports = router;