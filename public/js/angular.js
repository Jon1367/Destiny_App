// .config(function ($interpolateProvider) {
//         $interpolateProvider.startSymbol('{[{');
//         $interpolateProvider.endSymbol('}]}');})

// start foundation 
$(document).foundation();
var app = angular.module("sampleApp", ["firebase"]);


app.controller("SampleCtrl", function($scope, $firebaseObject) {
  var ref = new Firebase("https://destinyapp.firebaseio.com/");
  // download the data into a local object
  $scope.data = $firebaseObject(ref);
  // putting a console.log here won't work, see below
});

function MyController($scope, angularFireAuth) {
  var ref = new Firebase("https://destinyapp.firebaseio.com/");
  angularFireAuth.initialize(ref, {scope: $scope, name: "user"});
}

	// .controller('MainController', function($scope,CandyService){

	// 	  console.log("Hello1");
        

 //        $scope.candyArray=CandyService.getCandy();

 //    })