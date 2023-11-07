/* eslint-disable @typescript-eslint/no-var-requires */
const admin = require("firebase-admin")
const functions = require("firebase-functions")

admin.initializeApp()

// Take the text parameter passed to this HTTP endpoint and insert it into
// Firestore under the path /messages/:documentId/original
exports.addmessage = functions.https.onRequest(async (req, res) => {
  // Grab the text parameter.
  const original = req.query.text
  // Push the new message into Firestore using the Firebase Admin SDK.
  const writeResult = await functions.getFirestore()
      .collection("messages")
      .add({ original: original })
  // Send back a message that we've successfully written the message
  res.json({ result: `Message with ID: ${writeResult.id} added.` })
})
