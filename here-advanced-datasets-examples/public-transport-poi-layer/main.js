(function () {
    /**
   * Shows the building layer provided by Platform Data Extension REST API
   * https://developer.here.com/platform-extensions/documentation/platform-data/topics/introduction.html
   *
   * @param  {H.Map} map      A HERE Map instance within the application
   */
  let showPublicTransport = map => {
    let service = platform.getPlatformDataService()

    let transportProvider = new H.service.extension.platformData.TileProvider(service,
    {
      layerId: 'PUBLIC_TRANSPORT_POI', level: 13
    }, {
        resultType: H.service.extension.platformData.TileProvider.ResultType.MARKER,
    })
    let public_tr = new H.map.layer.MarkerTileLayer(transportProvider)
    map.addLayer(public_tr)
  }

  /**
   * Boilerplate map initialization code starts below:
   */

  //Step 1: initialize communication with the platform
  // In your own code, replace variable window.apikey with your own apikey
  let platform = new H.service.Platform({
    apikey: "YOUR_APIKEY"
  })

  let defaultLayers = platform.createDefaultLayers()

  //Step 2: initialize a map  - not specificing a location will give a whole world view.
  let map = new H.Map(document.getElementById('map'),
    defaultLayers.raster.normal.map, {
      pixelRatio: window.devicePixelRatio || 1
    })
  // add a resize listener to make sure that the map occupies the whole container
  window.addEventListener('resize', () => map.getViewPort().resize())

  map.setCenter({lat:55.75349, lng: 37.61885})
  map.setZoom(13)

  //Step 3: make the map interactive
  // MapEvents enables the event system
  // Behavior implements default interactions for pan/zoom (also on mobile touch environments)
  let behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map))

  // Create the default UI components
  
  let ui = H.ui.UI.createDefault(map, defaultLayers)

  // Now use the map as required...
  showPublicTransport(map)

}())