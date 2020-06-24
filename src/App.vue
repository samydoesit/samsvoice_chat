<template>
  <div id="app">
    <header>
      <h1>Sam's Chat</h1>
      <p>Realtime Voice Chat</p>
    </header>

    <router-view />
  </div>
</template>

<script>

import { auth } from './firebase'

console.log(auth)

export default {
  name: 'App',
  components: {
  }
}
</script>

<style>

</style>
