import * as XLSX from 'xlsx'

export const processData = (workbook) => {
  const sheetName = workbook.SheetNames[0]
  const sheet = workbook.Sheets[sheetName]
  const range = XLSX.utils.decode_range(sheet['!ref'])
  const dataDict = {}
  const columns = []

  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellRef = XLSX.utils.encode_cell({ c: C, r: R })
      const cell = sheet[cellRef]
      const columnName = XLSX.utils.encode_col(C)

      if (R === 0 && cell) {
        columns.push(`${cell.v} (${columnName})`)
        dataDict[columnName] = []
      } else if (cell) {
        dataDict[columnName][R - 1] = cell.v
      }
    }
  }

  Object.keys(dataDict).forEach((column) => {
    for (let i = 0; i < range.e.r; i++) {
      if (dataDict[column][i] === undefined) {
        dataDict[column][i] = null
      }
    }
  })

  return { sheetName, columns, data: dataDict }
}

export const readExcelFile = (droppedFile) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      let workbook

      if (droppedFile.type === 'text/csv' || /\.csv$/i.test(droppedFile.name)) {
        const data = e.target.result
        const parsedCSV = XLSX.read(data, { type: 'string' })
        workbook = parsedCSV
      } else {
        const binaryData = droppedFile.type === 'application/vnd.ms-excel' || /\.xls$/i.test(droppedFile.name) ? e.target.result : new Uint8Array(e.target.result)
        workbook = XLSX.read(binaryData, { type: droppedFile.type === 'application/vnd.ms-excel' ? 'binary' : 'array' })
      }

      resolve(processData(workbook))
    }

    reader.onerror = reject

    if (droppedFile.type === 'text/csv' || /\.csv$/i.test(droppedFile.name)) {
      reader.readAsText(droppedFile)
    } else {
      reader.readAsArrayBuffer(droppedFile)
    }
  })
}

export const applyDataCleaning = (data, options) => {
  const newData = {}

  Object.keys(data).forEach((col) => {
    newData[col] = data[col].map((value) => {
      if (typeof value === 'string') {
        if (options.trimWhitespace) {
          value = value.trim()
        }
        if (options.toUpperCase) {
          value = value.toUpperCase()
        }
      }
      return value
    })
  })
  return newData
}


export const applySorting = (data, column, order) => {
  const columnLetter = column.match(/\(([^)]+)\)/)[1]

  if (!data[columnLetter]) {
    console.error(`Column ${columnLetter} not found.`)
    return data
  }

  const sortFn = (a, b) => {
    if (order === 'ascend') {
      return (a || '').toString().localeCompare((b || '').toString())
    } else {
      return (b || '').toString().localeCompare((a || '').toString())
    }
  }

  const sortedIndices = data[columnLetter].map((_, index) => index)
      .sort((a, b) => sortFn(data[columnLetter][a], data[columnLetter][b]))

  const sortedData = Object.fromEntries(
      Object.keys(data).map((key) => [
        key,
        sortedIndices.map((index) => data[key][index]),
      ]),
  )

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

    const originalColumnNames = Object.keys(data)
    const headerRow = originalColumnNames.map((colName) => colName.replace(/\s+\([A-Z]\)$/, ''))

    XLSX.utils.sheet_add_aoa(worksheet, [headerRow], { origin: 'A1' })
    const numRows = data[originalColumnNames[0]].length

    for (let rowIdx = 0; rowIdx < numRows; rowIdx++) {
      const rowData = originalColumnNames.map((colName) => data[colName][rowIdx] || '')
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

  selected.forEach((col) => {
    const letter = col.match(/\(([^)]+)\)/)[1]
    newData[col] = data[letter]
  })

  return {
    sheetName: excelData.sheetName,
    columns: selected,
    data: newData,
  }
}
