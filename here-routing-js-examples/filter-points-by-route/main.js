(function () {
   
  let platform = new H.service.Platform({
    apikey: "jZv6x8DIQ2L07XCHFQGXKVxwvxvja2UwR0bJfuFq-Zk"
  })

  let defaultLayers = platform.createDefaultLayers()

  //Step 2: initialize a map  - not specificing a location will give a whole world view.
  let map = new H.Map(document.getElementById('map'),
    defaultLayers.vector.normal.map, {
      pixelRatio: window.devicePixelRatio || 1
    })
  // add a resize listener to make sure that the map occupies the whole container
  window.addEventListener('resize', () => map.getViewPort().resize())

  map.setCenter({lat:55.75349, lng: 37.61885})
  map.setZoom(16)

  //Step 3: make the map interactive
  // MapEvents enables the event system
  // Behavior implements default interactions for pan/zoom (also on mobile touch environments)
  let behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map))

  // Create the default UI components
  
  let ui = H.ui.UI.createDefault(map, defaultLayers)

  function calculateRouteFromAtoB (platform) {
    var router = platform.getRoutingService(),
      routeRequestParams = {
        mode: 'fastest;car',
        representation: 'display',
        routeattributes : 'waypoints,summary,shape,legs',
        maneuverattributes: 'direction,action',
        waypoint0: '55.84294011297761,37.496337890625', // Brandenburg Gate
        waypoint1: '55.790859214839344,37.6226806640625'  // Friedrichstraße Railway Station
      };


    router.calculateRoute(
      routeRequestParams,
      onSuccess,
      onError
    );
  }

  function onSuccess(result) {
    var route = result.response.route[0];
   /*
    * The styling of the route response on the map is entirely under the developer's control.
    * A representitive styling can be found the full JS + HTML code of this example
    * in the functions below:
    */
    addRouteShapeToMap(route);
    // ... etc.
  }

  function onError(error) {
    alert('Can\'t reach the remote server');
  }

  function addRouteShapeToMap(route){
    var lineString = new H.geo.LineString(),
      routeShape = route.shape,
      polyline;

    let poi_array = []

    routeShape.forEach(function(point) {
      var parts = point.split(',');
      poi_array.push(parts)
      lineString.pushLatLngAlt(parts[0], parts[1]);
    });

    var linestring1 = turf.lineString(poi_array, {name: 'line 1'})
    var buffered = turf.buffer(linestring1, 5, {units: 'kilometers'})

    var reader = new H.data.geojson.Reader();
    reader.parseData(buffered);

    // debugger
    
    var group = new H.map.Group(); 
    group.addObjects(reader.getParsedObjects()); 
    map.addObject(group); 
    

    polyline = new H.map.Polyline(lineString, {
      style: {
        lineWidth: 4,
        strokeColor: 'rgba(0, 128, 255, 0.7)'
      }
    });
    // Add the polyline to the map
    map.addObject(polyline);
    // And zoom to its bounding rectangle
    map.getViewModel().setLookAtData({
      bounds: polyline.getBoundingBox()
    });
  }

  // Now use the map as required...
  calculateRouteFromAtoB (platform);

}())