import { DeleteOutlined, GlobalOutlined, InboxOutlined } from '@ant-design/icons'
import { Collapse, Select, Switch, Upload, message } from 'antd'
import React, { useState } from 'react'
import ExcelColumnSelector from '../modals/ExcelColumnSelector.jsx'
import './ToolPanel.css'
import { extractShapes } from './utils/ExtractShapes.jsx'


const { Panel } = Collapse
const { Dragger } = Upload

// Sample handler functions
const handleToggleLayer = (checked) => {
  console.log('Layer visibility toggled:', checked)
  // Add your layer toggle logic here
}

const handleVisualizationChange = (value) => {
  console.log('Visualization option selected:', value)
  // Update visualization based on the selected option
}

const ToolPanel = ({ setMapPoints, setShapes }) => {
  const [excelModalVisible, setExcelModalVisible] = useState(false)
  const [droppedFile, setDroppedFile] = useState(null)
  const [fileList, setFileList] = useState([])
  const [shapefileList, setShapefileList] = useState([])

  const genExtra = (iconType) => {
    let IconComponent = InboxOutlined
    if (iconType === 'globe') {
      IconComponent = GlobalOutlined
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

  const removeFile = (fileName, listType) => {
    if (listType === 'fileList') {
      const newFileList = fileList.filter((file) => file.name !== fileName)
      setFileList(newFileList)
    } else if (listType === 'shapefileList') {
      const newShapefileList = shapefileList.filter((file) => file.name !== fileName)
      setShapefileList(newShapefileList)
    }
  }

  return (
    <div className="tool-panel">
      <h3>DATA ENTRY</h3>
      <Collapse expandIconPosition="right">
        <Panel header="Excel Data Import" key="1" extra={genExtra('inbox')}>
          <div className="upload-container">
            <Dragger
              beforeUpload={(file) => {
                if (!/\.(xlsx|xls|csv)$/i.test(file.name)) {
                  message.error('File is not in Excel format', 3)
                  return Upload.LIST_IGNORE
                }
                if (fileList.find((f) => f.name === file.name)) {
                  message.error('This file has already been uploaded.', 3)
                  return Upload.LIST_IGNORE
                }
                const newFileList = [...fileList, file]
                setFileList(newFileList)
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
                  <DeleteOutlined onClick={() => removeFile(fileName, 'fileList')} className="file-delete-icon" />
                </div>
              ))}
            </div>
          </div>
        </Panel>

        <Panel header="Shapefile Import" key="2" extra={genExtra('globe')}>
          <div className="upload-container">
            <Dragger
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
                  <span>
                    {file.name}
                  </span>
                  <DeleteOutlined onClick={() => removeFile(file.name, 'shapefileList')} className="file-delete-icon" />
                </div>
              ))}
            </div>
          </div>
        </Panel>
      </Collapse>

      <h3>VISUALIZE</h3>
      <ul>
        <li>
          <span className="tool-icon">🔴</span>
          Dots on Political Party
        </li>
        <li>
          <span className="tool-icon">🔵</span>
          <Switch onChange={handleToggleLayer} /> Areas are Hidden
        </li>
        <li>
          <span className="tool-icon">🌐</span>
          <Select defaultValue="heatmap" style={{ width: 120 }} onChange={handleVisualizationChange}>
            <Select.Option value="heatmap">Heatmap</Select.Option>
            <Select.Option value="clusters">Clusters</Select.Option>
            <Select.Option value="density">Density</Select.Option>
          </Select>
        </li>
      </ul>
      <ExcelColumnSelector
        visible={excelModalVisible}
        onCancel={() => setExcelModalVisible(false)}
        droppedFile={droppedFile}
        setMapPoints={setMapPoints}
      />
    </div>
  )
}

export default ToolPanel
