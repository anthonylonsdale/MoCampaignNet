import { DatabaseOutlined, DeleteOutlined, EditOutlined, EnvironmentOutlined, EyeInvisibleOutlined, EyeOutlined, GlobalOutlined, IdcardOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { Button, Collapse, List, Popconfirm, Tooltip, Upload, message } from 'antd'
import React, { useEffect, useState } from 'react'
import styles from './KnockingToolPanel.module.css'
import ExcelDataPlotModal from './modals/ExcelDataPlotModal.jsx'

const { Panel } = Collapse
const { Dragger } = Upload


const DoorknockingToolPanel = ({ knockingData, setKnockingData, fileData, setFileData, featureGroupRef }) => {
  const { drawnShape, selectedShapeForEditing } = knockingData
  const { setKnockingPoints, setSelectedShapeForEditing } = setKnockingData
  const { voterDataFiles } = fileData
  const { handleAddVoterDataFile, handleRemoveVoterDataFile } = setFileData

  const [voterDataModalVisible, setVoterDataModalVisible] = useState(false)
  const [currentVoterDataFile, setCurrentVoterDataFile] = useState(null)
  const [drawnShapeList, setDrawnShapeList] = useState([])

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

  useEffect(() => {
    if (drawnShape) {
      if (!drawnShapeList.some((shape) => shape.id === drawnShape.id)) {
        setDrawnShapeList((prevShapes) => [...prevShapes, drawnShape])
      }
    }
  }, [drawnShape])

  const confirmDelete = (shapeId) => {
    const shapeToDelete = drawnShapeList.find((s) => s.id === shapeId)
    if (shapeToDelete && featureGroupRef.current) {
      featureGroupRef.current.removeLayer(shapeToDelete.layer)
    }
    setDrawnShapeList((prevShapes) => prevShapes.filter((s) => s.id !== shapeId))
  }

  const startEditingShape = (shapeId) => {
    const shapeToEdit = drawnShapeList.find((s) => s.id === shapeId)
    if (shapeToEdit) {
      setSelectedShapeForEditing(shapeToEdit)
    }
  }

  const stopEditingShape = (shapeId) => {
    setSelectedShapeForEditing(null)

    const shapeToStopEditing = drawnShapeList.find((s) => s.id === shapeId)
    if (shapeToStopEditing && shapeToStopEditing.layer) {
      shapeToStopEditing.layer.editing.disable()
    }
  }

  const toggleVisibility = (shapeId) => {
    setDrawnShapeList((prevShapes) => {
      const shapeIndex = prevShapes.findIndex((shape) => shape.id === shapeId)
      if (shapeIndex === -1) return prevShapes

      const newShapes = [...prevShapes]
      const shapeToToggle = newShapes[shapeIndex]
      shapeToToggle.visible = !shapeToToggle.visible

      if (shapeToToggle.visible) {
        featureGroupRef.current.addLayer(shapeToToggle.layer)
      } else {
        featureGroupRef.current.removeLayer(shapeToToggle.layer)
      }

      return newShapes
    })
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
      <div className={styles.sectionContainer}>
        <h3>SHAPES</h3>
        <List
          itemLayout="horizontal"
          dataSource={drawnShapeList}
          renderItem={(shape) => (
            <List.Item key={shape.id}>
              <List.Item.Meta
                title={shape.name}
                description={`ID: ${shape.id}`}
              />
              <div className={styles.actionContainer}>
                {shape.visible ? (
                  <EyeOutlined onClick={() => toggleVisibility(shape.id)} />
                ) : (
                  <EyeInvisibleOutlined onClick={() => toggleVisibility(shape.id)} />
                )}
                <span className={styles.iconSeparator}></span>
                <EditOutlined onClick={() => startEditingShape(shape.id)} />
                <span className={styles.iconSeparator}></span>
                <Popconfirm
                  title="Are you sure you want to delete this shape?"
                  onConfirm={() => confirmDelete(shape.id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <DeleteOutlined />
                </Popconfirm>
                {selectedShapeForEditing && selectedShapeForEditing.id === shape.id && (
                  <>
                    <span className={styles.iconSeparator}></span>
                    <Button type="primary" size="small" onClick={() => stopEditingShape(shape.id)}>Apply</Button>
                  </>
                )}
              </div>
            </List.Item>
          )}
        />
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
