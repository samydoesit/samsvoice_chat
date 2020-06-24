const functions = require('firebase-functions')
const admin = require('firebase-admin')

admin.initializeApp(functions.config().firebase)
const db = admin.firestore()

exports.createNewUser = functions.auth.user().onCreate(async (user, context) => {
    await db.collection('users').doc(user.uid).set({
      displayName: user.displayName,
      email: user.email,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      status: ''
    })
  })