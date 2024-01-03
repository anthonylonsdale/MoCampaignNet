import React from 'react'
import InteractiveMapper from './InteractiveMapper.jsx'
import './MapContainer.css'
import ToolPanel from './ToolPanel.jsx'
import useMapData from './hooks/useMapDataHook.jsx'
import usePrecinctData from './hooks/usePrecinctDataHook.jsx'

const MappingContainer = () => {
  // Using custom hooks to manage related states
  const {
    mapData,
    setMapData,
    clearMarkerData,
  } = useMapData()

  const {
    precinctData,
    setPrecinctData,
    clearPrecinctData,
  } = usePrecinctData()

  return (
    <div className="interactive-mapper-container">
      <ToolPanel
        mapData={mapData}
        setMapData={setMapData}
        precinctDataState={precinctData}
        setPrecinctDataState={setPrecinctData}
      />
      <InteractiveMapper
        mapData={mapData}
        setMapData={setMapData}
        precinctData={precinctData}
        clearMarkerData={clearMarkerData}
        clearPrecinctData={clearPrecinctData}
      />
    </div>
  )
}

export default MappingContainer
