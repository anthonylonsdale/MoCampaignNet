export const getRoadData = async (id) => {
  const db = await openDatabase()
  const transaction = db.transaction(['roadData'], 'readonly')
  const store = transaction.objectStore('roadData')

  return new Promise((resolve, reject) => {
    const request = store.get(id)

    request.onsuccess = function() {
      resolve(request.result)
    }

    request.onerror = function(e) {
      console.error('Error retrieving road data from db:', e)
      reject(Error('indexeddberror'))
    }
  })
}

export const addRoadData = async (roadData) => {
  const db = await openDatabase()
  const transaction = db.transaction(['roadData'], 'readwrite')
  const store = transaction.objectStore('roadData')

  return new Promise((resolve, reject) => {
    const request = store.add(roadData)
    request.onsuccess = function() {
      resolve(request.result)
    }

    request.onerror = function(e) {
      console.error('Error adding road data to db:', e)
      reject(Error('indexeddberror'))
    }
  })
}

export const getRoadMetrics = async (id) => {
  const db = await openDatabase()
  const transaction = db.transaction(['roadMetrics'], 'readonly')
  const store = transaction.objectStore('roadMetrics')

  return new Promise((resolve, reject) => {
    const request = store.get(id)

    request.onsuccess = function() {
      resolve(request.result)
    }

    request.onerror = function(e) {
      console.error('Error retrieving road metrics from db:', e)
      reject(Error('indexeddberror'))
    }
  })
}

export const addRoadMetrics = async (roadMetrics) => {
  const db = await openDatabase()
  const transaction = db.transaction(['roadMetrics'], 'readwrite')
  const store = transaction.objectStore('roadMetrics')

  return new Promise((resolve, reject) => {
    const request = store.add(roadMetrics)

    request.onsuccess = function() {
      resolve(request.result)
    }

    request.onerror = function(e) {
      console.error('Error adding road metrics to db:', e)
      reject(Error('indexeddberror'))
    }
  })
}

export const openDatabase = () => {
  return new Promise((resolve, reject) => {
    const openRequest = indexedDB.open('RoadMapsDB', 2)

    openRequest.onupgradeneeded = function(e) {
      const db = e.target.result
      if (!db.objectStoreNames.contains('roadMetrics')) {
        db.createObjectStore('roadMetrics', { keyPath: 'id' })
      }
      if (!db.objectStoreNames.contains('roadData')) {
        db.createObjectStore('roadData', { keyPath: 'id' })
      }
    }

    openRequest.onerror = function(e) {
      console.error('Error opening database', e)
      reject(Error('indexeddberror'))
    }

    openRequest.onsuccess = function(e) {
      resolve(e.target.result)
    }
  })
}

