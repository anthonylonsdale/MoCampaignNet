import { useState } from 'react'

const useKnockingData = () => {
  const [knockingPoints, setKnockingPoints] = useState([])
  const [selectedHouses, setSelectedHouses] = useState([])
  const [drawnShape, setDrawnShape] = useState(null)
  const [selectedShapeForEditing, setSelectedShapeForEditing] = useState(null)

  const [roadMetrics, setRoadMetrics] = useState({ totalDistance: 0, roadTypes: [] })

  const clearKnockingData = () => {
    setKnockingPoints([])
    setSelectedHouses([])
  }

  const clearDrawnShape = () => {
    setDrawnShape(null)
  }

  return {
    knockingData: {
      knockingPoints,
      selectedHouses,
      drawnShape,
      selectedShapeForEditing,
      roadMetrics,
    },
    setKnockingData: {
      setKnockingPoints,
      setSelectedHouses,
      setDrawnShape,
      setSelectedShapeForEditing,
      setRoadMetrics,
    },
    clearData: {
      clearKnockingData,
      clearDrawnShape,
    },
  }
}

export default useKnockingData
