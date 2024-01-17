/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-var-requires */
const functions = require("firebase-functions")
const admin = require("firebase-admin")
// const cors = require("cors")
const { v4: uuidv4 } = require("uuid")
const axios = require("axios")

admin.initializeApp()

// the cors handler is mostly for if we want to make barebones http requests,
// we can just use onCall to avoid this messiness
// const allowedOrigins = ["https://bernoullitechnologies.net", "http://localhost:3000"]

/*
const corsHandler = cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
})
*/

exports.getStreetDataFromPolygon = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "The function must be called while authenticated.")
  }

  const { north, south, east, west } = data

  const highwayTypes = ["motorway", "primary", "secondary", "tertiary", "residential"]
  const highwayFilters = highwayTypes.map((type) => `way["highway"="${type}"](${south},${west},${north},${east});`).join("")

  const query = `
    [out:json][timeout:30];
    (
      ${highwayFilters}
    );
    out body;
    >;
    out skel qt;
  `

  const overpassUrl = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`

  try {
    const response = await axios.get(overpassUrl)
    return response.data
  } catch (error) {
    console.error("Error calling Overpass API:", error)
    throw new functions.https.HttpsError("internal", "Failed to call the Overpass API.")
  }
})

exports.deleteSubaccount = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "The function must be called while authenticated.")
  }

  const { subaccountUid, parentUserUid } = data

  try {
    await admin.auth().deleteUser(subaccountUid)
    const userDocRef = admin.firestore().collection("users").doc(parentUserUid)
    const subaccountDocRef = userDocRef.collection("subaccounts").where("uid", "==", subaccountUid)
    const subaccountsSnapshot = await subaccountDocRef.get()

    subaccountsSnapshot.forEach(async (doc) => {
      await doc.ref.delete()
    })

    return { success: true, subaccountUid: subaccountUid }
  } catch (error) {
    console.error("Error deleting subaccount: ", error)
    throw new functions.https.HttpsError("internal", error.message)
  }
})

exports.createSubaccount = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated",
        "The function must be called while authenticated.")
  }

  const { email, displayName, role, parentUserUid } = data

  try {
    const subaccountAuthUser = await admin.auth().createUser({
      email: email,
      displayName: displayName,
      emailVerified: false,
    })

    const subaccountDetails = {
      uid: subaccountAuthUser.uid, // Store the Firebase Auth UID here for reference
      email: email,
      displayName: displayName,
      role: role,
    }

    const userDocRef = admin.firestore().collection("users").doc(parentUserUid)
    const subaccountDocRef = userDocRef.collection("subaccounts").doc()
    await subaccountDocRef.set(subaccountDetails)

    return { success: true, email: email }
  } catch (error) {
    console.error("Error creating subaccount: ", error)
    throw new functions.https.HttpsError("internal", error.message)
  }
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
    ip: data.ip,
    device: data.device,
    browser: data.browser,
    os: data.os,
    screenResolution: data.screenResolution,
    userAgent: data.userAgent,
  })

  return { sessionId }
})

exports.validateSession = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated",
        "The function must be called while authenticated.")
  }

  try {
    const { userId, sessionId } = data
    if (!userId || !sessionId) {
      throw new functions.https.HttpsError("invalid-argument",
          "Missing userId or sessionId")
    }

    const sessionDoc = await admin.firestore().collection("sessions")
        .doc(userId).get()
    if (!sessionDoc.exists) {
      return { isValid: false }
    }

    const sessionData = sessionDoc.data()
    return { isValid: sessionData.sessionId === sessionId &&
      sessionData.isValid }
  } catch (error) {
    console.error("Error in validateSession:", error)
    throw new functions.https.HttpsError("internal",
        "Internal server error", error)
  }
})


exports.invalidateSession = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated",
        "The function must be called while authenticated.")
  }

  const { sessionId } = data
  if (!sessionId) {
    throw new functions.https.HttpsError("invalid-argument",
        "The function must be called with a session ID.")
  }

  const userId = context.auth.uid
  const sessionRef = admin.firestore().collection("sessions").doc(userId)

  try {
    const doc = await sessionRef.get()
    if (!doc.exists) {
      throw new functions.https.HttpsError("not-found",
          "The session document does not exist.")
    }

    const sessionData = doc.data()
    if (sessionData.sessionId !== sessionId) {
      throw new functions.https.HttpsError("permission-denied",
          "The session ID does not match the current session.")
    }

    await sessionRef.update({ isValid: false })
    return { success: true }
  } catch (error) {
    console.error("Error invalidating session:", error)
    throw new functions.https.HttpsError("unknown",
        "Failed to invalidate session.", error)
  }
})
