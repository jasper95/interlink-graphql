import gql from 'graphql-tag'
import bluebird from 'bluebird'
import QUERY from './query'

export const generateMutation = ({ keys = ['id'], method = 'POST', url }) => {
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

export const applyUpdates = (...fns) => 
  (cache, result) => bluebird.mapSeries(fns, fn => fn(cache, result))

export const setNotification = (message, type = 'success') => {
  return (cache) => {
    return setData('notification', {
      notification: message ? {
        message,
        type,
      } : null
    })(cache)
  }
}

export const setData = (key, value) => {
  return (cache) => {
    return cache.writeQuery({
      data: {
        [key]: value
      },
      query: QUERY[`GET_${key.toUpperCase()}`]
    })
  }
}