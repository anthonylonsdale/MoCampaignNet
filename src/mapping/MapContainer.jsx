import React, { useState } from 'react'
import InteractiveMapper from './InteractiveMapper.jsx'
import './MapContainer.css'
import ToolPanel from './ToolPanel.jsx'

const MappingContainer = () => {
  const [mapPoints, setMapPoints] = useState([])
  const [selectedPoints, setSelectedPoints] = useState([])
  const [shapes, setShapes] = useState(null)

  return (
    <>
      <div className="interactive-mapper-title">Data Analysis and Visualization Platform</div>
      <div className="interactive-mapper-container">
        <ToolPanel setMapPoints={setMapPoints} setShapes={setShapes} />
        <InteractiveMapper
          mapPoints={mapPoints}
          setSelectedPoints={setSelectedPoints}
          selectedPoints={selectedPoints}
          shapes={shapes}
        />
      </div>
    </>
  )
}


export default MappingContainer
