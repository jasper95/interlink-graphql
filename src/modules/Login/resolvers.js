import gql from 'graphql-tag'

const LOGIN_MUTATION = gql`
  mutation Signin(
    $input: any!,
  ) {
    signinUser(input: $input)
      @rest(type: "User", path: "/login", method: "POST") {
        token
      }
  }
`