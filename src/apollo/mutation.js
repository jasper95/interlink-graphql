import gql from 'graphql-tag'

export const generateMutation = (keys, method = 'POST') => {
  return gql`
    mutation NodeMutation(
      $url: String,
      $method: String,
      $input: any!,
    ) {
      nodeMutation(url: $url, method: $method, input: $input)
        @rest(type: "any", path: "{args.url}", method: "${method}") {
          ${keys.join(', ')}
        }
    }
  `
}