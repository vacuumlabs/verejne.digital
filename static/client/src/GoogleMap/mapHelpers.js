const ENTITY_ZOOM = 16
const SUB_CITY_ZOOM = 13
const CITY_ZOOM = 10

export const getZoomLevel = (mapReference) => {
  if (!mapReference) return []
  const zoom = mapReference.getZoom() || 0
  return [ENTITY_ZOOM, SUB_CITY_ZOOM, CITY_ZOOM].reduce((acc, val) => acc + (val >= zoom ? 1 : 0), 0)
}
