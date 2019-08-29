(function() {

    var platform = new H.service.Platform({
      app_id: 'SRDnjFXg1EUdjJNVu9xN',
      app_code: 'BDyd-r-8dYkniAe-fQKrOw',
    })
    
    var defaultLayers = platform.createDefaultLayers()

    var map = new H.Map(document.getElementById('map'),
      defaultLayers.normal.map, {center: {lat: 51.50851542064582, lng: -0.12669682502746582}, zoom: 16 })

    var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map))

    var ui = H.ui.UI.createDefault(map, defaultLayers)

	$.ajax({
	  url: 'https://traffic.api.here.com/traffic/6.1/flow.json',
	  type: 'GET',
	  dataType: 'jsonp',
	  jsonp: 'jsoncallback',
	  data: {
	    bbox: '51.5082,-0.1285;51.5062,-0.1265',
	    app_id: "SRDnjFXg1EUdjJNVu9xN",
	    app_code: "BDyd-r-8dYkniAe-fQKrOw",
	    responseattributes: 'sh,fc' 
	  },
	  success: function (data) {
	    data.RWS[0].RW.forEach(feature => {
	    	feature.FIS[0].FI.forEach(link => {
	    		link.SHP.forEach(attr => {
	    		
	    			var point1 = attr.value[0].split(" ")[0].split(",")
	    			var point2 = attr.value[0].split(" ")[1].split(",")
	    			
	    			var lineString = new H.geo.LineString();

					lineString.pushPoint({lat:Number(point1[0]), lng:Number(point1[1])})
					lineString.pushPoint({lat:Number(point2[0]), lng:Number(point2[1])})

					map.addObject(new H.map.Polyline(
						lineString, { style: { lineWidth: 4 }}
					))

	    			console.log(attr.value)
	    		})
	    	})
	    })
	  }
	})

	var distanceMeasurementTool = new H.ui.DistanceMeasurement()
	ui.addControl('distancemeasurement', distanceMeasurementTool)

}())