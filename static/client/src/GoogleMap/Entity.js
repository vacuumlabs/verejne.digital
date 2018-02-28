class Entity {
  constructor({ eid, lat, lng, title, size, ds, level }) {
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
}

export default Entity
