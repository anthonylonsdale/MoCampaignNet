import { Button, Checkbox, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import * as XLSX from 'xlsx'

function ExcelColumnSelector({ visible, onCancel, droppedFile }) {
  const [excelData, setExcelData] = useState(null)
  const [selectedColumns, setSelectedColumns] = useState([])

  useEffect(() => {
    if (!droppedFile) {
      return
    }

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
      setExcelData({
        sheetName,
        columns,
        data: dataDict,
      })
    }
    reader.readAsArrayBuffer(droppedFile)
  }, [droppedFile])

  const handleCheckboxChange = (column) => {
    const updatedSelection = selectedColumns.includes(column) ?
      selectedColumns.filter((col) => col !== column) :
      [...selectedColumns, column]

    setSelectedColumns(updatedSelection)
  }

  const handleConfirm = () => {
    const newExcelData = reformatData(excelData, selectedColumns)
    generateAndDownloadNewExcelFile(newExcelData)
    onCancel() // close the modal
  }

  const reformatData = (excelData, selected) => {
    const { data } = excelData
    const newData = {}

    for (const col of selected) {
      const matches = col.match(/\(([^)]+)\)/)
      if (matches) {
        const letters = matches[1] // Get the letters
        newData[col] = data[letters]
      }
    }

    return {
      sheetName: excelData.sheetName,
      columns: selected,
      data: newData,
    }
  }

  const generateAndDownloadNewExcelFile = (newData) => {
    if (!newData || Object.keys(newData).length === 0) {
      return
    }

    const { sheetName, data } = newData
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.aoa_to_sheet([])
    const columns = Object.keys(data)
    XLSX.utils.sheet_add_aoa(worksheet, [columns], { origin: 'A1' })

    const columnData = Object.values(data)
    const maxRows = Math.max(...columnData.map((col) => col.length))
    for (let rowIdx = 0; rowIdx < maxRows; rowIdx++) {
      const rowData = columns.map((col) => data[col][rowIdx])
      XLSX.utils.sheet_add_aoa(worksheet,
          [rowData], { origin: `A${rowIdx + 2}` })
    }

    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
    XLSX.writeFile(workbook, `${sheetName}_filtered.xlsx`)
  }

  return (
    <Modal
      open={visible}
      title="Select Columns to Keep"
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="confirm" type="primary" onClick={handleConfirm}>
          Confirm
        </Button>,
      ]}
    >
      {excelData?.columns?.map((column) => (
        <Checkbox
          key={column}
          onChange={() => handleCheckboxChange(column)}
          checked={selectedColumns.includes(column)}
        >
          {column}
        </Checkbox>
      ))}
    </Modal>
  )
}

export default ExcelColumnSelector
