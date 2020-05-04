// import fetch from 'node-fetch'
import { from } from 'apollo-link'
// import { createHttpLink } from 'apollo-link-http'
import { RetryLink } from 'apollo-link-retry'
import { onError } from 'apollo-link-error'

import QueueLink from 'apollo-link-queue'
import SerializingLink from 'apollo-link-serialize'
import loggerLink from 'apollo-link-logger'

const offlineLink = new QueueLink()
offlineLink.close()
// offlineLink.open()
const serializingLink = new SerializingLink()
const retryLink = new RetryLink()

const errorLink = onError((err) => {
  // tslint:disable-next-line
  console.log('Caught Apollo Client Error', err)
})

const link = from([
  loggerLink,
  errorLink,
  offlineLink,
  serializingLink,
  retryLink
  // createHttpLink({ uri: 'http://localhost:8080/query/', fetch })
])

const resolvers = {
  Mutation: {
    createTodo2: (root, value, { cache }) => {
      console.log('value', value)
      const data = {
        hello: value
      }
      cache.writeData({ data })
      return null
    }
  }
}

const clientState = {
  // Set initial local state.
  defaults: {
    todos: []
  },
  resolvers
}

export default function (context) {
  return {
    httpEndpoint: 'http://localhost:8080/query/',
    wsEndpoint: 'ws://127.0.0.1:8080/query/',
    persisting: false,
    websocketsOnly: false,
    // defaultHttpLink: false,
    link,
    clientState
  }
}
