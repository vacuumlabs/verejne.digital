import thunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import { createLogger } from 'redux-logger'
import rootReducer from './rootReducer'
import getInitialState from './initialState'
import Api from './api'

export default () => {
  const api = new Api()
  const logger = {
    log: () => null,
  }
  const loggerMiddleware = createLogger({
    collapsed: true,
  })

  const middlewares = [
    thunk.withExtraArgument({ api, logger }),
  ]
  if (process.env.NODE_ENV === 'development') {
    middlewares.push(
      loggerMiddleware,
    )
  }

  const store = createStore(
    rootReducer,
    getInitialState(),
    applyMiddleware(...middlewares)
  )

  if (process.env.NODE_ENV === 'development') {
    logger.log = (message, payload) => store.dispatch({
      type: message,
      payload,
    })
  }

  return store
}
