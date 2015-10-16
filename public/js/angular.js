// ============  Angular ===========
var app = angular.module("destinyApp", ["firebase"])
.run(function($rootScope) {
    $rootScope.user  = '';
});




app.controller("AuthCtrl", ["$scope", "$rootScope" ,"$firebaseObject","$firebaseAuth",
  function($scope, $rootScope ,$firebaseObject ,$firebaseAuth) {
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
		  	$rootScope.user = data.password.email;
		    console.log("Authenticated successfully with payload:", data);
		  }).catch(function(error){
		  	console.log(error);
		  });
    };
  }
]);
app.controller("chatCtrl", ["$scope", "$rootScope", "$firebaseArray", 
        function($scope, $rootScope, $firebaseArray) {
          //CREATE A FIREBASE REFERENCE
          var ref = new Firebase("https://destinyapp.firebaseio.com/messages");

          // GET MESSAGES AS AN ARRAY
          $scope.messages = $firebaseArray(ref);

          //ADD MESSAGE METHOD
          $scope.addMessage = function(e) {

            //LISTEN FOR RETURN KEY
            if (e.keyCode === 13 && $scope.msg) {
              //ALLOW CUSTOM OR ANONYMOUS USER NAMES
              var name = $scope.name || "anonymous";
              console.log('root Scope');
              console.log($scope.user);

             if($scope.user === ''){

            // check if logged In
            $scope.messages.$add({
                from: name,
                body: $scope.msg
              });
             }else{

            $scope.messages.$add({
                from: $scope.user,
                body: $scope.msg
              });


             }
              //ADD TO FIREBASE


              //RESET MESSAGE
              $scope.msg = "";
            }
          }
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

