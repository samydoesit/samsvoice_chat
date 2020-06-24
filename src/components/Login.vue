<template>
  <aside>
    <!-- <h3>Sign in Anonnymously</h3>
    <button @click="auth.signInAnonymously()">Sign In</button>

    <div v-if="newUser">
      <h3>Sign Up for a New Account</h3>
      <a href="#" @click="newUser = false">Returning User?</a>
    </div>

    <div v-else>
      <h3>Sign In with Email</h3>
      <a href="#" @click="newUser = true">New user?</a>
    </div>

    <label for="email">Email</label>
    <br />
    <input v-model="email" placeholder="email" type="email" class="input" />

    <label for="password">Password</label>
    <br />
    <input v-model="password" type="password" class="input" />
    <a
      href="#"
      @click="sendResetPasswordEmail()"
      v-if="email && !newUser && !resetMailSend"
    >Forgot Password?</a>
    <p class="has-text-danger" v-if="resetMailSend">Send Mail</p>
    <br />

    <button
      class="button is-info"
      :class="{ 'is-loading': loading }"
      @click="signInOrCreateUser()"
    >{{ newUser ? 'Sign Up' : 'Login' }}</button>
    <button
      class="button is-warning"
      :class="{ 'is-loading': loading }"
      @click="socialSignIn()"
    >Social Login</button>-->

    <section id="firebaseui-auth-container"></section>

    <p class="has-text-danger" v-if="errorMessage">{{ errorMessage }}</p>
  </aside>
</template>

<script>
import { auth, db } from "../firebase";

import "firebaseui/dist/firebaseui.css";

export default {
  data() {
    return {
      auth,
      db,
      newUser: false,
      email: "",
      password: "",
      errorMessage: "",
      loading: false,
      resetMailSend: false,
      users: []
    };
  },
  firestore() {
    return {
      users: db.collection("users")
    };
  },
  mounted() {
    this.socialSignIn();
  },
  methods: {
    async signInOrCreateUser() {
      this.loading = true;
      this.errorMessage = "";
      this.resetMailSend = false;

      try {
        if (this.newUser) {
          await auth.createUserWithEmailAndPassword(this.email, this.password);
        } else {
          await auth.signInWithEmailAndPassword(this.email, this.password);
        }
      } catch (error) {
        this.errorMessage = error.message;
      }

      this.loading = false;
    },
    async sendResetPasswordEmail() {
      this.loading = true;
      this.errorMessage = "";

      try {
        await auth.sendPasswordResetEmail(this.email).then(() => {
          this.resetMailSend = true;
        });
      } catch (error) {
        this.errorMessage = error.message;
      }

      this.loading = false;
    },
    socialSignIn() {
      var firebase = require("firebase/app");
      var firebaseui = require("firebaseui");
      let ui = firebaseui.auth.AuthUI.getInstance();
      if (!ui) {
        ui = new firebaseui.auth.AuthUI(firebase.auth());
      }
      const uiConfig = {
        callbacks: {
          signInSuccessWithAuthResult: function(
            authResult /* , redirectUrl */
          ) {
            console.log({ authResult });
            // User successfully signed in.
            // Return type determines whether we continue the redirect automatically
            // or whether we leave that to developer to handle.
            return false;
          },
          uiShown: function() {
            // The widget is rendered.
            // Hide the loader.
            // document.getElementById("loader").style.display = "none";
          }
        },
        signInSuccessUrl: "/",
        signInOptions: [
          firebase.auth.FacebookAuthProvider.PROVIDER_ID,
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          firebase.auth.GithubAuthProvider.PROVIDER_ID,
          {
            provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
            // Whether the display name should be displayed in the Sign Up page.
            requireDisplayName: true
          }
          //firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
        ]
      };
      ui.start("#firebaseui-auth-container", uiConfig);
    }
  }
};
</script>

<style>
#firebaseui-auth-container .firebaseui-idp-list {
  list-style: none !important;
}
</style>