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

	var system;

	unirest.get('http://www.bungie.net/Platform/Destiny/SearchDestinyPlayer/'+system+'/'+gamerTag)
    .type('json')
    .end(function (response) {

       	var data = response.body;
        gamerTag = data["Response"][0]["displayName"];
        membershipId = data["Response"][0]["membershipId"];
        systemType = data["Response"][0]["membershipType"];

           if(systemType = 2){
            system = 'TigerPSN';
           }else if(systemType = 1){
            system = "TigerXbox";
           }
        
       	unirest.get('http://www.bungie.net/Platform/Destiny/'+system+'/Account/'+membershipId+'/?definitions=true')
		.type('json')
		.end(function (response) {
			//console.log('+++++++++++++++++++++++ Api One Results +++++++++++++++++++++++');
       		var data2 = response.body;
       		//console.log(data2);
			callback(data2['Response']);
			//return data2['Response'];
			//return {data: data2['Response']};

		  });

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