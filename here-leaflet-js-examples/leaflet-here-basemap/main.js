(function(){

	let M = {
	    'AppId': 'YOUR_APP_ID',
	    'AppCode': 'YOUR_APP_CODE',
	    'Lat' : 55.751,     
	    'Lng' : 37.620,     
	    'Zoom' : 12,
	    'TileLayerUrl': {}
	}

	M.TileLayerUrl = style => `https://2.base.maps.api.here.com/maptile/2.1/maptile/newest/${style}/{z}/{x}/{y}/512/png8?app_id=${M.AppId}&app_code=${M.AppCode}&ppi=320&lg=rus`

	const map = L.map('map').setView([M.Lat, M.Lng], M.Zoom)
	
	let basemap = L.tileLayer(M.TileLayerUrl('normal.day'))
	basemap.addTo(map)
	
	map.zoomControl.setPosition("topright")

	document.querySelectorAll(".form-check-input").forEach(el => {
		el.addEventListener('click', evt => {
			map.removeLayer(basemap)
			basemap = L.tileLayer(M.TileLayerUrl(evt.target.getAttribute("data-map")))
			basemap.addTo(map)
		})
	})


}())