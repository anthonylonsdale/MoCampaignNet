const pendingValidations = new Map()

self.addEventListener('install', () => {
  self.skipWaiting() // Activate worker immediately
})

self.addEventListener('fetch', (event) => {
  // Check if this is a POST request to the Firebase Authentication endpoint
  if (isFirebaseAuthPostRequest(event.request)) {
    // If it is, bypass the service worker and allow the request to go directly to the network
    return
  }
})

self.addEventListener('message', (event) => {
  // This log should only include data that is within the scope of this event.
  console.log('Received message in service worker:', event.data)
  if (event.data && event.data.type === 'SESSION_VALIDATION_RESPONSE') {
    const { validationId, isValid } = event.data
    const resolve = pendingValidations.get(validationId)
    if (resolve) {
      console.log(`Resolving validation for ID ${validationId} with result: ${isValid}`)
      resolve(isValid)
      pendingValidations.delete(validationId)
    } else {
      console.log(`No pending validation for ID ${validationId} found.`)
    }
  }
})

function isFirebaseAuthPostRequest(request) {
  const url = new URL(request.url)
  return (
    request.method === 'POST' &&
    url.hostname.includes('identitytoolkit.googleapis.com') &&
    url.pathname.includes('/accounts:signInWithPassword')
  )
}
