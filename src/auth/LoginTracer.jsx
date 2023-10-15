import { doc, setDoc } from 'firebase/firestore'
import { db, getUserDeviceInfo, getUserIP } from './firebase.jsx'


async function loginTracer(userId) {
  const userLoginRef = doc(db, 'userLogins', userId)

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
  }

  await setDoc(userLoginRef, {
    logins: loginDetails,
  }, { merge: true })
}

export default loginTracer
