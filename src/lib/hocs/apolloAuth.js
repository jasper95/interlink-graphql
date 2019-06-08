import React, { createContext } from 'react'
import gql from 'graphql-tag'
import { setData } from 'apollo/mutation'

export const AuthContext = createContext(null)
const getSession = apolloClient =>
  apolloClient
    .query({
      query: gql`
        query {
          session @rest(type: "Auth", path: "/session") {
            id
            last_name
            first_name
            avatar
            role
            slug
            unread_notifications
            address_description
            address
            contact_number
            email
            resume
            nationality
            birth_date
            company {
              id
              name
              slug
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
      setData('auth', auth.data.session)(apolloClient)
    }
    return { }
  }
  return Authentication
}

