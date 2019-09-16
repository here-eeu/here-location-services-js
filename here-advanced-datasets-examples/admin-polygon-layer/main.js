// Initialize the platform object:
var platform = new H.service.Platform({
  'apikey': 'mMAe2WEZear4kBv6DXbM1vHG03tQjKKsGcuS19rdGHQ'
  });

// Obtain the default map types from the platform object
var maptypes = platform.createDefaultLayers();

// Instantiate (and display) a map object:
var map = new H.Map(
  document.getElementById('mapContainer'),
  maptypes.vector.normal.map,
  {
    zoom: 11.5,
    center: { lng: 37.0958, lat: 55.8646 }
  });

// Make the map interactive  
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Create the default UI:
var ui = H.ui.UI.createDefault(map, maptypes);