// ShapeSelectorModal.jsx
import { Button, Modal } from 'antd'
import React, { useState } from 'react'
import './ShapeSelectorModal.css'; // Assuming the CSS file is named ShapeSelectorModal.css

const ShapeSelectorModal = ({ isModalOpen, setIsModalOpen, shapes, setFilteredShapes, setModalCompleted }) => {
  const [tempSelectedShapes, setTempSelectedShapes] = useState([])
  const [selectAll, setSelectAll] = useState(false)

  const handleShapeSelection = (shape, isSelected) => {
    setTempSelectedShapes((prevSelectedShapes) => {
      if (isSelected) {
        return [...prevSelectedShapes, shape]
      } else {
        return prevSelectedShapes.filter((s) => s.properties.ID !== shape.properties.ID)
      }
    })
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
      <Button onClick={handleSelectAllToggle} type="primary">
        {selectAll ? 'Deselect All' : 'Select All'}
      </Button>
      <div className="shape-selection-container">
        {shapes && shapes.map((shape) => (
          <div key={shape.properties.ID} className="shape-row">
            <label>
              <input
                type="checkbox"
                onChange={(e) => handleShapeSelection(shape, e.target.checked)}
                checked={tempSelectedShapes.some((s) => s.properties.ID === shape.properties.ID)}
              />
              {` District ${shape.properties.DISTRICT}`}
            </label>
          </div>
        ))}
      </div>
    </Modal>
  )
}

export default ShapeSelectorModal
