import { useState } from 'react'
import { useApolloClient } from 'react-apollo-hooks'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo-hooks'
import { setData } from './mutation'
import initialState from './initialState'

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
  const client = useApolloClient()
  return [{ ...notification, ...auth, ...dialog}, setAppData]
  function setAppData(key, val) {
    setData(key, val)(client)
  }
}

export function useManualQuery(query, options = {}, initialData = {}) {
  const client = useApolloClient()
  const [data, setData] = useState(initialData)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  async function onQuery() {
    setIsLoading(true)
    await client.query({
      query,
      ...options
    }).then(response => {
        setData(response.data)
      })
      .catch(err => {
        setError(err)
      })
    setIsLoading(false)
  }
  return [{ data, isLoading, error }, { onQuery }]
}