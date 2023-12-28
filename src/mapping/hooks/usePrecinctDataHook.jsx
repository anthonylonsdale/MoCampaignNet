import { useState } from 'react'

const usePrecinctData = () => {
  const [shapes, setShapes] = useState(undefined)
  const [precinctShapes, setPrecinctShapes] = useState(undefined)
  const [electoralFieldMapping, setElectoralFieldMapping] = useState(undefined)

  const [electoralFields, setElectoralFields] = useState(undefined)

  const [demographicSelections, setDemographicSelections] = useState({})

  const clearPrecinctData = () => {
    setShapes(undefined)
    setPrecinctShapes(undefined)
    setElectoralFieldMapping(undefined)
    setElectoralFields(undefined)
  }

  return {
    precinctData: {
      shapes,
      precinctShapes,
      electoralFieldMapping,
      electoralFields,
      demographicSelections,
    },
    setPrecinctData: {
      setShapes,
      setPrecinctShapes,
      setElectoralFieldMapping,
      setElectoralFields,
      setDemographicSelections,
    },
    clearPrecinctData,
  }
}

export default usePrecinctData
