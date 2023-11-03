import { addDoc, collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore'
import { db, getUserDeviceInfo, getUserIP } from './firebase.jsx'

async function loginTracer(userId) {
  const userLoginCollectionRef = collection(db, 'userLogins', userId, 'sessions')

  const deviceInfo = getUserDeviceInfo()
  const ipAddress = await getUserIP()

  const loginDetails = {
    timestamp: new Date(),
    ip: ipAddress,
    ...(Object.values(deviceInfo.result.device).every((value) =>
      value === undefined) ?
    {} :
    {
      device: deviceInfo.result.device.model,
    }),
    browser: `${deviceInfo.result.browser.name} 
    ${deviceInfo.result.browser.version}`,
    isActive: true,
  }

  const existingQuery = query(userLoginCollectionRef,
      where('logins.ip', '==', loginDetails.ip),
      where('logins.browser', '==', loginDetails.browser))

  const existingEntries = await getDocs(existingQuery)

  if (existingEntries.size > 0) {
    // If a matching entry exists, update it and mark as active
    const existingEntry = existingEntries.docs[0]
    const existingEntryRef = doc(userLoginCollectionRef, existingEntry.id)

    await updateDoc(existingEntryRef, { logins: loginDetails })
  } else {
    // If no matching entry exists, add a new entry as active
    await addDoc(userLoginCollectionRef, { logins: loginDetails })
  }
}

// Function to mark a session as inactive
async function markSessionAsInactive(userId, sessionId) {
  const sessionRef = doc(db, 'userLogins', userId, 'sessions', sessionId)

  await updateDoc(sessionRef, {
    isActive: false, // Mark the session as inactive
  })
}

export { loginTracer, markSessionAsInactive }
