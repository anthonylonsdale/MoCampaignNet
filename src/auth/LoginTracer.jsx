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

async function markSessionAsInactive(userId, sessionId) {
  const sessionRef = doc(db, 'userLogins', userId, 'sessions', sessionId)

  try {
    await deleteDoc(sessionRef)
  } catch (error) {
    console.error('Error deleting session: ', error)
  }
}

async function getActiveSessions(userId) {
  const userLoginCollectionRef = collection(db, 'userLogins', userId, 'sessions')
  const activeSessionsQuery = query(userLoginCollectionRef, where('logins.isActive', '==', true))
  const querySnapshot = await getDocs(activeSessionsQuery)

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data().logins,
  }))
}

export { getActiveSessions, loginTracer, markSessionAsInactive }
