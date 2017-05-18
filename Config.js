var config = {
    "hostname": "localhost", //Db host
    "port": "3000", //landing page port
    "user": "root", //Db user
    "password": "", //DB password
    "emailuser": "", //mail module email
    "emailpwd": "", //mail module password
    "PUBLISHABLE_KEY": "", //Stripe API key
    "SECRET_KEY": "", //Stripe API key -> DO NOT SHARE PUBLICLY
    "check_in_freq": "5000", //ms; controls how often user checks in
    "email_job_freq": "5000", //ms; controls call to batch of emails to notify list
    "notify_delay": "5000" //ms; checks when failed check-in to send to notify list
};
module.exports = config;