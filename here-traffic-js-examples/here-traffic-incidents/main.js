(function () {
	
	var platform = new H.service.Platform({
      app_id: 'YOUR_APP_ID',
      app_code: 'YOUR_APP_CODE',
    })
    
    var defaultLayers = platform.createDefaultLayers()

    var map = new H.Map(document.getElementById('map'),
      defaultLayers.normal.map, {center: {lat: 55.75182523990561, lng: 37.61645793914794}, zoom: 14 })

    var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map))

    var ui = H.ui.UI.createDefault(map, defaultLayers)

	$.ajax({
	  url: 'https://traffic.api.here.com/traffic/6.0/incidents.json',
	  type: 'GET',
	  dataType: 'jsonp',
	  jsonp: 'jsoncallback',
	  data: {
	    bbox: '55.7990,37.5206;55.6931,37.7046',
	    app_id: "SRDnjFXg1EUdjJNVu9xN",
	    app_code: "BDyd-r-8dYkniAe-fQKrOw",
	    criticality: "critical,major,minor,lowImpact"
	  },
	  success: function (data) {
	
	   data.TRAFFICITEMS.TRAFFICITEM.forEach(feature => {
	   	console.log(feature)
	   	let coords = feature.LOCATION.GEOLOC.ORIGIN
	   	let lat = coords.LATITUDE
	   	let lng = coords.LONGITUDE
	   	let marker = new H.map.Marker({lat:lat, lng:lng})

	   	map.addObject(marker)
	   })
	  }
	})
}())