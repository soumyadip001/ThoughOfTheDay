var express = require('express');
var session = require('express-session');
var router = express.Router();
var session;
var multer = require('multer');
var bodyParser = require('body-parser');
var fs = require('fs');
var app = express();
app.use(bodyParser.json());
var env = process.env.NODE_ENV || 'development_windows';
var config = require('../config/config')[env];

var Storage = multer.diskStorage({
     destination: function(req, file, callback) {
         callback(null, "./public/uploaded_img");
     },
     filename: function(req, file, callback) {
         callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
     }
 });
var upload = multer({
        storage: Storage
    }).array("imgUploader", 10);

//Get mysql connection
var connection = require('../config/db_connect');

/* GET users listing. */
router.get('/', function(req, res, next) {
    session = req.session;
    errorMsg 	= req.query.errorMsg;
    successMsg 	= req.query.successMsg;
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
                res.render('gallery', { 
                    title: 'Mailer - Gallery', 
                    site_header: 'Welcome to Gallery '+ session.user_name,
                    username: session.user_name,
                    uploaded_images_data: uploaded_images_data,
                    errorMsg: errorMsg,
                    flashMessageSuccess: successMsg
                });
            });
        });
    }
    else
    {
        return res.render('user_login', { title: 'Mailer Login', flashMessage: 'You need to login first.' });
    }
});

router.post('/upload_image',function(req, res, next)
{
    upload(req, res, function(err) 
    {
        if (err) {
            return res.end("Something went wrong!");
        }
        else
        {
            uploaded_on = "";
            for(var attributename in req.files)
            {
                originalname = req.files[attributename].originalname;
                size = req.files[attributename].size;
                uploaded_path = req.files[attributename].filename;
                encoding = req.files[attributename].encoding;
                mimetype = req.files[attributename].mimetype;

                connection.query("INSERT INTO uploads SET file_name = ?, size = ?, uploaded_path = ?, encoding = ?, mimetype = ?, status = 'A'",
                    [
                        originalname,
                        size,
                        uploaded_path,
                        encoding,
                        mimetype
                    ], 
                    function(err, rows)
                    {
                        if(err){
                            return console.log(err);
                        }
                        // added to db
                    }
                );
            }
        }
        return res.end("File uploaded sucessfully!.");
    });
});

router.get('/remove/:file_id', function(req, res, next)
{
	session = req.session;
    if(session.user_name) 
    {
    	file_id = req.params.file_id;
    	file_id = file_id.trim();

    	connection.query("SELECT * FROM uploads WHERE file_id = ?",[file_id], function(err, rows)
        {
        	if (err)
        	{
                errorMsg = 'Database Error on getting addressbook.';
                return res.redirect('/gallery?errorMsg='+errorMsg);
            }

            if(!rows.length)
            {
            	errorMsg = 'Specified image is not present.';
                return res.redirect('/gallery?errorMsg='+errorMsg);
            }
            else
            {
            	uploaded_images_data = rows[0];
            	connection.query("DELETE FROM uploads WHERE file_id = ?",[file_id], function(err, rows)
            	{
            		if (err)
		        	{
		                errorMsg = 'Database Error on deleting image.';
		                return res.redirect('/gallery?errorMsg='+errorMsg);
		            }

		            fs.unlinkSync('./public/uploaded_img/'+uploaded_images_data.uploaded_path);
	            	flashMessageSuccess = "Image has been deleted successfully!";
	            	res.redirect('/gallery?successMsg='+flashMessageSuccess);
            	});
            }
        });
    }
    else
    {
        return res.render('user_login', { title: 'Mailer Login', flashMessage: 'You need to login first.' });
    }
});

module.exports = router;