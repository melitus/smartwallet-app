import * as _ from 'lodash'
import WalletCrypto from 'smartwallet-contracts/lib/wallet-crypto'
import HTTPAgent from 'lib/agents/http'
import * as settings from 'settings'

export default class GatewayAgent {
  constructor() {
    this._httpAgent = new HTTPAgent({proxy: false})
    this._gatewayUrl = settings.gateway
  }

  // getApiVersion() {
  //   return this._httpAgent.get(`${this._gatewayUrl}/system/info`)
  // }

  // createEthereumIdentity({userName, seedPhrase}) {
  //   return this._httpAgent.post(
  //     `${this._gatewayUrl}/${userName}/ethereum/create-identity`,
  //     JSON.stringify({seedPhrase: seedPhrase}),
  //     {'Content-type': 'application/json'}
  //   )
  // }

  checkUserDoesNotExist({userName}) {
    return new Promise((resolve, reject) => {
      this.getUserInformation({userName})
      .then((response) => {
        reject(new Error('This username already exists!'))
      })
      .catch((e) => {
        // console.log(e.typeError)
        if (!!e.response && e.response.status === 404) {
          resolve()
        } else {
          // eslint-disable-next-line max-len
          reject(new Error('network error, please make sure you have an internet connection'))
        }
      })
    })
  }

  getUserInformation({userName}) {
    return this._httpAgent.get(
      `${this._gatewayUrl}/${userName}`
    )
  }

  register({userName, seedPhrase, email, password}) {
    return this._httpAgent.put(
      `${this._gatewayUrl}/${userName}`,
      JSON.stringify({seedPhrase, email, password}),
      {'Content-type': 'application/json'},
      // {credentials: 'omit'}
    )
  }

  login({seedPhrase}) {
    return this._httpAgent.post(
      `${this._gatewayUrl}/login`,
      JSON.stringify({seedPhrase}),
      {
        'Content-type': 'application/json'
      }
    )
  }

  // createSolidIdentity({userName, seedPhrase}) {
  //   return this._httpAgent.post(
  //     `${this._gatewayUrl}/${userName}/solid/create-identity`,
  //     JSON.stringify({seedPhrase: seedPhrase}),
  //     {'Content-type': 'application/json'}
  //   )
  // }

  getRequesterIdentity(identity) {
    // console.log('getRequesterIdentity: ', identity)
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(identity), 2000)
    })
    // return this._httpAgent.get(
    //   identity + '/identity/name/display'
    // )
  }

  grantAccessToRequester(user, body) {
    return this._httpAgent.post(
      user + '/access/grant',
      JSON.stringify(body),
      {
        'Content-type': 'application/json'
      }
    )
  }

  verify({userName, seedPhrase, identity, attributeType,
     attributeId, attributeValue}) {
    let url = `${this._gatewayUrl}/${userName}/verify`
    let body = {
      seedPhrase,
      identity,
      attributeType,
      attributeId,
      attributeValue
    }
    return this._httpAgent.post(
      url, JSON.stringify(body),
      {'Content-type': 'application/json'}
    )
  }

  proxyGet(requestUrl) {
    // TODO put correct url
    return this._httpAgent.get(
      requestUrl
    )
  }

  storeAttribute({userName, attributeType, attributeId, attributeData}) {
    let url = `${this._gatewayUrl}/${userName}/identity/${attributeType}`
    if (attributeId) {
      url += `/${attributeId}`
    }

    let serialized
    if (_.isPlainObject(attributeData)) {
      serialized = new WalletCrypto().serializeData(attributeData)
    } else {
      serialized = JSON.stringify(attributeData)
    }

    return this._httpAgent.put(
      url,
      serialized,
      {'Content-type': 'application/json'}
    )
  }

  deleteAttribute({userName, attributeType, attributeId}) {
    let url = `${this._gatewayUrl}/${userName}/identity/${attributeType}`
    if (attributeId) {
      url += `/${attributeId}`
    }

    return this._httpAgent.delete(url)
  }

  async getOwnAttributes({userName, type, checkVerified}) {
    const multiple = typeof type !== 'string'
    const types = multiple ? type : [type]

    const allAttributes = await Promise.all(types.map(async type => {
      const typeAttributesIds = await this._httpAgent.get(
        `${this._gatewayUrl}/${userName}/identity/${type}`
      )
      const [typeAttributes, typeVerifications] = await Promise.all([
        Promise.all(typeAttributesIds.map(
          async id => {
            let attrValue = await this._httpAgent.get(
              `${this._gatewayUrl}/${userName}/identity/${type}/${id}`
            )
            if (_.isArray(attrValue)) {
              attrValue = _.fromPairs(attrValue)
            }
            return attrValue
          }
        )),
        Promise.all(typeAttributesIds.map(
          async id => {
            return await this._httpAgent.get(
              `${this._gatewayUrl}/${userName}` +
              `/identity/${type}/${id}/verifications`
            )
          }
        ))
      ])

      return typeAttributesIds.map((id, idx) => {
        return {
          id,
          contents: typeAttributes[idx],
          verified: Object.keys(typeVerifications[idx]).length > 0
        }
      })
    }))

    return allAttributes
  }
}