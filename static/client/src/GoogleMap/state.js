import { setIn, getIn } from '../utils/helpers'

export const PATH_MAP = ['map']
export const PATH_MAP_OPTIONS = [...PATH_MAP, 'mapOptions']

export const setInitialState = (state) =>
  setIn(state, PATH_MAP, {
    mapOptions: {
      center: [48.600, 19.500], // Slovakia :)
      zoom: 8,
      bounds: undefined,
    },
    mapReference: undefined,
    entities: [],
  }, true)

export const mapOptionsSelector = (state) => getIn(state, PATH_MAP_OPTIONS)
export const centerSelector = (state) => getIn(state, [...PATH_MAP_OPTIONS, 'center'])
export const zoomSelector = (state) => getIn(state, [...PATH_MAP_OPTIONS, 'zoom'])
export const mapReferenceSelector = (state) => getIn(state, [...PATH_MAP, 'mapReference'])
export const entitiesSelector = (state) => getIn(state, [...PATH_MAP, 'entities'])
