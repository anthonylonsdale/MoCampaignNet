/* eslint-disable @typescript-eslint/no-var-requires */
const functions = require("firebase-functions")
const admin = require("firebase-admin")
const cors = require("cors")
const { v4: uuidv4 } = require("uuid")

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

exports.createSubaccount = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    if (req.method === "POST") {
      const { email, displayName, role, parentUserUid } = req.body
      const subaccountDetails = {
        email: email,
        displayName: displayName,
        role: role,
      }
      try {
        await admin.auth().createUser({
          email: email,
          displayName: displayName,
          emailVerified: false,
        })

        const userDocRef = admin.firestore().collection("users")
            .doc(parentUserUid)

        const subaccountDocRef = userDocRef.collection("subaccounts").doc()
        await subaccountDocRef.set(subaccountDetails)

        res.status(200).send({
          success: true,
          email: email,
        })
      } catch (error) {
        console.error("Error creating subaccount: ", error)
        res.status(500).send({ success: false, error: error.message })
      }
    } else {
      res.status(403).send("Forbidden!")
    }
  })
})

exports.createSession = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated",
        "The user must be logged in to create a session.")
  }

  const userId = context.auth.uid
  const sessionId = uuidv4()

  const sessionsRef = admin.firestore().collection("sessions")

  await sessionsRef.doc(userId).set({
    sessionId: sessionId,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    isValid: true,
  })

  return { sessionId }
})

exports.validateSession = functions.https.onCall(async (data) => {
  const userId = data.userId
  const sessionId = data.sessionId
  const sessionDoc = await admin.firestore().collection("sessions")
      .doc(userId).get()

  if (!sessionDoc.exists) {
    return { isValid: false }
  }

  const sessionData = sessionDoc.data()
  return { isValid: sessionData.sessionId === sessionId &&
    sessionData.isValid }
})

exports.invalidateSession = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated",
        "The function must be called while authenticated.")
  }

  const sessionId = data.sessionId
  if (!sessionId) {
    throw new functions.https.HttpsError("invalid-argument",
        "The function must be called with a session ID.")
  }

  try {
    const sessionRef = admin.firestore().collection("sessions").doc(sessionId)
    await sessionRef.update({ isValid: false })
    return { success: true }
  } catch (error) {
    console.error("Error invalidating session:", error)
    throw new functions.https.HttpsError("unknown",
        "Failed to invalidate session.")
  }
})
