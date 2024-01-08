import { DatabaseOutlined, DeleteOutlined, EnvironmentOutlined, GlobalOutlined, IdcardOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { Collapse, Tooltip, Upload, message } from 'antd'
import React, { useState } from 'react'
import ExcelColumnSelector from '../modals/ExcelColumnSelector.jsx'
import './KnockingToolPanel.css'
import useKnockingData from './hooks/useKnockingDataHook.jsx'
import useKnockingFileData from './hooks/useKnockingFileDataHook.jsx'

const { Panel } = Collapse
const { Dragger } = Upload

const DoorknockingToolPanel = ({ }) => {
  const {
    setKnockingPoints,
  } = useKnockingData()

  const {
    voterDataFiles,
    handleAddVoterDataFile,
    handleRemoveVoterDataFile,
  } = useKnockingFileData()

  const [voterDataModalVisible, setVoterDataModalVisible] = useState(false)
  const [currentVoterDataFile, setCurrentVoterDataFile] = useState(null)

  const handleVoterData = (file) => {
    setCurrentVoterDataFile(file)
    setVoterDataModalVisible(true)
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

  const iconComponents = {
    voterId: IdcardOutlined,
    distInfo: EnvironmentOutlined,
    shapefile: GlobalOutlined,
    precinct: DatabaseOutlined,
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
    <div className="knocking-panel">
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
                  if (voterDataFiles.find((f) => f.name === file.name)) {
                    message.error('This file has already been uploaded.', 3)
                    return Upload.LIST_IGNORE
                  }
                  handleAddVoterDataFile(file)
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
                {voterDataFiles.map((file, index) => (
                  <div key={index} className="file-item">
                    <span onClick={() => handleVoterData(file)}>
                      {file.name}
                    </span>
                    <DeleteOutlined onClick={() => handleRemoveVoterDataFile(file)} className="file-delete-icon" />
                  </div>
                ))}
              </div>
            </div>
          </Panel>
        </Collapse>
      </div>

      <ExcelColumnSelector
        visible={voterDataModalVisible}
        onCancel={() => setVoterDataModalVisible(false)}
        droppedFile={currentVoterDataFile}
        setMapPoints={setKnockingPoints}
      />
    </div>
  )
}

export default DoorknockingToolPanel
