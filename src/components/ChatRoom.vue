<template>
  <main>
    <h3>Welcome to Chat Room {{ chatId }}</h3>

    <User #user="{ user }">
      <div v-if="user">
        <ul>
          <li v-for="message of messages" :key="message.id">
            <ChatMessage :message="message" :owner="user.uid === message.sender" :users="users" />
          </li>
        </ul>

        <input type="text" v-model="newMewssageText" class="input" />

        <hr />
        <h5>Record Audio</h5>

        <button v-if="!recorder" @click="record()" class="button is-info">Record</button>
        <button v-else @click="stop()" class="button is-danger">Stop</button>

        <audio v-if="newAudio" :src="newAudioURL" controls></audio>
        <hr />

        <button
          :disabled="(!newMewssageText && !newAudio) || loading"
          class="button is-success"
          @click="addMessage(user.uid)"
        >Send</button>
      </div>
      <Login v-else />
    </User>

    <router-link to="/">Back</router-link>
  </main>
</template>

<script>
import User from "./User";
import Login from "./Login";
import ChatMessage from "./ChatMessage";

import { db, storage } from "../firebase";

export default {
  components: {
    User,
    Login,
    ChatMessage
  },
  data() {
    return {
      newMewssageText: "",
      loading: false,
      messages: [],
      newAudio: null,
      recorder: null,
      chatRoomData: [],
      users: []
    };
  },
  computed: {
    chatId() {
      return this.$route.params.id;
    },
    messagesCollection() {
      return db.doc(`chats/${this.chatId}`).collection("messages");
    },
    newAudioURL() {
      return URL.createObjectURL(this.newAudio);
    },
    RoomData() {
      return db.doc(`chats/${this.chatId}`);
    }
  },
  firestore() {
    return {
      chatRoomData: this.RoomData,
      messages: this.messagesCollection.orderBy("createdAt").limitToLast(10),
      users: db.collection('users')
    };
  },
  methods: {
    async addMessage(uid) {
      this.laoding = true;

      let audioURL = null;

      const { id: messageId } = this.messagesCollection.doc();
      if (!this.chatRoomData.members.includes(uid)) {
        const members = this.chatRoomData.members;
        try {
          members.push(uid);
          this.RoomData.update({ members: members }).then(
            console.log("Member hinzugefügt")
          );
        } catch (error) {
          console.log("Fehler: ", error);
        }
      }

      if (this.newAudio) {
        const storageRef = storage
          .ref("chats")
          .child(this.chatId)
          .child(`${messageId}.wav`);

        await storageRef.put(this.newAudio);

        audioURL = await storageRef.getDownloadURL();
      }

      console.log("Test: ", await this.messagesCollection.doc(messageId));

      await this.messagesCollection.doc(messageId).set({
        text: this.newMewssageText,
        sender: uid,
        createdAt: Date.now(),
        audioURL
      });

      this.loading = false;
      this.newMewssageText = "";
      this.newAudio = null;
    },
    async record() {
      this.newAudio = null;

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false
      });

      const options = { mimeType: "audio/webm" };
      const recordedChunks = [];
      this.recorder = new MediaRecorder(stream, options);

      this.recorder.addEventListener("dataavailable", e => {
        if (e.data.size > 0) {
          recordedChunks.push(e.data);
        }
      });

      this.recorder.addEventListener("stop", () => {
        this.newAudio = new Blob(recordedChunks);
        console.log(this.newAudio);
      });

      this.recorder.start();
    },
    async stop() {
      this.recorder.stop();
      this.recorder.null;
    }
  }
};
</script>

<style scoped>
ul {
  list-style-type: none;
  margin: 0;
  padding: 10px;
  display: flex;
  flex-direction: column;
  background: #efefef;
  border-radius: 0;
}
li {
  display: flex;
}
</style>