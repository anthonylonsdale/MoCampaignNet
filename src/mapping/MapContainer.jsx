import React, { useState } from 'react'
import InteractiveMapper from './InteractiveMapper.jsx'
import './MapContainer.css'
import ToolPanel from './ToolPanel.jsx'

const MappingContainer = () => {
  const [mapPoints, setMapPoints] = useState([])
  const [selectedPoints, setSelectedPoints] = useState([])
  const [shapes, setShapes] = useState(null)
  const [precinctShapes, setPrecinctShapes] = useState(null)
  const [showPoliticalDots, setShowPoliticalDots] = useState(false)

  const [partyCounts, setPartyCounts] = useState([])
  const [selectedParties, setSelectedParties] = useState(new Set())
  const [isShapefileVisible, setIsShapefileVisible] = useState(true)
  const [visualizationType, setVisualizationType] = useState('points')

  const clearAllData = () => {
    setMapPoints([])
    setSelectedPoints([])
    setShapes(null)
    setSelectedParties(new Set())
    setPartyCounts([])
    setShowPoliticalDots(false)
  }

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
          setIsShapefileVisible={setIsShapefileVisible}
          isShapefileVisible={isShapefileVisible}
          setVisualizationType={setVisualizationType}
          setPrecinctShapes={setPrecinctShapes}
        />
        <InteractiveMapper
          mapPoints={mapPoints}
          setSelectedPoints={setSelectedPoints}
          shapes={shapes}
          showPoliticalDots={showPoliticalDots}
          selectedParties={selectedParties}
          isShapefileVisible={isShapefileVisible}
          clearAllData={clearAllData}
          visualizationType={visualizationType}
          precinctShapes={precinctShapes}
        />
      </div>
    </>
  )
}

export default MappingContainer
