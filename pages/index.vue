<template>
  <div class="container">
    <div>
      <logo />
      <h1 class="title">
        graphql
      </h1>
      <h2 class="subtitle">
        Learning Graphql
      </h2>
      <div v-if="token" class="links">
        <a-input v-model="email" placeholder="email" />
        <a-input v-model="password" placeholder="password" />
        <a-button @click="handleLoginClick()" type="primary">
          Login
        </a-button>
      </div>
      <div class="links">
        <ul id="example-1">
          <li v-for="item in todos" :key="item.text">
            {{ item.text }}
          </li>
        </ul>
        <a-input v-model="text" placeholder="Basic usage" />
        <a-button @click="handleClick()" type="primary">
          Add
        </a-button>
        <div v-if="error">
          {{ error }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag'

import Logo from '~/components/Logo.vue'
// import todo from '~/apollo/queries/todo'

export default {
  data () {
    return {
      text: '',
      error: null,
      token: null,
      email: '',
      password: ''
    }
  },
  apollo: {
    todos: {
      query: gql`
      query todos {
        todos {
          id @client
          text @client
          done @client
        }
      }
      `
      // subscribeToMore: {
      //   document: gql`subscription {
      //     todoCreated {
      //       id
      //       text
      //       done
      //       user {
      //         id
      //         name
      //       }
      //     }
      //   }`,
      //   // Mutate the previous result
      //   updateQuery: (previousResult, { subscriptionData }) => {
      //     // Here, return the new result from the previous with the new data
      //     console.log('previous:', previousResult)
      //     console.log('subscriptionData:', subscriptionData)

      //     const { todos } = previousResult
      //     const { data: { todoCreated } } = subscriptionData

      //     if (todos.map(d => d.id).filter(id => id === todoCreated.id).length <= 0) {
      //       todos.push(todoCreated)
      //     }
      //   }
      // }
    }
  },
  components: {
    Logo
  },
  methods: {
    async handleLoginClick () {
      console.log(this.email, this.password)
      const result = await this.$axios.post('http://localhost:8080/user/login', {
        email: this.email,
        password: this.password
      })
      console.log(result)
      this.token = result.data.token
      await this.$apolloHelpers.onLogin(this.token)
    },
    handleClick () {
      const newText = this.text
      this.text = ''
      this.$apollo.mutate({
        // Query
        mutation: gql`mutation($text: String!) {
          createTodo(input: { text: $text, userId: "OK" }) @client {
            id
            text
            done
            user {
              id
              name
            }
          }
        }`,
        // Parameters
        variables: {
          text: newText
        }
        // error (error) {
        //   this.error = JSON.stringify(error.message)
        // },
        // Update the cache with the result
        // The query will be updated with the optimistic response
        // and then with the real result of the mutation
        // update: (store, { data: { createTodo } }) => {
        //   // Read the data from our cache for this query.
        //   const data = store.readQuery({ query: todo })
        //   console.log('data:', data)
        //   console.log('createTodo:', createTodo)
        //   // Add our tag from the mutation to the end
        //   if (data.todos.map(d => d.id).filter(id => id === createTodo.id).length <= 0) {
        //     data.todos.push(createTodo)
        //     // Write our data back to the cache.
        //     store.writeQuery({ query: todo, data })
        //   }
        // }
      }).then((data) => {
        // Result
        console.log(data)
      }).catch((error) => {
        // Error
        console.error(error)
        // We restore the initial user input
        this.text = newText
      })
    }
  }
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
