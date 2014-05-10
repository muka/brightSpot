var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

var twitterAPI = require('node-twitter-api');

server.listen(8090);

var twitter = new twitterAPI({
    consumerKey: 'oxNnEWipa0vJZ29UK2EOEDbH4',
    consumerSecret: 'SPQeO6oVOmeyerLlwU2bpw3QWKVyhbMcKzz3tJBLvkp6OGJXQz',
//    callback: 'http://yoururl.tld/something'
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


app.use('/', require('express').static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/public/index.html');
});

app.get('/login', function (req, res) {
  res.sendfile(__dirname + '/public/login.html');
});

app.get('/login/go', function (req, res) {
    res.redirect(200, 'https://twitter.com/oauth/authenticate?oauth_token=' + twdata.requestToken);
    res.end();
});

io.sockets.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
        console.log(data);
    });
});

console.log("started");
