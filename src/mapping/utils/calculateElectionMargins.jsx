export const calcPartisanAdvantage = (shapefileShapes, precinctShapes, electoralFields, mapping, idFieldName) => {
  return new Promise((resolve, reject) => {
    const worker = new Worker('partisanCalcWorker.js')

    worker.postMessage({ shapefileShapes, precinctShapes, electoralFields, mapping, idFieldName })

    worker.onmessage = function(e) {
      resolve(e.data)
    }

    worker.onerror = function(error) {
      console.error('Web Worker error:', error)
      reject(error)
    }
  })
}
