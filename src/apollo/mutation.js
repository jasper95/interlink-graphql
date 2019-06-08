import gql from 'graphql-tag'
import bluebird from 'bluebird'
import useMutation from 'lib/hooks/useMutation'
import { useAppData } from 'apollo/query'
import capitalize from 'lodash/capitalize'
import QUERY from './query'

export function useCreateNode(metadata = {}, options) {
  const {
    node,
    message = `${capitalize(node)} successfully created`,
  } = metadata
  return useNodeMutation({
    ...metadata,
    message,
    method: 'POST',
  }, options)
}

export function useUpdateNode(metadata = {}, options) {
  const {
    node,
    message = `${capitalize(node)} successfully updated`,
  } = metadata
  return useNodeMutation({
    ...metadata,
    message,
    method: 'PUT'
  }, options)
}

export function useDeleteNode(metadata = {}, options) {
  const {
    node,
    message = `${capitalize(node)} successfully deleted`,
  } = metadata
  return useNodeMutation({
    ...metadata,
    message,
    method: 'DELETE'
  }, options)
}

export function useNodeMutation(metadata = {}, options) {
  const {
    node,
    message,
    callback = () => {},
    method
  } = metadata
  const query = generateMutation({ url: `/${node}`, method })
  const [, setAppData] = useAppData()
  const defaultOptions = {
    update: (cache) => {
      setData('dialog', null)(cache)
      setToast(message)(cache)
      setData('dialogProcessing', false)(cache)
      callback()
    }
  }
  const [mutation, state] = useMutation(query, { ...defaultOptions, ...options })
  return [onMutate, state]
  function onMutate(params) {
    setAppData('dialogProcessing', true)
    return mutation(params)
  }
}


export function generateMutation({ keys = ['NoResponse'], method = 'POST', url }) {
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