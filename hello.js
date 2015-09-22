// Node.js

// Includes
var express 		= require('express'),
	session 		= require('express-session'),
	bodyParser 		= require('body-parser'),
	unirest 		= require("unirest"),
	app 			= express(),
	http 			= require('http'),
	path 			= require('path'),
	ejs 			= require('ejs'),
	async 			= require('async'),


// modules
api = require('./models/api.js'),
player = require('./models/player.js');



// Friends Character Info
var fcharacter;
var fcharacterInfo = [];
var fgamerTag = '';
var fcharacterOne = [];
var fcharacterTwo = [];
var fcharacterThree = [];


//App Sets
app.set('views', __dirname);
app.set('view engine', 'ejs');

// App Use
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({secret: 'ssshhhhh'}));
app.use(express.static(__dirname + '/public'));



/*=============   Routes   =============*/

app.get('/', function(req,res){

		res.render('./views/layout');

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

		// error handling
		if(result == false){

		res.render('./views/errors');
		}else{

			// Setting Session
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
		}
	});

});

app.post('/viewCharacter', function(req, res) {

	var sess = req.session;
	var playerOne = new player();
	characterchoose = req.body.character;

	var sData = sess.UserOneData;



	playerOne.getDestinyInfo(sess.system,sess.gamerTag,function(result){
	console.log('==============   Character API  ==============');

		//console.log(result['data']['characters'][characterchoose]['characterBase']["peerView"]['equipment']);
		var hashItem = result['data']['characters'][characterchoose]['characterBase']["peerView"]['equipment'];
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
		data : sess.UserOneData
 	});

});

app.post('/processFriendApi', function(req, res) {

	var sess = req.session;
	var playerTwo = new player();
	// Form Data
	playerTwo.gamerTag = req.body.gamerTag;
	playerTwo.system = req.body.system;

	// Setting Sessions
	sess = req.session;
	sess.fgamerTag = playerTwo.gamerTag;
	sess.fsystem = playerTwo.system;



	// Api call
	playerTwo.getDestinyInfo(playerTwo.system ,playerTwo.gamerTag ,function(result){

		console.log('++++++++++++ playerTwo data +++++++++++++++++');
		console.log(result);

		// error handling
		if(result == false){

		res.render('./views/errors');
		}else{

			// Setting Session
	    	sess.UserTwoData = result;
	       	playerTwo.data = result;
	    	sess.membershipId2 =	playerTwo.data['data']['membershipId'];
	    	sess.characters2 = [];

	    	// storing characterID in session
	    	for (var i = 0; i < playerTwo.data['data']['characters'].length ; i++) {
	    		//console.log(playerOne.data['data']['characters'][i]['characterBase']['characterId']);
	    		sess.characters2.push(playerTwo.data['data']['characters'][i]['characterBase']['characterId']);
	    	};

	    	console.log('++++++++++++ Sesssions +++++++++++++++++');
			console.log(sess);

	    	//Render Views
			// res.render('./views/profile',{
			// 	gamerTag : playerOne.gamerTag,
			// 	data : playerTwo.data
		 //    });
		}

	});

	var playerOne = new player();
	characterchoose = req.body.character;

	//var sData = sess.UserOneData;



	playerOne.getDestinyInfo(sess.system,sess.gamerTag,function(result){
	console.log('==============   Character API  ==============');
	//console.log(result['data']);


		// //console.log(result['data']['characters'][characterchoose]['characterBase']["peerView"]['equipment']);
		// var hashItem = result['data']['characters'][characterchoose]['characterBase']["peerView"]['equipment'];
		// var unHashItem =   result['definitions']['items'];

		res.render('./views/compare',{
			gamerTag : sess.gamerTag,
			fgamerTag : playerTwo.gamerTag  ,
			data : result,
			data2 : playerTwo.data

	    });


	});

});
app.get('/back', function(req, res) {

	
	res.render('./views/profile',{gamerTag:gamerTag,
			characterOne : characterOne,
			characterTwo:characterTwo,
			characterThree : characterThree
                                     });

});

app.post('/processCompare', function(req, res) {

	var cOne = req.body.character
	var cTwo = req.body.fcharacter;

	var sess = req.session;
	var playerTwo = new player();
	// Form Data
	playerTwo.gamerTag = sess.fgamerTag;
	playerTwo.system = sess.fsystem;

	// Setting Sessions
	sess = req.session;
	sess.fgamerTag = playerTwo.gamerTag;
	sess.fsystem = playerTwo.system;



	// Api call
	playerTwo.getDestinyInfo(playerTwo.system ,playerTwo.gamerTag ,function(result){

		console.log('++++++++++++ playerTwo data +++++++++++++++++');
		console.log('player Two');

		// error handling
		if(result == false){

		res.render('./views/errors');
		}else{

			// Setting Session
	    	sess.UserTwoData = result;
	       	playerTwo.data = result;
	    	sess.membershipId2 =	playerTwo.data['data']['membershipId'];
	    	sess.characters2 = [];
	    	 fhashItem = result['data']['characters'][cTwo]['characterBase']["peerView"]['equipment'];
		 	 funHashItem =   result['definitions']['items'];



	  //   	console.log('++++++++++++ Sesssions +++++++++++++++++');
			// console.log(sess);

	    	//Render Views
			// res.render('./views/profile',{
			// 	gamerTag : playerOne.gamerTag,
			// 	data : playerTwo.data
		 //    });
		}

			var playerOne = new player();
	characterchoose = req.body.character;

	var sData = sess.UserOneData;
	var sData2 = sess.UserTwoData;




	playerOne.getDestinyInfo(sess.system,sess.gamerTag,function(result){
	console.log('==============   Character API  ==============');
	console.log('PlayerOne');


		// //console.log(result['data']['characters'][characterchoose]['characterBase']["peerView"]['equipment']);
		 var hashItem = result['data']['characters'][cOne]['characterBase']["peerView"]['equipment'];
		 var unHashItem =   result['definitions']['items'];



		res.render('./views/charCompare',{
			gamerTag : sess.gamerTag,
			gamerTag : sess.fgamerTag,
			character : sData['data']['characters'][cOne],
			fcharacter : sData2['data']['characters'][cTwo],
			hashItem : hashItem ,
			unHashItem : unHashItem ,
			fhashItem : fhashItem,
			funHashItem : funHashItem
	    });

	});


	});







});

/*=============   DataBase CRUD unFinish   =============*/


app.get('/logout', function(req, res) {
    sess = null;
    
    res.redirect('/')
});

app.listen(8080);
console.log("Listening on port 8080");
