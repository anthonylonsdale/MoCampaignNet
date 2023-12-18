// ShapeSelectorModal.jsx
import { Button, Modal, Select } from 'antd'
import React, { useState } from 'react'
import './ShapeSelectorModal.css'

const ShapeSelectorModal = ({ isModalOpen, setIsModalOpen, shapes, setFilteredShapes, setModalCompleted }) => {
  const [tempSelectedShapes, setTempSelectedShapes] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [isMouseDown, setIsMouseDown] = useState(false)
  const [idFieldName, setIdFieldName] = useState('')

  const handleIdFieldChange = (value) => {
    setIdFieldName(value)
  }

  const handleShapeSelection = (shape, isSelected) => {
    setTempSelectedShapes((prevSelectedShapes) => {
      if (isSelected) {
        return [...prevSelectedShapes, shape]
      } else {
        return prevSelectedShapes.filter((s) => s.properties.ID !== shape.properties.ID)
      }
    })
    setIsMouseDown(isSelected)
  }

  const handleMouseEnter = (shape) => {
    if (isMouseDown) {
      handleShapeSelection(shape, !tempSelectedShapes.some((s) => s.properties.ID === shape.properties.ID))
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
    setIsModalOpen(false)
    setModalCompleted(true)
  }

  return (
    <Modal
      title="Select Shapes"
      open={isModalOpen}
      onOk={handleModalSubmit}
      onCancel={() => setIsModalOpen(false)}
    >
      {!idFieldName && (
        <>
          <p>Please select the field which represents the ID of the districts:</p>
          <Select
            showSearch
            style={{ width: '100%' }}
            placeholder="Select the field for IDs"
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
                <label>
                  <input
                    type="checkbox"
                    onMouseDown={(e) => handleShapeSelection(shape, !e.target.checked)}
                    onMouseUp={() => setIsMouseDown(false)}
                    onMouseEnter={() => handleMouseEnter(shape)}
                    checked={tempSelectedShapes.some((s) => s.properties[idFieldName] === shape.properties[idFieldName])}
                  />
                  {` District ${shape.properties[idFieldName]}`}
                </label>
              </div>
            ))}
          </div>
        </>
      )}
    </Modal>
  )
}

export default ShapeSelectorModal
