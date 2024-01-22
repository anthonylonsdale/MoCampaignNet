import L from 'leaflet'
import 'leaflet-draw/dist/leaflet.draw.css'
import 'leaflet.fullscreen'
import 'leaflet.fullscreen/Control.FullScreen.css'
import 'leaflet/dist/leaflet.css'
import React, { useEffect, useState } from 'react'
import { FeatureGroup, MapContainer, TileLayer, useMap } from 'react-leaflet'
import { EditControl } from 'react-leaflet-draw'
import styles from './EventsMap.module.css'

function CoordinatesDisplay() {
  const map = useMap()
  const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 })

  const debounce = (fn, ms = 0) => {
    let timeoutId
    return function(...args) {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => fn(...args), ms)
    }
  }

  const updateCoordinates = debounce((e) => {
    setCoordinates(e.latlng)
  }, 5)

  useEffect(() => {
    map.on('mousemove', updateCoordinates)
    return () => {
      map.off('mousemove', updateCoordinates)
    }
  }, [map, updateCoordinates])

  return (
    <div className={styles.coordinatesDisplay}>
      Lat: {coordinates.lat.toFixed(4)}, Lng: {coordinates.lng.toFixed(4)}
    </div>
  )
}

const EventsMap = ({ featureGroupRef }) => {
  const onCreated = (e) => {
    const layer = e.layer
    featureGroupRef.current.addLayer(layer)
  }

  const onDeleted = (e) => {
    const { layers: { _layers } } = e
    Object.values(_layers).forEach((layer) => {
      if (layer instanceof L.Polygon || layer instanceof L.Rectangle || layer instanceof L.Circle) {
        if (featureGroupRef.current) {
          featureGroupRef.current.removeLayer(layer)
        }
      }
    })
  }

  return (
    <div className={styles.mappingContainer}>
      <MapContainer
        center={[38.573936, -92.603760]}
        zoom={13}
        fullscreenControl={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
          attribution='Map tiles by Carto, under CC BY 3.0. Data by OpenStreetMap, under ODbL.'
        />
        <FeatureGroup ref={featureGroupRef}>
          <EditControl
            position="topright"
            onCreated={onCreated}
            onDeleted={onDeleted}
            draw={{
              rectangle: true,
              polygon: true,
              circle: true,
              polyline: false,
              marker: false,
              circlemarker: false,
            }}
            edit={{
              edit: true,
              remove: true,
            }}
          />
        </FeatureGroup>

        <CoordinatesDisplay />
      </MapContainer>
    </div>
  )
}

export default EventsMap
