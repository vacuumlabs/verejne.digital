import React, { PropTypes, Component } from 'react'

const K_WIDTH = 40
const K_HEIGHT = 40

const greatPlaceStyle = {
  // initially any map object has left top corner at lat lng coordinates
  // it's on you to set object origin to 0,0 coordinates
  position: 'absolute',
  width: K_WIDTH,
  height: K_HEIGHT,
  left: -K_WIDTH / 2,
  top: -K_HEIGHT / 2,

  borderRadius: K_HEIGHT,
  backgroundColor: 'rgb(66, 134, 244, 0.9)',
  textAlign: 'center',
  color: 'rgb(66, 134, 244, 0.9)',
  fontSize: 16,
  fontWeight: 'bold',
  padding: 4,
}

export default class MyGreatPlace extends Component {
  static propTypes = {
    text: PropTypes.string,
  };

  static defaultProps = {};

  shouldComponentUpdate() {
    return false
  }

  render() {
    return (
      <div style={greatPlaceStyle}>
        <span className="markerText">{this.props.numPoints}</span>
      </div>
    )
  }
}
