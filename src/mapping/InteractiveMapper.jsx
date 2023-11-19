import * as turf from '@turf/turf'
import { message } from 'antd'
import L from 'leaflet'
import 'leaflet-draw/dist/leaflet.draw.css'
import 'leaflet.fullscreen'
import 'leaflet.fullscreen/Control.FullScreen.css'
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

const PrecinctLayer = ({ data, featureGroupRef }) => {
  const map = useMap()
  useEffect(() => {
    if (!data) return

    const precinctLayer = L.geoJson(data, {
      style: () => ({
        weight: 1,
        color: '#000000',
        fillOpacity: 0,
      }),
    })

    featureGroupRef.current.addLayer(precinctLayer)
    map.fitBounds(precinctLayer.getBounds())

    return () => {
      featureGroupRef.current.removeLayer(precinctLayer)
    }
  }, [data, featureGroupRef, map])

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

const InteractiveMapper = ({
  mapPoints,
  setSelectedPoints,
  shapes,
  selectedParties,
  isShapefileVisible,
  clearAllData,
  visualizationType,
  showPoliticalDots,
  precinctShapes,
}) => {
  const mapPointsRef = useRef(mapPoints)
  const featureGroupRef = useRef()
  const shapefileGroupRef = useRef(null)
  const precinctGroupRef = useRef(null)

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

    const addMarkers = (points, color) => {
      const markersLayerGroup = L.layerGroup()
      points.forEach((point) => {
        const marker = L.marker([point.lat, point.lng], {
          icon: createCustomIcon(color ? color : point.color),
        }).bindTooltip(point.name, {
          permanent: false,
          interactive: true,
          direction: 'top',
        })
        markersLayerGroup.addLayer(marker)
      })
      featureGroupRef?.current?.addLayer(markersLayerGroup)
    }

    if (visualizationType === 'clusters') {
      const markerClusterGroup = L.markerClusterGroup()
      mapPoints.forEach((point) => {
        const marker = L.marker([point.lat, point.lng], {
          icon: createCustomIcon(point.color),
        })
        marker.bindTooltip(point.name, { permanent: false, interactive: true, direction: 'top' })
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

      if (showPoliticalDots === true) {
        addMarkers(filteredPoints)
      } else if (showPoliticalDots === false) {
        addMarkers(filteredPoints, 'black')
      }
    }
  }, [visualizationType, mapPoints, selectedParties, showPoliticalDots])

  return (
    <div className="interactive-mapper-container">
      <MapContainer center={[38.573936, -92.603760]} zoom={13} fullscreenControl={true}>
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
              circlemarker: false,
            }}
            edit={{
              edit: true,
              remove: true,
            }}
            onDeleted={onDeleted}
          />
        </FeatureGroup>
        <FeatureGroup ref={precinctGroupRef}>
          {precinctShapes && <PrecinctLayer data={precinctShapes} featureGroupRef={precinctGroupRef} />}
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
