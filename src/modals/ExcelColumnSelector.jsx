import { Alert, Button, Checkbox, Modal, Radio, Select, message } from 'antd'
import React, { useEffect, useState } from 'react'
import * as XLSX from 'xlsx'

function ExcelColumnSelector({ visible, onCancel, droppedFile, setMapPoints }) {
  const [excelData, setExcelData] = useState(null)
  const [selectedColumns, setSelectedColumns] = useState([])
  const [actionType, setActionType] = useState(null)
  const [error, setError] = useState(false)

  const [latitudeColumn, setLatitudeColumn] = useState(null)
  const [longitudeColumn, setLongitudeColumn] = useState(null)
  const [nameColumn, setNameColumn] = useState(null)

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

  const handleActionChange = (e) => {
    setActionType(e.target.value)
  }

  const handleConfirm = () => {
    if (actionType === 'format') {
      const newExcelData = reformatData(excelData, selectedColumns)
      generateAndDownloadNewExcelFile(newExcelData)
    } else if (actionType === 'map') {
      if (latitudeColumn && longitudeColumn && nameColumn && excelData?.data) {
        const latitudeKey = latitudeColumn.match(/\(([^)]+)\)/)[1] // Extract the column letter
        const longitudeKey = longitudeColumn.match(/\(([^)]+)\)/)[1] // Extract the column letter
        const nameKey = nameColumn.match(/\(([^)]+)\)/)[1] // Extract the column letter

        const mapData = excelData.data[latitudeKey].map((_, idx) => ({
          lat: excelData.data[latitudeKey][idx],
          lng: excelData.data[longitudeKey][idx],
          name: excelData.data[nameKey][idx],
        }))
        setMapPoints(mapData)
      } else {
        // Error handling: required columns not selected
        message.error('Please select all required columns.', 5)
        setError(true)
        return
      }
    }
    onCancel() // Close the modal
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

  const renderMapColumnSelectors = () => (
    <div>
      {['Latitude', 'Longitude', 'Marker Name'].map((placeholder, index) => (
        <Select
          key={placeholder}
          placeholder={`Select ${placeholder} Column`}
          style={{ width: 200, marginBottom: 10, borderColor: error ? 'red' : undefined }}
          onChange={(value) => {
            setError(false) // Reset error on new selection
            if (index === 0) setLatitudeColumn(value)
            if (index === 1) setLongitudeColumn(value)
            if (index === 2) setNameColumn(value)
          }}>
          {excelData.columns.map((column) => (
            <Select.Option key={column} value={column}>
              {column}
            </Select.Option>
          ))}
        </Select>
      ))}
    </div>
  )

  return (
    <Modal
      open={visible}
      title="Excel Data Options"
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
        Cancel
        </Button>,
        <Button key="confirm" type="primary" onClick={handleConfirm} disabled={!actionType}>
        Confirm
        </Button>,
      ]}
    >
      <Radio.Group onChange={handleActionChange} value={actionType}>
        <Radio value="format">Format Excel Document</Radio>
        <Radio value="map">Display on Map</Radio>
      </Radio.Group>
      {excelData && actionType === 'format' && (
        <div>
          <h3>Select Columns:</h3>
          {excelData.columns.map((column) => (
            <Checkbox
              key={column}
              onChange={() => handleCheckboxChange(column)}
              checked={selectedColumns.includes(column)}
            >
              {column}
            </Checkbox>
          ))}
        </div>
      )}
      {excelData && actionType === 'map' && (
        <>
          {renderMapColumnSelectors()}
          {Object.keys(excelData.data).some((key) => excelData.data[key].length > 10000) && (
            <Alert
              message="Warning"
              description="Large datasets may result in slow performance."
              type="warning"
              showIcon
              style={{ marginTop: '20px' }}
            />
          )}
        </>
      )}
    </Modal>
  )
}

export default ExcelColumnSelector
