const pendingValidations = new Map()

self.addEventListener('install', () => {
  self.skipWaiting() // Activate worker immediately
})

self.addEventListener('fetch', (event) => {
  if (isAuthRequest(event.request)) {
    // Handle Firebase Authentication requests
    event.respondWith(handleAuthRequest(event.request, event.clientId))
  } else {
    // Non-auth requests
    event.respondWith(fetch(event.request))
  }
})

self.addEventListener('message', (event) => {
  // Log the incoming message for debugging purposes
  console.log('Received message in service worker:', event.data)
  console.log('gubs')
  if (event.data && event.data.type === 'SESSION_VALIDATION_RESPONSE') {
    const { validationId, isValid } = event.data
    const resolve = pendingValidations.get(validationId)
    if (resolve) {
      resolve(isValid)
      pendingValidations.delete(validationId)
    }
  }
})

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
  console.log('gibs')
  // Create a message channel for two-way communication
  const messageChannel = new MessageChannel()
  const client = await self.clients.get(clientId)

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
