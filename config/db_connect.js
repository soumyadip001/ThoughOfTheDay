var env = process.env.NODE_ENV || 'development_linux';
var config = require('../config/config')[env];
var mysql = require('mysql');

var connection = mysql.createConnection({
  	host     : config.database.host,
  	user     : config.database.username,
  	password : config.database.password,
  	database : config.database.db
});

connection.connect(function(err) {
    if (err) throw err;
});

module.exports = connection;