/* Modules used in app */
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var validate = require('express-validator');
var validator = require('validator');
var mysql = require('mysql');

var config = require('./config');

var app = express();

/* Mysql connection */
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'user'
});

/* view engine setup */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/* Setup validator */
app.use(validate());

/* Setup bodyparser */
app.use(bodyParser.urlencoded({extended: false}));

/* Setup public path */
app.use(express.static(path.join(__dirname, 'public')));

/* Find the port to render code */
app.listen(config.port, function () {
    console.log('Server up at localhost:' + config.port);
});

/* Get landing page */
app.get('/', function (req, res) {
    res.set('Content-Type', 'text/html');
    res.render('index.ejs', {title: 'Not Dead Yet', errors: ''});
});

/* Nodemail setup */
var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: config.emailuser,
        pass: config.emailpwd
    }
});

/* Handle post page */
app.post("/charge", function (req, res) {
    var email = req.body.email;
    var errors = req.validationErrors();
    
    /* Check if email is valid, else render the page and start emailJob() */
    if (validator.isEmail(email) === false) {
        console.log("Invalid email");
        res.send("Valid email? " + errors);

        return;
    } else {
        //render post page with user email
        res.render("charge.ejs", {user_email: email});
        emailJob(req, res);
    }
    
    /* Insert information to db */
    connection.connect(function (err) {
        console.log("Connected!");
        
        var sql = "INSERT INTO notdeadyet (id, email, last_check_in, last_email_sent, notify, message) VALUES ('', '" + req.body.email + "', '0', '0', '" + req.body.notify + "'," + req.body.message + ")";
        
        connection.query(sql, function (err, result) {
            console.log("1 record inserted with: " + result);
        });
    });

});

/* EmailJob sets up message */
var emailJob = function (req, res)
{
    
        var mailOptions = {
            from: config.emailuser, // sender address
            to: req.body.notify, // list of receivers
            subject: 'Hello', // Subject line
            text: 'Hello world' // plaintext body
        };
        
        /* send mail with defined transport object */
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else
            {
                setInterval(function ()
                {
                    console.log("timer: email sent");
                }, config.email_job_freq);
            }
        });
        transporter.close();
};

/* catch 404 and forward to error handler */
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/* error handler */
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

/* Export variables */
module.exports = app;