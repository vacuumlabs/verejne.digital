import React from 'react'
import { lifecycle } from 'recompose'

const Marker = ({ numPoints }) => (
  <div className="GoogleMap__Marker">
    <span className="GoogleMap__Marker__Text">{numPoints}</span>
  </div>
)

export default lifecycle({
  shouldComponentUpdate: () => false,
})(Marker)
