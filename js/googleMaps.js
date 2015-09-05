// Different Places to show on map
var places = [
	    {
	    	lat: 56.819, 
	    	lng: -5.105, 
	    	title: 'Fort William'
	    },
	    {
	    	lat: 57.535, 
	    	lng: -6.226, 
	    	title: 'Isle Of Skye'
	    },
	    {
	    	lat: 56.439, 
	    	lng: -6.000, 
	    	title: 'Isle Of Mull'
	    },
	    {
	    	lat: 55.864, 
	    	lng: -4.251, 
	    	title: 'Glasgow'
	    },
	    {
	    	lat: 55.953, 
	    	lng: -3.188, 
	    	title: 'Edinburgh'
	    },
	    {
	    	lat: 57.477, 
	    	lng: -4.224, 
	    	title: 'Inverness'
	    },
	    {
	    	lat: 57.149, 
	    	lng: -2.094, 
	    	title: 'Aberdeen'
	    }
    ];


function ViewModel(term) {
	// 
    this.query = ko.observable(term);

    this.places = ko.dependentObservable(function() {
        var search = this.query().toLowerCase();
        return ko.utils.arrayFilter(places, function(place) {
            return place.title.toLowerCase().indexOf(search) >= 0;
        });
    }, this);

    self.getFsData = ko.computed(function() {
		$.ajax(fourSquare_URL, {
			dataType: 'json',
			async: true,
			type: 'GET'
		}).done(function(data){
			self.locationsList.push(makeLocationData(data));
		});
	});
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
		var arrayLength = places.length;
		console.log(i);

		for(i; i<arrayLength; i++){
			console.log(places[i].title);
			setMarker(places[i]);
		}	
	}

	function setMarker(place){
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




