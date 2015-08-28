var map;
function initMap() {
	var highland = {lat: 55.928, lng: -3.810}
	
	map = new google.maps.Map(document.getElementById('map'), {
		center: highland,
		zoom: 7
	});
}

