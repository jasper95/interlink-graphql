import gql from 'graphql-tag'

export const CREATE_NODE = gql`
  mutation CreateNode(
    $node: String,
    $input: any!,
  ) {
    createNode(node: "user", input: $input)
      @rest(type: "any", path: "/{args.node}", method: "POST") {
        token
      }
  }
`