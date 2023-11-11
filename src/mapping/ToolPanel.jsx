import { Select, Switch, Upload } from 'antd'
import React, { useState } from 'react'
import './ToolPanel.css'

// Sample handler functions
const handleToggleLayer = (checked) => {
  console.log('Layer visibility toggled:', checked)
  // Add your layer toggle logic here
}

const handleVisualizationChange = (value) => {
  console.log('Visualization option selected:', value)
  // Update visualization based on the selected option
}

const ToolPanel = () => {
  const [fileList, setFileList] = useState([])

  const handleFileUpload = (info) => {
    console.log('Uploaded file:', info.file)
    // You would process the file here
    setFileList(info.fileList.slice(-1)) // Keep the latest file
  }

  return (
    <div className="tool-panel">
      <h3>DATA ENTRY</h3>


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
          <Upload
            accept=".shp"
            beforeUpload={() => false} // Prevent automatic upload
            onChange={handleFileUpload}
            fileList={fileList}
          >
            Upload Shapefile
          </Upload>
        </li>
        {/* Add other tools and handlers as needed */}
      </ul>
    </div>
  )
}

export default ToolPanel
