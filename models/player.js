var unirest = require("unirest");
var home = require('../hello.js');

// Constructor
function Player() {
  // always initialize all instance properties
  this.gamerTag = '';
  this.system =  0;
  this.data; // default value
}
// class methods
Player.prototype.getDestinyInfo= function(system,gamerTag,callback) {

	var apiKey = '037e61ce4a9f42c5b6c3b19e872e4ff9';


	unirest.get('http://www.bungie.net/Platform/Destiny/SearchDestinyPlayer/'+system+'/'+gamerTag)
    .type('json')
    .header('X-API-Key',apiKey)
    .end(function (response) {
       	var data = response.body;
    	console.log(data);

       	//Error Handling
       	if(data["Response"].length == 0){
       		console.log('its empty');
       		callback(false);
}else{

	        gamerTag = data["Response"][0]["displayName"];
	        membershipId = data["Response"][0]["membershipId"];
	        systemType = data["Response"][0]["membershipType"];

	        
	       	unirest.get('http://www.bungie.net/Platform/Destiny/'+system+'/Account/'+membershipId+'/?definitions=true')
	       	 .header('X-API-Key',apiKey)
			.type('json')
			.end(function (response) {
				
	       		var data2 = response.body;
	       		console.log(data2);
				callback(data2['Response']);

			  });
		}
    });

};
Player.prototype.getCharacterInfo= function(system,membershipId,characterId,callback) {

	 unirest.get('http://www.bungie.net/Platform/Destiny/'+system+'/Account/'+membershipId+'/Character/'+characterId+'/Inventory/?definitions=true')
    .end(function (res) {
        
        var temp = res.body;
        callback(temp['Response']);
        
    });

};
// export the class
module.exports = Player;