import * as turf from '@turf/turf'
import { AutoComplete, Input, Modal, message } from 'antd'
import L from 'leaflet'
import 'leaflet-draw/dist/leaflet.draw.css'
import 'leaflet.fullscreen'
import 'leaflet.fullscreen/Control.FullScreen.css'
import 'leaflet.heat'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'leaflet.markercluster/dist/leaflet.markercluster'
import 'leaflet/dist/leaflet.css'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { FeatureGroup, MapContainer, TileLayer, useMap } from 'react-leaflet'
import { EditControl } from 'react-leaflet-draw'
import styles from './KnockingMap.module.css'
import RoadwayMetricsPanel from './TrafficPanel.jsx'
import { processKnockingPoints } from './utils/MarkerPlotting.jsx'

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

const KnockingMap = ({ knockingData, setKnockingData, clearData, featureGroupRef }) => {
  const { knockingPoints, selectedShapeForEditing, roadMetrics } = knockingData
  const { setDrawnShape } = setKnockingData
  const { clearKnockingData } = clearData

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [newShapeName, setNewShapeName] = useState('')
  const [tempShape, setTempShape] = useState(null)

  const mapPointsRef = useRef(knockingPoints)

  useEffect(() => {
    mapPointsRef.current = knockingPoints
  }, [knockingPoints])

  const onCreated = (e) => {
    const layer = e.layer
    featureGroupRef.current.addLayer(layer)
    const drawnPolygon = layer.toGeoJSON()
    const currentMapPoints = mapPointsRef.current

    const tempNewShape = {
      id: Math.random().toString(36).substring(2, 9),
      layer: e.layer,
      bounds: e.layer.getBounds(),
      name: '',
      visible: true,
    }
    setIsModalVisible(true)
    setTempShape(tempNewShape)

    if (Array.isArray(currentMapPoints)) {
      const pointsSelected = currentMapPoints.filter((point) => {
        const pointToCheck = turf.point([point.lng, point.lat])
        return turf.booleanPointInPolygon(pointToCheck, drawnPolygon)
      })

      message.info(`${pointsSelected.length} points have been selected.`)
    }
  }

  const handleOk = () => {
    if (newShapeName.trim() === '') {
      message.error('Please enter a name for the shape.')
      return
    }

    setDrawnShape({ ...tempShape, name: newShapeName })
    setIsModalVisible(false)
    setNewShapeName('')
    setTempShape(null)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    setNewShapeName('')
    setTempShape(null)
    setDrawnShape(null)
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
    processKnockingPoints(featureGroupRef, knockingPoints)
  }, [knockingPoints, featureGroupRef])

  useEffect(() => {
    if (selectedShapeForEditing && selectedShapeForEditing.layer) {
      selectedShapeForEditing.layer.editing.enable()
    }
  }, [selectedShapeForEditing])

  useEffect(() => {
    if (featureGroupRef.current) {
      const map = featureGroupRef.current

      const handleEdit = (e) => {
        const layers = e.layers

        layers.eachLayer((layer) => {
          if (selectedShapeForEditing && layer === selectedShapeForEditing.layer) {
            const newGeometry = layer.toGeoJSON()
            setDrawnShape(newGeometry)
            updateSelectedShapeGeometry(selectedShapeForEditing.id, newGeometry)
          }
        })
      }

      map.on('draw:edited', handleEdit)
      return () => {
        map.off('draw:edited', handleEdit)
      }
    }
  }, [featureGroupRef])

  const hasRealData = useMemo(() => {
    return roadMetrics.totalDistance > 0 || roadMetrics.roadTypes.length > 0
  }, [roadMetrics])

  console.log()

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

        <SearchControl knockingPoints={knockingPoints} />

        <CoordinatesDisplay />

        <SetViewToBounds points={knockingPoints} />
      </MapContainer>
      <Modal title="Name Your Shape" open={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Input
          value={newShapeName}
          onChange={(e) => setNewShapeName(e.target.value)}
          placeholder="Enter shape name"
          onPressEnter={handleOk} // Allows pressing Enter to submit
        />
      </Modal>

      {!!hasRealData && <RoadwayMetricsPanel roadMetrics={roadMetrics} />}
    </div>
  )
}

export default KnockingMap
