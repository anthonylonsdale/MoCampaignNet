import { Alert, Button, Modal, Select, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { readExcelFile } from '../../utils/ExcelProcessingUtils.jsx'
import styles from './ExcelDataPlotModal.module.css'

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

function ExcelDataPlotModal({ visible, onCancel, droppedFile, setKnockingPoints }) {
  const [excelData, setExcelData] = useState(null)
  const [error, setError] = useState(false)

  const [latitudeColumn, setLatitudeColumn] = useState(null)
  const [longitudeColumn, setLongitudeColumn] = useState(null)
  const [nameColumn, setNameColumn] = useState(null)

  const resetSelection = () => {
    setLatitudeColumn(null)
    setLongitudeColumn(null)
    setNameColumn(null)
    setError(false)
  }

  useEffect(() => {
    if (!droppedFile) {
      return
    }
    readExcelFile(droppedFile)
        .then((data) => {
          setExcelData(data)
        })
        .catch((error) => {
          console.error('Error reading file:', error)
          message.error('Error reading file')
        })
  }, [droppedFile, visible])

  const handleConfirm = () => {
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
      setKnockingPoints(mapData)
    } else {
      message.error('Please select all required columns.', 5)
      setError(true)
      return
    }
    resetSelection()
    onCancel()
  }

  useEffect(() => {
    resetSelection()
  }, [visible])

  return (
    <Modal
      open={visible}
      title="Map Data Options"
      onCancel={onCancel}
      className={styles.excelColumnSelectorModal}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="confirm" type="primary" onClick={handleConfirm}>
          Confirm
        </Button>,
      ]}
    >
      {excelData && (
        <>
          <div className={styles.selectGroup}>
            {['Latitude', 'Longitude', 'Marker Name'].map((placeholder, index) => (
              <Select
                key={placeholder}
                className={`${styles.selectColumn} ${error && styles.errorSelect}`}
                placeholder={`Select ${placeholder} Column`}
                value={index === 0 ? latitudeColumn : index === 1 ? longitudeColumn : nameColumn}
                onChange={(value) => {
                  if (index === 0) setLatitudeColumn(value)
                  if (index === 1) setLongitudeColumn(value)
                  if (index === 2) setNameColumn(value)
                }}
              >
                {excelData.columns.map((column) => (
                  <Select.Option key={column} value={column}>
                    {column}
                  </Select.Option>
                ))}
              </Select>
            ))}
          </div>
          <Alert
            className={styles.alertWarning}
            message="Note"
            description={
              <>
                Ensure your data is geocoded (has coordinates).
                <br />
                Contact support if you need help with geocoding.
              </>
            }
            type="info"
            showIcon
          />
        </>
      )}
    </Modal>
  )
}

export default ExcelDataPlotModal
