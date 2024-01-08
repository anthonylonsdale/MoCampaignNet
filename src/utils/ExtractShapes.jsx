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
          const geojson = await shp(arrayBuffer)
          resolve(geojson.features)
        } catch (error) {
          console.error('Error parsing shapefile:', error)
        }
      }

      reader.onerror = (e) => {
        console.error('FileReader error:', e)
      }

      reader.readAsArrayBuffer(file)
    })
  }

  try {
    const filesArray = Array.from(files)
    const data = await Promise.all(filesArray.map(_parseFile))

    if (data.some((fileData) => !fileData || fileData.length < 1)) {
      throw new Error('EXTRACT_FILE_EMPTY')
    }

    result.data = data.flat()
  } catch (error) {
    console.error('Error extracting shapes:', error)
    result.hasError = true
    result.errorMessage = error.message
  }

  return result.hasError ? result : result.data
}

export { extractShapes }
