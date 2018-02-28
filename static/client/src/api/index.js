class Api {
  // TOOD: fetch doesn't work on IE11, need to include polyfills
  fetch(url, options) {
    return fetch(url, options).then((response) => response.json())
  }
}

export default Api
