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

/*
function generateUniqueId() {
  return 'id-' + Math.random().toString(36).substr(2, 16)
}

function isAuthRequest(request) {
  const url = new URL(request.url)
  const isLoginRequest = url.pathname.includes('/accounts:signInWithPassword')
  return url.hostname.includes('identitytoolkit.googleapis.com') && !isLoginRequest
}

async function handleAuthRequest(request, clientId) {
  console.log('TEST')
  // Create a message channel for two-way communication
  const messageChannel = new MessageChannel()
  const client = await self.clients.get(clientId)

  console.log(client)

  if (!client) {
    console.log('No client found for clientId:', clientId)
    return fetch(request)
  }

  // Generate a unique identifier for this validation request
  const validationId = generateUniqueId()
  const validationPromise = new Promise((resolve) => {
    pendingValidations.set(validationId, resolve)
  })

  // Post the message along with one port of the message channel
  client.postMessage({ type: 'CHECK_SESSION', validationId }, [messageChannel.port2])

  // Wait for the response
  const isValidSession = await validationPromise
  if (!isValidSession) {
    console.log('Session is not valid')
    return new Response('Invalid session', { status: 401 })
  }

  console.log('Session is valid, proceeding with request')
  return fetch(request)
}
*/
