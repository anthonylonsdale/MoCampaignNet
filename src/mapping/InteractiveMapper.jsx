import * as turf from '@turf/turf'
import { message } from 'antd'
import L from 'leaflet'
import 'leaflet-draw/dist/leaflet.draw.css'
import 'leaflet.heat'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'leaflet.markercluster/dist/leaflet.markercluster'
import React, { useEffect, useRef } from 'react'
import { FeatureGroup, MapContainer, TileLayer, useMap } from 'react-leaflet'
import { EditControl } from 'react-leaflet-draw'
import './InteractiveMapper.css'

const createCustomIcon = (color) => {
  const markerColor = color || 'black'
  return L.divIcon({
    className: 'custom-icon',
    html: `<div style="width: 8px; height: 8px; background-color: ${markerColor};"></div>`,
  })
}

const partyColorMapping = {
  'Republican': 'red',
  'No Data': 'black',
  'Independent': 'grey',
  'Democrat': 'blue',
}

const SetViewToBounds = ({ points }) => {
  const map = useMap()
  if (points.length > 0) {
    const bounds = L.latLngBounds(points.map((point) => [point.lat, point.lng]))
    map.fitBounds(bounds)
  }
  return null
}

const ShapefileLayer = ({ data, featureGroupRef }) => {
  const map = useMap()
  useEffect(() => {
    if (!data) return

    const shapefileLayer = L.featureGroup()

    L.geoJson(data, {
      onEachFeature: function tooltip(f, l) {
        const out = []
        if (f.properties) {
          Object.keys(f.properties).forEach((key) => {
            out.push(`${key}: ${f.properties[key]}`)
          })
          l.bindTooltip(out.join('<br />'))
        }
      },
    }).addTo(shapefileLayer)

    featureGroupRef.current.addLayer(shapefileLayer)

    map.fitBounds(shapefileLayer.getBounds())

    return () => {
      featureGroupRef.current.removeLayer(shapefileLayer)
    }
  }, [data, map, featureGroupRef])

  return null
}

const InteractiveMapper = ({ mapPoints, setSelectedPoints, shapes, selectedParties, isShapefileVisible, clearAllData, visualizationType }) => {
  const mapPointsRef = useRef(mapPoints)
  const featureGroupRef = useRef()
  const shapefileGroupRef = useRef(null)


  useEffect(() => {
    mapPointsRef.current = mapPoints
  }, [mapPoints])

  const onCreated = (e) => {
    const layer = e.layer
    const drawnPolygon = layer.toGeoJSON()
    const currentMapPoints = mapPointsRef.current // Use ref to access the latest mapPoints

    const pointsSelected = currentMapPoints.filter((point) => {
      const pointToCheck = turf.point([point.lng, point.lat])
      return turf.booleanPointInPolygon(pointToCheck, drawnPolygon)
    })

    setSelectedPoints(pointsSelected)
    message.info(`${pointsSelected.length} points have been selected.`)
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
    if (featureGroupRef.current && Object.keys(_layers).length === featureGroupRef.current.getLayers().length) {
      clearAllData()
    }
  }

  useEffect(() => {
    if (featureGroupRef.current) {
      featureGroupRef.current.clearLayers()
    }

    if (visualizationType === 'clusters') {
      const markerClusterGroup = L.markerClusterGroup()
      mapPoints.forEach((point) => {
        const marker = L.marker([point.lat, point.lng], {
          icon: createCustomIcon(point.color),
        }).bindPopup(point.name)
        markerClusterGroup.addLayer(marker)
      })
      featureGroupRef.current.addLayer(markerClusterGroup)
    } else if (visualizationType === 'heatmap') {
      const heatMapPoints = mapPoints.map((point) => [point.lat, point.lng, 1])
      const heatLayer = L.heatLayer(heatMapPoints, { radius: 25, blur: 15 })
      featureGroupRef.current.addLayer(heatLayer)
    } else {
      const filteredPoints = mapPoints.filter((point) => {
        const party = Object.keys(partyColorMapping).find((p) => partyColorMapping[p] === point.color)
        return selectedParties.size === 0 || selectedParties.has(party)
      })

      filteredPoints.forEach((point) => {
        const marker = L.marker([point.lat, point.lng], {
          icon: createCustomIcon(point.color),
        }).bindPopup(point.name)
        featureGroupRef.current.addLayer(marker)
      })
    }
  }, [visualizationType, mapPoints, selectedParties])

  console.log(featureGroupRef.current?.getLayers())
  console.log(selectedParties)
  console.log(mapPoints)
  console.log(isShapefileVisible)
  console.log(shapes)

  return (
    <div className="interactive-mapper-container">
      <MapContainer center={[38.573936, -92.603760]} zoom={13}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <FeatureGroup ref={featureGroupRef}>
          <EditControl
            position="topright"
            onCreated={onCreated}
            draw={{
              rectangle: true,
              polygon: true,
              circle: true,
              polyline: false,
              marker: false,
            }}
            edit={{
              edit: true,
              remove: true,
            }}
            onDeleted={onDeleted}
          />
        </FeatureGroup>
        <FeatureGroup ref={shapefileGroupRef}>
          {isShapefileVisible && shapes && <ShapefileLayer data={shapes} featureGroupRef={shapefileGroupRef} />}
        </FeatureGroup>
        <SetViewToBounds points={mapPoints} />
      </MapContainer>
    </div>
  )
}

export default InteractiveMapper
