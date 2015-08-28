var map;
function initMap() {
	var highland = {lat: 55.928, lng: -3.810}
	var fortWilliam = {lat: 56.819, lng: -5.105}
	var isleOfSkye = {lat: 57.535, lng: -6.226}
	var glasgow = {lat: 55.864, lng: -4.251}
	var edinburgh = {lat: 55.953, lng: -3.188}
	var inverness = {lat: 57.477, lng: -4.224}
	
	var fortWilliamTitle = "Fort William";
	var isleOfSkyeTitle = "Isle Of Skye";
	var glasgowTitle = "Glasgow";
	var edinburghTitle = "Edinburgh";
	var invernessTitle = "Inverness";
	
	map = new google.maps.Map(document.getElementById('map'), {
		center: highland,
		zoom: 7
	});
	
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

}

