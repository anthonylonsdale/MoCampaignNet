import L from 'leaflet'
import 'leaflet-draw/dist/leaflet.draw.css'
import 'leaflet.fullscreen'
import 'leaflet.fullscreen/Control.FullScreen.css'
import 'leaflet/dist/leaflet.css'
import React, { useEffect, useState } from 'react'
import { FeatureGroup, GeoJSON, MapContainer, TileLayer, useMap } from 'react-leaflet'
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

const styleFeature = (feature) => {
  const getColor = (population) => {
    return population > 1000000 ? '#800026' :
           population > 500000 ? '#BD0026' :
           population > 100000 ? '#E31A1C' :
           population > 50000 ? '#FC4E2A' :
           population > 20000 ? '#FD8D3C' :
           population > 10000 ? '#FEB24C' :
           population > 5000 ? '#FED976' :
                                  '#FFEDA0'
  }

  const population = feature.properties.pop_2000

  return {
    fillColor: getColor(population),
    weight: 1,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.7,
  }
}

const EventsMap = ({ featureGroupRef }) => {
  const [geojsonData, setGeojsonData] = useState(null)

  useEffect(() => {
    fetch('/mo_counties.geojson')
        .then((response) => response.json())
        .then((data) => {
          setGeojsonData(data)
        })
        .catch((error) => {
          console.error('Error fetching the GeoJSON file:', error)
        })
  }, [])

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

  console.log(geojsonData)

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

          {geojsonData && <GeoJSON data={geojsonData} style={styleFeature} /> }
        </FeatureGroup>
        <CoordinatesDisplay />
      </MapContainer>
    </div>
  )
}

export default EventsMap
