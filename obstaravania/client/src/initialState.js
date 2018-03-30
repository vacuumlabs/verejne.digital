import { compose } from './utils'
import { setInitialState as appInitialState } from './App/state.js'

const getInitialState = () => compose(
  appInitialState
)({})

export default getInitialState
