import { Button, List, Modal, Select, message } from 'antd'
import React, { useEffect, useState } from 'react'

const assignPartyColor = (party) => {
  switch (party) {
    case 'Republican':
      return 'red'
    case 'Democrat':
      return 'blue'
    default:
      return 'grey'
  }
}


const PartyAffiliationModal = ({ visible, onCancel, mapData, setMapPoints }) => {
  const [selectedColumn, setSelectedColumn] = useState(null)
  const [partyCounts, setPartyCounts] = useState([])

  useEffect(() => {
    if (!selectedColumn || !mapData) {
      setPartyCounts([])
      return
    }

    const columnLetter = selectedColumn.match(/\(([^)]+)\)/)[1]
    const columnIndex = mapData.columns.indexOf(selectedColumn)

    if (columnIndex === -1) {
      message.error('Selected column does not exist in data.')
      return
    }

    const columnData = mapData.data[columnLetter]
    const counts = columnData.reduce((acc, party) => {
      if (party) {
        acc[party] = (acc[party] || 0) + 1
      }
      return acc
    }, {})

    setPartyCounts(Object.entries(counts).map(([party, count]) => ({ party, count })))
  }, [selectedColumn, mapData])

  const onConfirmSelection = () => {
    // Extract the selected column's letter from the state
    const selectedColumnLetter = selectedColumn.match(/\(([^)]+)\)/)[1]

    // Validate that the selected column exists in the data
    if (!mapData.data[selectedColumnLetter]) {
      message.error('No data available for the selected column.')
      onCancel()
      return
    }

    // Assuming mapData.data['K'] and mapData.data['L'] are arrays with latitude and longitude values.
    const latColumn = 'K' // Replace with actual latitude column letter
    const lngColumn = 'L' // Replace with actual longitude column letter

    // Validate that the latitude and longitude arrays exist and have the correct lengths
    if (!Array.isArray(mapData.data[latColumn]) || !Array.isArray(mapData.data[lngColumn]) || mapData.data[latColumn].length !== mapData.data[selectedColumnLetter].length) {
      message.error('Latitude and longitude data are not properly aligned with party data.')
      onCancel()
      return
    }

    // Create a new array of map points with colors based on party affiliation
    const updatedMapPoints = mapData.data[latColumn].map((lat, index) => {
      const lng = mapData.data[lngColumn][index]
      const party = mapData.data[selectedColumnLetter][index]
      return {
        lat,
        lng,
        name: lat + ', ' + lng, // or any other identifier you use for the name
        color: assignPartyColor(party),
      }
    })

    console.log(updatedMapPoints)

    // Update the map points state with the new array
    setMapPoints(updatedMapPoints)
    message.success('Map points updated with party colors.')
    onCancel() // Close the modal
  }


  return (
    <Modal
      title="Select Party Affiliation Column"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Return
        </Button>,
        <Button key="confirm" type="primary" onClick={onConfirmSelection}>
          Confirm
        </Button>,
      ]}
    >
      <Select
        showSearch
        style={{ width: '100%' }}
        placeholder="Select a column"
        optionFilterProp="children"
        onChange={setSelectedColumn}
        filterOption={(input, option) =>
          option.children.toLowerCase().includes(input.toLowerCase())
        }
      >
        {mapData?.columns.map((column, index) => (
          <Select.Option key={index} value={column}>
            {column}
          </Select.Option>
        ))}
      </Select>
      <List
        header={<div>Party Counts</div>}
        bordered
        dataSource={partyCounts}
        renderItem={(item) => (
          <List.Item>
            {item.party}: {item.count}
          </List.Item>
        )}
      />
    </Modal>
  )
}

export default PartyAffiliationModal
