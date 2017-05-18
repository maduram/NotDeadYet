var config = require ('./config');
var mysql = require('mysql');

/* Connection creation */
var connection = mysql.createConnection({
  host     : config.hostname,
  user     : config.user,
  password : config.password
});

/* Connect to db */
connection.connect();

/* Now issue some commands against the database  */
connection.query('DROP DATABASE IF EXISTS NOTDEADYET', 
    function (error, results, fields) {
        if (error) throw error;
    }
);

/*  
    These query calls are non blocking, 
    so in theory we should nest them. As is, this
    might have a race condition.
 */
connection.query('CREATE DATABASE NOTDEADYET',
     function (error, results, fields) {
          if (error) throw error;
     }
);

/* Use the db */
connection.query('USE NOTDEADYET', function (error, results, fields) {
   if (error) throw error;
});  

/* Create table */
connection.query('CREATE TABLE IF NOT EXISTS USER(ID INT AUTO_INCREMENT PRIMARY KEY, EMAIL VARCHAR(50), LAST_CHECK_IN TIMESTAMP(0), LAST_EMAIL_SENT TIMESTAMP(0), NOTIFY TEXT, MESSAGE TEXT)', function (error, results, fields) {
        if (error) throw error;
        else console.log('Table created');
    }
);

/* close the connection.
   makes sure all queries terminate before closing connection
 */
connection.end(function(err) {
    if(err) console.log(err);
    else console.log("Database connection ended");
});

/* Log if db created */
console.log("Database Created!");
