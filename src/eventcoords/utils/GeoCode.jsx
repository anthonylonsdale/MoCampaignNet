import axios from 'axios'
import React, { useState } from 'react'

const GeocodeApp = () => {
  const [address, setAddress] = useState('')
  const [coordinates, setCoordinates] = useState(null)

  const geocodeAddress = async () => {
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${address}&limit=1`)

      if (response.status === 200 && response.data.length > 0) {
        const location = response.data[0]
        setCoordinates({
          lat: parseFloat(location.lat),
          lng: parseFloat(location.lon),
        })
      } else {
        console.error('Geocoding failed')
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Enter address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <button onClick={geocodeAddress}>Geocode</button>
      {coordinates && (
        <div>
          Latitude: {coordinates.lat}, Longitude: {coordinates.lng}
        </div>
      )}
    </div>
  )
}

export default GeocodeApp
