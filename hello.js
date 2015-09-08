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
var async = require('async');


// modules
var api = require('./models/api.js');
var player = require('./models/player.js');



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


//App Sets
app.set('views', __dirname);
app.set('view engine', 'ejs');

// App Use
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({secret: 'ssshhhhh'}));
app.use(express.static(__dirname + '/public'));



/*=============   Routes   =============*/

app.get('/', function(req,res){

	res.sendfile(path.join(__dirname + '/views/layout.html'));

});
app.post('/processApi', function(req, res) {

	var playerOne = new player();
	// Form Data
	playerOne.gamerTag = req.body.gamerTag;
	playerOne.system = req.body.system;

	// Setting Sessions
	sess = req.session;
	sess.gamerTag = playerOne.gamerTag;
	sess.system = playerOne.system;


	// Api call
	playerOne.getDestinyInfo(playerOne.system,playerOne.gamerTag,function(result){

    	sess.UserOneData = result;
       	playerOne.data = result;
    	sess.membershipId =	playerOne.data['data']['membershipId'];
    	sess.characters = [];

    	// storing characterID in session
    	for (var i = 0; i < playerOne.data['data']['characters'].length ; i++) {
    		//console.log(playerOne.data['data']['characters'][i]['characterBase']['characterId']);
    		sess.characters.push(playerOne.data['data']['characters'][i]['characterBase']['characterId'])
    	};

    	//Render Views
		res.render('./views/profile',{
			gamerTag : playerOne.gamerTag,
			data : playerOne.data
	    });

	 });

});

app.post('/viewCharacter', function(req, res) {

	var sess = req.session;
	var playerOne = new player();
	characterchoose = req.body.character;

	var sData = sess.UserOneData;


	playerOne.getCharacterInfo(sess.system,sess.membershipId,sess.characters[characterchoose] ,function(result){
	console.log('==============   Character API  ==============');

		console.log(result);
		var hashItem = result['data']['buckets']['Equippable'];
		var unHashItem =   result['definitions']['items'];


		res.render('./views/charView',{
			gamerTag : sess.gamerTag,
			character : sData['data']['characters'][characterchoose],
			hashItem : hashItem,
			unHashItem : unHashItem
	    });


	 });



});


/*=============   Friend Processing   =============*/
app.get('/friend', function(req, res) {

	var sess = req.session;
	var gamerTag = sess.gamerTag;

	res.render('./views/friend',{gamerTag:gamerTag,
	characterOne : sess.UserOneData['data']['characters'][0],
	characterTwo: sess.UserOneData['data']['characters'][1],
	characterThree : sess.UserOneData['data']['characters'][2]
 	});

});
app.get('/back', function(req, res) {

	
	res.render('./views/profile',{gamerTag:gamerTag,
			characterOne : characterOne,
			characterTwo:characterTwo,
			characterThree : characterThree
                                     });

});

app.post('/processFriendApi', function(req, res) {

	var data;

	var friendGamerTag = req.body.gamerTag;
	var fsystem = req.body.system;

	var nplayer = new player(friendGamerTag,fsystem);

	api.apiOne(fsystem,friendGamerTag,function(result){

        //console.log(typeof(result));
//        console.log(result);
        
        if (result == 55) {
            res.render('./views/errors');       
        } else {
        
		data = result['data']['characters'];
		console.log('++++++++++ Friend Api +++++++++');

		console.log(result);
        

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

	// console.log("character Choice");
	// console.log(cOne);
	// console.log(cTwo);

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


});

/*=============   DataBase CRUD unFinish   =============*/

app.get('/login', function(req, res) {

    res.render('./views/form');

});

app.get('/addUser', function(req, res) {

	res.render('./views/addUser');

});

app.post('/processAdd', function(req, res) {

	 var name = req.body.name;
	 var password = req.body.password;
     var gamertag = req.body.gamertag;
	 var system = req.body.system;

	 sess = req.session;
	 sess.name = name;



    res.redirect('/');


});
app.get('/logout', function(req, res) {
    sess = null;
    
    res.redirect('/')
});

app.listen(8080);
console.log("Listening on port 8080");
