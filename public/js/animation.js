// ============  jQuery ===========

//start foundation js
//$(document).foundation();


// JQuery on load
$(document).ready(function(){



	// close SigIn  Modal
	$( "#SignIn" ).click(function() {

	$('#myModal').foundation('reveal', 'close');

	});

	// close Sign-Up Modal
	$( "#SignUp" ).click(function() {

	$('#signUp').foundation('reveal', 'close');

	});

// ===================== Profile  Page ================

	// Character Banner animation set with tmeouts
	setTimeout(function(){ 
		$( "#cbanner0" ).removeClass( "hide" ).addClass( "animated flipInX" );
	}, 500);
	setTimeout(function(){ 
		$( "#cbanner1" ).removeClass( "hide" ).addClass( "animated flipInX" );
	}, 1000);
	setTimeout(function(){ 
		$( "#cbanner2" ).removeClass( "hide" ).addClass( "animated flipInX" );
	}, 1500);

// ===================== CharacterView Page ================

	setTimeout(function(){ 
		$( "#chInfo" ).removeClass( "hide" ).addClass( "animated fadeInLeft" );
	}, 500);
	setTimeout(function(){ 
		$( "#chInfo2" ).removeClass( "hide" ).addClass( "animated fadeInRight" );
	}, 500);






});
