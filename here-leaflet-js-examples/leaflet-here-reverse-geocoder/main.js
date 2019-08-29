(function () {
	let M = {
	    'AppId': 'SRDnjFXg1EUdjJNVu9xN',
	    'AppCode': 'BDyd-r-8dYkniAe-fQKrOw',
	    'Lat' : 55.751,     
	    'Lng' : 37.620,     
	    'Zoom' : 17,
	    'TileLayerUrl': {},
	    'Geocoder' : {},
	    'GeocoderUrl': {}
	}

	M.TileLayerUrl = style => `https://2.base.maps.api.here.com/maptile/2.1/maptile/newest/${style}/{z}/{x}/{y}/512/png8?app_id=${M.AppId}&app_code=${M.AppCode}&ppi=320&lg=rus`

	const map = L.map('map').setView([M.Lat, M.Lng], M.Zoom)
	
	L.tileLayer(M.TileLayerUrl('reduced.night')).addTo(map)

	let navPosMarkerGroup = L.layerGroup()
	navPosMarkerGroup.addTo(map)

	M.GeocoderUrl = coords => `https://reverse.geocoder.api.here.com/6.2/reversegeocode.json?
		gen=3
		&app_id=${M.AppId}
		&app_code=${M.AppCode}
		&maxresults=1&
		mode=retrieveAddresses
		&prox=${coords},10000`

	
	M.Geocoder = position => {
		let coords = position.target.getLatLng()
		let geocoderUrl = M.GeocoderUrl(`${coords.lat},${coords.lng}`)

		fetch(geocoderUrl).then(res => {
			res.json().then(data => {
				console.log(data)
				
				navPosMarkerGroup.getLayers().forEach(layer => {
					navPosMarkerGroup.removeLayer(layer)
				})
				let resultArray = data.Response.View[0].Result
				resultArray.forEach(address => {
					console.log(address)
					L.marker([address.Location.NavigationPosition[0].Latitude,address.Location.NavigationPosition[0].Longitude]).addTo(navPosMarkerGroup)
				})
			})
		})
	}

	let marker = L.marker([M.Lat, M.Lng], {draggable:true}).addTo(map)
	marker.on('dragend', M.Geocoder)

	alert("Drag marker to geocode")

}())