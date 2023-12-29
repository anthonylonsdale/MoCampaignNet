// ShapeSelectorModal.jsx
import { Button, Checkbox, Modal, Select } from 'antd'
import React, { useState } from 'react'
import './ShapeSelectorModal.css'

const ShapeSelectorModal = ({ isModalOpen, setIsModalOpen, shapes, setFilteredShapes, setModalCompleted, idFieldName, setIdFieldName }) => {
  const [tempSelectedShapes, setTempSelectedShapes] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [isMouseDown, setIsMouseDown] = useState(false)

  const handleIdFieldChange = (value) => {
    setIdFieldName(value)
  }

  const resetIdFieldSelection = () => {
    setIdFieldName('')
    setTempSelectedShapes([])
  }

  const handleShapeSelection = (shape, isSelected) => {
    setTempSelectedShapes((prevSelectedShapes) => {
      if (isSelected) {
        return [...prevSelectedShapes, shape]
      } else {
        return prevSelectedShapes.filter((s) => s.properties[idFieldName] !== shape.properties[idFieldName])
      }
    })
    setIsMouseDown(isSelected)
  }

  const handleMouseEnter = (shape) => {
    if (isMouseDown) {
      handleShapeSelection(shape, !tempSelectedShapes.some((s) => s.properties[idFieldName] === shape.properties[idFieldName]))
    }
  }

  const handleSelectAllToggle = () => {
    if (selectAll) {
      setTempSelectedShapes([])
    } else {
      setTempSelectedShapes([...shapes])
    }
    setSelectAll(!selectAll)
  }

  const handleModalSubmit = () => {
    if (!idFieldName) {
      alert('Please select an ID field.')
      return
    }

    setFilteredShapes(tempSelectedShapes)
    setTempSelectedShapes([])
    setIsModalOpen(false)
    setModalCompleted(true)
  }

  const renderFooter = () => {
    // When idFieldName is set, show the footer with the "Change Field Selection" button
    if (idFieldName) {
      return [
        <Button key="back" onClick={resetIdFieldSelection}>
          Change Field Selection
        </Button>,
        <Button key="submit" type="primary" onClick={handleModalSubmit}>
          OK
        </Button>,
        <Button key="cancel" onClick={() => setIsModalOpen(false)}>
          Cancel
        </Button>,
      ]
    } else {
      return [
        <Button key="cancel" onClick={() => setIsModalOpen(false)}>
          Cancel
        </Button>,
      ]
    }
  }

  return (
    <Modal
      title="Select Shapes"
      open={isModalOpen}
      onOk={handleModalSubmit}
      onCancel={() => setIsModalOpen(false)}
      footer={renderFooter()}
    >
      {!idFieldName && (
        <>
          <p>Please select the field which represents the ID of the districts:</p>
          <Select
            showSearch
            style={{ width: '100%' }}
            placeholder="Select district ID from fields"
            onChange={handleIdFieldChange}
          >
            {Object.keys(shapes?.[0]?.properties || {}).map((key) => (
              <Select.Option key={key} value={key}>{key}</Select.Option>
            ))}
          </Select>
        </>
      )}
      {idFieldName && (
        <>
          <Button onClick={handleSelectAllToggle} type="primary">
            {selectAll ? 'Deselect All' : 'Select All'}
          </Button>
          <div className="shape-selection-container">
            {shapes && shapes.map((shape) => (
              <div key={shape.properties[idFieldName]} className="shape-row">
                <Checkbox
                  onMouseDown={(e) => {
                    e.preventDefault()
                    handleShapeSelection(shape, !e.target.checked)
                  }}
                  onMouseUp={() => setIsMouseDown(false)}
                  onMouseEnter={() => handleMouseEnter(shape)}
                  checked={tempSelectedShapes.some((s) => s.properties[idFieldName] === shape.properties[idFieldName])}
                >
                  {` District ${shape.properties[idFieldName]}`}
                </Checkbox>
              </div>
            ))}
          </div>
        </>
      )}
    </Modal>
  )
}

export default ShapeSelectorModal
