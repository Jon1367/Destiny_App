// ============  Angular ===========
var app = angular.module("destinyApp", ["firebase"]);




app.controller("AuthCtrl", ["$scope", "$firebaseAuth",
  function($scope, $firebaseAuth) {
	var ref = new Firebase("https://destinyapp.firebaseio.com/");

    var Auth = $firebaseAuth(ref);
    $scope.userShow;

    $scope.signIn = function() {

	//var ref = new Firebase("https://destinyapp.firebaseio.com/");
		Auth.$authWithPassword({
		  "email": $scope.email,
		  "password": $scope.password
		}).then(function(data) {
		  	$scope.userShow=1;
		  	$scope.userData = data;
		    console.log("Authenticated successfully with payload:", data);
		  }).catch(function(error){
		  	console.log(error);
		  });
    };
  }
]);

// ============  Add Firebase User ===========

app.controller("addUser", ["$scope", "$firebaseAuth",
  	function($scope, $firebaseAuth) {
		var ref = new Firebase("https://destinyapp.firebaseio.com/");

	    $scope.signUp = function() {

			ref.createUser({
			  email: $scope.email,
			  password: $scope.password
			}, function(error, userData) {
			  if (error) {
			    switch (error.code) {
			      case "EMAIL_TAKEN":
			        console.log("The new user account cannot be created because the email is already in use.");
			        break;
			      case "INVALID_EMAIL":
			        console.log("The specified email is not a valid email.");
			        break;
			      default:
			        console.log("Error creating user:", error);
			    }
			  } else {
			    console.log("Successfully created user account with uid:", userData.uid);
			  }
			});
		};
	}
]);

