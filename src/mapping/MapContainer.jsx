import React, { useState } from 'react'
import InteractiveMapper from './InteractiveMapper.jsx'
import './MapContainer.css'
import ToolPanel from './ToolPanel.jsx'

const MappingContainer = () => {
  const [mapPoints, setMapPoints] = useState([])
  const [selectedPoints, setSelectedPoints] = useState([])
  const [shapes, setShapes] = useState([])

  return (
    <>
      <div className="interactive-mapper-title">Data Analysis and Visualization Platform</div>
      <div className="interactive-mapper-container">
        <div className="tool-panel">
          <ToolPanel setMapPoints={setMapPoints} setShapes={setShapes} />
        </div>
        <div className="interactive-mapper">
          <InteractiveMapper
            mapPoints={mapPoints}
            setSelectedPoints={setSelectedPoints}
            selectedPoints={selectedPoints}
            shapes={shapes}
          />
        </div>
      </div>
    </>
  )
}


export default MappingContainer
