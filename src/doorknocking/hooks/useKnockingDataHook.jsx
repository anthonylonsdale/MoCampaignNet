import { useState } from 'react'

const useKnockingData = () => {
  const [knockingPoints, setKnockingPoints] = useState([])
  const [selectedHouses, setSelectedHouses] = useState([])

  const clearKnockingData = () => {
    setKnockingPoints([])
    setSelectedHouses([])
  }

  return {
    knockingData: {
      knockingPoints,
      selectedHouses,
    },
    setKnockingData: {
      setKnockingPoints,
      setSelectedHouses,
    },
    clearKnockingData,
  }
}

export default useKnockingData
