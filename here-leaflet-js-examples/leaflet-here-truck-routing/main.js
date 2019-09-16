(function() {
    let M = {
        'AppId': 'YOUR_APP_ID',
        'AppCode': 'YOUR_APP_CODE',
        'Lat' : 55.704443,     
        'Lng' : 52.347373,     
        'Zoom' : 14,
        'TileLayerUrl': {}
    }

    // Base Map
    M.TileLayerUrl = (style) => `https://2.base.maps.api.here.com/maptile/2.1/trucktile/newest/${style}/{z}/{x}/{y}/512/png8?app_id=${M.AppId}&app_code=${M.AppCode}&ppi=320&lg=rus`

    const map = L.map('map').setView([M.Lat, M.Lng], M.Zoom)
    
    L.tileLayer(M.TileLayerUrl('reduced.day')).addTo(map)

    let routingParams = {
        height: 4.5,
        width: 3.5,
        length: 16,
        limitedWeight: 40,
        weightPerAxle: 10,
        coordsStart: [55.80030,49.10828],
        coordsEnd: [55.70457,52.34733],
    }

    let routingGroup = L.layerGroup().addTo(map)

    L.marker(routingParams.coordsStart, {draggable:true}).on('dragend', e => {
        let coords = e.target.getLatLng()
        routingParams.coordsStart = [coords.lat, coords.lng]
        calculateRoute(routingParams)
    }).addTo(map)

    L.marker(routingParams.coordsEnd, {draggable:true}).on('dragend', e => {
        let coords = e.target.getLatLng()
        routingParams.coordsEnd = [coords.lat, coords.lng]
        calculateRoute(routingParams)
    }).addTo(map)
    
    let calculateRoute = routingParams => {
        routingGroup.getLayers().forEach(e => routingGroup.removeLayer(e))

        let routeUrl = `https://route.api.here.com/routing/7.2/calculateroute.json?app_code=BDyd-r-8dYkniAe-fQKrOw&app_id=SRDnjFXg1EUdjJNVu9xN&jsonattributes=41&language=en-us&maneuverattributes=po,ti,pt,ac,di,fj,ix&metricsystem=metric&mode=fastest;truck&height=${routingParams.height}&limitedWeight=${routingParams.limitedWeight}&routeattributes=sh,gr&waypoint0=geo!stopOver!${routingParams.coordsStart[0]},${routingParams.coordsStart[1]}&waypoint1=geo!stopOver!${routingParams.coordsEnd[0]},${routingParams.coordsEnd[1]}`

        fetch(routeUrl).then(res => {
            res.json().then(data => {
                console.log(data)
                let splitArray = (array, part) => {
                    var tmp = []
                    for(var i = 0; i < array.length; i += part) {
                        tmp.push(array.slice(i, i + part));
                    }
                    return tmp;
                }

                L.polyline(splitArray(data.response.route[0].shape, 2)).addTo(routingGroup)
            })
        })
    }

    calculateRoute(routingParams)
}())