import {
  DatabaseOutlined, DeleteOutlined, DownOutlined, EnvironmentOutlined, GlobalOutlined,
  IdcardOutlined, InfoCircleOutlined, UpOutlined,
} from '@ant-design/icons'
import { Alert, Button, Checkbox, Collapse, List, Select, Switch, Tooltip, Upload, message } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import * as XLSX from 'xlsx'
import ExcelColumnSelector from '../modals/ExcelColumnSelector.jsx'
import './ToolPanel.css'
import DemographicDataModal from './modals/DemographicDataModal.jsx'
import PartyAffiliationModal from './modals/PartyAffiliationModal.jsx'
import PrecinctDataModal from './modals/PrecinctDataModal.jsx'
import ElectoralResults from './utils/ElectoralResults.jsx'
import { extractShapes } from './utils/ExtractShapes.jsx'

const { Panel } = Collapse
const { Dragger } = Upload
const { Option } = Select

const partyEmojiMapping = {
  'Republican': '🔴', // Red circle emoji
  'Democrat': '🔵', // Blue circle emoji
  'Independent': '🔘', // White circle emoji for Independent or another suitable emoji
  'No Data': '⚫', // Black circle emoji for no data
}

const ToolPanel = ({ mapData, setMapData, precinctDataState, setPrecinctDataState }) => {
  const {
    mapPoints,
    selectedPoints,
    showPoliticalDots,
    partyCounts,
    selectedParties,
    isShapefileVisible,
  } = mapData

  const {
    shapes,
    electoralFieldMapping,
    electoralFields,
  } = precinctDataState

  const {
    setMapPoints,
    setShowPoliticalDots,
    setPartyCounts,
    setSelectedParties,
    setIsShapefileVisible,
    setVisualizationType,
  } = setMapData

  const {
    setShapes,
    setPrecinctShapes,
    setElectoralFieldMapping,
    setElectoralFields,
    setDemographicSelections,
  } = setPrecinctDataState

  const [partyModalVisible, setPartyModalVisible] = useState(false)
  const [voterDataModalVisible, setVoterDataModalVisible] = useState(null)
  const [voterDataModalFile, setVoterDataModalFile] = useState(null)

  const [voterDataFileList, setVoterDataFileList] = useState([])
  const [districtDataFileList, setDistrictDataFileList] = useState([])

  const [shapefileList, setShapefileList] = useState([])
  const [currentVoterMappingFile, setCurrentVoterMappingFile] = useState(null)

  const [demographicModalVisible, setDemographicModalVisible] = useState(false)
  const [demographicData, setDemographicData] = useState(null)

  const [isPrecinctModalVisible, setIsPrecinctModalVisible] = useState(false)
  const [precinctList, setPrecinctList] = useState([])
  const [precinctData, setPrecinctData] = useState(null)

  const [panelWidth, setPanelWidth] = useState(375)
  const [isDragging, setIsDragging] = useState(false)
  const panelRef = useRef(null)

  const onMouseDown = (e) => {
    setIsDragging(true)
    e.preventDefault()
  }

  const onMouseMove = (e) => {
    if (isDragging && panelRef.current) {
      const newWidth = e.clientX - panelRef.current.getBoundingClientRect().left
      setPanelWidth(newWidth)
    }
  }

  const onMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove)
      window.addEventListener('mouseup', onMouseUp)
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [isDragging])

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

  const iconComponents = {
    voterId: IdcardOutlined,
    distInfo: EnvironmentOutlined,
    shapefile: GlobalOutlined,
    precinct: DatabaseOutlined,
  }

  const genIcons = (iconType) => {
    const IconComponent = iconComponents[iconType]

    return (
      <IconComponent
        onClick={(event) => {
          event.stopPropagation()
        }}
      />
    )
  }

  const handleVoterData = (file) => {
    setVoterDataModalFile(file)
    setVoterDataModalVisible(true)
  }

  const handlePoliticalDotsSwitch = (checked) => {
    if (!currentVoterMappingFile) {
      message.error('No data set!')
      return
    }
    setShowPoliticalDots(checked)
    if (checked && mapPoints.every((point) => point.color === undefined || point.color === null || point.color === 'black')) {
      setPartyModalVisible(true)
    }
  }

  // removeFile edited on 12/21 to be more dynamic
  const fileLists = {
    voterDataFileList: [voterDataFileList, setVoterDataFileList],
    districtDataFileList: [districtDataFileList, setDistrictDataFileList],
    shapefileList: [shapefileList, setShapefileList],
    precinctList: [precinctList, setPrecinctList],
  }

  const removeFile = (fileName, listType) => {
    const [list, setList] = fileLists[listType] || []
    if (list && setList) {
      const newFileList = list.filter((file) => file.name !== fileName)
      setList(newFileList)
    } else {
      console.error(`Invalid listType: ${listType}`)
    }
  }

  // right now is very simple and essentially outputs the points as they are plotted on the map... that is with very limited information besides party and
  // the labelling (and obviously lat and long coordinates)
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(selectedPoints)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'SelectedPoints')
    XLSX.writeFile(wb, 'selectedPoints.xlsx')
  }

  useEffect(() => {
    if (mapPoints.length === 0 && partyCounts.length === 0) {
      setCurrentVoterMappingFile(null)
      setElectoralFieldMapping(undefined)
      setElectoralFields(undefined)
    }
  }, [mapPoints, currentVoterMappingFile, partyCounts])


  const handleDemographicDataImport = (file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result)
      const workbook = XLSX.read(data, { type: 'array' })
      const worksheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[worksheetName]
      const json = XLSX.utils.sheet_to_json(worksheet)
      setDemographicData(json)
      setDemographicModalVisible(true)
    }
    reader.readAsArrayBuffer(file)
  }
  const renderImportTooltip = (tooltipCode) => {
    let tooltipText
    switch (tooltipCode) {
      case 1:
        tooltipText = 'Upload a .csv or Excel file with voter data.'
        break
      case 2:
        tooltipText = 'Upload a .csv or Excel file with district information.'
        break
      case 3:
        tooltipText = 'Upload a .zip file containing shapefiles.'
        break
      case 4:
        tooltipText = 'Upload a .zip file containing precinct results.'
        break
      default:
        tooltipText = 'No tooltip available.'
    }

    return (
      <Tooltip
        title={<span style={{ fontWeight: 600, color: 'white' }}>{tooltipText}</span>}
        color="#0052cc"
      >
        <InfoCircleOutlined style={{ marginLeft: 8 }} />
      </Tooltip>
    )
  }

  return (
    <div className="tool-panel" ref={panelRef} style={{ width: `${panelWidth}px` }} >
      <div
        onMouseDown={onMouseDown}
        style={{
          width: '10px',
          cursor: 'ew-resize',
          height: '100%',
          position: 'absolute',
          right: '0',
          top: '0',
        }}
      />
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
          <Panel header={<span>Voter Data Import {renderImportTooltip(1)}</span>} key="1" extra={genIcons('voterId')}>
            <div className="upload-container">
              <Dragger
                accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.csv"
                beforeUpload={(file) => {
                  if (!/\.(xlsx|xls|csv)$/i.test(file.name)) {
                    message.error('Uploaded file is not an Excel file', 3)
                    return Upload.LIST_IGNORE
                  }
                  if (voterDataFileList.find((f) => f.name === file.name)) {
                    message.error('This file has already been uploaded.', 3)
                    return Upload.LIST_IGNORE
                  }
                  const newFileList = [...voterDataFileList, file]
                  setVoterDataFileList(newFileList)
                  handleVoterData(file)
                  return false
                }}
                multiple={false}
                showUploadList={false}
              >
                <p className="ant-upload-drag-icon">
                  <IdcardOutlined />
                </p>
                <p className="upload-text">Drag in Excel File</p>
                <p className="upload-text">or</p>
                <p className="upload-text">Click to Browse Files</p>
              </Dragger>
              <div className="file-list">
                {voterDataFileList.map((file, index) => (
                  <div key={index} className="file-item">
                    <span onClick={() => handleVoterData(file)}>
                      {file.name}
                    </span>
                    <DeleteOutlined onClick={() => removeFile(file.name, 'voterDataFileList')} className="file-delete-icon" />
                  </div>
                ))}
              </div>
            </div>
          </Panel>

          <Panel header={<span>District Info Import {renderImportTooltip(2)}</span>} key="2" extra={genIcons('distInfo')}>
            <div className="upload-container">
              <Dragger
                accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.csv"
                beforeUpload={(file) => {
                  if (!/\.(xlsx|xls|csv)$/i.test(file.name)) {
                    message.error('Uploaded file is not an Excel file', 3)
                    return Upload.LIST_IGNORE
                  }
                  if (districtDataFileList.find((f) => f.name === file.name)) {
                    message.error('This file has already been uploaded.', 3)
                    return Upload.LIST_IGNORE
                  }
                  if (shapefileList.length === 0) {
                    message.error('No Districts have been uploaded yet!', 3)
                    return Upload.LIST_IGNORE
                  }

                  const newFileList = [...districtDataFileList, file]
                  setDistrictDataFileList(newFileList)

                  handleDemographicDataImport(file)
                  return false
                }}
                multiple={false}
                showUploadList={false}
              >
                <p className="ant-upload-drag-icon">
                  <EnvironmentOutlined />
                </p>
                <p className="upload-text">Drag in Excel File</p>
                <p className="upload-text">or</p>
                <p className="upload-text">Click to Browse Files</p>
              </Dragger>
              <div className="file-list">
                {districtDataFileList.map((file, index) => (
                  <div key={index} className="file-item">
                    <span onClick={() => {
                      if (shapefileList.length === 0) {
                        message.error('No Districts have been uploaded yet!', 3)
                        return
                      }
                      handleDemographicDataImport(file)
                    }}>
                      {file.name}
                    </span>
                    <DeleteOutlined onClick={() => removeFile(file.name, 'districtDataFileList')} className="file-delete-icon" />
                  </div>
                ))}
              </div>
            </div>
          </Panel>

          <Panel header={<span>Shapefile Import {renderImportTooltip(3)}</span>} key="3" extra={genIcons('shapefile')}>
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

          <Panel header={<span>Precinct Data Import {renderImportTooltip(4)}</span>} key="4" extra={genIcons('precinct')}>
            <div className="upload-container">
              <Dragger
                accept=".zip"
                beforeUpload={async (file) => {
                  if (!/\.(zip)$/i.test(file.name)) {
                    message.error('Uploaded File is not a ZIP archive', 3)
                    return Upload.LIST_IGNORE
                  }
                  const shapesData = await extractShapes([file])
                  setPrecinctList([...precinctList, file])
                  setPrecinctData(shapesData)
                  setIsPrecinctModalVisible(true)
                  setPrecinctShapes(shapesData)
                  return false
                }}
                multiple={false}
                showUploadList={false}
              >
                <p className="ant-upload-drag-icon">
                  <DatabaseOutlined />
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

                      setPrecinctData(shapesData)
                      setIsPrecinctModalVisible(true)
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

      <DemographicDataModal
        visible={demographicModalVisible}
        onCancel={() => setDemographicModalVisible(false)}
        demographicData={demographicData}
        setDemographicSelections={setDemographicSelections}
        shapeData={shapes}
      />

      <PartyAffiliationModal
        visible={partyModalVisible}
        onCancel={() => setPartyModalVisible(false)}
        mapData={currentVoterMappingFile}
        setMapPoints={setMapPoints}
        mapPoints={mapPoints}
        partyCounts={partyCounts}
        setPartyCounts={setPartyCounts}
        selectedParties={selectedParties}
      />

      <ExcelColumnSelector
        visible={voterDataModalVisible}
        onCancel={() => setVoterDataModalVisible(false)}
        droppedFile={voterDataModalFile}
        setMapPoints={setMapPoints}
        setCurrentMapFile={setCurrentVoterMappingFile}
      />

      <PrecinctDataModal
        visible={isPrecinctModalVisible}
        precinctData={precinctData}
        onCancel={() => setIsPrecinctModalVisible(false)}
        setElectoralDataFields={setElectoralFields}
        setElectoralFieldMapping={setElectoralFieldMapping}
      />
    </div>
  )
}

export default ToolPanel
