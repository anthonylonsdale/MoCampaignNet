import { Input } from 'antd'
import React, { useState } from 'react'
import styles from './DynamicTable.module.css'

const { TextArea } = Input

const EditableCell = ({ value, onValueChange }) => {
  const [editingValue, setEditingValue] = useState(value)

  const handleBlur = () => {
    onValueChange(editingValue)
  }

  const handleChange = (e) => {
    setEditingValue(e.target.value)
  }

  return (
    <TextArea
      value={editingValue}
      onChange={handleChange}
      onBlur={handleBlur}
      autoSize={true} // Adjust min and max rows as needed
    />
  )
}

const DynamicTable = ({ data, setData, title, columns, setColumns }) => {
  const handleCellValueChange = (rowIndex, column, newValue) => {
    const updatedData = [...data]
    updatedData[rowIndex][column] = newValue
    setData(updatedData)
  }

  const handleAddColumn = () => {
    const columnName = prompt('Enter new column name:')
    if (columnName) {
      setColumns([...columns, columnName])
      const updatedData = data.map((row) => ({ ...row, [columnName]: '' }))
      setData(updatedData)
    }
  }

  const handleRemoveColumn = (columnToRemove) => {
    setColumns(columns.filter((column) => column !== columnToRemove))
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const updatedData = data.map(({ [columnToRemove]: _, ...row }) => row)
    setData(updatedData)
  }

  return (
    <div>
      <h3 className={styles.header}>{title}</h3>
      <button onClick={handleAddColumn} className={styles.addButton}>
        Add Column
      </button>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column} className={styles.header}>
                {column}
                <button
                  onClick={() => handleRemoveColumn(column)}
                  className={`${styles.hoverButton} ${styles.actionCell}`}
                >
                  Remove
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className={styles.row}>
              {columns.map((column) => (
                <td key={column}>
                  <EditableCell
                    value={row[column]}
                    onValueChange={(newValue) => handleCellValueChange(rowIndex, column, newValue)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default DynamicTable
