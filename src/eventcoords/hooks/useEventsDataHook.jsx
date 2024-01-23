import { useState } from 'react'

const useEventsData = () => {
  const [selectedCounty, setSelectedCounty] = useState(null)

  const clearData = () => {
    setSelectedCounty(null)
  }

  return {
    eventsData: { selectedCounty },
    setEventsData: { setSelectedCounty },
    clearData: { clearData },
  }
}

export default useEventsData
