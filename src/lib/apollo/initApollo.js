import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloLink } from 'apollo-link'
import { RestLink } from 'apollo-link-rest'
import { setContext } from 'apollo-link-context'
import ApolloClient from 'apollo-client'
import { onError } from 'apollo-link-error'
import fetch from 'node-fetch'

let apolloClient = null

// Polyfill fetch() on the server (used by apollo-client)
if (!process.browser) {
  global.fetch = fetch
  global.Headers = fetch.Headers;
}

function create(initialState, { getToken, fetchOptions }) {
  const errorLink = onError((err) => {
    const { graphQLErrors, networkError, operation } = err
    const { cache } = operation.getContext()
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, path }) =>
        console.log(`[GraphQL error]: Message: ${message}, Path: ${path}`)
      );
    }
  
    if (networkError) {
      console.log(
        `[Network error ${operation.operationName}]: ${networkError.message}`
      );
    }
  })
  const authLink = setContext((_, { headers }) => {
    const token = getToken()
    const basicAuth = Buffer.from(process.env.API_USERNAME + ':' + process.env.API_PASSWORD).toString('base64')
    return {
      headers: {
        ...headers,
        Authorization: token ? `Bearer ${token}` : `Basic ${basicAuth}`
      }
    }
  })
  const restLink = new RestLink({
    uri: process.env.API_URL,
    credentials: 'same-origin',
    customFetch: fetch
  })
  const httpLink = new HttpLink({
    uri: 'http://jobhunt-graphql.herokuapp.com/v1/graphql',
    credentials: 'same-origin',
    fetchOptions
  })
  return new ApolloClient({
    connectToDevTools: process.browser,
    ssrMode: !process.browser,
    cache: new InMemoryCache().restore(initialState || {}),
    link: ApolloLink.from([
      errorLink,
      authLink,
      restLink,
      httpLink
    ])
  })
}

export default function initApollo (initialState, options) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return create(initialState, options)
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState, options)
  }

  return apolloClient
}