export const calcPartisanAdvantage = (shapefileShapes, precinctShapes, electoralFields, mapping, idFieldName, onProgressUpdate) => {
  return new Promise((resolve, reject) => {
    const worker = new Worker('partisanCalcWorker.js')

    worker.postMessage({ shapefileShapes, precinctShapes, electoralFields, mapping, idFieldName })

    worker.onmessage = function(e) {
      if (e.data.type === 'progress' || e.data.type === 'progress2') {
        onProgressUpdate(e.data)
      } else if (e.data.type === 'result') {
        resolve(e.data)
      }
    }

    worker.onerror = function(error) {
      console.error('Web Worker error:', error)
      reject(error)
    }
  })
}
