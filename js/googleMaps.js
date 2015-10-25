

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
            name: 'Edinburgh Castle',
            address: 'Castlehill<br />Edinburgh<br />EH1 2NG<br />United Kingdom'
        },
        {
            lat: 55.946,
            lng: -3.159,
            name: 'Holyrood Park',
            address: 'Queen\'s Dr<br />Edinburgh<br />EH8 8HG<br />United Kingdom'
        },
        {
            lat: 55.952,
            lng: -3.172,
            name: 'Palace of Holyroodhouse',
            address: 'Canongate<br />Edinburgh<br />EH8 8DX<br />United Kingdom'
        },
        {
            lat: 55.946,
            lng: -3.190,
            name: 'National Museum of Scotland',
            address: 'Chambers St<br />Edinburgh<br />EH1 1JF<br />United Kingdom'
        },
        {
            lat: 55.964,
            lng: -3.212,
            name: 'Royal Botanic Garden Edinburgh',
            address: 'Arboretum Place<br />Edinburgh<br />EH3 5NZ<br />United Kingdom'
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

    // set marker to place
    place.marker = marker;

    // adds Event when a marker is clicked
    google.maps.event.addListener(marker, 'click', function() {
        activateMarker(marker, map, place);
    });
}

// animates a marker
function animateMarker(marker){
    // sets the type of animation
    marker.setAnimation(google.maps.Animation.BOUNCE);
    // sets how long the animation is shown
    setTimeout(function() {
        marker.setAnimation(null);
    }, 1500);
}

// shows a Info Window
function showInfoWindow(map, marker, place){
    var infoWindowContent = "<div style='font-weight:bold;'>" + place.name + "</div><div>" + place.address + "</div>";

    // show InfoWindow
    infoWindow.setContent(infoWindowContent);
    infoWindow.open(map, marker);
}

// puts a selected in a central position on the map
function centerMarker(marker){
    // put selected Marker in middle Position
    map.panTo(marker.position);
}

// animates an marker, shows an Info window and centers the position of the selected marker on the map
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
    this.places.push.apply(places, startMarkers);
}

// creates for all elements on the places array an marker and sets it on the map
function setAllMarkersOnMap(){
    var i = 0;
    var placesLength = this.places.length;
    for(i; i<placesLength; i++){
        if(this.places[i]){
            setMarker(this.places[i]);
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
  this.places = [];
}

// if a element of the list view is clicked, then this function is triggered and activates the related marker
function clickPlaceMarker(result){
    google.maps.event.trigger(result.marker, 'click');

    var place = getPlaceFromName(result.marker);
    if(place){
        activateMarker(result.marker, map, place);
    }
}

// Checks if the Parameter is listes inside the places array. If it is, then it returns the entry.
function getPlaceFromName(name){
    var i = 0;
    var placesLength = this.places.length;
    for(i; i<placesLength; i++){
        if(places[i].name == name){
            return places[i];
        }
    } 
    return false;
}


/* ===========================================
 * ========== F O U R S Q U A R E ============
 * ===========================================*/


var foursquare = {};

// Foursquare ajax search request with the needed parameters
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

    // result of request is put onto the places array
    request.done(function(results) {
        var venues = results.response.venues;

        if (venues.length === 0) {
            // reaction for when no response comes back
            var errorObj = new noteObject("Info", "No entries");
            notifications.push(errorObj);
        } else {
            // write response on place element.
            // first, clear all current Markers
            clearMarkers();
            var arrayLength = venues.length;
            var formattedAddressLength;
            var output;
            var previousOutput;
            var address = "";
            var i = 0;
            //iterates through search Response and adds all elements on the places array.   
            for (i; i < arrayLength; i++) {
                address = "";
                formattedAddressLength = "";
                formattedAddressLength = venues[i].location.formattedAddress.length;

                // takes the formatted Address and saves it as a string
                for (var j = 0; j < formattedAddressLength; j++) {
                    output = venues[i].location.formattedAddress[j];
                    if(previousOutput != output){
                        // if the previous content is the same as this one it will be ignored to prevent duplicate and unnecessary content
                        address += output + "<br />";    
                    }
                    previousOutput = output;
                }

                var venueOption = {
                    'lat': venues[i].location.lat, 
                    'lng' : venues[i].location.lng, 
                    'name': venues[i].name,
                    'address' : address
                }
                // write each element on places array
                places.push(venueOption);
            }   
            // writes all search results on the map
            setAllMarkersOnMap();
        }
    });

    // if a request fails there will be a console output
    request.fail(function(jqXHR, textStatus) {
        console.log('Request failed: ' + textStatus);
    });
};


/* ===========================================
 * ========= V I E W  M O D E L ==============
 * ===========================================*/
function ViewModel(term) {
    // observeable for the search input field
    this.query = ko.observable(term); 

    // observeable for the places array
    this.places = ko.dependentObservable(function() {
        // the searchterm of the search input field is changed into lowercase
        var search = this.query().toLowerCase();

        if(search != ""){
            // run search
            foursquare.search(search);
        }

        if(places == ""){
            // if places array is empty (first visit of page) then add defined startMarkers on places array
            setStartMarkersAsPlaces();
        }
        
        return ko.utils.arrayFilter(places, function(place) {
            // returns places name for list view
            return place.name;
        });
    }, this);
}
ko.applyBindings(new ViewModel(''));