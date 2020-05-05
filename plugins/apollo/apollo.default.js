import gql from 'graphql-tag'
import { persistCache } from 'apollo-cache-persist'

const resolvers = {
  Mutation: {
    createTodo: (root, { input }, { cache }) => {
      console.log('value', input)
      const data = {
        todos: [{
          __typename: 'Todo',
          id: 1,
          text: input.text,
          done: true,
          user: {
            __typename: 'User',
            id: input.userId,
            name: 'horas'
          }
        }]
      }
      cache.writeData({ data })
      return null
    }
  }
}

export default function (context) {
  return {
    httpEndpoint: 'http://localhost:8080/query/',
    // wsEndpoint: 'ws://127.0.0.1:8080/query/',
    persisting: false,
    websocketsOnly: false,
    // defaultHttpLink: false,
    // link,
    resolvers,
    typeDefs: gql`
      type Todo {
        id: ID!
        text: String!
        done: Boolean!
        user: User!
      }

      type User {
        id: ID!
        name: String!
      }
    `,
    onCacheInit: (cache) => {
      persistCache({
        cache,
        storage: window.localStorage
      })
      const data = {
        todos: []
      }
      cache.writeData({ data })
    }
  }
}
