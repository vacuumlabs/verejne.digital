import { set } from 'object-path-immutable'
import { get } from 'lodash'

export const PATH_APP = ['app']
export const PATH_BUTTON_TEXT = [...PATH_APP, 'buttonText']

export const setInitialState = (state) =>
  set(state, PATH_APP, {
    buttonText: 'Hello',
  })

export const buttonTextSelector = (state) => get(state, PATH_BUTTON_TEXT)
