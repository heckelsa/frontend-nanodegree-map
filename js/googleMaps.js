
/* ===========================================
 * =========== V A R I A B L E S =============
 * ===========================================*/
var map;
var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var labelIndex = 0;
var infoWindow = null;
var places = [];

// Fixed Markers for Map
var startMarkers = [
	    {
	    	lat: 55.948, 
	    	lng: -3.198, 
	    	name: 'Edinburgh Castle'
	    },
	    {
	    	lat: 55.946, 
	    	lng: -3.159, 
	    	name: 'Holyrood Park '
	    },
	    {
	    	lat: 55.952, 
	    	lng: -3.172, 
	    	name: 'Palace of Holyroodhouse'
	    },
	    {
	    	lat: 55.946, 
	    	lng: -3.190, 
	    	name: 'National Museum of Scotland'
	    },
	    {
	    	lat: 55.964, 
	    	lng: -3.212, 
	    	name: 'Royal Botanic Garden Edinburgh'
	    }
    ];


/* ===========================================
 * ========= G O O G L E   M A P S ===========
 * ===========================================*/

function initMap() {
	// Startposition for Google Maps
	var edinburgh = {lat: 55.953, lng: -3.188};

	// declare map options
	var options = {
		center: edinburgh,
		zoom: 12,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		disableDefaultUI: true,
    	zoomControl: true
	};

	// initialize Map to show Edinburgh
	this.map = new google.maps.Map(document.getElementById('map'), options);

	// sets up the start Markers on the map
	setAllMarkersOnMap(this.map);

	// add Marker to maps when Map is clicked
	google.maps.event.addListener(map, 'click', function(event) {
		addMarker(event.latLng, map);
	});

	
	infoWindow = new google.maps.InfoWindow();
}

// sets a marker for each place
function setMarker(place){
	// set Coordinates of place
	var placePosition = new google.maps.LatLng(place.lat, place.lng);
	// create new Marker
	var marker = new google.maps.Marker({
		position: placePosition,
		map: map,
		name: place.name
	});

	place.marker = marker;

	

	// adds Event when a marker is clicked
	google.maps.event.addListener(marker, 'click', function() {
		activateMarker(marker, map, place);		
	});
}

// animates a marker
function animateMarker(marker){
	marker.setAnimation(google.maps.Animation.BOUNCE);
	setTimeout(function() {
		marker.setAnimation(null);
	}, 1500);	
}

function showInfoWindow(map, marker, place){
	var infoWindowContent = "<div style='font-weight:bold;'>" + place.name + "</div>";

	// show InfoWindow
	infoWindow.setContent(infoWindowContent);
	infoWindow.open(map, marker);
}

function centerMarker(marker){
	// put selected Marker in middle Position
	map.panTo(marker.position);
}

function activateMarker(marker, map, place){
	animateMarker(marker);
	showInfoWindow(map, marker, place);
	centerMarker(marker);
}

// Adds a marker to the map after a click on the map.
function addMarker(location, map) {
  // Adds the marker at the clicked location, and add the next-available label
  // from the array of alphabetical characters.
  var marker = new google.maps.Marker({
    position: location,
    label: labels[labelIndex++ % labels.length],
    map: map
  });
}

// copyies the start Markers on the places array
function setStartMarkersAsPlaces(){
	this.places.push.apply(this.places, this.startMarkers);
}

// creates for all elements on the places array an marker and sets it on the map
function setAllMarkersOnMap(){
	var i = 0;
	var placesLength = this.places.length;
	for(i; i<placesLength; i++){
		if(this.places[i]){
			setMarker(places[i]);
		}
	}
}

// Set a specific map to all markers of the places array
function setMapOnAll(map) {
	var i = 0;
	var placesLength = this.places.length;
	for(i; i<placesLength; i++){
		places[i].marker.setMap(map);
	}
}

// Removes the markers from the map and clears the places array
function clearMarkers() {
  setMapOnAll(null);
  places = [];
}

function clickPlaceMarker(result){
	google.maps.event.trigger(result.marker, 'click');

	activateMarker(result.marker, map, result.place);
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

    if (venues.length === 0) {
      var errorObj = new noteObject("Info", "No entries");
      notifications.push(errorObj);
    } else {
    	clearMarkers();
    	var arrayLength = venues.length;
    	//iterates through search Response and adds all elements on the places array.	
		for (var i = 0; i < arrayLength; i++) {
			var venueOption = {
				'lat': venues[i].location.lat, 
				'lng' : venues[i].location.lng, 
				'name': venues[i].name
			}
			places.push(venueOption);
	    }	
	    // writes all search results on the map
        setAllMarkersOnMap();
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

        if(search != ""){
        	foursquare.search(search);
        }

        if(places == ""){
			setStartMarkersAsPlaces();
        }
        
        return ko.utils.arrayFilter(places, function(place) {
            return place.name.toLowerCase();
        });
    }, this);
}
ko.applyBindings(new ViewModel(''));