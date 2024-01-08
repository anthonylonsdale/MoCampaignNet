import 'leaflet/dist/leaflet.css'
import React from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import styles from './KnockingMap.module.css'

const KnockingMap = () => {
  return (
    <div className={styles.mappingContainer}>
      <MapContainer center={[38.573936, -92.603760]} zoom={13} fullscreenControl={true}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
          attribution='Map tiles by Carto, under CC BY 3.0. Data by OpenStreetMap, under ODbL.'
        />
      </MapContainer>
    </div>
  )
}

export default KnockingMap
