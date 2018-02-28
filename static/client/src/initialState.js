import { setInitialState as googleMapInitialState } from './GoogleMap/state.js'
import { compose } from './utils/helpers'

const state = {}

export default () => compose(
  googleMapInitialState,
)(state)
