/* eslint-disable @typescript-eslint/no-var-requires */
const functions = require("firebase-functions")
const admin = require("firebase-admin")
const cors = require("cors")

admin.initializeApp()

const allowedOrigins = ["https://bernoullitechnologies.net", "http://localhost:3000"]

const corsHandler = cors((req, callback) => {
  const origin = req.header("Origin")
  let corsOptions
  if (allowedOrigins.includes(origin)) {
    corsOptions = { origin: true }
  } else {
    corsOptions = { origin: false }
  }
  callback(null, corsOptions)
})

exports.addmessage = functions.https.onRequest((req, res) => {
  corsHandler(req, res, () => {
    if (req.method === "POST") {
      const original = req.body.text // Make sure to use body-parser if needed
      admin.firestore().collection("messages").add({ original: original })
          .then((writeResult) => {
            res.json({ result: `Message with ID: ${writeResult.id} added.` })
          })
          .catch((error) => {
            console.error("Error writing document: ", error)
            res.status(500).send(error)
          })
    } else {
      res.status(403).send("Forbidden!")
    }
  })
})
