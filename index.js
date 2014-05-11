
var twconfig = {
    consumerKey: 'oxNnEWipa0vJZ29UK2EOEDbH4',
    consumerSecret: 'SPQeO6oVOmeyerLlwU2bpw3QWKVyhbMcKzz3tJBLvkp6OGJXQz',
    callback: 'http://83.212.96.61:8090/login/auth'
};


//dev version 127.0.0.1

//twconfig = {
//    consumerKey: 'FklmYXKb8z3aZweMqw4T2qIdO',
//    consumerSecret: 'dMH77bQuj1qAbExBI4T2fXoVz4ZLrt6a7dDR0Fx4I5cNfapxZI',
//    callback: 'http://127.0.0.1:8090/login/auth'
//};

var express      = require('express')
var cookieParser = require('cookie-parser')
var session      = require('express-session')

var app = express()
  , server = require('http').createServer(app)
  , restler = require('restler')
//  , io = require('socket.io').listen(server);


server.listen(8090);



var twitterAPI = require('node-twitter-api');
var twitter = new twitterAPI(twconfig);

app.use(cookieParser()); // required before session.
app.use(session({
    secret: 'fdasklfdsanjfdsjkkfdsnfdsdskfnjdfsdsjfjkfdsasas',
    key: 'sid',
cookie: {
    expires: false,
    secure: false
}}));


app.use('/', express.static(__dirname + '/public'));

app.get('/', function (req, res) {

    if(req.loggedin)
        res.sendfile(__dirname + '/public/home.html');
    else {
        console.log("login", req.url + '/login');
        res.redirect(req.url + '/login');
    }
});

app.get('/propose', function (req, res) {
    res.sendfile(__dirname + '/public/propose.html');
});

app.use(require('body-parser')());
app.post('/propose/send', function(req, res) {

    var body = req.body;

//    console.log(body);

    var tweet = "#BrightSpot #" + body.activity.replace(' ', '-') + " #" + body.topic.replace(' ', '-') + " at " + body.date + " #" + body.place.replace(' ', '-');

    console.log(tweet);

    if(req.session.accessTokenSecret) {

        console.log("Tweet with token",  req.session.accessTokenSecret);

        twitter.statuses("update", {
                status: tweet
            },
            req.session.accessToken,
            req.session.accessTokenSecret,
            function(error, data, response) {
                if (error) {
                    console.log(error);
                    res.send(500);

                        // demo hack :P drop me
                        var posturl = 'http://83.212.96.61:8010/';
                    //    restler
                        restler.post(posturl, {
                            data: body.topic
                        });


                } else {
                    console.log(data);
//                    res.send(response.statusCode || 500);
                    res.redirect("/");
                }
            }
        );
    }

});

app.get('/login', function (req, res) {
    res.sendfile(__dirname + '/public/login.html');
});

app.get('/login/go', function (req, res) {

    console.log("Req auth");
    twitter.getRequestToken(function(error, requestToken, requestTokenSecret, results) {

        if (error) {

            console.log("Error getting OAuth request token : ", error);
            res.send(500, "An error occured, please retry");

        } else {

            req.session.requestTokenSecret = requestTokenSecret;
            req.session.requestToken = requestToken;
            req.session.save(function() {

                console.log("Session tokens", req.session.requestTokenSecret, req.session.requestToken);
                res.redirect('https://twitter.com/oauth/authenticate?oauth_token=' + requestToken);
            });
        }
    });

});

app.get('/login/auth', function (req, res) {

    console.log("Auth with ");
    console.log("token: " + req.query.oauth_token,
                "secret: " + req.session.requestTokenSecret,
                "verify" + req.query.oauth_verifier);

    twitter.getAccessToken(req.query.oauth_token, req.session.requestTokenSecret, req.query.oauth_verifier, function(error, accessToken, accessTokenSecret, results) {
        if (error) {

            console.log("Error on authentication");
            console.log(req.query, error);

            res.send(error.statusCode || 500);
        } else {

            req.session.accessToken = accessToken;
            req.session.accessTokenSecret = accessTokenSecret;

            res.redirect('/propose');
        }
    });


});

//io.sockets.on('connection', function (socket) {
//    socket.emit('news', { hello: 'world' });
//    socket.on('my other event', function (data) {
//        console.log(data);
//    });
//});

console.log("Started..");
