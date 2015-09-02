// .config(function ($interpolateProvider) {
//         $interpolateProvider.startSymbol('{[{');
//         $interpolateProvider.endSymbol('}]}');})

// start foundation 
$(document).foundation();

$( "#SignIn" ).click(function() {

$('#myModal').foundation('reveal', 'close');

});

// ============  Angular ===========

var app = angular.module("destinyApp", ["firebase"]);


app.controller("AuthCtrl", ["$scope", "$firebaseAuth",
  function($scope, $firebaseAuth) {
	var ref = new Firebase("https://destinyapp.firebaseio.com/");

    auth = $firebaseAuth(ref);

    $scope.signIn = function() {

	var ref = new Firebase("https://destinyapp.firebaseio.com/");
		ref.authWithPassword({
		  "email": $scope.email,
		  "password": $scope.password
		}, function(error, authData) {
		  if (error) {
		    console.log("Login Failed!", error);
		  } else {
		    console.log("Authenticated successfully with payload:", authData);
		  }
		});

    };
  }
]);