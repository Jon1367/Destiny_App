// Constructor
function PlayerOne(gamerTag,system) {
  // always initialize all instance properties
  this.gamerTag = gamerTag;
  this.system = system; // default value
}
// class methods
PlayerOne.prototype.fooBar = function() {

};
// export the class
module.exports = PlayerOne;