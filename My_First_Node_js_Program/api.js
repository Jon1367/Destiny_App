var unirest = require("unirest");
var home = require('./hello.js');


exports.apiOne = function(system,gamerTag,callback){

	var system;

	unirest.get('http://www.bungie.net/Platform/Destiny/SearchDestinyPlayer/'+system+'/'+gamerTag)
    .type('json')
    .end(function (response) {
       //console.log(response.body);
       data = response.body;
   	   console.log('Data One');
       console.log(data);
       gamerTag = data["Response"][0]["displayName"];
       membershipId = data["Response"][0]["membershipId"];
       systemType = data["Response"][0]["membershipType"];

       if(systemType = 2){

       	system = 'TigerPSN';
       }else if(systemType = 1){
       	system = "TigerXbox";
       }

       	unirest.get('http://www.bungie.net/Platform/Destiny/'+system+'/Account/'+membershipId+'')
		.type('json')
		.end(function (response) {
			console.log('data2');
			console.log(response.body);

       		var data2 = response.body;
			var characters = data2['Response']['data']['characters'];
	//  //    characterTwo = data['Response']['data']['characters'][1];
	//  //    characterThree = data['Response']['data']['characters'][2];
			callback(characters);

		});

     });
    console.log('hello');
 
    
};


// exports.apiTwo = function (membershipId) {
// 	unirest.get('http://www.bungie.net/Platform/Destiny/TigerPSN/Account/'+membershipId+'')
//     .type('json')
//     .end(function (response) {
//        //console.log(response.body);
//        data = response.body;
//        // gamerTag = data["Response"][0]["displayName"];
//        // membershipId = data["Response"][0]["membershipId"];
//     });
// };
//console.log(apiOne);
//module.exports.x = apiOne;

