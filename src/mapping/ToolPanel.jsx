import { DeleteOutlined, DownOutlined, GlobalOutlined, InboxOutlined, SafetyCertificateOutlined, UpOutlined } from '@ant-design/icons'
import { Alert, Button, Checkbox, Collapse, List, Select, Switch, Upload, message } from 'antd'
import React, { useState } from 'react'
import * as XLSX from 'xlsx'
import ExcelColumnSelector from '../modals/ExcelColumnSelector.jsx'
import './ToolPanel.css'
import PrecinctDataModal from './modals/PrecinctDataModal.jsx'
import ElectoralResults from './utils/ElectoralResults.jsx'
import { extractShapes } from './utils/ExtractShapes.jsx'
import PartyAffiliationModal from './utils/PartyAffiliationModal.jsx'


const { Panel } = Collapse
const { Dragger } = Upload
const { Option } = Select

const partyEmojiMapping = {
  'Republican': '🔴', // Red circle emoji
  'Democrat': '🔵', // Blue circle emoji
  'Independent': '🔘', // White circle emoji for Independent or another suitable emoji
  'No Data': '⚫', // Black circle emoji for no data
}

const ToolPanel = ({
  setMapPoints,
  setShapes,
  selectedPoints,
  mapPoints,
  showPoliticalDots,
  setShowPoliticalDots,
  partyCounts,
  setPartyCounts,
  setSelectedParties,
  selectedParties,
  setIsShapefileVisible,
  isShapefileVisible,
  setVisualizationType,
  setPrecinctShapes,
  electoralFieldMapping,
  setElectoralFieldMapping,
  electoralFields,
  setElectoralFields,
}) => {
  const [excelModalVisible, setExcelModalVisible] = useState(false)
  const [partyModalVisible, setPartyModalVisible] = useState(false)
  const [droppedFile, setDroppedFile] = useState(null)
  const [fileList, setFileList] = useState([])
  const [shapefileList, setShapefileList] = useState([])
  const [currentMapFile, setCurrentMapFile] = useState(null)

  const [isPrecinctModalVisible, setIsPrecinctModalVisible] = useState(false)
  const [precinctList, setPrecinctList] = useState([])
  const [precinctData, setPrecinctData] = useState(null)

  const togglePartySelection = (party, isChecked) => {
    setSelectedParties((prevSelectedParties) => {
      const newSelectedParties = new Set(prevSelectedParties)
      if (isChecked) {
        newSelectedParties.add(party)
      } else {
        newSelectedParties.delete(party)
      }
      return newSelectedParties
    })
  }

  const genExtra = (iconType) => {
    let IconComponent
    if (iconType === 'globe') {
      IconComponent = GlobalOutlined
    } else if (iconType === 'inbox') {
      IconComponent = InboxOutlined
    } else if (iconType === 'precinct') {
      IconComponent = SafetyCertificateOutlined
    }

    return (
      <IconComponent
        onClick={(event) => {
          event.stopPropagation()
        }}
      />
    )
  }

  const handleFileClick = (file) => {
    setDroppedFile(file)
    setExcelModalVisible(true)
  }

  const handlePoliticalDotsSwitch = (checked) => {
    if (!currentMapFile) {
      message.error('No data set!')
      return
    }

    setShowPoliticalDots(checked)
    if (checked && mapPoints.every((point) => point.color === undefined || point.color === null || point.color === 'black')) {
      setPartyModalVisible(true)
    }
  }

  const removeFile = (fileName, listType) => {
    if (listType === 'fileList') {
      const newFileList = fileList.filter((file) => file.name !== fileName)
      setFileList(newFileList)
    } else if (listType === 'shapefileList') {
      const newShapefileList = shapefileList.filter((file) => file.name !== fileName)
      setShapefileList(newShapefileList)
    } else if (listType === 'precinctList') {
      const newPrecinctList = precinctList.filter((file) => file.name !== fileName)
      setPrecinctList(newPrecinctList)
    }
  }

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(selectedPoints)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'SelectedPoints')
    XLSX.writeFile(wb, 'selectedPoints.xlsx')
  }

  return (
    <div className="tool-panel">
      <div className="section-container">
        <h3>EXPORT</h3>
        <span className="map-point-count">{mapPoints.length} points are on the map.</span>
        <div className="export-content">
          <span>{selectedPoints.length} points have been selected.</span>
          <Button type="primary" onClick={() => exportToExcel(selectedPoints)} disabled={selectedPoints.length === 0}>
            Export Now
          </Button>
        </div>
      </div>

      <div className="section-container">
        <h3>DATA ENTRY</h3>
        <Collapse expandIconPosition="right">
          <Panel header="Excel Data Import" key="1" extra={genExtra('inbox')}>
            <div className="upload-container">
              <Dragger
                accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.csv"
                beforeUpload={(file) => {
                  if (!/\.(xlsx|xls|csv)$/i.test(file.name)) {
                    message.error('Uploaded file is not an Excel file', 3)
                    return Upload.LIST_IGNORE
                  }
                  if (fileList.find((f) => f.name === file.name)) {
                    message.error('This file has already been uploaded.', 3)
                    return Upload.LIST_IGNORE
                  }
                  const newFileList = [...fileList, file]
                  setFileList(newFileList)
                  handleFileClick(file)
                  return false
                }}
                multiple={false}
                showUploadList={false}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="upload-text">Drag in Excel File</p>
                <p className="upload-text">or</p>
                <p className="upload-text">Click to Browse Files</p>
              </Dragger>
              <div className="file-list">
                {fileList.map((file, index) => (
                  <div key={index} className="file-item">
                    <span onClick={() => handleFileClick(file)}>
                      {file.name}
                    </span>
                    <DeleteOutlined onClick={() => removeFile(file.name, 'fileList')} className="file-delete-icon" />
                  </div>
                ))}
              </div>
            </div>
          </Panel>

          <Panel header="Shapefile Import" key="2" extra={genExtra('globe')}>
            <div className="upload-container">
              <Dragger
                accept=".zip"
                beforeUpload={async (file) => {
                  if (!/\.(zip)$/i.test(file.name)) {
                    message.error('Uploaded File is not a ZIP archive', 3)
                    return Upload.LIST_IGNORE
                  }
                  const shapesData = await extractShapes([file])
                  setShapes(shapesData)
                  setShapefileList([...shapefileList, file])
                  return false
                }}
                multiple={false}
                showUploadList={false}
              >
                <p className="ant-upload-drag-icon">
                  <GlobalOutlined />
                </p>
                <p className="upload-text">Drag in Shapefile</p>
                <p className="upload-text">or</p>
                <p className="upload-text">Click to Browse Files</p>
              </Dragger>
              <div className="file-list">
                {shapefileList.map((file, index) => (
                  <div key={index} className="file-item">
                    <span onClick={async () => {
                      const shapesData = await extractShapes([file])
                      setShapes(shapesData)
                    }}>
                      {file.name}
                    </span>
                    <DeleteOutlined onClick={() => removeFile(file.name, 'shapefileList')} className="file-delete-icon" />
                  </div>
                ))}
              </div>
            </div>
          </Panel>
          <Panel header="Precinct Data Import" key="3">
            <div className="upload-container">
              <Dragger
                accept=".zip"
                beforeUpload={async (file) => {
                  if (!/\.(zip)$/i.test(file.name)) {
                    message.error('Uploaded File is not a ZIP archive', 3)
                    return Upload.LIST_IGNORE
                  }
                  const shapesData = await extractShapes([file])
                  setPrecinctShapes(shapesData)
                  setPrecinctList([...precinctList, file])

                  setPrecinctData(shapesData)
                  setIsPrecinctModalVisible(true)
                  return false
                }}
                multiple={false}
                showUploadList={false}
              >
                <p className="ant-upload-drag-icon">
                  <SafetyCertificateOutlined />
                </p>
                <p className="upload-text">Drag in Precinct Results</p>
                <p className="upload-text">or</p>
                <p className="upload-text">Click to Browse Files</p>
              </Dragger>
              <div className="file-list">
                {precinctList.map((file, index) => (
                  <div key={index} className="file-item">
                    <span onClick={async () => {
                      const shapesData = await extractShapes([file])
                      setPrecinctShapes(shapesData)
                    }}>
                      {file.name}
                    </span>
                    <DeleteOutlined onClick={() => removeFile(file.name, 'precinctList')} className="file-delete-icon" />
                  </div>
                ))}
              </div>
            </div>
          </Panel>
        </Collapse>
      </div>

      <div className="section-container">
        <h3>ELECTORAL RESULTS</h3>
        <ElectoralResults electoralFields={electoralFields} mapping={electoralFieldMapping} precinctData={precinctData} />
      </div>

      <div className="section-container">
        <h3>VISUALIZE</h3>
        <Collapse
          bordered={false}
          expandIcon={({ isActive }) => isActive ? <UpOutlined /> : <DownOutlined />}
          className="party-breakdown-panel"
        >
          <Panel
            header={<span className="tool-icon">🔴 Show Political Parties</span>}
            key="1"
            extra={<Switch checked={showPoliticalDots} onChange={handlePoliticalDotsSwitch} />}
          >
            <List
              dataSource={partyCounts}
              renderItem={(item) => (
                <List.Item key={item.party}>
                  <Checkbox
                    checked={selectedParties.has(item.party)}
                    onChange={(e) => togglePartySelection(item.party, e.target.checked)}
                    style={{ marginRight: '.5rem' }}
                  />
                  <span>{partyEmojiMapping[item.party]}</span>
                  <div className="party-data-name">{item.party}</div>
                  <div className="party-data-count">{item.count.toLocaleString()}</div>
                  <div className="party-data-percentage">{item.percentage.toFixed(2)}%</div>
                </List.Item>
              )}
            />
          </Panel>
          <Panel
            header={<span className="tool-icon">🔵 Shapefile Areas Visible</span>}
            key="2"
            extra={<Switch checked={isShapefileVisible} onChange={(e) => setIsShapefileVisible(e)} />}
          >
            <Alert
              message="Click on a shapefile in the 'Data Entry' panel to change what is shown on the map."
              type="info"
              showIcon
            />
          </Panel>
          <Panel
            header={<span className="tool-icon">🌐 Visualization Type</span>}
            key="3"
          >
            <Select defaultValue="points" style={{ width: '100%' }} onChange={(e) => setVisualizationType(e)}>
              <Option value="points">Points</Option>
              <Option value="clusters">Clusters</Option>
              <Option value="heatmap">Heatmap</Option>
            </Select>
          </Panel>
          <Panel
            header={<span className="tool-icon">🌟 Feature Insights (Placeholder)</span>}
            key="4"
          >
            <div className="feature-insights-content">
              <p>Top Insight: The number of independent voters has increased by 10% since the last period, indicating a shift in voter sentiment.</p>
              <p>Trend to Watch: Urban areas are showing a 5% higher growth rate in data points collected compared to rural areas.</p>
              <p>Anomaly Alert: An unexpected cluster of data points has been detected in the northwestern region, suggesting a potential data entry error or a significant new development.</p>
            </div>
          </Panel>
        </Collapse>
      </div>

      <PartyAffiliationModal
        visible={partyModalVisible}
        onCancel={() => setPartyModalVisible(false)}
        mapData={currentMapFile}
        setMapPoints={setMapPoints}
        mapPoints={mapPoints}
        partyCounts={partyCounts}
        setPartyCounts={setPartyCounts}
        selectedParties={selectedParties}
      />

      <ExcelColumnSelector
        visible={excelModalVisible}
        onCancel={() => setExcelModalVisible(false)}
        droppedFile={droppedFile}
        setMapPoints={setMapPoints}
        setCurrentMapFile={setCurrentMapFile}
      />

      <PrecinctDataModal
        visible={isPrecinctModalVisible}
        precinctData={precinctData}
        onConfirm={() => setIsPrecinctModalVisible(false)}
        onCancel={() => setIsPrecinctModalVisible(false)}
        setElectoralDataFields={setElectoralFields}
        setElectoralFieldMapping={setElectoralFieldMapping}
      />
    </div>
  )
}

export default ToolPanel
