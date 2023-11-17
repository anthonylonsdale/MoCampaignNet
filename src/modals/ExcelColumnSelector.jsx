import { Alert, Button, Checkbox, Input, Modal, Radio, Select, Switch, message } from 'antd'
import React, { useEffect, useState } from 'react'
import './ExcelColumnSelector.css'
import { applyDataCleaning, applySorting, generateAndDownloadNewExcelFile, readExcelFile, reformatData } from './utils/ExcelFileProcessor.jsx'


function ExcelColumnSelector({ visible, onCancel, droppedFile, setMapPoints, setCurrentMapFile }) {
  const [excelData, setExcelData] = useState(null)
  const [actionType, setActionType] = useState(null)
  const [error, setError] = useState(false)

  const [latitudeColumn, setLatitudeColumn] = useState(null)
  const [longitudeColumn, setLongitudeColumn] = useState(null)
  const [nameColumn, setNameColumn] = useState(null)

  const [selectedColumns, setSelectedColumns] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
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

    readExcelFile(droppedFile)
        .then((excelData) => {
          setExcelData(excelData)
        })
        .catch((error) => {
          console.error('Error reading file:', error)
        })
  }, [droppedFile, visible])

  const handleCheckboxChange = (column) => {
    const updatedSelection = selectedColumns.includes(column) ?
      selectedColumns.filter((col) => col !== column) :
      [...selectedColumns, column]

    setSelectedColumns(updatedSelection)
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

      if (sortColumn) {
        newData = applySorting(newData, sortColumn, sortOrder)
      }

      const newExcelData = reformatData({ ...excelData, data: newData }, selectedColumns)
      generateAndDownloadNewExcelFile(newExcelData)
    } else if (actionType === 'map') {
      if (latitudeColumn && longitudeColumn && nameColumn && excelData?.data) {
        const latitudeKey = latitudeColumn.match(/\(([^)]+)\)/)[1]
        const longitudeKey = longitudeColumn.match(/\(([^)]+)\)/)[1]
        const nameKey = nameColumn.match(/\(([^)]+)\)/)[1]

        const latitudes = excelData.data[latitudeKey]
        const longitudes = excelData.data[longitudeKey]

        const validationMessage = validateLatLngData(latitudes, longitudes)
        if (validationMessage) {
          message.error(validationMessage, 5)
          return
        }

        const mapData = excelData.data[latitudeKey].map((_, idx) => ({
          id: idx,
          lat: excelData.data[latitudeKey][idx],
          lng: excelData.data[longitudeKey][idx],
          name: excelData.data[nameKey][idx],
          color: 'black',
        }))
        setMapPoints(mapData)
        setCurrentMapFile(excelData)
      } else {
        message.error('Please select all required columns.', 5)
        setError(true)
        return
      }
    }
    onCancel()
  }

  const validateLatLngData = (latitudes, longitudes) => {
    const latPattern = /^-?([1-8]?[0-9](\.\d+)?|90(\.0+)?)$/
    const lngPattern = /^-?((1[0-7][0-9]|[1-9]?[0-9])(\.\d+)?|180(\.0+)?)$/

    for (const lat of latitudes) {
      if (!latPattern.test(lat.toString())) {
        return `Invalid latitude value: ${lat}`
      }
    }

    for (const lng of longitudes) {
      if (!lngPattern.test(lng.toString())) {
        return `Invalid longitude value: ${lng}`
      }
    }

    return ''
  }

  useEffect(() => {
    if (!visible) {
      setExcelData(null)
      setActionType(null)
      setError(false)
      setLatitudeColumn(null)
      setLongitudeColumn(null)
      setNameColumn(null)
      setSelectedColumns([])
      setSortColumn(null)
      setSortOrder('ascend')
      setCleanDataOptions({
        trimWhitespace: false,
        toUpperCase: false,
      })
    }
  }, [visible])

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
      <Radio.Group onChange={(e) => setActionType(e.target.value)} value={actionType}>
        <Radio value="format">Data Cleaning</Radio>
        <Radio value="map">Display on Map</Radio>
      </Radio.Group>
      {excelData && actionType === 'format' && (
        <>
          <div>
            <h3>Select Columns to Keep:</h3>
            <Input
              type="text"
              placeholder="Search columns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
              style={{ marginBottom: '10px', padding: '5px', width: '100%' }}
            />
            <div className="column-container">
              {excelData.columns
                  .filter((column) => column.toLowerCase().includes(searchQuery))
                  .map((column, index) => (
                    <div key={column} className="checkbox-label">
                      <span className="column-prefix">
                        {index < 26 ? String.fromCharCode(65 + index) : (
                          String.fromCharCode(64 + Math.floor(index / 26)) +
                          String.fromCharCode(65 + (index % 26))
                        )}
                      </span>
                      <Checkbox
                        onChange={() => handleCheckboxChange(column)}
                        checked={selectedColumns.includes(column)}
                      >
                        <span className="column-name">{column.replace(/\s+\([A-Z]\)$/, '')}</span>
                      </Checkbox>
                    </div>
                  ))}
            </div>
          </div>
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
          <div style={{ marginBottom: 20 }}>
            <h3>Sorting Options:</h3>
            <Switch
              checkedChildren="Ascending"
              unCheckedChildren="Descending"
              onChange={(value) => setSortOrder(value)}
            />
            <Select
              placeholder="Select Column to Sort"
              style={{ width: 200, marginRight: 10 }}
              onChange={(value) => setSortColumn(value)}
            >
              {selectedColumns.map((column) => (
                <Select.Option key={column} value={column}>
                  {column}
                </Select.Option>
              ))}
            </Select>
          </div>
        </>
      )}
      {excelData && actionType === 'map' && (
        <>
          <div className="select-group">
            {['Latitude', 'Longitude', 'Marker Name'].map((placeholder, index) => (
              <Select
                key={placeholder}
                className={`select-column ${error && 'error-select'}`}
                placeholder={`Select ${placeholder} Column`}
                onChange={(value) => {
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
          <Alert
            className="alert-warning"
            message="Note"
            description={
              <>
                Ensure your data is geocoded (has latitude and longitude data).
                <br />
                Contact <a href="mailto:alonsdale@bernoullitechnologies.net">alonsdale@bernoullitechnologies.net</a> if you need this for your data.
              </>
            }
            type="info"
            showIcon
          />
          {Object.keys(excelData.data).some((key) => excelData.data[key].length > 10000) && (
            <Alert
              className="alert-warning"
              message="Warning"
              description="Large datasets may result in slow performance."
              type="warning"
              showIcon
            />
          )}
        </>
      )}

    </Modal>
  )
}

export default ExcelColumnSelector
