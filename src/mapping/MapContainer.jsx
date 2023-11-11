import React, { useState } from 'react'
import InteractiveMapper from './InteractiveMapper.jsx'
import './MapContainer.css'
import ToolPanel from './ToolPanel.jsx'

const MappingContainer = () => {
  const [mapPoints, setMapPoints] = useState([])
  const [selectedPoints, setSelectedPoints] = useState([])

  return (
    <>
      <div className="interactive-mapper-container">
        <ToolPanel setMapPoints={setMapPoints} />
        <InteractiveMapper mapPoints={mapPoints} setSelectedPoints={setSelectedPoints} selectedPoints={selectedPoints} />
      </div>
    </>
  )
}


export default MappingContainer
