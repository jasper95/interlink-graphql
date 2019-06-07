import React from 'react'
import gql from 'graphql-tag'
import { setData } from 'apollo/mutation'

const getSession = apolloClient =>
  apolloClient
    .query({
      query: gql`
        query {
          session @rest(type: "Auth", path: "/session") {
            id,
            last_name,
            first_name,
            avatar,
            role,
            company {
              id,
              name
            }
          }
        }
      `
    })
    .then(({ data }) => ({ data }))
    .catch(() => null)


export default (requireAuth = true) => WrappedComponent => {
  function Authentication(props) {
    return (
      <WrappedComponent {...props} />
    )
  }
  Authentication.displayName = `withAuth(${WrappedComponent.displayName ||
    WrappedComponent.name ||
    'Component'})`
  Authentication.getInitialProps = async(ctx) => {
    const { apolloClient } = ctx
    const auth = await getSession(apolloClient)
    if (auth) {
      setData('auth', auth.data.session)
    }
    return { }
  }
  return Authentication
}

