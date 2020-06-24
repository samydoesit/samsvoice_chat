<template>
  <div>
    Logged in as {{ user.displayName ? user.displayName : user.uid }}
    <button @click="auth.signOut()" class="button is-danger">Sign Out</button>
  </div>
</template>

<script>
import { auth } from "../firebase";

export default {
  data() {
    return {
      auth
    };
  },
  props: ["user"]
};
</script>