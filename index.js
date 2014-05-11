
var express      = require('express')
var cookieParser = require('cookie-parser')
var session      = require('express-session')

var app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

var twitterAPI = require('node-twitter-api');

server.listen(8090);

var twitter = new twitterAPI({
    consumerKey: 'oxNnEWipa0vJZ29UK2EOEDbH4',
    consumerSecret: 'SPQeO6oVOmeyerLlwU2bpw3QWKVyhbMcKzz3tJBLvkp6OGJXQz',
    callback: 'http://yoururl.tld/something'
});

var twdata = {};

twitter.getRequestToken(function(error, requestToken, requestTokenSecret, results){
    if (error) {
        console.log("Error getting OAuth request token : " + error);
    } else {

        twdata.requestTokenSecret = requestTokenSecret;
        twdata.requestToken = requestToken;

        //store token and tokenSecret somewhere, you'll need them later; redirect user
    }
});


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
    res.sendfile(__dirname + '/public/login.html');
});

app.get('/login/go', function (req, res) {
    res.redirect(301, 'https://twitter.com/oauth/authenticate?oauth_token=' + twdata.requestToken);
    res.end();
});

//io.sockets.on('connection', function (socket) {
//    socket.emit('news', { hello: 'world' });
//    socket.on('my other event', function (data) {
//        console.log(data);
//    });
//});

console.log("Started..");
