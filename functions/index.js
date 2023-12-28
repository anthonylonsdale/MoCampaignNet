/* eslint-disable @typescript-eslint/no-var-requires */
const functions = require("firebase-functions")
const admin = require("firebase-admin")
const cors = require("cors")

admin.initializeApp()

const allowedOrigins = ["https://bernoullitechnologies.net", "http://localhost:3000"]

const corsHandler = cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
})

// above is the config required, below is a sample request
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
