(function () {

  // Initialize the platform object:
  let platform = new H.service.Platform({
    'apikey': window.app_id
    });

  // Obtain the default map types from the platform object
  let maptypes = platform.createDefaultLayers();

  // Instantiate (and display) a map object:
  let map = new H.Map(
    document.getElementById('mapContainer'),
    maptypes.vector.normal.map,
    {
      zoom: 12,
      center: { lng: 37.0958, lat: 55.8646 }
    });

  // Add a resize listener to make sure that the map occupies the whole container
  window.addEventListener('resize', () => map.getViewPort().resize())

  // Make the map interactive  
  let behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

  // Create the default UI:
  let ui = H.ui.UI.createDefault(map, maptypes)

  // create tile provider and layer that displays postcode boundaries  
  let service = platform.getPlatformDataService()

  style = new H.map.SpatialStyle()
  
  let adminsProvider = new H.service.extension.platformData.TileProvider(service,
      {
        layerId: 'ADMIN_POLY_9', 
        level: 11
      }, 
      {
        resultType: H.service.extension.platformData.TileProvider.ResultType.POLYGON,
        styleCallback: data => {return style} 
      })

  let admins = new H.map.layer.TileLayer(adminsProvider);
  map.addLayer(admins);
}())