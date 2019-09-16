(function () {
    /**
   * Shows the building layer provided by Platform Data Extension REST API
   * https://developer.here.com/platform-extensions/documentation/platform-data/topics/introduction.html
   *
   * @param  {H.Map} map      A HERE Map instance within the application
   */
  let showBuildings = map => {
    let service = platform.getPlatformDataService()

    style = new H.map.SpatialStyle()
    // create tile provider and layer that displays postcode boundaries
    let buildingsProvider = new H.service.extension.platformData.TileProvider(service,
        {
          layerId: 'BUILDING', 
          level: 13
        }, 
        {
          resultType: H.service.extension.platformData.TileProvider.ResultType.POLYGON,
          styleCallback: data => {return style} 
        })
    
    let buildings = new H.map.layer.TileLayer(buildingsProvider);
    map.addLayer(buildings);

    buildingsProvider.addEventListener('tap', function(ev) {
      let coords = map.screenToGeo(ev.currentPointer.viewportX, ev.currentPointer.viewportY)
      
      let buildingData = ev.target.getData()
      let columns = buildingData.getColumnNames()
      
      let bubble =  new H.ui.InfoBubble(coords, {
        // read custom data
        content: `
          <table>
            <tr>
              <td>BUILDING_ID:</td>
              <td>${buildingData.getCell("BUILDING_ID")}</td>
            </tr>
            <tr>
              <td>HEIGHT:</td>
              <td>${buildingData.getCell("HEIGHT")}</td>
            </tr>
          <table/>`
      })
      
      // show info bubble
      ui.addBubble(bubble)
    });

  }

  /**
   * Boilerplate map initialization code starts below:
   */

  //Step 1: initialize communication with the platform
  // In your own code, replace letiable window.apikey with your own apikey
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
  map.setZoom(16)

  //Step 3: make the map interactive
  // MapEvents enables the event system
  // Behavior implements default interactions for pan/zoom (also on mobile touch environments)
  let behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map))

  // Create the default UI components
  
  let ui = H.ui.UI.createDefault(map, defaultLayers)

  // Now use the map as required...
  showBuildings(map)
}())