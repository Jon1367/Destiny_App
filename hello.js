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
var SteamStrategy = require('passport-steam').Strategy;


// modules
var api = require('./api.js');

// global Variables

// User Data
var membershipId;
var gamerTag = '';
// var characterId;


// user's character Info
var character;

var characterInfo = [];
var characterItems = [];
var hash = [];

var characterOne = [];
var characterTwo = [];
var characterThree = [];

// Friends Character Info
var fcharacter;

var fcharacterInfo = [];

var fgamerTag = '';
var fcharacterOne = [];
var fcharacterTwo = [];
var fcharacterThree = [];
/*
 	Face Book:
 	AppId: 804379889616035
 	AppSerect: 3662bc272f3c540efa827618188e17a5
*/

var faceBookName = "";

// Connecting to MYSQL Data Base
/*
 var mysql      = require('mysql');
 var connection = mysql.createConnection({
   host     : 'localhost',
   port     :  '8889',
   database : 'projectdb',
   user     : 'root',
   password : 'root',
 });

// connection.connect();

*/

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
 
passport.use(new SteamStrategy({
    returnURL: 'http://localhost:8080/auth/steam/return',
    realm: 'http://localhost:8080/',
    apiKey: '96561BE3CFC49F03586B97D08C12745F'
  },
  function(identifier, profile, done) {
    process.nextTick(function () {

      // To keep the example simple, the user's Steam profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Steam account with a user record in your database,
      // and return that user instead.
      profile.identifier = identifier;

      console.log(profile);
      
      return done(null, profile);
    });
  }
));



app.get('/auth/steam',
  passport.authenticate('steam'),
  function(req, res) {
    // The request will be redirected to Steam for authentication, so
    // this function will not be called.
  });

app.get('/auth/steam/return',
  passport.authenticate('steam', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });


/*=============   Routes   =============*/

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

/*=============   Views   =============*/

app.get('/', function(req,res){

	res.sendfile(path.join(__dirname + '/views/layout.html'));

});
app.post('/viewCharacter', function(req, res) {

	characterchoose = req.body.character;

	console.log('==============   Character Choose ==============');
	console.log(characterInfo[characterchoose]);

	var characterId = characterInfo[characterchoose]['characterBase']['characterId'];
	var memberId = characterInfo[characterchoose]['characterBase']['membershipId'];
	var system = characterInfo[characterchoose]['characterBase']['membershipType'];




	console.log(characterId);
	console.log(memberId);

	api.characterInfo(memberId,characterId,system,function(result){

		console.log('==============   Hash Character Items ==============');
		console.log(result['Response']['data']['buckets']['Equippable']);
		console.log('==============   unHash Equippable ==============');
		console.log(result['Response']['definitions']['items']);

		//console.log(result['Response']['data']['buckets']['Equippable'][0]['items'][0]['itemHash']);
		//console.log(result['Response']['definitions']['items']['250113089']['icon']);




		var unHashItem  = result['Response']['definitions']['items'];
		var hashItem= result['Response']['data']['buckets']['Equippable'];
		console.log('==============   DeBuging ==============');
		console.log(characterchoose)
		console.log(characterInfo[characterchoose])

	res.render('./views/charView',{
			gamerTag : gamerTag,
			character : characterInfo[characterchoose],
			hashItem : hashItem,
			unHashItem : unHashItem

        });

	});





});

app.get('/friend', function(req, res) {

	res.render('./views/friend',{gamerTag:gamerTag,
	characterOne : characterOne,
	characterTwo:characterTwo,
	characterThree : characterThree
 	});

});
app.get('/back', function(req, res) {

	
	res.render('./views/profile',{gamerTag:gamerTag,
			characterOne : characterOne,
			characterTwo:characterTwo,
			characterThree : characterThree
                                     });

});

/*=============   Processing   =============*/

