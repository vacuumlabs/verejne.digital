import React, { PropTypes, Component } from 'react'
import GoogleMap from 'google-map-react'
import { map } from 'lodash'
import Marker from './Marker'
import supercluster from 'points-cluster'

function Entity(eid, lat, lng, title, size, ds, level) {
  this.eid = eid
  this.lng = lng
  this.lat = lat
  this.selected = false
  this.title = title
  this.size = size
  this.level = level
  this.visible = false
  this.ds = ds
}

const serverURL = 'https://verejne.digital/api/v/'

function createMapOptions(maps) {
  // next props are exposed at maps
  // "Animation", "ControlPosition", "MapTypeControlStyle", "MapTypeId",
  // "NavigationControlStyle", "ScaleControlStyle", "StrokePosition", "SymbolPath", "ZoomControlStyle",
  // "DirectionsStatus", "DirectionsTravelMode", "DirectionsUnitSystem", "DistanceMatrixStatus",
  // "DistanceMatrixElementStatus", "ElevationStatus", "GeocoderLocationType", "GeocoderStatus", "KmlLayerStatus",
  // "MaxZoomStatus", "StreetViewStatus", "TransitMode", "TransitRoutePreference", "TravelMode", "UnitSystem"
  return {
    zoomControlOptions: {
      position: maps.ControlPosition.RIGHT_CENTER,
      style: maps.ZoomControlStyle.SMALL,
    },
    mapTypeControlOptions: {
      position: maps.ControlPosition.TOP_RIGHT,
    },
    mapTypeControl: true,
    styles: [
      { elementType: 'geometry.fill', stylers: [{ color: '#f1f4f5' }] },
      { elementType: 'geometry.stroke', stylers: [{ color: '#cddae3' }] },
      { elementType: 'labels.text.fill', stylers: [{ color: '#666666' }] },
      { elementType: 'labels.text.stroke', stylers: [{ color: '#ffffff' }] },
      {
        featureType: 'administrative',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#333333' }],
      },
      {
        featureType: 'landscape',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#859fb4' }],
      },
      {
        featureType: 'landscape.natural',
        elementType: 'geometry',
        stylers: [{ color: '#f1f4f5' }],
      },
      {
        featureType: 'landscape.man_made',
        elementType: 'geometry.fill',
        stylers: [{ color: '#dae3ea' }],
      },
      {
        featureType: 'road',
        elementType: 'geometry.fill',
        stylers: [{ color: '#ffffff' }],
      },
      {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#a5baca' }],
      },
      {
        featureType: 'road.local',
        elementType: 'geometry.fill',
        stylers: [{ color: '#ffffff' }],
      },
      {
        featureType: 'transit.line',
        elementType: 'geometry',
        stylers: [{ color: '#c5d1da' }],
      },
      {
        featureType: 'transit.station',
        elementType: 'geometry',
        stylers: [{ color: '#e6ecf1' }],
      },
      {
        featureType: 'water',
        elementType: 'geometry.fill',
        stylers: [{ color: '#ebf8ff' }],
      },
      {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#859fb4' }],
      },
      {
        featureType: 'landscape.natural',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }],
      },
      {
        featureType: 'road.highway',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }],
      },
      {
        featureType: 'road.arterial',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }],
      },
    ],
  }
}

export default class CustomGoogleMap extends Component {
  static propTypes = {
    center: PropTypes.array,
    zoom: PropTypes.number,
  };

  static defaultProps = {
    center: [48.600, 19.500],
    zoom: 8,
  };

  constructor(props) {
    super(props)
    this.state = {
      entities: [],
    }
  }

  static mapReference
  static lastGetEntitiesRequest

