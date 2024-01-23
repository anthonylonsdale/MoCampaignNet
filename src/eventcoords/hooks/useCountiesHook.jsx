import { useEffect, useState } from 'react'

const useCounties = () => {
  const [counties, setCounties] = useState([])

  useEffect(() => {
    fetch('/mo_counties.geojson')
        .then((response) => response.json())
        .then((data) => {
          const extractedCounties = data.features.map((feature) => feature.properties.countyname)
          setCounties(extractedCounties)
        })
        .catch((error) => {
          console.error('Error fetching the GeoJSON file:', error)
        })
  }, [])

  return counties
}

export default useCounties
