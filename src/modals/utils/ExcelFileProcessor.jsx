import * as XLSX from 'xlsx'

export const readExcelFile = (droppedFile) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result)
      const workbook = XLSX.read(data, { type: 'array' })
      const sheetName = workbook.SheetNames[0]
      const sheet = workbook.Sheets[sheetName]
      const dataDict = {}
      const columns = []

      for (const cell in sheet) {
        if (sheet.hasOwnProperty(cell)) {
          const match = /^([A-Z]+)(\d+)$/.exec(cell)

          if (match) {
            const columnName = match[1]
            const rowNumber = parseInt(match[2], 10)

            if (rowNumber === 1) {
              columns.push(`${sheet[cell].v} (${columnName})`)
              dataDict[columnName] = []
            } else {
              if (!dataDict[columnName]) {
                dataDict[columnName] = []
              }
              dataDict[columnName].push(sheet[cell].v)
            }
          }
        }
      }
      resolve({ sheetName, columns, data: dataDict })
    }
    reader.onerror = reject
    reader.readAsArrayBuffer(droppedFile)
  })
}

export const applyDataCleaning = (data, options) => {
  const newData = { ...data }
  for (const col in newData) {
    if (newData.hasOwnProperty(col)) {
      newData[col] = newData[col].map((value) => {
        // Ensure value is a string before trying to apply string functions
        let stringValue = value
        if (options.trimWhitespace && typeof stringValue === 'string') {
          stringValue = stringValue.trim()
        }
        if (options.toUpperCase && typeof stringValue === 'string') {
          stringValue = stringValue.toUpperCase()
        }
        return stringValue
      })
    }
  }
  return newData
}

export const applySorting = (data, column, order) => {
  const columnLetter = column.match(/\(([^)]+)\)/)[1]

  if (!data[columnLetter]) {
    console.error(`Column ${columnLetter} not found.`)
    return data
  }

  const columnData = data[columnLetter].slice(0)

  const sortedIndices = columnData
      .map((value, index) => ({ index, value }))
      .sort((a, b) => {
        if (a.value === undefined || b.value === undefined) {
          return 0
        }
        if (order === 'ascend') {
          return a.value.toString().localeCompare(b.value.toString())
        }
        return b.value.toString().localeCompare(a.value.toString())
      })
      .map((pair) => pair.index)

  const sortedData = {}
  Object.keys(data).forEach((key) => {
    sortedData[key] = []
    sortedIndices.forEach((index) => {
      sortedData[key].push(data[key][index])
    })
  })

  return sortedData
}

export const generateAndDownloadNewExcelFile = (newData) => {
  if (!newData || Object.keys(newData).length === 0) {
    return
  }

  try {
    const { sheetName, data } = newData
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.aoa_to_sheet([])
    const columns = Object.keys(data)
    XLSX.utils.sheet_add_aoa(worksheet, [columns], { origin: 'A1' })

    const columnData = Object.values(data)
    const maxRows = Math.max(...columnData.map((col) => col.length))
    for (let rowIdx = 0; rowIdx < maxRows; rowIdx++) {
      const rowData = columns.map((col) => data[col][rowIdx] || '')
      XLSX.utils.sheet_add_aoa(worksheet, [rowData], { origin: `A${rowIdx + 2}` })
    }

    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
    XLSX.writeFile(workbook, `${sheetName}_filtered.xlsx`)
  } catch (error) {
    console.error('Error generating file:', error)
  }
}

export const reformatData = (excelData, selected) => {
  const { data } = excelData
  const newData = {}

  for (const col of selected) {
    const matches = col.match(/\(([^)]+)\)/)
    if (matches) {
      const letters = matches[1]
      newData[col] = data[letters]
    }
  }

  return {
    sheetName: excelData.sheetName,
    columns: selected,
    data: newData,
  }
}
