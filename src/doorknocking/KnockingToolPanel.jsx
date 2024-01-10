import { DatabaseOutlined, DeleteOutlined, EnvironmentOutlined, GlobalOutlined, IdcardOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { Collapse, Tooltip, Upload, message } from 'antd'
import React, { useState } from 'react'
import styles from './KnockingToolPanel.module.css'
import ExcelDataPlotModal from './modals/ExcelDataPlotModal.jsx'

const { Panel } = Collapse
const { Dragger } = Upload


const DoorknockingToolPanel = ({ setKnockingData, fileData, setFileData }) => {
  const { setKnockingPoints } = setKnockingData
  const { voterDataFiles } = fileData
  const { handleAddVoterDataFile, handleRemoveVoterDataFile } = setFileData

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
        <InfoCircleOutlined style={{ marginLeft: '1rem' }} />
      </Tooltip>
    )
  }

  return (
    <div className={styles.knockingPanel}>
      <div className={styles.sectionContainer}>
        <h3>DATA ENTRY</h3>
        <Collapse expandIconPosition="right">
          <Panel header={<span>Voter Data Import {renderImportTooltip(1)}</span>} key="1" extra={genIcons('voterId')}>
            <div className={styles.uploadContainer}>
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
                <p className={styles.uploadText}>Drag in Excel File</p>
                <p className={styles.uploadText}>or</p>
                <p className={styles.uploadText}>Click to Browse Files</p>
              </Dragger>
              <div className={styles.fileList}>
                {voterDataFiles.map((file, index) => (
                  <div key={index} className={styles.fileItem}>
                    <span onClick={() => handleVoterData(file)}>
                      {file.name}
                    </span>
                    <DeleteOutlined onClick={() => handleRemoveVoterDataFile(file.name)} className={styles.fileDeleteIcon} />
                  </div>
                ))}
              </div>
            </div>
          </Panel>
        </Collapse>
      </div>

      <ExcelDataPlotModal
        visible={voterDataModalVisible}
        onCancel={() => setVoterDataModalVisible(false)}
        droppedFile={currentVoterDataFile}
        setKnockingPoints={setKnockingPoints} // Passed correctly here
      />
    </div>
  )
}

export default DoorknockingToolPanel
