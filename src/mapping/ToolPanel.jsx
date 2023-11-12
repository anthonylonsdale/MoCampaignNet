import { InboxOutlined } from '@ant-design/icons'
import { Collapse, Select, Switch, Upload, message } from 'antd'
import React, { useState } from 'react'
import shp from 'shpjs'
import ExcelColumnSelector from '../modals/ExcelColumnSelector.jsx'
import './ToolPanel.css'

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
  const [fileList, setFileList] = useState([])
  const [excelModalVisible, setExcelModalVisible] = useState(false)
  const [droppedFile, setDroppedFile] = useState(null)

  const handleFileUpload = async (info) => {
    const file = info.file // Use info.file directly

    console.log(file)

    if (file && /\.(zip)$/i.test(file.name)) {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const buffer = e.target.result

        const geojson = await shp.parseZip(buffer)
        setShapes(geojson.features) // Set the shapes in the parent component's state
      }
      reader.readAsArrayBuffer(file)
    } else {
      message.error('Uploaded file is not a .shp file or file is undefined')
    }
    setFileList([info.file]) // Set the latest file
  }

  const genExtra = () => (
    <InboxOutlined
      onClick={(event) => {
        event.stopPropagation()
      }}
    />
  )

  return (
    <>
      <h3>DATA ENTRY</h3>
      <Collapse expandIconPosition="right">
        <Panel header="Excel Data Import" key="1" extra={genExtra()}>
          <div className="upload-container">
            <Dragger
              beforeUpload={(file) => {
                if (!/\.(xlsx|xls|csv)$/i.test(file.name)) {
                  message.error('File is not in Excel format', 3)
                  return Upload.LIST_IGNORE
                }
                setDroppedFile(file)
                setExcelModalVisible(true)
                return false
              }}
              multiple={false}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="upload-text">Drag in Excel File</p>
              <p className="upload-text">or</p>
              <p className="upload-text">Click to Browse Files</p>
            </Dragger>
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
        <li>
          <span className="tool-icon">🗺️</span>
          <Upload accept=".zip" beforeUpload={() => false} onChange={handleFileUpload} fileList={fileList} >
            Upload Shapefile
          </Upload>
        </li>
        {/* Add other tools and handlers as needed */}
      </ul>
      <ExcelColumnSelector
        visible={excelModalVisible}
        onCancel={() => setExcelModalVisible(false)}
        droppedFile={droppedFile}
        setMapPoints={setMapPoints}
      />
    </>
  )
}

export default ToolPanel
