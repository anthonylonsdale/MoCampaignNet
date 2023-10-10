import { doc, setDoc } from 'firebase/firestore'
import { db, getUserDeviceInfo, getUserIP } from './firebase.jsx'


async function loginTracer(userId) {
  const userLoginRef = doc(db, 'userLogins', userId)

  console.log(getUserDeviceInfo())

  const deviceInfo = getUserDeviceInfo()

  const loginDetails = {
    timestamp: new Date(),
    ip: getUserIP(),
    device: deviceInfo.deviceType,
    browser: `${deviceInfo.browser.name} ${deviceInfo.browser.version}`,
  }
  console.log(loginDetails)

  await setDoc(userLoginRef, {
    logins: loginDetails,
  }, { merge: true })
}

export default loginTracer
