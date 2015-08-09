// Server interaction logic
class WebAgent {
  // GET a resource represented by url
  //
  // @param {string} url resource url
  //
  // @return {Promise} promise with resulting xhr
  get(url) {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest()
      xhr.withCredentials = true
      xhr.open('GET', url, true)
      xhr.onload = (event) => {
        if ((event.target.status >= 200 && event.target.status < 300) || event.target.status == 304) {
          resolve(event.target)
        }
        else {
          reject(new Error(event.target.status))
        }
      }
      xhr.onerror = (error) => {
        reject(error)
      }
      xhr.send()
    })
  }


  // PUT a resource represented by url
  //
  // @param {string} url resource url
  // @param {Object} headers headers hash
  // @param {string} body replacement object
  //
  // @return {Promise} promise with resulting xhr
  put(url, headers, body) {
    return new Promise((resolve, reject) => {
      // TODO: implement
      let xhr = new XMLHttpRequest()
      xhr.withCredentials = true
      xhr.open('PUT', url, true)
      for (var headerKey in headers) {
        let headerValue = headers[headerKey]
        xhr.setRequestHeader(headerKey, headerValue)
      }
      xhr.onload = (event) => {
        if ((event.target.status >= 200 && event.target.status < 300) || event.target.status == 304) {
          resolve(event.target)
        }
        else {
          reject(new Error(event.target.status))
        }
      }
      xhr.onerror = (error) => {
        reject(error)
      }

      xhr.send(body)
    })
  }


  // OPTIONS request (used for identifying WebID session)
  //
  // @param {string} url resource url
  //
  // @return {Promise} promise with resulting xhr
  options(url) {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest()
      xhr.withCredentials = true
      xhr.open('OPTIONS', url, true)
      xhr.onload = (event) => {
        if ((event.target.status >= 200 && event.target.status < 300) || event.target.status == 304) {
          resolve(event.target)
        }
        else {
          reject(new Error(event.target.status))
        }
      }
      xhr.onerror = (error) => {
        reject(error)
      }
      xhr.send()
    })
  }

}

export default WebAgent
