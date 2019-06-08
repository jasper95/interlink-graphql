import { useState } from 'react'
import { useApolloClient } from 'react-apollo-hooks'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo-hooks'
import { setData } from './mutation'
import initialState from './initialState'


function generateQueryByFilter({ node, keys, variables, filters }) {
  return gql`
    query getNodeByFilter(${variables}){
      ${node}(${filters}) {
        ${keys.join(', ')}
      }
    }
  `
}

export function generateQueryById({ node, keys = ['id', 'name'] }) {
  const filters = 'where: {id: {_eq: $id }}'
  const variables = '$id: uuid'
  return generateQueryByFilter({ node, variables, filters, keys })
}

const QUERY = Object.keys(initialState)
  .reduce((acc, el) => {
    acc[`GET_${el.toUpperCase()}`] = gql`
      query {
        ${el} @client
      }
    `
    return acc
  }, {})

export default QUERY

export function useAppData() {
  const { data: notification } = useQuery(QUERY.GET_TOAST, { ssr: false })
  const { data: auth} = useQuery(QUERY.GET_AUTH)
  const { data: dialog} = useQuery(QUERY.GET_DIALOG, { ssr: false })
  const { data: dialogProcessing } = useQuery(QUERY.GET_DIALOGPROCESSING, { ssr: false })
  const client = useApolloClient()
  return [{ ...notification, ...auth, ...dialog, ...dialogProcessing }, setAppData]
  function setAppData(key, val) {
    setData(key, val)(client)
  }
}

export function useManualQuery(query, options = {}, initialData = {}) {
  const client = useApolloClient()
  const [data, setData] = useState(initialData)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  async function onQuery(queryOptions = {}) {
    setIsLoading(true)
    const result = await client
      .query({
        query,
        ...options,
        ...queryOptions
      })
      .then(response => {
        setData(response.data)
        return response.data
      })
      .catch(err => {
        setError(err)
        return { error: err }
      })
    setIsLoading(false)
    return result
  }
  return [{ data, isLoading, error }, { onQuery }]
}