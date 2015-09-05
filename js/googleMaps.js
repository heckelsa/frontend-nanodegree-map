// Different Places to show on map
var fortWilliam = {lat: 56.819, lng: -5.105, title: 'Fort William'}
var isleOfSkye = {lat: 57.535, lng: -6.226, title: 'Isle Of Skye'}
var isleOfMull = {lat: 56.439, lng: -6.000, title: 'Isle Of Mull'}
var glasgow = {lat: 55.864, lng: -4.251, title: 'Glasgow'}
var edinburgh = {lat: 55.953, lng: -3.188, title: 'Edinburgh'}
var inverness = {lat: 57.477, lng: -4.224, title: 'Inverness'}
var aberdeen = {lat: 57.149, lng: -2.094, title: 'Aberdeen'}

var mapPlacesArray = [fortWilliam, isleOfSkye, glasgow, edinburgh, inverness, isleOfMull, aberdeen];

function ViewModel(term) {
    this.searchQuery = ko.observable(term);

    this.searchOutput = ko.pureComputed(function() {
    	return this.searchWithinMapPlaces();
    }, this); 

    this.searchWithinMapPlaces = function(){
		if(this.searchQuery != null){
			var i = 0;
			var mapPlaceName;
			var foundPlaces = [];
			var arrayLength = mapPlacesArray.length;

			for(i; i<arrayLength; i++){
				mapPlaceName = mapPlacesArray[i].title.toLowerCase();

				if(mapPlaceName.indexOf(this.searchQuery().toLowerCase()) >= -0) {
	                foundPlaces.push(mapPlacesArray[i].title);
	            }
			};

			return foundPlaces;
		}
    };
}
 
ko.applyBindings(new ViewModel(''));


var map;
var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var labelIndex = 0;


/* ===========================================
 * ====== G O O G L E   M A P S   A P I ======
 * ===========================================*/
function initAutocomplete() {
	
	// Initial Marker for the Map
	var highland = {lat: 55.928, lng: -3.810}
	
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
	function setMarkerOnMap(){
		var i = 0;
		var arrayLength = mapPlacesArray.length;
		console.log(i);

		for(i; i<arrayLength; i++){
			console.log(mapPlacesArray[i].title);
			setMarker(mapPlacesArray[i]);
		}	
	}

	function setMarker(place, placeTitle){
		var marker = new google.maps.Marker({
			position: place,
			map: map,
			title: place.title
		});	
	}

	setMarkerOnMap();

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




