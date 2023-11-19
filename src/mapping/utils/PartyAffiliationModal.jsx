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
    case 'Independent':
      return 'grey'
    case 'No Data':
      return 'black'
    default:
      return 'black'
  }
}

const PartyAffiliationModal = ({
  visible,
  onCancel,
  mapData,
  setMapPoints,
  mapPoints,
  partyCounts,
  setPartyCounts,
}) => {
  const [selectedColumn, setSelectedColumn] = useState(null)
  const [sortDirection, setSortDirection] = useState('descend')
  const [partyMappings, setPartyMappings] = useState({})

  useEffect(() => {
    console.log(mapData)
    if (mapData && selectedColumn) {
      const columnLetter = selectedColumn.match(/\(([^)]+)\)/)[1]
      const uniqueValues = new Set(mapData.data[columnLetter])
      const mappings = {}
      uniqueValues.forEach((value) => {
        mappings[value] = 'No Data'
      })
      console.log(mappings)
      setPartyMappings(mappings)
    }
  }, [selectedColumn, mapData])

  useEffect(() => {
    const newPartyCounts = calculatePartyCounts()
    console.log(newPartyCounts)
    setPartyCounts(newPartyCounts)
  }, [partyMappings])

  const calculatePartyCounts = () => {
    if (!selectedColumn || !mapData || !partyMappings) {
      return []
    }

    const columnLetter = selectedColumn.match(/\(([^)]+)\)/)[1]
    const partyCountStructure = {
      'Republican': 0,
      'Democrat': 0,
      'Independent': 0,
      'No Data': 0,
    }

    const counts = { ...partyCountStructure }

    mapData.data[columnLetter].forEach((rawValue) => {
      // Use the mapping to increase the count for the corresponding party
      const party = partyMappings[rawValue]
      if (party && counts.hasOwnProperty(party)) {
        counts[party]++
      } else {
        // If the value is not mapped, count it as 'No Data'
        counts['No Data']++
      }
    })

    // Convert the counts to an array suitable for the dataSource of the List component
    return Object.keys(partyCountStructure).map((party) => ({
      party: party,
      count: counts[party],
      percentage: (counts[party] / Object.values(counts).reduce((a, b) => a + b, 0)) * 100,
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
      const rawValue = mapData.data[selectedColumnLetter][index]
      const mappedParty = partyMappings[rawValue] || 'No Data'
      const color = assignPartyColor(mappedParty)

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
      {selectedColumn && Object.keys(partyMappings).length > 0 && (
        <div>
          {Object.keys(partyMappings).map((value) => (
            <div key={value}>
              <span>{value} maps to:</span>
              <Select defaultValue={partyMappings[value]} style={{ width: 120 }} onChange={(party) => setPartyMappings({ ...partyMappings, [value]: party })}>
                <Select.Option value="Republican">Republican</Select.Option>
                <Select.Option value="Democrat">Democrat</Select.Option>
                <Select.Option value="Independent">Independent</Select.Option>
                <Select.Option value="No Data">No Data</Select.Option>
              </Select>
            </div>
          ))}
        </div>
      )}
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
