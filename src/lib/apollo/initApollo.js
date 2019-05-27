import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloLink } from 'apollo-link'
// import { RestLink } from 'apollo-link-rest'
import { setContext } from 'apollo-link-context'
import ApolloClient from 'apollo-client'
import withApollo from 'next-with-apollo'
import { onError } from 'apollo-link-error'
import fetch from 'node-fetch'

let apolloClient = null

// Polyfill fetch() on the server (used by apollo-client)
if (!process.browser) {
  global.fetch = fetch
}

function create({ headers, initialState }) {
  const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
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
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : ''
      }
    }
  })
  // const restLink = new RestLink({
  //   uri: process.env.REST_URI,
  //   credentials: 'same-origin',
  //   customFetch: fetch
  // })
  const httpLink = new HttpLink({
    uri: 'http://jobhunt-graphql.herokuapp.com/v1/graphql',
    credentials: 'same-origin'
  })
  return new ApolloClient({
    connectToDevTools: process.browser,
    ssrMode: !process.browser,
    cache: new InMemoryCache().restore(initialState || {}),
    link: ApolloLink.from([
      errorLink,
      // authLink,
      // restLink,
      httpLink
    ])
  })
}

export default function initApollo (initialState, options) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    let fetchOptions = {}
    // If you are using a https_proxy, add fetchOptions with 'https-proxy-agent' agent instance
    // 'https-proxy-agent' is required here because it's a sever-side only module
    if (process.env.https_proxy) {
      fetchOptions = {
        agent: new (require('https-proxy-agent'))(process.env.https_proxy)
      }
    }
    return create(initialState,
      {
        ...options,
        fetchOptions
      })
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState, options)
  }

  return apolloClient
}