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

// view files
//var engine = require('./views')

// User Data
var membershipId = 0;
var gamerTag = '';


// user's different character
var characterOne = [];
var characterTwo = [];
var characterThree = [];

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
 
// //API
// unirest.get('http://www.bungie.net/Platform/Destiny/SearchDestinyPlayer/2/SoloFade')
//     .type('json')
//     .end(function (response) {
//         console.log(response.body);
//         data = response.body
//         //var res = JSON.parse(data);
//         console.log(data["Response"][0]["displayName"]);
    
        
// });


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
  res.send('Successfully logged in.');
});
 
app.get('/error', function(req, res, next) {
  res.send("Error logging in.");
});


app.post('/processLogin', function(req, res) {

	var name = req.body.name;
	var password = req.body.password;

	sess = req.session;
	sess.name = name;

	connection.connect();
	// SQL Query
 	connection.query('SELECT username from users where username = ? and password = ?',[name,password],function(err, rows) {
   		console.log("hello"); 
   		console.log(rows);
	 });
 	connection.end();	
    //res.render('layout');
     res.send('<p> '+  sess.name + password +'</p>');

});

app.post('/processApi', function(req, res) {

	var data;

	// Form Data
	var gamerTag = req.body.gamerTag;
	var system = req.body.system;

	console.log(gamerTag);
	console.log(system);
	//API  PS4 = 2 Xbox = 1     ex. SoloFade

	// var a = api.apiOne(system,gamerTag);
	// //console.log(api.y);
	// console.log(a);

	// console.log('Hello');
	// console.log(api.x);
	//console.log(api.apiOne.dataOne);

	api.apiOne(system,gamerTag,function(result){

		data = result;
		console.log(data);

		characterOne = data[0]['characterBase'];
		characterTwo = data[1]['characterBase'];
		characterThree = data[2]['characterBase'];

		console.log(characterOne);
		console.log(characterTwo);
		console.log(characterThree);




		// console.log(characterOne[]);
		res.render('./views/profile',{characterOne : characterOne,
			characterTwo:characterTwo,
			characterThree : characterThree

		});

	});
	//res.send(data);
	



	// unirest.get('http://www.bungie.net/Platform/Destiny/SearchDestinyPlayer/'+system+'/'+gamerTag)
 //    .type('json')
 //    .end(function (response) {
 //       //console.log(response.body);
 //       data = response.body;
 //   	   console.log('Data One');
 //       console.log(data);
 //       gamerTag = data["Response"][0]["displayName"];
 //       membershipId = data["Response"][0]["membershipId"];

 //       	unirest.get('http://www.bungie.net/Platform/Destiny/TigerPSN/Account/'+membershipId+'')
	// 	.type('json')
	// 	.end(function (response) {
	// 		console.log('data2');
	// 		console.log(response.body);

 //       		var data2 = response.body;
	// 		characterOne = data2['Response']['data']['characters'][0];
	// //  //    characterTwo = data['Response']['data']['characters'][1];
	// //  //    characterThree = data['Response']['data']['characters'][2];


	// 	});


 //     });
  
    	//api.apiTwo(membershipId);

 //    console.log(gamerTag);
 //    console.log(membershipId);


 //   	res.writeHead(301,
 //  	{Location: '/api2'}
	// );
	// res.end();

    //res.send(membershipId);
    // TigerPSN TigerXbox
    // http://www.bungie.net/Platform/Destiny/TigerPSN/Account/4611686018428490430

    
	// unirest.get('http://www.bungie.net/Platform/Destiny/TigerPSN/Account/'+membershipId+'')
	// .type('json')
	// .end(function (response) {
	        
	// 		data = response.body;
	// 	// characterOne = data['Response']['data']['characters'][0];
	//  //    characterTwo = data['Response']['data']['characters'][1];
	//  //    characterThree = data['Response']['data']['characters'][2];

	//         // temp[1] = data['Response']['data']['characters'][1];
	//         // temp[2] = data['Response']['data']['characters'][2];
	//         console.log(data);

	//      //    console.log(characterOne);

	//      //    // Save the users
	//         // characterOne[0] = characterOne["characterLevel"];
	//         // characterOne[1] = characterOne["characterBase"]["grimoireScore"];
	//         // characterOne[2] = characterOne["characterBase"]["genderType"];
	//        	// characterOne[3] = characterOne["characterBase"]["raceHash"];
	//        	// characterOne[4] = characterOne["characterBase"]["classHash"];
	//        	// characterOne[5] = characterOne["emblemPath"];
	//        	// characterOne[6] = characterOne["backgroundPath"];

	//        	// characterTwo[0] = characterTwo["characterLevel"];
	//         // characterTwo[1] = characterTwo["characterBase"]["grimoireScore"];
	//         // characterTwo[2] = characterTwo["characterBase"]["genderType"];
	//        	// characterTwo[3] = characterTwo["characterBase"]["raceHash"];
	//        	// characterTwo[4] = characterTwo["characterBase"]["classHash"];
	//        	// characterTwo[5] = characterTwo["emblemPath"];
	//        	// characterTwo[6] = characterTwo["backgroundPath"];

	//        	// characterThree[0] = characterThree["characterLevel"];
	//         // characterThree[1] = characterThree["characterBase"]["grimoireScore"];
	//         // characterThree[2] = characterThree["characterBase"]["genderType"];
	//        	// characterThree[3] = characterThree["characterBase"]["raceHash"];
	//        	// characterThree[4] = characterThree["characterBase"]["classHash"];
	//        	// characterThree[5] = characterThree["emblemPath"];
	//        	// characterThree[6] = characterThree["backgroundPath"];

	//      //   	// Displying users to check infomation
	//      //   	console.log(gamerTag);
	//     	// console.log(characterOne[0]);
	//     	// console.log(characterOne[1]);
	//     	// console.log(characterOne[2]);
	//     	// console.log(characterOne[3]);
	//     	// console.log(characterOne[4]);
	//     	// console.log(characterOne[5]);
	//     	// console.log(characterOne[6]);


	//     	// console.log(characterTwo[0]);
	//     	// console.log(characterTwo[1]);
	//     	// console.log(characterTwo[2]);
	//     	// console.log(characterTwo[3]);
	//     	// console.log(characterTwo[4]);
	//     	// console.log(characterTwo[5]);
	//     	// console.log(characterTwo[6]);

	//     	// console.log(characterThree[0]);
	//     	// console.log(characterThree[1]);
	//     	// console.log(characterThree[2]);
	//     	// console.log(characterThree[3]);
	//     	// console.log(characterThree[4]);
	//     	// console.log(characterThree[5]);
	//     	// console.log(characterThree[6]);

 //    //console.log(temp[0]);

	// // var name = req.body.name;
	// // var password = req.params.password;
 // 	});
	

    //res.render('./views/profile',{gamerTag : gamerTag});

});
app.post('/processApi', function(req, res) {



});
app.listen(8080);

console.log("Listening on port 8080");

// // How we require modules
// var http = require('http'); 
	
// http.createServer(function(request, response){

// 	response.writeHead(200); // Status code in header

// 	setTimeout(function(){
// 	response.write('Hello, this is dog.'); // Respnse body
// 	response.end(); // close the connection

// 	}, 5000);

// }).listen(8080);

//  console.log("Listening on port 8080");

// Desetiny Api Key
// // 993669113bf34361902b6343a306e98e
