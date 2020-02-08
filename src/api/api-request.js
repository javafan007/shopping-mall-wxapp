let Fly = require('flyio/dist/npm/wx')
let fly = new Fly()

class Response {
  constructor (res) {
    this.rawData = res
    this.code = res.code
    this.messages = res.messages
    this.data = res.data
    this.wwRequestEntity = res.wwRequestEntity
  }

  resolve () {
    if (this.isSuccess()) {
      return Promise.resolve(this.rawData)
    }
    if (this.isError()) {
      this.message = '错误'
    }
    return Promise.reject(this.messages)
  }

  isSuccess () {
    return this.code === 0
  }

  isError () {
    return this.code !== 0
  }
}

class ApiManager {
  constructor (apiPrefix) {
    fly.config.baseURL = apiPrefix // || Config.apiPrefix
    fly.config.timeout = 10 * 1000
    fly.interceptors.request.use(request => {
      const token = mpvue.getStorageSync('token')
      if (token) {
        request.headers.Authorization = `Bearer ${token}`
      }
      return request
    })

    fly.interceptors.response.use(res => {
      if (res.status >= 200 && res.status < 300) {
        let response = new Response(res.data)
        return response.resolve()
      }
      return Promise.reject(res)
    }, error => {
      const { response } = error
      if (!response) return Promise.reject(error)
      if (response.status === 401) {
        return Promise.reject(error)
      }
      return Promise.reject(error)
    })
  }
  post (uri, data, config) {
    return fly.post(uri, data, config)
  }

  get (uri, data) {
    return fly.get(uri, data)
  }

  put (uri, data) {
    return fly.put(uri, data)
  }

  delete (uri, data) {
    return fly.delete(uri, data)
  }
}

export function httpManager (baseURL) {
  return new ApiManager(baseURL)
}

const apiManager = httpManager('http://freshcity.top')

export default apiManager
