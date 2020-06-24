<template>
  <div class="message" :class="{'from-user': owner}">
    {{ message.text }}
    <br />

    <div v-if="message.audioURL">
      <audio :src="message.audioURL" controls></audio>
      <br />
      <br />
    </div>

    <span class="sender">
      <!-- {{ user && user.displayName ? user.displayName : `from UID ${message.sender}` }} -->
      {{ sender && sender.displayName ? sender.displayName : `from UID ${message.sender}` }}
    </span>
  </div>
</template>

<script>
import { db } from "../firebase";

export default {
  /* firestore() {
    return {
      user: db.collection('users').doc(this.message.sender)
    };
  }, */
  data() {
    return {
      /* user: null, */
      db
    };
  },
  computed: {
    sender() {
      return this.users.find(u => u.id === this.message.sender);
    }
  },
  props: ["message", "owner", "users"]
};
</script>

<style>
.message {
  background: #dddddd;
  color: black;
  margin-left: 10px;
  margin-right: auto;
  border-radius: 5px;
  padding: 12px;
  display: inline-block;
}
.from-user {
  margin-right: 10px;
  margin-left: auto;
  background: #91bbff;
}
.sender {
  font-size: 0.5rem;
}
</style>