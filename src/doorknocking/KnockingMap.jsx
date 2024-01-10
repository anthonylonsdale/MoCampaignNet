import * as turf from '@turf/turf'
import { AutoComplete, message } from 'antd'
import L from 'leaflet'
import 'leaflet-draw/dist/leaflet.draw.css'
import 'leaflet.fullscreen'
import 'leaflet.fullscreen/Control.FullScreen.css'
import 'leaflet.heat'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'leaflet.markercluster/dist/leaflet.markercluster'
import 'leaflet/dist/leaflet.css'
import React, { useEffect, useRef, useState } from 'react'
import { FeatureGroup, MapContainer, TileLayer, useMap } from 'react-leaflet'
import { EditControl } from 'react-leaflet-draw'
import styles from './KnockingMap.module.css'


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

function SearchControl({ knockingPoints }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [options, setOptions] = useState([])
  const map = useMap()

  const onSelect = (value) => {
    const result = knockingPoints.find((p) => p.name === value)
    if (result) {
      map.flyTo([result.lat, result.lng], 17)
    }
  }

  const handleSearch = (value) => {
    setSearchTerm(value)
    const filteredOptions = value ?
      knockingPoints
          .filter((point) => point.name.toLowerCase().includes(value.toLowerCase()))
          .map((point) => ({ value: point.name })) :
      []

    setOptions(filteredOptions)
  }

  return (
    <div className={styles.searchBoxContainer}>
      <AutoComplete
        className={styles.searchInput}
        onSelect={onSelect}
        onSearch={handleSearch}
        placeholder="Search..."
        options={options}
        value={searchTerm}
      />
    </div>
  )
}

const SetViewToBounds = ({ points }) => {
  const map = useMap()
  if (points.length > 0) {
    const bounds = L.latLngBounds(points.map((point) => [point.lat, point.lng]))
    map.fitBounds(bounds)
  }
  return null
}

const KnockingMap = ({ knockingData, clearKnockingData }) => {
  const { knockingPoints } = knockingData

  const mapPointsRef = useRef(knockingPoints)
  const featureGroupRef = useRef()

  useEffect(() => {
    mapPointsRef.current = knockingPoints
  }, [knockingPoints])

  const onCreated = (e) => {
    const layer = e.layer
    const drawnPolygon = layer.toGeoJSON()
    const currentMapPoints = mapPointsRef.current

    if (Array.isArray(currentMapPoints)) {
      const pointsSelected = currentMapPoints.filter((point) => {
        const pointToCheck = turf.point([point.lng, point.lat])
        return turf.booleanPointInPolygon(pointToCheck, drawnPolygon)
      })

      setSelectedHouses(pointsSelected)
      message.info(`${pointsSelected.length} points have been selected.`)
    }
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
    clearKnockingData()
  }

  useEffect(() => {
    if (featureGroupRef.current) {
      featureGroupRef.current.clearLayers()
    }

    const createHouseIconSVG = (color) => `<svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill="${color}">
        <path d="M12 2.69l-6 5.16V19a2 2 0 0 0 2 2h4v-5h2v5h4a2 2 0 0 0 2-2V7.85l-6-5.16zM12 4.07l4 3.44V18h-2v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4H8V7.51l4-3.44z"/>
      </svg>`

    const determineColor = (point) => {
      return point.color || '#000000'
    }

    const spreadOutVoters = (point, voters) => {
      featureGroupRef.current.clearLayers()

      voters.forEach((voter, index) => {
        const angle = (index / voters.length) * Math.PI * 2
        const latOffset = Math.cos(angle) * 0.0001
        const lngOffset = Math.sin(angle) * 0.0001
        L.marker([point.lat + latOffset, point.lng + lngOffset], {
          icon: L.divIcon({
            className: 'custom-house-icon',
            html: createHouseIconSVG('#ff0000'),
            iconSize: L.point(24, 24),
            iconAnchor: [12, 24],
          }),
        })
            .addTo(featureGroupRef.current)
            .bindPopup(`Voter: ${voter.name}`)
      })
    }

    const pointsByLocation = {}
    knockingPoints.forEach((point) => {
      const key = `${point.lat},${point.lng}`
      pointsByLocation[key] = pointsByLocation[key] || []
      pointsByLocation[key].push(point)
    })

    const createAndAddMarker = (point, latOffset = 0, lngOffset = 0) => {
      const color = determineColor(point)
      const houseIcon = L.divIcon({
        className: 'custom-house-icon',
        html: createHouseIconSVG(color),
        iconSize: L.point(24, 24),
        iconAnchor: [12, 24],
      })

      const marker = L.marker([point.lat + latOffset, point.lng + lngOffset], {
        icon: houseIcon,
      }).bindTooltip(point.name, {
        permanent: false,
        interactive: true,
        direction: 'top',
      })

      featureGroupRef.current.addLayer(marker)
    }

    Object.values(pointsByLocation).forEach((points) => {
      if (points.length === 1) {
        createAndAddMarker(points[0])
      } else {
        const mainPoint = points[0]
        const color = determineColor(mainPoint)
        const marker = L.marker([mainPoint.lat, mainPoint.lng], {
          icon: L.divIcon({
            className: 'custom-house-icon',
            html: createHouseIconSVG(color),
            iconSize: L.point(24, 24),
            iconAnchor: [12, 24],
          }),
        }).addTo(featureGroupRef.current)
        marker.on('click', () => spreadOutVoters(mainPoint, points))
      }
    })
  }, [knockingPoints])


  return (
    <div className={styles.mappingContainer}>
      <MapContainer center={[38.573936, -92.603760]} zoom={13} fullscreenControl={true}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
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

        <SearchControl knockingPoints={knockingPoints} />

        <CoordinatesDisplay />

        <SetViewToBounds points={knockingPoints} />
      </MapContainer>
    </div>
  )
}

export default KnockingMap
