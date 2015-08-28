var map;
var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var labelIndex = 0;


function initAutocomplete() {
	
	// Initial Marker for the Map
	var highland = {lat: 55.928, lng: -3.810}
	
	// Different Places to show on map
	var fortWilliam = {lat: 56.819, lng: -5.105}
	var isleOfSkye = {lat: 57.535, lng: -6.226}
	var glasgow = {lat: 55.864, lng: -4.251}
	var edinburgh = {lat: 55.953, lng: -3.188}
	var inverness = {lat: 57.477, lng: -4.224}
	
	// Set Titles for the de
	var fortWilliamTitle = "Fort William";
	var isleOfSkyeTitle = "Isle Of Skye";
	var glasgowTitle = "Glasgow";
	var edinburghTitle = "Edinburgh";
	var invernessTitle = "Inverness";
	
	// initialize Map to show Scotland
	map = new google.maps.Map(document.getElementById('map'), {
		center: highland,
		zoom: 7,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	});
	
	
	/* ===========================================
	 * =========== M A R K E R S =================
	 * ===========================================*/
	
	// Set the defined markers on the map
	var marker = new google.maps.Marker({
		position: isleOfSkye,
		map: map,
		title: isleOfSkyeTitle
	});
	
	var marker = new google.maps.Marker({
		position: fortWilliam,
		map: map,
		title: fortWilliamTitle
	});
	
	var marker = new google.maps.Marker({
		position: glasgow,
		map: map,
		title: glasgowTitle
	});
	
	var marker = new google.maps.Marker({
		position: edinburgh,
		map: map,
		title: edinburghTitle
	});
	
	var marker = new google.maps.Marker({
		position: inverness,
		map: map,
		title: invernessTitle
	});
	
	// add Marker to maps when Map is clicked
	// This event listener calls addMarker() when the map is clicked.
	google.maps.event.addListener(map, 'click', function(event) {
		addMarker(event.latLng, map);
	});
	
	
	/* ===========================================
	 * ============ S E A R C H ==================
	 * ===========================================*/
	
	// Create the search box and link it to the UI element.
	var input = document.getElementById('pac-input');
	var searchBox = new google.maps.places.SearchBox(input);
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
	
	// Bias the SearchBox results towards current map's viewport.
	map.addListener('bounds_changed', function() {
		searchBox.setBounds(map.getBounds());
	});
	
	var markers = [];
	// Listen for the event fired when the user selects a prediction and retrieve
	// more details for that place.
	searchBox.addListener('places_changed', function() {
		var places = searchBox.getPlaces();

		if (places.length == 0) {
			return;
		}

		// Clear out the old markers.
		markers.forEach(function(marker) {
			marker.setMap(null);
		});
		markers = [];

		// For each place, get the icon, name and location.
		var bounds = new google.maps.LatLngBounds();
		places.forEach(function(place) {
			var icon = {
				url: place.icon,
				size: new google.maps.Size(71, 71),
				origin: new google.maps.Point(0, 0),
				anchor: new google.maps.Point(17, 34),
				scaledSize: new google.maps.Size(25, 25)
			};

			// Create a marker for each place.
			markers.push(new google.maps.Marker({
				map: map,
				icon: icon,
				title: place.name,
				position: place.geometry.location
			}));

			if (place.geometry.viewport) {
				// Only geocodes have viewport.
				bounds.union(place.geometry.viewport);
			} else {
				bounds.extend(place.geometry.location);
			}
		});
		
		map.fitBounds(bounds);
	});
	
	
}

// Adds a marker to the map.
function addMarker(location, map) {
  // Add the marker at the clicked location, and add the next-available label
  // from the array of alphabetical characters.
  var marker = new google.maps.Marker({
    position: location,
    label: labels[labelIndex++ % labels.length],
    map: map
  });
}




