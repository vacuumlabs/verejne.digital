import React from 'react'
import GMap from 'google-map-react'
import { map } from 'lodash'
import Marker from './Marker'
import supercluster from 'points-cluster'
import classnames from 'classnames'
import { createMapOptions, clusterOptions } from './options'
import { connect } from 'react-redux'
import { mapOptionsSelector, mapReferenceSelector, entitiesSelector } from './state'
import { initializeGoogleMap, fetchEntities, updateMapOptions } from './actions'


class GoogleMap extends React.Component {
  getClusters = entities => {
    const clusters = supercluster(entities, clusterOptions)
    return clusters(this.props.mapOptions)
  }

  createClusters = () => {
    return this.props.mapOptions.bounds ?
      this.getClusters(this.props.entities).map(({ wx, wy, numPoints, points }, i) => {
        return {
          lat: wy,
          lng: wx,
          numPoints: numPoints,
          id: `${i}`,
          points,
        }
      }) : []
  }


  render() {
    return (
      <div className="GoogleMapWrapper">
        <GMap
          // apiKey={YOUR_GOOGLE_MAP_API_KEY} // set if you need stats etc ...
          className={classnames('GoogleMap', this.props.className)}
          center={this.props.mapOptions.center}
          zoom={this.props.mapOptions.zoom}
          options={createMapOptions}
          onGoogleApiLoaded={({ map, maps }) => this.props.initializeGoogleMap(map)}
          onChange={this.props.updateMapOptions}
          yesIWantToUseGoogleMapApiInternals
        >
          {map(this.createClusters(), (e, i) => {
            return (
              <Marker key={i} lat={e.lat} lng={e.lng} numPoints={e.numPoints} />
            )
          })}
        </GMap>
      </div >
    )
  }
}

export default connect(
  (state) => ({
    mapOptions: mapOptionsSelector(state),
    mapReference: mapReferenceSelector(state),
    entities: entitiesSelector(state),
  }),
  {
    initializeGoogleMap,
    fetchEntities,
    updateMapOptions,
  },
)(GoogleMap)
