module.exports =  {

	sync_is_authorized : async function(op_name, role_name)
	{
		var config = require('../config/config')['development_linux'];
		var mysql = require('mysql');
		var db = require('mysql-promise')();
		
		db.configure({
			"host": config.database.host,
			"user": config.database.username,
			"password": config.database.password,
			"database": config.database.db
		});
		var result = await db.query("SELECT * FROM op_authorization WHERE op_name = ? AND role = ?",[op_name, role_name]);

		console.log("inside sync_is_authorized");
		console.log(result[0]);
		if(result[0].length == 0)
		{
			return false;
		}
		else
		{
			return true;
		}
	}

};