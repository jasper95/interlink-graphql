import React from 'react'
import gql from 'graphql-tag'

const getSession = apolloClient =>
  apolloClient
    .query({
      query: gql`
        query getUser {
          session @rest(type: "user", path: "/session") {
            token,
            company_id,
            first_name
          }
        }
      `
    })
    .then(({ data }) => {
      console.log('zzzz: ', data);
      return { loggedInUser: data }
    })
    .catch(() => {
      // Fail gracefully
      return { loggedInUser: null }
    })


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
    const { loggedInUser } = await getSession(ctx.apolloClient)
    return { loggedInUser }
  }
  return Authentication
}