  getEntities() {
    if (!this.mapReference) return
    // Determine request url
    let req = serverURL + 'getEntities'
    let bounds = this.mapReference.getBounds()
    let lat1 = '47.26036122625137'
    let lng1 = '16.53369140625'
    let lat2 = '49.90503005077024'
    let lng2 = '22.46630859375'
    console.log('Zoom level:' + this.mapReference.getZoom())
    let restrictToSlovakia = true
    if (bounds != null && bounds !== undefined) {
      lat1 = bounds.getSouthWest().lat()
      lng1 = bounds.getSouthWest().lng()
      lat2 = bounds.getNorthEast().lat()
      lng2 = bounds.getNorthEast().lng()
      restrictToSlovakia = false
    }
    let level = this.getLevel()
    req += '?level=' + level + '&lat1=' + lat1 + '&lng1=' + lng1 + '&lat2=' + lat2 + '&lng2=' + lng2 + (
      restrictToSlovakia ? '&restrictToSlovakia=true' : '')

    let xmlhttp = new XMLHttpRequest()

    const self = this
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
        if (req !== self.lastGetEntitiesRequest) {
          //console.log('Ignoring request ' + req + ' because new request was sent in the meantime.')
          return
        }
        let myArr = JSON.parse(xmlhttp.responseText)
        self.freshListOfEntities(myArr)
      }
    }
    xmlhttp.open('GET', req, true)
    xmlhttp.send()
    this.lastGetEntitiesRequest = req
    console.log('getEntities request: ' + req)
  }

  getLevel() {
    let level = 3
    let kZoomForEntity = 16
    let kZoomForSubCity = 13
    let kZoomForCity = 10
    if (this.mapReference.getZoom() == null || this.mapReference.getZoom() === undefined) return level
    if (this.mapReference.getZoom() >= kZoomForEntity) {
      level = 0
    } else if (this.mapReference.getZoom() >= kZoomForSubCity) {
      level = 1
    } else if (this.mapReference.getZoom() >= kZoomForCity) {
      level = 2
    }
    return level
  }

  freshListOfEntities = (arr) => {
    console.log('Received ' + arr.length + ' entities')
    let usedLevel = this.getLevel()
    const entities = arr.map((e) => new Entity(e.eid, e.lat, e.lng, e.name, e.size, e.ds, usedLevel))
    // TODO: this is bit hacky, you might wanna fix this. ;)
    /*if ('lat1' in arr[i]) {
      entity.lat1 = arr[i].lat1
      entity.lat2 = arr[i].lat2
      entity.lng1 = arr[i].lng1
      entity.lng2 = arr[i].lng2
    }*/
    this.generateMarkers(entities)
  }

  generateMarkers(entities) {
    this.createClusters(entities)
  }

  handleMapChange = ({ center, zoom, bounds }) => {
    this.setState(
      {
        mapOptions: {
          center,
          zoom,
          bounds,
        },
      },
    )
    this.getEntities()
  }

  getClusters = entities => {
    const clusters = supercluster(entities, {
      minZoom: 0,
      maxZoom: 16,
      radius: 60,
    })

    return clusters(this.state.mapOptions)
  };

  createClusters = entities => {
    console.log('xxx', entities.length, this.getClusters(entities).reduce((a, e) => a + e.numPoints, 0))
    this.setState({
      entities: this.state.mapOptions.bounds
        ? this.getClusters(entities).map(({ wx, wy, numPoints, points }, i) => {
          return {
            lat: wy,
            lng: wx,
            numPoints: numPoints,
            id: `${i}`,
            points,
          }
        })
        : [],
    })
  };


  render() {
    return (
      <div id="map">
        <GoogleMap
          // apiKey={YOUR_GOOGLE_MAP_API_KEY} // set if you need stats etc ...
          center={this.props.center}
          zoom={this.props.zoom}
          options={createMapOptions}
          onGoogleApiLoaded={({ map, maps }) => {this.mapReference = map}}
          onChange={this.handleMapChange}
          yesIWantToUseGoogleMapApiInternals
        >
          {map(this.state.entities, (e, i) => {
            return (
              <Marker key={i} lat={e.lat} lng={e.lng} numPoints={e.numPoints} />
            )
          })}
        </GoogleMap>
      </div >
    )
  }
}
