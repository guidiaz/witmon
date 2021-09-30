import axios from 'axios'

export class WittyCreaturesApi {
  constructor () {
    this.baseUrl = 'http://127.0.0.1:3000'
  }

  _handleResponse(response) {
    if (response && response.data) {
      return response.data
    }
  }

  _handleError(error) {
    console.log('[ERROR]', error)
    return { error }
  }

  _get(params) {
    return axios
      .get(baseUrl, params)
      .then(this._handleResponse)
      .catch(this._handleError)
  }

  _post(params) {
    return axios
      .post(`${this.baseUrl}/claim`, params)
      .then(this._handleResponse)
      .catch(this._handleError)
  }

  claim(params) {
    return { token: params }
    // return this._post(params)
  }

  // getEggInfo(params) {
  //   return this._get(params)
  // }
}
