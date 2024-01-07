import { MinusCircleOutlined } from '@ant-design/icons'
import { Alert, Button, Modal, Select, Space, message } from 'antd'
import React, { useEffect, useState } from 'react'

const DemographicDataModal = ({ visible, onCancel, demographicData, setDemographicSelections, shapeData }) => {
  const [selectedFields, setSelectedFields] = useState([])
  const [districtIdField, setDistrictIdField] = useState('')
  const [totalPopulationField, setTotalPopulationField] = useState('')
  const [demographicOptions, setDemographicOptions] = useState([])
  const [dataLengthMismatch, setDataLengthMismatch] = useState(false)

  useEffect(() => {
    if (demographicData) {
      const options = Object.keys(demographicData[0]).map((key) => ({ label: key, value: key }))
      setDemographicOptions(options)
    }

    const mismatch = shapeData && demographicData && shapeData.length !== demographicData.length
    setDataLengthMismatch(mismatch)
  }, [demographicData, shapeData])

  const addNewField = () => {
    setSelectedFields((prevFields) => [...prevFields, ''])
  }

  const removeField = (indexToRemove) => {
    setSelectedFields((prevFields) => prevFields.filter((_, index) => index !== indexToRemove))
  }

  const handleFieldChange = (field, value) => {
    setSelectedFields((prevFields) => {
      const newFields = [...prevFields]
      newFields[field] = value
      return newFields.filter((item) => item)
    })
  }

  const handleDistrictIdChange = (value) => {
    setDistrictIdField(value)
  }

  const handleTotalPopulationChange = (value) => {
    setTotalPopulationField(value)
  }

  const handleConfirm = () => {
    if (!districtIdField || !totalPopulationField) {
      message.error('Please select both the district ID and total population fields.')
      return
    }
    if (dataLengthMismatch) {
      Modal.warning({
        title: 'Data Length Mismatch',
        content: 'The demographic data and shapefile data lengths do not match. Please ensure the datasets correspond to each other.',
      })
      return
    }

    const demographicCounts = demographicData.map((district) => {
      const districtId = district[districtIdField]
      const totalPopulation = district[totalPopulationField]

      const demographicNumbers = selectedFields.reduce((acc, field) => {
        acc[field] = Math.round(district[field] * totalPopulation)
        return acc
      }, {})

      return {
        districtId,
        totalPopulation,
        demographics: demographicNumbers,
      }
    })

    setDemographicSelections({
      demographicCounts: demographicCounts,
      idField: districtIdField,
    })

    onCancel()
  }

  return (
    <Modal
      title="Demographic Data Options"
      open={visible}
      onCancel={onCancel}
      onOk={handleConfirm}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleConfirm}>
          Confirm
        </Button>,
      ]}
    >

      {dataLengthMismatch && (
        <Alert
          message="Warning"
          description="The length of the demographic data does not match the length of the shapefile data."
          type="warning"
          showIcon
          style={{ marginBottom: '1rem' }}
        />
      )}
      <Select
        showSearch
        style={{ width: '100%', marginBottom: '1rem' }}
        placeholder="Select total population field"
        onChange={handleTotalPopulationChange}
        options={demographicOptions}
      />

      <Select
        showSearch
        style={{ width: '100%', marginBottom: '1rem' }}
        placeholder="Select district ID field"
        onChange={handleDistrictIdChange}
        options={demographicOptions}
      />

      {selectedFields.map((field, index) => (
        <Space
          key={index}
          style={{ display: 'flex', marginBottom: 8, width: '100%' }}
          align="baseline"
        >
          <Select
            showSearch
            style={{ flex: 1, minWidth: 200 }}
            placeholder={`Select demographic field #${index + 1}`}
            value={field}
            onChange={(value) => handleFieldChange(index, value)}
            options={demographicOptions.filter( (option) => !selectedFields.includes(option.value) )}
          />
          {selectedFields.length > 1 ? (
            <MinusCircleOutlined
              onClick={() => removeField(index)}
              style={{ color: 'red', cursor: 'pointer' }}
            />
          ) : null}
        </Space>
      ))}

      <Button type="dashed" onClick={addNewField} style={{ width: '100%', marginBottom: '1rem' }} >
        Add Demographic Field
      </Button>
    </Modal>
  )
}

export default DemographicDataModal
