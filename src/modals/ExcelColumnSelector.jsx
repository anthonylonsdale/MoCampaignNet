import { Alert, Button, Checkbox, Modal, Radio, Select, Switch, message } from 'antd'
import React, { useEffect, useState } from 'react'
import * as XLSX from 'xlsx'
import './ExcelColumnSelector.css'

function ExcelColumnSelector({ visible, onCancel, droppedFile, setMapPoints }) {
  const [excelData, setExcelData] = useState(null)
  const [actionType, setActionType] = useState(null)
  const [error, setError] = useState(false)

  const [latitudeColumn, setLatitudeColumn] = useState(null)
  const [longitudeColumn, setLongitudeColumn] = useState(null)
  const [nameColumn, setNameColumn] = useState(null)

  const [selectedColumns, setSelectedColumns] = useState([])
  const [sortColumn, setSortColumn] = useState(null)
  const [sortOrder, setSortOrder] = useState('ascend')
  const [cleanDataOptions, setCleanDataOptions] = useState({
    trimWhitespace: false,
    toUpperCase: false,
  })

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

  const handleSortColumnChange = (value) => {
    setSortColumn(value)
  }

  const handleSortOrderChange = (value) => {
    setSortOrder(value)
  }

  const handleDataCleaningSwitch = (checked, option) => {
    setCleanDataOptions((prevOptions) => ({
      ...prevOptions,
      [option]: checked,
    }))
  }

  const handleConfirm = () => {
    if (actionType === 'format') {
      let newData = applyDataCleaning(excelData.data, cleanDataOptions)

      // Then apply sorting if a column is selected
      if (sortColumn) {
        newData = applySorting(newData, sortColumn, sortOrder)
      }

      // Now reformat the data with the selected columns
      const newExcelData = reformatData({ ...excelData, data: newData }, selectedColumns)
      generateAndDownloadNewExcelFile(newExcelData)
    } else if (actionType === 'map') {
      if (latitudeColumn && longitudeColumn && nameColumn && excelData?.data) {
        const latitudeKey = latitudeColumn.match(/\(([^)]+)\)/)[1]
        const longitudeKey = longitudeColumn.match(/\(([^)]+)\)/)[1]
        const nameKey = nameColumn.match(/\(([^)]+)\)/)[1]

        const mapData = excelData.data[latitudeKey].map((_, idx) => ({
          lat: excelData.data[latitudeKey][idx],
          lng: excelData.data[longitudeKey][idx],
          name: excelData.data[nameKey][idx],
        }))
        setMapPoints(mapData)
      } else {
        message.error('Please select all required columns.', 5)
        setError(true)
        return
      }
    }
    onCancel()
  }

  const reformatData = (excelData, selected) => {
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
            setError(false)
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

  const applyDataCleaning = (data, options) => {
    const newData = { ...data }
    for (const col in newData) {
      if (newData.hasOwnProperty(col)) {
        newData[col] = newData[col].map((value) => {
          // Ensure value is a string before trying to apply string functions
          let stringValue = value
          if (value !== null && value !== undefined) {
            stringValue = value.toString()
          }
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


  const applySorting = (data, column, order) => {
    const columnObject = excelData.columns.find((col) => col.name === column)
    if (!columnObject) {
      console.error(`Column ${column} not found.`)
      return data
    }

    const columnData = data[columnObject.letter].slice(1)
    const sortedIndices = columnData
        .map((value, index) => ({ index, value }))
        .sort((a, b) => {
          if (a.value === undefined || b.value === undefined) {
            return 0
          }
          if (order === 'ascend') return a.value.toString().localeCompare(b.value.toString())
          return b.value.toString().localeCompare(a.value.toString())
        })
        .map((pair) => pair.index)

    const sortedData = {}
    Object.keys(data).forEach((key) => {
      sortedData[key] = [data[key][0]]
      sortedIndices.forEach((index) => {
        sortedData[key].push(data[key][index + 1])
      })
    })

    return sortedData
  }


  const renderDataCleaningOptions = () => (
    <div style={{ marginBottom: 20 }}>
      <h3>Data Cleaning Options:</h3>
      <div>
        <Switch
          checkedChildren="Trim"
          unCheckedChildren="No Trim"
          onChange={(checked) => handleDataCleaningSwitch(checked, 'trimWhitespace')}
        />
        <span style={{ marginLeft: 8 }}>Trim Whitespace</span>
      </div>
      <div>
        <Switch
          checkedChildren="Upper"
          unCheckedChildren="No Upper"
          onChange={(checked) => handleDataCleaningSwitch(checked, 'toUpperCase')}
        />
        <span style={{ marginLeft: 8 }}>Convert Text to Uppercase</span>
      </div>
    </div>
  )

  const renderSortingOptions = () => (
    <div style={{ marginBottom: 20 }}>
      <h3>Sorting Options:</h3>
      <Select
        placeholder="Select Column to Sort"
        style={{ width: 200, marginRight: 10 }}
        onChange={handleSortColumnChange}
      >
        {excelData.columns.map((column) => (
          <Select.Option key={column} value={column}>
            {column}
          </Select.Option>
        ))}
      </Select>
      <Select
        defaultValue="ascend"
        style={{ width: 120 }}
        onChange={handleSortOrderChange}
      >
        <Select.Option value="ascend">Ascending</Select.Option>
        <Select.Option value="descend">Descending</Select.Option>
      </Select>
    </div>
  )

  return (
    <Modal
      open={visible}
      title="Excel Data Options"
      onCancel={onCancel}
      className="excel-column-selector-modal"
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
        <Radio value="format">Data Cleaning</Radio>
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
      {actionType === 'format' && renderDataCleaningOptions()}
      {actionType === 'format' && renderSortingOptions()}
    </Modal>
  )
}

export default ExcelColumnSelector
