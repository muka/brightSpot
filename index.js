
var twconfig = {
    consumerKey: 'oxNnEWipa0vJZ29UK2EOEDbH4',
    consumerSecret: 'SPQeO6oVOmeyerLlwU2bpw3QWKVyhbMcKzz3tJBLvkp6OGJXQz',
    callback: 'http://83.212.96.61:8090/login/auth'
};

var express      = require('express')
var cookieParser = require('cookie-parser')
var session      = require('express-session')

var app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

var twitterAPI = require('node-twitter-api');

app.use(cookieParser()) // required before session.
app.use(session({
    secret: 'fdasklfdsanjfdsjkkfdsnfdsdskfnjdfsdsjfjkfds',
    key: 'sid',
cookie: { secure: true }}))

server.listen(8090);

app.use('/', express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/public/home.html');
});

app.get('/propose', function (req, res) {
    res.sendfile(__dirname + '/public/propose.html');
});

app.use(require('body-parser')());
app.post('/propose/send', function(req, res) {

    var body = req.body;

//    console.log(body);

    var tweet = "#BrightSpot #" + body.activity.replace(' ', '-') + " #" + body.topic.replace(' ', '-') + " at " + body.date + " @" + body.place;
    console.log(tweet);

    twitter.statuses("update", {
            status: tweet
        },
        twdata.accessToken,
        twdata.accessTokenSecret,
        function(error, data, response) {
            if (error) {
                console.log(error);
                res.send(500);
            } else {
                console.log(response);
                res.send(response.statusCode || 500);
            }
            res.end();
        }
    );


});

app.get('/login', function (req, res) {

    var session = req.session;

    var twitter = new twitterAPI(twconfig);

    twitter.getRequestToken(function(error, requestToken, requestTokenSecret, results){
        if (error) {

            console.log("Error getting OAuth request token : ", error);

            res.send(500, "An error occured, please retry");

        } else {



            session.requestTokenSecret = requestTokenSecret;
            session.requestToken = requestToken;

            console.log("Session tokens", session);

            res.sendfile(__dirname + '/public/login.html');
        }

//        res.end();
    });

});

app.get('/login/go', function (req, res) {

    console.log("Req auth");
    console.log(req.session);

    res.redirect(301, 'https://twitter.com/oauth/authenticate?oauth_token=' + req.session.requestToken);
    res.end();
});

app.get('/login/auth', function (req, res) {

    res.redirect(301, '/propose');
    res.end();
});

//io.sockets.on('connection', function (socket) {
//    socket.emit('news', { hello: 'world' });
//    socket.on('my other event', function (data) {
//        console.log(data);
//    });
//});

console.log("Started..");
