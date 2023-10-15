import { Button, Checkbox, Modal } from 'antd'
import React, { useState } from 'react'

function ExcelColumnSelector({ visible, columns, onCancel, onConfirm }) {
  const [selectedColumns, setSelectedColumns] = useState([])

  const handleCheckboxChange = (column) => {
    const updatedSelection = selectedColumns.includes(column) ?
      selectedColumns.filter((col) => col !== column) :
      [...selectedColumns, column]

    setSelectedColumns(updatedSelection)
  }

  const handleConfirm = () => {
    onConfirm(selectedColumns)
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
      {columns?.map((column) => (
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
