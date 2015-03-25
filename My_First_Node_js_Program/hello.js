// Node.js

// Includes
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var unirest = require("unirest");
var app = express();
var http = require('http');
var path = require('path');
var ejs = require('ejs');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

// modules
var api = require('./api.js');

// global Variables
// User Data
var membershipId;
var gamerTag = '';
// var characterId;


// user's different character
var characterOne = [];
var characterTwo = [];
var characterThree = [];

var character;
// Face Book
// AppId: 804379889616035
// AppSerect: 3662bc272f3c540efa827618188e17a5

var faceBookName = "";

// Connecting to Data Base
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  port     :  '8889',
  database : 'projectdb',
  user     : 'root',
  password : 'root',
});


//App Sets
app.set('views', __dirname);
app.set('view engine', 'ejs');

// App Use
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({secret: 'ssshhhhh'}));
app.use(express.static(__dirname + '/public'));

// passport initlze
app.use(passport.initialize());
app.use(passport.session());

// Connecting to FaceBook 
passport.use(new FacebookStrategy({
    clientID: '804379889616035',
    clientSecret: '3662bc272f3c540efa827618188e17a5',
    callbackURL: "http://localhost:8080/auth/facebook/callback",
    enableProof: false
  },
  function(accessToken, refreshToken, profile, done) {
  	process.nextTick(function() {
  	//console.log(profile);
    done(null, profile);
  });
}));

// SerializeUser
passport.serializeUser(function(user, done) {
  done(null, user);
});
 
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});
 

//Routes
app.get('/', function(req,res){

	res.sendfile(path.join(__dirname + '/views/layout.html'));

});

app.get('/login', function(req, res) {

    res.render('./views/form');

});

//  Face Book Authenication
app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/success',
  failureRedirect: '/error'
}));

app.get('/success', function(req, res, next) {
  res.redirect('/');
});
 
app.get('/error', function(req, res, next) {
  res.send("Error logging in.");
});



app.post('/processLogin', function(req, res) {

	var name = req.body.name;
	var password = req.body.password;

	sess = req.session;
	sess.name = name;
	sess.bool = true;
    
	connection.connect();
	// SQL Query
 	connection.query('SELECT username from users where username = ? and password = ?',[name,password],function(err, rows) {
   		console.log("hello"); 
   		console.log(rows);

	 });
 	connection.end();
    
    res.redirect('/');

     
});

app.get('/logout', function(req, res) {
    sess = null;
    
    res.redirect('/')
});


// Proccessing Apis
app.post('/processApi', function(req, res) {

	var data;

	// Form Data
	var gamerTag = req.body.gamerTag;
	var system = req.body.system;

	console.log(gamerTag);
	console.log(system);


    
	api.apiOne(system,gamerTag,function(result){

        console.log(typeof(result));
//        console.log(result);
        
        if (result == 55) {
            res.render('./views/errors');       
        } else {
        
		data = result;
//		console.log(data);
        

		membershipId = data[0]['characterBase']['membershipId'];
		characterOne = data[0];
		characterTwo = data[1];
		characterThree = data[2];

//		console.log(characterOne);
//		console.log(characterTwo);
//		console.log(characterThree);


		res.render('./views/profile',{gamerTag:gamerTag,
			characterOne : characterOne,
			characterTwo:characterTwo,
			characterThree : characterThree
                                     });
        }
                   

		});
	});


app.post('/viewCharacter', function(req, res) {

	 characterchoose = req.body.character;

	console.log(character);




	if (characterchoose == 0) {
		character = characterOne;
		res.redirect('/chooseCharacter');

	}else if(characterchoose == 1){
		character = characterTwo;
		res.redirect('/chooseCharacter');

	}else if(characterchoose == 2){
		character = characterThree;
		res.redirect('/chooseCharacter');
	}

});
app.get('/chooseCharacter', function(req, res) {

	console.log(character);

	res.render('./views/charView',{character:character});

});
app.get('/addUser', function(req, res) {

	res.render('./views/addUser');

});


app.post('/processAdd', function(req, res) {

	 var name = req.body.name;
	 var password = req.body.password;
     var gamertag = req.body.gamertag;
	 var system = req.body.system;

//	 sess = req.session;
//	 sess.name = name;

	connection.connect();
	// SQL Query
 	connection.query('insert into users(username,password,gamertag,system)values(?,?,?,?)',[name,password,gamertag,system],function(err, rows) {
   		console.log("hello"); 
   		console.log(rows);
	 });

 	connection.end();

    res.redirect('/');


});

app.get('/back', function(req, res) {

	
	res.render('./views/profile',{gamerTag:gamerTag,
			characterOne : characterOne,
			characterTwo:characterTwo,
			characterThree : characterThree
                                     });

});


app.listen(8080);
console.log("Listening on port 8080");
