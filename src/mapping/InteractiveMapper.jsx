import * as turf from '@turf/turf'
import { message, Modal } from 'antd'
import L from 'leaflet'
import 'leaflet-draw/dist/leaflet.draw.css'
import 'leaflet.fullscreen'
import 'leaflet.fullscreen/Control.FullScreen.css'
import 'leaflet.heat'
import 'leaflet.markercluster/dist/leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import React, { useEffect, useRef, useState } from 'react'
import { FeatureGroup, MapContainer, TileLayer, useMap } from 'react-leaflet'
import { EditControl } from 'react-leaflet-draw'
import './InteractiveMapper.css'
import { calcPartisanAdvantage } from './utils/calculateElectionMargins.jsx'

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
        weight: .5,
        color: '#000000',
        fillOpacity: 0,
      }),
    })

    featureGroupRef.current.addLayer(precinctLayer)
    map.fitBounds(precinctLayer.getBounds())

    return () => {
      try {
        featureGroupRef.current.removeLayer(precinctLayer)
      } catch {}
    }
  }, [data, featureGroupRef, map])

  return null
}

function createPopupContent(districtResults, districtId) {
  const electionResults = districtResults[districtId]
  const container = document.createElement('div')
  container.className = 'election-popup'

  Object.keys(electionResults).forEach((electionCode) => {
    const candidates = electionResults[electionCode]
    const totalDistrictVotes = Object.values(candidates).reduce((sum, { totalVotes }) => sum + totalVotes, 0)
    const electionDiv = document.createElement('div')
    electionDiv.className = 'election-info'
    electionDiv.innerHTML = `<h4>Election ${electionCode}</h4>`

    const list = document.createElement('ul')
    Object.entries(candidates).forEach(([partyCode, { totalVotes, candidate }]) => {
      const votePercentage = ((totalVotes / totalDistrictVotes) * 100).toFixed(2) // Fixed to two decimal places
      const listItem = document.createElement('li')
      listItem.innerHTML = `
        <span class="candidate-name">${candidate}</span> 
        (<span class="party-code">${partyCode}</span>): 
        <span class="candidate-votes">${totalVotes.toLocaleString()}</span> votes 
        - <span class="candidate-percentage">${votePercentage}%</span>`

      list.appendChild(listItem)
    })

    electionDiv.appendChild(list)

    container.appendChild(electionDiv)
  })

  return container
}

const ShapefileLayer = ({ data, featureGroupRef, precinctShapes, mapping, fields }) => {
  const map = useMap()

  useEffect(() => {
    if (!data) return

    const shapefileLayer = L.featureGroup()

    if (data && precinctShapes && fields && mapping) {
      const { districtMargins, districtTooltips, districtResults } = calcPartisanAdvantage(data, precinctShapes, fields, mapping)

      L.geoJson(data, {
        style: (feature) => {
          const districtId = feature.properties.ID
          return {
            color: districtMargins[districtId],
            weight: 1,
            opacity: 1,
            fillColor: districtMargins[districtId],
            fillOpacity: 0.5,
          }
        },
        onEachFeature: (feature, layer) => {
          const districtId = feature.properties.ID
          if (districtTooltips[districtId]) {
            layer.bindTooltip(districtTooltips[districtId], {
              sticky: true,
              className: 'custom-tooltip',
            })
            layer.on('click', () => {
              const popupContent = createPopupContent(districtResults, districtId)
              layer.bindPopup(popupContent).openPopup()
            })
          }
        },
      }).addTo(shapefileLayer)
    } else {
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
    }

    featureGroupRef.current.addLayer(shapefileLayer)
    map.fitBounds(shapefileLayer.getBounds())

    return () => {
      try {
        featureGroupRef.current.removeLayer(shapefileLayer)
      } catch {}
    }
  }, [data, map, featureGroupRef, precinctShapes, mapping, fields])
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
  electoralFieldMapping,
  electoralFields,
}) => {
  const mapPointsRef = useRef(mapPoints)
  const featureGroupRef = useRef()
  const shapefileGroupRef = useRef(null)
  const precinctGroupRef = useRef(null)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalCompleted, setModalCompleted] = useState(false)
  const [filteredShapes, setFilteredShapes] = useState([])

  useEffect(() => {
    if (precinctShapes && shapes && shapes.length > 0) {
      setIsModalOpen(true)
    }
  }, [shapes])

  const handleModalSubmit = () => {
    setIsModalOpen(false)
    setModalCompleted(true)
  }

  const handleShapeSelection = (shape, isSelected) => {
    setFilteredShapes((prevFilteredShapes) => {
      if (isSelected) {
        return [...prevFilteredShapes, shape]
      } else {
        return prevFilteredShapes.filter((s) => s.properties.ID !== shape.properties.ID)
      }
    })
    console.log(filteredShapes)
  }

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
    <>
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
            {precinctShapes && <PrecinctLayer data={precinctShapes} featureGroupRef={precinctGroupRef}/>}
          </FeatureGroup>
          <FeatureGroup ref={shapefileGroupRef}>
            {isShapefileVisible && filteredShapes && modalCompleted && <ShapefileLayer data={filteredShapes} featureGroupRef={shapefileGroupRef} precinctShapes={precinctShapes} mapping={electoralFieldMapping} fields={electoralFields} />}
          </FeatureGroup>
          <SetViewToBounds points={mapPoints} />
        </MapContainer>
      </div>

      <Modal
        title="Select Shapes"
        open={isModalOpen}
        onOk={handleModalSubmit}
        onCancel={() => setIsModalOpen(false)}
      >
        {precinctShapes && shapes && shapes.map((shape) => (
          <div key={shape.properties.ID}>
            <label>
              <input
                type="checkbox"
                onChange={(e) => handleShapeSelection(shape, e.target.checked)}
              />
              {` District ${shape.properties.ID}`}
            </label>
          </div>
        ))}
      </Modal>
    </>
  )
}

export default InteractiveMapper
