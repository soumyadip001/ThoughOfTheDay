
var connection = require('./config/db_connect');
var nodemailer = require("nodemailer");
var nunjucks  = require('nunjucks');
nunjucks.configure(__dirname + '/email_templates', {
  autoescape: true,
});

var today = new Date().toLocaleString('en-us', {  weekday: 'long' });
var current_day_in_number = new Date().getDate();
var current_month_in_number = new Date().getMonth() + 1;
var all_emails = [];

if(today == "Sunday" || today == "Saturday")
{
	console.log("It's a holiday! No need to send email");
	process.exit(0);
}
else
{
	// check if it is a holiday
	connection.query("SELECT * FROM holiday WHERE holiday_month = ? AND holiday_day = ?",[current_month_in_number, current_day_in_number], function(err, rows)
	{
	    if (err){
	    	console.log("DB error on getting holiday list");
	        process.exit(1);
	    }

	    if(rows.length)
	    {
	        // It is a holiday, so we skip
	        console.log("It's a holiday! No need to send email");
	        process.exit(0);
	    }
	    else
	    {
	    	// Not a holiday
	    	console.log("Today is not Saturday/Sunday/holiday");
	    	connection.query("SELECT * FROM address_book", function(err, rows)
			{
			    if (err){
			        console.log("DB error on getting address_book");
			        process.exit(0);
			    }

			    if(rows.length)
			    {
			    	console.log("Address found on address_book");
			        for(address_book in rows)
				    {
				    	console.log("Added "+rows[address_book].emp_email+" to senders list");
				    	all_emails.push(rows[address_book].emp_email);
				    }

				    // getting the image now
				    connection.query("SELECT * FROM uploads WHERE status = 'A' LIMIT 1", function(err, rows)
					{
					    var image_data = [];
					    if (err){
					        console.log("DB error on uploads");
					        // need to send a mail to hr
					        process.exit(1);
					    }

					    if(rows.length)
					    {
					        image_id   = rows[0].file_id;
					        image_name = rows[0].uploaded_path;
					        image_directory = __dirname + '/public/uploaded_img/';
					        console.log("Image to send today - " + image_directory + image_name);
					        
					        // Now send the email
					        nodemailer.createTestAccount((err, account) => {

							    let transporter = nodemailer.createTransport({
							        host: 'mail.unifiedinfotech.net',
							        port: 25, 
							        secure: false, 
							        debug: true,
							        auth: {
							            user: 'soumyadip@unifiedinfotech.net', 
							            pass: "soumyadip2103" 
							        },
							        tls: {
							        	rejectUnauthorized: false
							    	}
							    });
							    
							    all_emails.toString();

							    // Generating HTML template for mail body
							    var mail_body = nunjucks.render('layout.html');
							    console.log("Applied email template");

							    // setup email data with unicode symbols
							    let mailOptions = {
							        from: '"Soumyadip Hazra" <soumyadip@unifiedinfotech.net>', // sender address
							        to: all_emails, // list of receivers
							        subject: 'Thought of the Day!', 
							        html: mail_body,
							        attachments: [
							        	{
								        	filename: image_name,
								        	path: image_directory + image_name,
								        	cid: 'thought_of_the_day'
								    	},
								    	{
								    		filename: 'UIPL_mail_footer_logo.jpg',
								        	path: __dirname + '/email_templates/UIPL_mail_footer_logo.jpg',
								        	cid: 'UIPL_mail_footer_logo'
								    	},
								    	{
								    		filename: 'icon-linkedin.png',
								        	path: __dirname + '/email_templates/icon-linkedin.png',
								        	cid: 'UIPL_mail_footer_icon_linkedin'
								    	},
								    	{
								    		filename: 'icon-facebook.png',
								        	path: __dirname + '/email_templates/icon-facebook.png',
								        	cid: 'UIPL_mail_footer_icon_facebook' 
								    	},
								    	{
								    		filename: 'icon-twitter.png',
								        	path: __dirname + '/email_templates/icon-twitter.png',
								        	cid: 'UIPL_mail_footer_icon_twitter' 
								    	},
								    	{
								    		filename: 'icon-twitter.png',
								        	path: __dirname + '/email_templates/icon-google-plus.png',
								        	cid: 'UIPL_mail_footer_icon_google_plus' 
								    	},
								    	{
								    		filename: 'icon-pinterest.png',
								        	path: __dirname + '/email_templates/icon-pinterest.png',
								        	cid: 'UIPL_mail_footer_icon_pinterest'
								    	},
								    ]
							    };

							    // send mail with defined transport object
							    transporter.sendMail(mailOptions, (error, info) => {
							        if (error) 
							        {
							            console.log(error);
							            process.exit(1);
							        }
							        else
							        {
							        	console.log('Message sent: %s', info.messageId);

							        	// Now remove the sent image
							        	connection.query("UPDATE uploads SET status = 'D' WHERE file_id = ?",[image_id], function(err, rows)
										{
											if (err)
											{
										        console.log("DB error on removing sent image");
										        process.exit(1);
										    }
										    else
										    {
										    	console.log("Used image removed");
										    	process.exit(0);
										    }
										});
							        }
							    });
							});
					    }
					    else
					    {
					    	// No image for today
					    	// need to send a mail to hr
					    	console.log("No image in uploads");
					        process.exit(1);
					    }
					});

			    }
			    else
			    {
			    	console.log("There is no address in address_book");
			        process.exit(0);
			    }
			});
	    }
	});
}

console.log("Done");