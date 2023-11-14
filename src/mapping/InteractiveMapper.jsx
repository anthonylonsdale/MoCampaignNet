import * as turf from '@turf/turf'
import { message } from 'antd'
import L from 'leaflet'
import 'leaflet-draw/dist/leaflet.draw.css'
import React, { useEffect, useRef } from 'react'
import { FeatureGroup, MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import { EditControl } from 'react-leaflet-draw'
import './InteractiveMapper.css'

const createCustomIcon = (color) => {
  const markerColor = color || 'black'
  return L.divIcon({
    className: 'custom-icon',
    html: `<div style="width: 8px; height: 8px; background-color: ${markerColor};"></div>`,
  })
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

    if (featureGroupRef && featureGroupRef.current) {
      featureGroupRef.current.addLayer(shapefileLayer)
    } else {
      shapefileLayer.addTo(map)
    }

    map.fitBounds(shapefileLayer.getBounds())

    return () => {
      if (featureGroupRef && featureGroupRef.current) {
        featureGroupRef.current.removeLayer(shapefileLayer)
      } else {
        map.removeLayer(shapefileLayer)
      }
    }
  }, [data, map, featureGroupRef])

  return null
}

const InteractiveMapper = ({ mapPoints, setSelectedPoints, shapes }) => {
  const mapPointsRef = useRef(mapPoints)
  const featureGroupRef = useRef()

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

  return (
    <div className="interactive-mapper-container">
      <MapContainer center={[38.573936, -92.603760]} zoom={13}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <SetViewToBounds points={mapPoints} />
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
          />
          {mapPoints.map((point, index) => (
            <Marker
              key={index}
              position={[point.lat, point.lng]}
              icon={createCustomIcon(point.color)} // Use the color from point data
            >
              <Popup>{point.name}</Popup>
            </Marker>
          ))}

        </FeatureGroup>
        {shapes && <ShapefileLayer data={shapes} featureGroupRef={featureGroupRef} />}
      </MapContainer>
    </div>
  )
}

export default InteractiveMapper
