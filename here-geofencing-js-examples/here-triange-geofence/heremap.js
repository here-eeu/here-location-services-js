class HereMap {
  
  constructor(apikey, appId, appCode, mapElement) {

    this.apikey = apikey
    this.appId = appId
    this.appCode = appCode
    
    this.platform = new H.service.Platform({
        apikey: this.apikey
    })
    
    this.map = new H.Map(
        mapElement,
        this.platform.createDefaultLayers().vector.normal.map,
        {
            zoom: 10,
            center: { lat: 37, lng: -121 }
        }
    );

    window.addEventListener('resize', () => this.map.getViewPort().resize())

    const mapEvent = new H.mapevents.MapEvents(this.map);
    const behavior = new H.mapevents.Behavior(mapEvent);
    
    this.geofencing = this.platform.getGeofencingService();
    this.currentPosition = new H.map.Marker({ lat: 37.21, lng: -121.21 })

    this.map.addEventListener("tap", (ev) => {
        var target = ev.target

        this.map.removeObject(this.currentPosition)
        
        this.currentPosition = new H.map.Marker(this.map.screenToGeo(ev.currentPointer.viewportX, ev.currentPointer.viewportY))
        // debugger
        this.fenceRequest(["1234"], this.currentPosition.getGeometry()).then(result => {
            if(result.geometries.length > 0) {
                alert("You are within a geofence!")
            } else {
                console.log("Not within a geofence!");
            }
        })

        this.map.addObject(this.currentPosition)
        

    }, false)

    this.map.addObject(this.currentPosition);
  }

  draw(mapObject) {
    this.map.addObject(mapObject)
  }

  polygonToWKT(polygon) { 
    const geometry = polygon.getGeometry()
    return geometry.toString()
  }
  uploadGeofence(layerId, name, geometry) {
    
    const zip = new JSZip()
    
    zip.file("data.wkt", "NAME\tWKT\n" + name + "\t" + geometry)
    
    return zip.generateAsync({ type:"blob" }).then(content => {
        
        let formData = new FormData()
        
        formData.append("zipfile", content)
       
        return axios.post("https://gfe.api.here.com/2/layers/upload.json", formData, {
            headers: {
                "content-type": "multipart/form-data"
            },
            params: {
                "app_id": this.appId,
                "app_code": this.appCode,
                "layer_id": layerId
            }
        })
    })
  }
  fenceRequest(layerIds, position) {
    return new Promise((resolve, reject) => {
        this.geofencing.request(
            H.service.extension.geofencing.Service.EntryPoint.SEARCH_PROXIMITY,
            {
                'layer_ids': layerIds,
                'proximity': position.lat + "," + position.lng,
                'key_attributes': ['NAME']
            },
            result => {
                resolve(result);
            }, error => {
                reject(error)
            }
        )
    })
  }
}