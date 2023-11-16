import { DownOutlined, UpOutlined } from '@ant-design/icons'
import { Button, List, Modal, Select, message } from 'antd'
import React, { useEffect, useState } from 'react'
import './PartyAffiliation.css'

const assignPartyColor = (party) => {
  switch (party) {
    case 'Republican':
      return 'red'
    case 'Democrat':
      return 'blue'
    case null:
      return 'black'
    default:
      return 'grey' // Non-empty strings get 'grey', empty or undefined get 'black'
  }
}

const PartyAffiliationModal = ({ visible, onCancel, mapData, setMapPoints, mapPoints, partyCounts, setPartyCounts, selectedParties }) => {
  const [selectedColumn, setSelectedColumn] = useState(null)
  const [sortDirection, setSortDirection] = useState('descend')

  useEffect(() => {
    // Initially, set all parties as selected when the component mounts or when mapData changes
    if (mapData && selectedColumn && selectedParties.size === 0) {
      const allParties = new Set(mapData.data[selectedColumn.match(/\(([^)]+)\)/)[1]])
      selectedParties = allParties // Assuming selectedParties is a state, you should use a setState function instead
    }

    const newPartyCounts = calculatePartyCounts(mapData, selectedColumn, selectedParties)
    console.log(newPartyCounts)
    setPartyCounts(newPartyCounts)
  }, [selectedColumn, mapData, selectedParties])

  const calculatePartyCounts = (mapData, selectedColumn, selectedParties) => {
    if (!selectedColumn || !mapData) {
      return []
    }

    const columnLetter = selectedColumn.match(/\(([^)]+)\)/)[1]
    const columnIndex = mapData.columns.indexOf(selectedColumn)

    if (columnIndex === -1) {
      console.error('Selected column does not exist in data.')
      return []
    }

    const initialCounts = {
      'Republican': 0,
      'Democrat': 0,
      'Independent': 0,
      'No Data': 0,
    }

    const columnData = mapData.data[columnLetter]
    columnData.forEach((party) => {
      if (selectedParties.has(party) || party === null || party === undefined) {
        const partyKey = party === null || party === undefined ? 'No Data' : party
        initialCounts[partyKey] = (initialCounts[partyKey] || 0) + 1
      }
    })

    const totalCount = Object.values(initialCounts).reduce((sum, count) => sum + count, 0)
    return Object.entries(initialCounts).map(([party, count]) => ({
      party,
      count,
      percentage: (count / totalCount) * 100,
    }))
  }

  const onConfirmSelection = () => {
    const selectedColumnLetter = selectedColumn.match(/\(([^)]+)\)/)[1]

    if (!mapData.data[selectedColumnLetter]) {
      message.error('No data available for the selected column.')
      onCancel()
      return
    }

    const updatedMapPoints = mapPoints.map((point, index) => {
      const party = mapData.data[selectedColumnLetter][index]
      const color = assignPartyColor(party)

      return {
        ...point,
        color: color,
      }
    })

    setMapPoints(updatedMapPoints)
    message.success('Map points updated with party colors.')
    onCancel()
  }

  const onSortChange = () => {
    setSortDirection(sortDirection === 'ascend' ? 'descend' : 'ascend')
  }

  const getSortedPartyCounts = () => {
    return [...partyCounts].sort((a, b) => {
      if (sortDirection === 'ascend') {
        return a.count - b.count
      } else {
        return b.count - a.count
      }
    })
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
        style={{ width: '100%', marginBottom: '1rem' }}
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
        header={
          <div className="sort-header">
            <div className="party-counts-header">
              Party Counts
            </div>
            <div className="sort-indicators" onClick={onSortChange}>
              <UpOutlined className={sortDirection === 'ascend' ? 'active' : ''} />
              <DownOutlined className={sortDirection === 'descend' ? 'active' : ''} />
            </div>
          </div>
        }
        bordered
        dataSource={getSortedPartyCounts()}
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
