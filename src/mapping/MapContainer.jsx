import React, { useState } from 'react'
import InteractiveMapper from './InteractiveMapper.jsx'
import './MapContainer.css'
import ToolPanel from './ToolPanel.jsx'
import { extractShapes } from './utils/ExtractShapes.jsx'
import Leaflet from './utils/Leaflet.jsx'

const MappingContainer = () => {
  const [mapPoints, setMapPoints] = useState([])
  const [selectedPoints, setSelectedPoints] = useState([])
  const [shapes, setShapes] = useState([])
  const [data, setData] = useState(null)

  const handleChange = async (e) => {
    console.log(e.target.files)

    setData(await extractShapes(e.target.files))
  }

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
      <input type="file" onChange={handleChange} />
      {data && <Leaflet data={data} />}
    </>
  )
}


export default MappingContainer
