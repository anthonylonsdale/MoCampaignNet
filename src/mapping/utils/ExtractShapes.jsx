import shp from 'shpjs'

const extractShapes = async (files) => {
  const result = {
    hasError: false,
    errorMessage: null,
    data: null,
  }

  const _parseFile = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader()

      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target.result
          const geojson = await shp(arrayBuffer) // Convert to GeoJSON
          resolve(geojson.features) // Assuming you want to extract features
        } catch (error) {
          console.error('Error parsing shapefile:', error)
        }
      }

      reader.onerror = (e) => {
        console.error('FileReader error:', e)
      }

      reader.readAsArrayBuffer(file) // Read the file as an ArrayBuffer
    })
  }

  try {
    // Process all files and wait for all to complete
    const filesArray = Array.from(files)
    const data = await Promise.all(filesArray.map(_parseFile))

    // Check if any of the files returned empty data
    if (data.some((fileData) => !fileData || fileData.length < 1)) {
      throw new Error('EXTRACT_FILE_EMPTY')
    }

    result.data = data.flat() // Flatten the array of features arrays
  } catch (error) {
    console.error('Error extracting shapes:', error)
    result.hasError = true
    result.errorMessage = error.message
  }

  return result.hasError ? result : result.data
}

export { extractShapes }
