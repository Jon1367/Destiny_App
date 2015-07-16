var unirest = require("unirest");
var home = require('./hello.js');

function isEmptyObject(data) {
    return !Object.keys(data["Response"]).length;   
};

exports.apiOne = function(system,gamerTag,callback){

// Key: 96561BE3CFC49F03586B97D08C12745F

// http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=[YOUR KEY HERE]&steamids=[STEAM 64 IDS]&format=[xml OR json]

// http://api.steampowered.com/spike1367/GetPlayerSummaries/v0002/?key=96561BE3CFC49F03586B97D08C12745F&steamids=[STEAM 64 IDS]&format=json


	var system;

	unirest.get('http://www.bungie.net/Platform/Destiny/SearchDestinyPlayer/'+system+'/'+gamerTag)
    .type('json')
    .end(function (response) {
        
        
       //console.log(response.body)p;
       var data = response.body;
        console.log('length');
       console.log(typeof(data));
        console.log(data);

        if (isEmptyObject(data) == true) {
            callback(55);
            return false;      
        } else {
        
           gamerTag = data["Response"][0]["displayName"];
           membershipId = data["Response"][0]["membershipId"];
           systemType = data["Response"][0]["membershipType"];

           if(systemType = 2){
            system = 'TigerPSN';
           }else if(systemType = 1){
            system = "TigerXbox";
           }
           console.log(systemType);
           console.log(system);
           console.log(membershipId);
        }


       	unirest.get('http://www.bungie.net/Platform/Destiny/'+system+'/Account/'+membershipId+'')
		.type('json')
		.end(function (response) {
			console.log('data2');
			console.log(response.body);

       		var data2 = response.body;
			//var characters = data2['Response']['data']['characters'];
	 //    characterTwo = data['Response']['data']['characters'][1];
	 //    characterThree = data['Response']['data']['characters'][2];
			callback(data2['Response']);

		});

     });
    console.log('hello');
 
    
};
exports.friend = function(system,gamerTag,callback){

  var system;

  unirest.get('http://www.bungie.net/Platform/Destiny/SearchDestinyPlayer/'+system+'/'+gamerTag)
    .type('json')
    .end(function (response) {
        
        
       //console.log(response.body)p;
       var data = response.body;
        console.log('length');
       console.log(typeof(data));
        console.log(data);

        if (isEmptyObject(data) == true) {
            callback(55);
            return false;      
        } else {
        
           gamerTag = data["Response"][0]["displayName"];
           membershipId = data["Response"][0]["membershipId"];
           systemType = data["Response"][0]["membershipType"];

           if(systemType = 2){
            system = 'TigerPSN';
           }else if(systemType = 1){
            system = "TigerXbox";
           }
           console.log(systemType);
           console.log(system);
           console.log(membershipId);
        }


        unirest.get('http://www.bungie.net/Platform/Destiny/'+system+'/Account/'+membershipId+'')
    .type('json')
    .end(function (response) {
     console.log('++++++++++++data2+++++++++++');
     console.log(response.body);

          var data2 = response.body;
  // var characters = data2['Response']['data']['characters'];
  //    characterTwo = data['Response']['data']['characters'][1];
  //    characterThree = data['Response']['data']['characters'][2];
      callback(data2['Response']);

    });

     });
    console.log('hello');
 
    
};


exports.characterInfo = function(membershipId,characterId,system,callback){


    // http://www.bungie.net/Platform/Destiny/2/Account/4611686018428490430/Character/2305843009286077889/?definitions=true
    unirest.get('http://www.bungie.net/Platform/Destiny/'+system+'/Account/'+membershipId+'/Character/'+characterId+'/Inventory/?definitions=true')
    .end(function (res) {
        
        var temp = res.body;
        callback(temp)
        
    });
};

exports.apiTwo = function(type,id,callback){

	//    /Manifest/{type}/{id}/

    unirest.get('http://www.bungie.net/Platform/Destiny/'+type+'/'+id+'')
    .end(function (res) {
        
        var temp = res.body;
        callback(temp)
        
    });

};




