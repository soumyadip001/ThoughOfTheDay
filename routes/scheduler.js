var express = require('express');
var session = require('express-session');
var datetime = require('node-datetime');
var router = express.Router();
var env = process.env.NODE_ENV || 'development_windows';
var config = require('../config/config')[env];

//Get mysql connection
var connection = require('../config/db_connect');


/* GET crete_schedule page. */
router.get('/crete_schedule', function(req, res, next) 
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

            // all is well, return successful user
            res.render('crete_schedule', { title: 'Create Mailer Schedule', username: session.user_name });
        });
    }
    else
    {
        return res.render('user_login', { title: 'Mailer Login', flashMessage: 'You need to login first.' });
    }
});



router.post('/crete_schedule', function(req, res, next) 
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
		    email_title   		= req.body.email_title;
		    triggered_date    	= req.body.triggered_date;
		    triggered_time   	= req.body.triggered_time;
		    email_body         	= req.body.email_body;
		    created_by 			= rows[0]["id"];
		    created_by_username = rows[0]["username"];
		    
		    dt 					= datetime.create();
			created_on 			= dt.format('m/d/Y H:M:S');
			status 				= 'A';

			if (email_title == null || email_title ==''){
		        email_title 	= "Thought of the Day!";
		    }

		    if (email_body == null || email_body ==''){
		        return res.render('crete_schedule', { title: 'Mailer Registration', flashMessage: 'Please write something inside the mail body.' });
		    }

		    connection.query("INSERT INTO emails SET mail_title = ?, mail_body = ?, schedule_date = ?, schedule_time = ?, status = ?, created_by = ?, created_by_username =?, created_on = ?",[email_title, email_body, triggered_date, triggered_time, status, created_by, created_by_username, created_on], 
		    	function(err, rows)
		    	{
	                if (err){
	                    return res.render('user_registration', { title: 'Mailer Registration', flashMessage: 'Database Error During Registration.' });
	                }

	                // setting session
	                session=req.session;
	                session.user_name = created_by_username;

	                return res.render('crete_schedule', { title: 'Create Mailer Schedule', flashMessageSuccess: 'Mail has been scheduled successfully.' });
            	}
            );

        });
    }
    else
    {
        return res.render('user_login', { title: 'Mailer Login', flashMessage: 'You need to login first.' });
    }
});


router.get('/delete/:mail_id', function(req, res, next)
{
	mail_id   		= req.params.mail_id;

	connection.query("SELECT * FROM emails WHERE id = ? AND status != 'D'", [mail_id], function(err, rows){
		if (err){
            return res.render('user_login', { title: 'Mailer Profile', flashMessage: 'Database Error on delete operation.'+err });
        }

        if (!rows.length) {
            return res.render('user_login', { title: 'Mailer Profile', flashMessage: 'Invalid Identifier.' });
        }

        // valid mail id given
        session = req.session;
        user_name = session.user_name;

        if(user_name !== rows[0]["created_by_username"])
        {
        	return res.render('user_login', { title: 'Mailer Profile', flashMessage: 'You are not authorized to perform this action.' });
        }

        // everything is fine
        connection.query("UPDATE emails SET status = 'D' WHERE id = ?",[mail_id], function(err, rows){
        	if (err){
	            return res.render('user_login', { title: 'Mailer Profile', flashMessage: 'Database Error2 on delete operation.'+err });
	        }

	        //res.render('user_profile', { title: 'Mailer Profile', flashMessageSuccess: 'Deleted Successfully!' });
	        res.redirect('/users/profile');
        });
	});
});

router.get('/view/:mail_id', function(req, res, next)
{
	mail_id   		= req.params.mail_id;
	//res.send('viewing mail id: '+mail_id+' .Work on progress');

	connection.query("SELECT * FROM emails WHERE mail_id = ? AND status = A",[mail_id], function(err, rows)
    {
        var pending_mails_data = [];
        if (err){
            return res.render('user_login', { title: 'Mailer Login', flashMessage: 'Database Error on getting pending mails.' });
        }

        if(rows.length) {
            pending_mails_data = rows;
        }

        // all is well, return successful user
        res.render('user_profile', { title: 'Mailer - Profile', username: session.user_name, user_data: user_data, pending_mails_data: pending_mails_data });
    });
});





module.exports = router;