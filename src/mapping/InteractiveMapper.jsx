import * as turf from '@turf/turf'
import { Button, message } from 'antd'
import L from 'leaflet'
import 'leaflet-draw/dist/leaflet.draw.css'
import React, { useEffect, useRef } from 'react'
import { FeatureGroup, MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import { EditControl } from 'react-leaflet-draw'
import * as XLSX from 'xlsx'
import './InteractiveMapper.css'

const createCustomIcon = () => {
  return L.divIcon({
    className: 'custom-icon',
    html: `<div style="width: 8px; height: 8px; background-color: black;"></div>`,
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

const InteractiveMapper = ({ mapPoints, setSelectedPoints, selectedPoints, shapes }) => {
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

    console.log('Selected Points:', pointsSelected)
    setSelectedPoints(pointsSelected)
    message.info(`${pointsSelected.length} points have been selected.`)
  }

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(selectedPoints)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'SelectedPoints')
    XLSX.writeFile(wb, 'selectedPoints.xlsx')
  }

  const groupedPoints = mapPoints.reduce((acc, point) => {
    const key = `${point.lat}-${point.lng}`
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(point)
    return acc
  }, {})

  const ShapefileLayer = ({ data }) => {
    const map = useMap()

    useEffect(() => {
      if (!data) return

      const shapefileLayer = L.featureGroup().addTo(map)

      L.geoJson(data, {
        onEachFeature: function popUp(f, l) {
          const out = []
          if (f.properties) {
            Object.keys(f.properties).forEach((key) => {
              out.push(`${key}: ${f.properties[key]}`)
            })
            l.bindPopup(out.join('<br />'))
          }
        },
      }).addTo(shapefileLayer)

      map.fitBounds(shapefileLayer.getBounds())

      return () => {
        map.removeLayer(shapefileLayer)
      }
    }, [data, map])

    return null
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
          {Object.values(groupedPoints).map((points, idx) => (
            points.map((point, index) => {
              return (
                <Marker key={`${idx}-${index}`} position={[point.lat, point.lng]} icon={createCustomIcon()}>
                  <Popup>({point.lat}, {point.lng})</Popup>
                </Marker>
              )
            })
          ))}
        </FeatureGroup>
        {shapes && <ShapefileLayer data={shapes} />}
      </MapContainer>
      {selectedPoints.length > 0 && (
        <Button onClick={exportToExcel}>
          Export Selected Points
        </Button>
      )}
    </div>
  )
}

export default InteractiveMapper
