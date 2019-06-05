import initialState from './initialState'
import gql from 'graphql-tag'

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