import gql from 'graphql-tag'
import bluebird from 'bluebird'
import QUERY from './query'

export function generateMutation({ keys = ['id'], method = 'POST', url }) {
  return gql`
    mutation NodeMutation(
      $input: any!,
    ) {
      nodeMutation(url: $url, method: $method, input: $input)
        @rest(type: "any", path: "${url}", method: "${method}") {
          ${keys.join(', ')}
        }
    }
  `
}

export function applyUpdates (...fns) {
  return (cache, result) => bluebird.mapSeries(fns, fn => fn(cache, result))
}

export function setData(key, value) {
  return (cache) => {
    return cache.writeQuery({
      data: {
        [key]: value
      },
      query: QUERY[`GET_${key.toUpperCase()}`]
    })
  }
}

export function setToast(message, type = 'success') {
  return (cache) => {
    return setData('toast', message ? {
      message,
      type,
    } : null)(cache)
  }
}