app.post('/processApi', function(req, res) {

	var data;

	// Form Data
	gamerTag = req.body.gamerTag;
	var system = req.body.system;

	console.log(gamerTag);
	console.log(system);


    
	api.apiOne(system,gamerTag,function(result){

       console.log('++++++++ result +++++++++');
       console.log(result);


        
        if (result == 55) {
            res.render('./views/errors');       
        } else {
        
		data = result['data']['characters'];
        console.log('++++++++ characters +++++++++');
		console.log(data);
        

		membershipId = data[0]['characterBase']['membershipId'];
		characterOne = data[0];
		characterTwo = data[1];
		characterThree = data[2];

		for (var i = 0; i <= 2; i++) {
			characterInfo.push(data[i]);
		};

		// console.log("character Info Variable");
		// console.log(characterInfo);
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

app.post('/processFriendApi', function(req, res) {

	var data;

	fgamerTag = req.body.gamerTag;
	var system = req.body.system;

	api.friend(system,fgamerTag,function(result){

        console.log(typeof(result));
//        console.log(result);
        
        if (result == 55) {
            res.render('./views/errors');       
        } else {
        
		data = result['data']['characters'];
		console.log(data);
        

		membershipId = data[0]['characterBase']['membershipId'];
		fcharacterOne = data[0];
		fcharacterTwo = data[1];
		fcharacterThree = data[2];

		for (var i = 0; i <= 2; i++) {
			fcharacterInfo.push(data[i]);
		};

		// // FRIEND API
		// console.log('FRIEND API ');
		// console.log(fcharacterOne);
		// console.log(fcharacterTwo);
		// console.log(fcharacterThree);


		// // FIRst Character
		// console.log(characterOne);
		// console.log(characterTwo);
		// console.log(characterThree);

		res.render('./views/compare',{gamerTag:gamerTag,
			characterOne : characterOne,
			characterTwo:characterTwo,
			characterThree : characterThree,
			fgamerTag:fgamerTag,
			fcharacterOne : fcharacterOne,
			fcharacterTwo: fcharacterTwo,
			fcharacterThree : fcharacterThree
          });
        }
                   

	});


});
app.post('/processCompare', function(req, res) {

	var cOne = req.body.character
	var cTwo = req.body.fcharacter;

	console.log("character Choice");
	console.log(cOne);
	console.log(cTwo);

	var characterId = characterInfo[cOne]['characterBase']['characterId'];
	var memberId = characterInfo[cOne]['characterBase']['membershipId'];
	var system = characterInfo[cOne]['characterBase']['membershipType'];

	var fcharacterId = characterInfo[cTwo]['characterBase']['characterId'];
	var fmemberId = characterInfo[cTwo]['characterBase']['membershipId'];
	var fsystem = characterInfo[cTwo]['characterBase']['membershipType'];

	api.characterInfo(memberId,characterId,system,function(result){

		// console.log('==============   Hash Character Items ==============');
		// console.log(result['Response']['data']['buckets']['Equippable']);
		// console.log('==============   unHash Equippable ==============');
		// console.log(result['Response']['definitions']['items']);

		//console.log(result['Response']['data']['buckets']['Equippable'][0]['items'][0]['itemHash']);
		//console.log(result['Response']['definitions']['items']['250113089']['icon']);




		var unHashItem  = result['Response']['definitions']['items'];
		var hashItem= result['Response']['data']['buckets']['Equippable'];


		api.characterInfo(fmemberId,fcharacterId,fsystem,function(result){


			var funHashItem  = result['Response']['definitions']['items'];
			var fhashItem= result['Response']['data']['buckets']['Equippable'];


			res.render('./views/charCompare',{gamerTag:gamerTag,
					character : characterInfo[cOne],
					fgamerTag: fgamerTag,
					fcharacter : fcharacterInfo[cTwo],
					hashItem : hashItem,
	 				unHashItem : unHashItem,
					fhashItem : fhashItem,
	 				funHashItem : funHashItem
		        });

		});

	});

	// res.render('./views/charView',{
	// 		gamerTag : gamerTag,
	// 		character : characterInfo[characterchoose],
	// 		hashItem : hashItem,
	// 		unHashItem : unHashItem

 // //        });
	// res.render('./views/charCompare',{gamerTag:gamerTag,
	// 		character : characterInfo[cOne],
	// 		fgamerTag: fgamerTag,
	// 		fcharacter : fcharacterInfo[cTwo]
 //        });


	// 	characterchoose = req.body.character;

	// console.log('==============   Character Choose ==============');
	// console.log(characterInfo[characterchoose]);

	// var characterId = characterInfo[characterchoose]['characterBase']['characterId'];
	// var memberId = characterInfo[characterchoose]['characterBase']['membershipId'];
	// var system = characterInfo[characterchoose]['characterBase']['membershipType'];




	// console.log(characterId);
	// console.log(memberId);

	// api.characterInfo(memberId,characterId,system,function(result){

	// 	console.log('==============   Hash Character Items ==============');
	// 	console.log(result['Response']['data']['buckets']['Equippable']);
	// 	console.log('==============   unHash Equippable ==============');
	// 	console.log(result['Response']['definitions']['items']);

	// 	//console.log(result['Response']['data']['buckets']['Equippable'][0]['items'][0]['itemHash']);
	// 	//console.log(result['Response']['definitions']['items']['250113089']['icon']);




	// 	var unHashItem  = result['Response']['definitions']['items'];
	// 	var hashItem= result['Response']['data']['buckets']['Equippable'];

	// res.render('./views/charView',{
	// 		gamerTag : gamerTag,
	// 		character : characterInfo[characterchoose],
	// 		hashItem : hashItem,
	// 		unHashItem : unHashItem

 //        });

	// });

});

/*=============   DataBase CRUD unFinish   =============*/

app.get('/login', function(req, res) {

    res.render('./views/form');

});

app.get('/addUser', function(req, res) {

	res.render('./views/addUser');

});

app.post('/processLogin', function(req, res) {

	var name = req.body.name;
	var password = req.body.password;

	// sess = req.session;
	// sess.name = name;
	// sess.bool = true;
    

	// // SQL Query
 // 	connection.query('SELECT username from users where username = ? and password = ?',[name,password],function(err, rows) {
 //   		console.log("hello"); 
 //   		console.log(rows);

	//  });

    
    res.redirect('/');

     
});
app.post('/processAdd', function(req, res) {

	 var name = req.body.name;
	 var password = req.body.password;
     var gamertag = req.body.gamertag;
	 var system = req.body.system;

//	 sess = req.session;
//	 sess.name = name;


	// SQL Query
 	// connection.query('insert into users(username,password,gamertag,system)values(?,?,?,?)',[name,password,gamertag,system],function(err, rows) {
  //  		console.log("hello"); 
  //  		console.log(rows);
	 // });



    res.redirect('/');


});
app.get('/logout', function(req, res) {
    sess = null;
    
    res.redirect('/')
});

app.listen(8080);
console.log("Listening on port 8080");
