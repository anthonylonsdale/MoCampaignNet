import React, { useState } from 'react'
import InteractiveMapper from './InteractiveMapper.jsx'
import './MapContainer.css'
import ToolPanel from './ToolPanel.jsx'

const MappingContainer = () => {
  const [mapPoints, setMapPoints] = useState([])
  const [selectedPoints, setSelectedPoints] = useState([])
  const [shapes, setShapes] = useState(null)
  const [showPoliticalDots, setShowPoliticalDots] = useState(false)

  const [partyCounts, setPartyCounts] = useState([])
  const [selectedParties, setSelectedParties] = useState(new Set())

  return (
    <>
      <div className="interactive-mapper-title">Data Analysis and Visualization Platform</div>
      <div className="interactive-mapper-container">
        <ToolPanel
          setMapPoints={setMapPoints}
          setShapes={setShapes}
          selectedPoints={selectedPoints}
          mapPoints={mapPoints}
          showPoliticalDots={showPoliticalDots}
          setShowPoliticalDots={setShowPoliticalDots}
          partyCounts={partyCounts}
          setPartyCounts={setPartyCounts}
          setSelectedParties={setSelectedParties}
          selectedParties={selectedParties}
        />
        <InteractiveMapper
          mapPoints={mapPoints}
          setSelectedPoints={setSelectedPoints}
          shapes={shapes}
          selectedParties={selectedParties}
        />
      </div>
    </>
  )
}

export default MappingContainer
