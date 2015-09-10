var map;
var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var labelIndex = 0;
var infoWindow = null;

// Different Places to show on map
var places = [
	    {
	    	lat: 55.948, 
	    	lng: -3.198, 
	    	title: 'Edinburgh Castle'
	    },
	    {
	    	lat: 55.946, 
	    	lng: -3.159, 
	    	title: 'Holyrood Park '
	    },
	    {
	    	lat: 55.952, 
	    	lng: -3.172, 
	    	title: 'Palace of Holyroodhouse'
	    },
	    {
	    	lat: 55.946, 
	    	lng: -3.190, 
	    	title: 'National Museum of Scotland'
	    },
	    {
	    	lat: 55.964, 
	    	lng: -3.212, 
	    	title: 'Royal Botanic Garden Edinburgh'
	    }
    ];

var searchResultAddress = [];

// Set the defined markers on the map
function setMarkerOnMap(searchResultArray){
	var i = 0;
	var arrayLength = places.length;
	var searchResultArrayLength = searchResultArray.length;

	for(i; i<arrayLength; i++){
		setMarker(places[i]);
	}	

	if(searchResultArrayLength > 0){
		for(i; i<searchResultArrayLength; i++){
			setMarker(searchResultArray[i]);
		}		
	}

	//console.log("A: " + marker);

}

function setMarker(place){
	var marker = new google.maps.Marker({
		position: place,
		map: map,
		name: place.title
	});	
	//console.log("B: " + marker);
}
/*
function setMapOnAll(map) {
	console.log("C: " + marker);
	for (var i = 0; i < marker.length; i++) {
		marker[i].setMap(map);
	}
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
  setMapOnAll(null);
  markers = [];
}*/



/* ===========================================
 * ====== G O O G L E   M A P S   A P I ======
 * ===========================================*/
function initAutocomplete() {
	
	// Initial Marker for the Map
	var edinburgh = {lat: 55.953, lng: -3.188}
	
	// initialize Map to show Scotland
	map = new google.maps.Map(document.getElementById('map'), {
		center: edinburgh,
		zoom: 12,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	});
	
	
	/* ===========================================
	 * =========== M A R K E R S =================
	 * ===========================================*/

	/*
	var infowindow = new google.maps.InfoWindow({
		content: contentString
	});*/
	

	setMarkerOnMap('');

	// add Marker to maps when Map is clicked
	// This event listener calls addMarker() when the map is clicked.
	google.maps.event.addListener(map, 'click', function(event) {
		addMarker(event.latLng, map);
	});

	/*
	marker.addListener('click', function() {
		infowindow.open(map, marker);
	});
*/

	// Add InfoWindow to each marker
	/*
	for (var i = 0; i < markers.length; i++) {
		var marker = markers[i];
		google.maps.event.addListener(marker, 'click', function () {
			infowindow.setContent(this.html);
			infowindow.open(map, this);
		});
	}*/

	// Highlights selected Marker
	/*
	google.maps.event.addListener(marker,'click',function() {

        if (selectedMarker) {
            selectedMarker.setIcon(normalIcon);
        }
        marker.setIcon(selectedIcon);
        selectedMarker = marker;
    });*/


	
	
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


/* ===========================================
 * ========== F O U R S Q U A R E ============
 * ===========================================*/
var foursquare = {
  description: 'Foursquare'
};

foursquare.search = function(search) {
  var request = $.ajax({
    url: 'https://api.foursquare.com/v2/venues/search',
    method: "GET",
    data: {
      ll: '55.9, -3.1',
      query: search,
      limit: 20,
      client_id: '01IIHMKSGMJZO21JB5S4DGE4BSWNHRX4BJR3KQ1XVKS1M1V1',
      client_secret: 'GGJ42S5YLPP4GFXJNHNS4TAEPVBCZBF44KS15WODOGJKDXN2',
      v: '20150910'
    }
  });

  request.done(function(results) {
    var venues = results.response.venues;
    console.log(venues);
    if (venues.length === 0) {
      var errorObj = new noteObject("Info", "No entries");
      notifications.push(errorObj);
    } else {
    	console.log("####################################################################################");
    	//console.log("D: " + marker);
    	//clearMarkers();
    	var arrayLength = venues.length;
      	for (var i = 0; i < arrayLength; i++) {
          searchResultAddress.push({'lat': venues[i].location.lat, 'lng' : venues[i].location.lng, 'title': venues[i].name});
        }
        console.log(searchResultAddress);

        setMarkerOnMap(searchResultAddress);
    }
  });

  request.fail(function(jqXHR, textStatus) {
    alert('Request failed: ' + textStatus);
  });
};


/* ===========================================
 * ========= V I E W  M O D E L ==============
 * ===========================================*/
function ViewModel(term) {
    this.query = ko.observable(term); 

    this.places = ko.dependentObservable(function() {
        var search = this.query().toLowerCase();
        console.log(search);
        if(search != ""){
        	foursquare.search(search);
        }
        
        return ko.utils.arrayFilter(places, function(place) {
            return place.title.toLowerCase().indexOf(search) >= 0;
        });
    }, this);
}
ko.applyBindings(new ViewModel(''));

