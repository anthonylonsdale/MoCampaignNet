import { useState } from 'react'

const useMapData = () => {
  const [mapPoints, setMapPoints] = useState([])
  const [selectedPoints, setSelectedPoints] = useState([])
  const [showPoliticalDots, setShowPoliticalDots] = useState(false)
  const [partyCounts, setPartyCounts] = useState([])
  const [selectedParties, setSelectedParties] = useState(new Set())
  const [isShapefileVisible, setIsShapefileVisible] = useState(true)
  const [visualizationType, setVisualizationType] = useState('points')

  const clearMarkerData = () => {
    setMapPoints([])
    setSelectedPoints([])
    setSelectedParties(new Set())
    setPartyCounts([])
    setShowPoliticalDots(false)
  }

  return {
    mapData: {
      mapPoints,
      selectedPoints,
      showPoliticalDots,
      partyCounts,
      selectedParties,
      isShapefileVisible,
      visualizationType,
    },
    setMapData: {
      setMapPoints,
      setSelectedPoints,
      setShowPoliticalDots,
      setPartyCounts,
      setSelectedParties,
      setIsShapefileVisible,
      setVisualizationType,
    },
    clearMarkerData,
  }
}

export default useMapData
