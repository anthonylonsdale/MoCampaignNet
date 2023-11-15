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

const PartyAffiliationModal = ({ visible, onCancel, mapData, setMapPoints, mapPoints, partyCounts, setPartyCounts }) => {
  const [selectedColumn, setSelectedColumn] = useState(null)
  const [sortDirection, setSortDirection] = useState('descend')

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
      const partyKey = party === null || party === undefined ? 'No Data' : party
      acc[partyKey] = (acc[partyKey] || 0) + 1
      return acc
    }, {})

    const totalCount = Object.values(counts).reduce((sum, count) => sum + count, 0)

    setPartyCounts(Object.entries(counts).map(([party, count]) => ({
      party,
      count,
      percentage: (count / totalCount) * 100,
    })))
  }, [selectedColumn, mapData])

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

  console.log(partyCounts)

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
