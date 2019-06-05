import { useMutation } from 'react-apollo-hooks'

export default function customUseMutation(...args) {
  const [mutation, states] = useMutation(...args)
  const customMutation = new Proxy(mutation, {
    apply (target, thisArg, argList) {
      return target(...argList)
        .catch(err => err)
    }
  })
  return [
    customMutation,
    states
  ]
}