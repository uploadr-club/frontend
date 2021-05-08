let storage_counter = document.getElementById("storage_counter");
let files_counter = document.getElementById("total_files");


get_storage()
get_files()
check_user_logged()
login()

/** get users storage info */
function get_storage() {
	storage_counter.innerText = "Data from user storage";
	storage_counter.value = 0; // will be the used value
	storage_counter.max = 100; // will be the max value
}

function get_files() {
	files_counter.innerText = 1000
}



function login() {
	payload = {
		"username": "Primus",
		"password": "Secondus"
	};
	postData('https://api.uploadr.club/api/v1/session/create', payload).then(data => {
		console.log(data);
	});
}


function check_user_logged() {
	placeholder = {
		"token": "xyz",
		"expire_timestamp": 1,
		"user_uuid": "e-e-e-e-e"
	}
	postData('https://api.uploadr.club/api/v1/session/check', placeholder)
		.then(data = () => {
			console.log(data)
		})
}






async function postData(url = '', data = {}) {
	const response = await fetch(url, {
		method: 'POST',
		cache: 'no-cache',
		mode: 'no-cors',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	});
	return response.json();
}




/** convert function
function abbrNum(number, decPlaces) {
	// 2 decimal places => 100, 3 => 1000, etc
	decPlaces = Math.pow(10,decPlaces);

	// Enumerate number abbreviations
	var abbrev = [ "k", "m", "b", "t" ];

	// Go through the array backwards, so we do the largest first
	for (var i=abbrev.length-1; i>=0; i--) {

		// Convert array index to "1000", "1000000", etc
		var size = Math.pow(10,(i+1)*3);

		// If the number is bigger or equal do the abbreviation
		if(size <= number) {
			 // Here, we multiply by decPlaces, round, and then divide by decPlaces.
			 // This gives us nice rounding to a particular decimal place.
			 number = Math.round(number*decPlaces/size)/decPlaces;

			 // Handle special case where we round up to the next abbreviation
			 if((number == 1000) && (i < abbrev.length - 1)) {
				 number = 1;
				 i++;
			 }

			 // Add the letter for the abbreviation
			 number += abbrev[i];

			 // We are done... stop
			 break;
		}
	}

	return number;
}
*/