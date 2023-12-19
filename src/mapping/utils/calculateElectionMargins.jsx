export const calcPartisanAdvantage = (shapefileShapes, precinctShapes, electoralFields, mapping, idFieldName) => {
  return new Promise((resolve, reject) => {
    const worker = new Worker('partisanCalcWorker.js')

    worker.postMessage({ shapefileShapes, precinctShapes, electoralFields, mapping, idFieldName })

    worker.onmessage = function(e) {
      if (e.data.type === 'progress') {
        resolve({ type: 'progress', ...e.data })
      } else if (e.data.type === 'progress2') {
        resolve({ type: 'progress2', ...e.data })
      } else if (e.data.type === 'result') {
        resolve({ type: 'result', ...e.data })
      }
    }

    worker.onerror = function(error) {
      console.error('Web Worker error:', error)
      reject(error)
    }
  })
}
