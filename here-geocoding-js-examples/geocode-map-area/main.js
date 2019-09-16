(function () {

  /**
   * Boilerplate map initialization code starts below:
   */

  //Step 1: initialize communication with the platform
  // In your own code, replace letiable window.apikey with your own apikey
  let platform = new H.service.Platform({
    apikey: "YOUR_APIKEY"
  })

  var locations, shape
  var coord

  let defaultLayers = platform.createDefaultLayers()

  //Step 2: initialize a map  - not specificing a location will give a whole world view.
  let map = new H.Map(document.getElementById('map'),
    defaultLayers.vector.normal.map, {
      pixelRatio: window.devicePixelRatio || 1
    })
  // add a resize listener to make sure that the map occupies the whole container
  window.addEventListener('resize', () => map.getViewPort().resize())

  map.setCenter({lat:55.75349, lng: 37.61885})
  map.setZoom(6)

  //Step 3: make the map interactive
  // MapEvents enables the event system
  // Behavior implements default interactions for pan/zoom (also on mobile touch environments)
  let behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map))

  // Create the default UI components
  
  let ui = H.ui.UI.createDefault(map, defaultLayers)

  function reverseGeocode(platform) {
    // set up Geocoder API    
    var geocoder = platform.getGeocodingService();  
    var prox = coord.lat + ',' + coord.lng;
    
    var reverseGeocodingParameters = {
        prox: prox,
        mode: 'retrieveAddresses',
        maxresults: '1',            
        additionaldata: 'IncludeShapeLevel,country'      
    };

    geocoder.reverseGeocode(
        reverseGeocodingParameters,
        onSuccess,
        onError
    );
  }

  function onSuccess(result) {
    // parse results from Geocoder API and retrieve shape information
    locations = result.Response.View[0].Result;
    shape = locations[0].Location.Shape.Value;                 
    addCountryOutline(map);
  }

  function onError(error) {
      alert('Ooops!');
  }

  function addCountryOutline(map) {

    // clear map
    markerGroup.removeAll();

    // set up polygon style
    var customStyle = {
        strokeColor: 'black', 
        fillColor: 'rgba(0,175,170,0.5)', 
        lineWidth: 2,            
        lineJoin: 'bevel'
    };
    
    // the shape is returned as WKT and we need to convert it a Geometry
    var geometry = H.util.wkt.toGeometry(shape); 

    // geometry is either a single or multi-polygon     
    if (geometry instanceof H.geo.MultiGeometry) {
        var geometryArray = geometry.getGeometries(); 
        for (var i = 0; i < geometryArray.length; i++) {
            markerGroup.addObject(new H.map.Polygon(geometryArray[i].getExterior(), 
              { style: customStyle }));            
        }
    } else { // instanceof H.geo.Polygon            
        markerGroup.addObject(new H.map.Polygon(geometry.getExterior(), 
          { style: customStyle }));            
    }        
  }


  var markerGroup = new H.map.Group()
  
  map.addObject(markerGroup)
  
  function setUpClickListener(map) {  
      // register a tap listener on the map and start geocoder on click
      map.addEventListener('tap', function (evt) {
          coord = map.screenToGeo(evt.currentPointer.viewportX, evt.currentPointer.viewportY);    
          reverseGeocode(platform, coord);    
      })
  }

  setUpClickListener(map);

}())