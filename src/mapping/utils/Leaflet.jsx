import 'leaflet/dist/leaflet.css'
import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'

import Shapefile from './ShapefileHandler.jsx'

const position = [51.505, -0.09]

function Leaflet({ data }) {
  const [map, setMap] = useState(null)

  useEffect(() => {
    if (map) map.setView([34.74161249883172, 18.6328125], 2)
  }, [map])

  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{ height: '100vh' }}
      ref={setMap}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <Shapefile data={data} />
    </MapContainer>
  )
}

export default Leaflet
