import * as turf from '@turf/turf'
import { Button, message } from 'antd'
import L from 'leaflet'
import 'leaflet-draw/dist/leaflet.draw.css'
import 'leaflet.fullscreen'
import 'leaflet.fullscreen/Control.FullScreen.css'
import 'leaflet.heat'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'leaflet.markercluster/dist/leaflet.markercluster'
import React, { useEffect, useRef, useState } from 'react'
import { FeatureGroup, MapContainer, TileLayer, useMap } from 'react-leaflet'
import { EditControl } from 'react-leaflet-draw'
import './InteractiveMapper.css'
import ShapeSelectorModal from './modals/ShapeSelectorModal.jsx'
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

const PrecinctLayer = ({ data, featureGroupRef, setHasPrecinctLayer }) => {
  const map = useMap()
  useEffect(() => {
    if (!data) return

    const precinctLayer = L.geoJson(data, {
      style: () => ({
        weight: .25,
        color: 'black',
        fillOpacity: 0,
      }),
    })

    featureGroupRef.current.addLayer(precinctLayer)
    setHasPrecinctLayer(true)
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

  container.style.maxHeight = '300px' // Set the height as needed
  container.style.overflowY = 'auto' // Enable vertical scrolling

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

const ShapefileLayer = ({ data, featureGroupRef, precinctShapes, mapping, fields, setHasShapefileLayer, idFieldName }) => {
  const map = useMap()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!data) return

    const shapefileLayer = L.featureGroup()

    const calculateData = async () => {
      setIsLoading(true)
      try {
        const { districtMargins, districtResults } = await calcPartisanAdvantage(data, precinctShapes, fields, mapping, idFieldName)

        L.geoJson(data, {
          style: (feature) => {
            const districtId = feature.properties[idFieldName]

            return {
              color: 'black',
              weight: 2,
              opacity: 1,
              fillColor: districtMargins[districtId],
              fillOpacity: 0.5,
            }
          },
          onEachFeature: (feature, layer) => {
            const districtId = feature.properties[idFieldName]
            layer.on('click', () => {
              const popupContent = createPopupContent(districtResults, districtId)
              layer.bindPopup(popupContent).openPopup()
            })
          },
        }).addTo(shapefileLayer)
      } catch (error) {
        console.error(error)
      }
      setIsLoading(false)
    }


    if (data && precinctShapes && fields && mapping && idFieldName) {
      console.log(isLoading)
      calculateData()
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
    setHasShapefileLayer(true)
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

  const [idFieldName, setIdFieldName] = useState('')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalCompleted, setModalCompleted] = useState(false)
  const [filteredShapes, setFilteredShapes] = useState([])

  const [hasPrecinctLayer, setHasPrecinctLayer] = useState(false)
  const [hasShapefileLayer, setHasShapefileLayer] = useState(false)

  const managePrecinctLayer = () => {
    if (precinctGroupRef.current) {
      precinctGroupRef.current.clearLayers()
      setHasPrecinctLayer(false)
    }
  }

  const manageShapefileLayer = () => {
    if (shapefileGroupRef.current) {
      shapefileGroupRef.current.clearLayers()
      setHasShapefileLayer(false)
    }
  }

  const isSidebarVisible = hasPrecinctLayer || hasShapefileLayer

  useEffect(() => {
    if (shapes && shapes.length > 0) {
      setIsModalOpen(true)
    }
  }, [shapes])

  useEffect(() => {
    mapPointsRef.current = mapPoints
  }, [mapPoints])

  const onCreated = (e) => {
    const layer = e.layer
    const drawnPolygon = layer.toGeoJSON()
    const currentMapPoints = mapPointsRef.current

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
    clearAllData()
  }

  useEffect(() => {
    if (featureGroupRef.current) {
      featureGroupRef.current.clearLayers()
    }

    const addMarkers = (points, color) => {
      points.forEach((point) => {
        const marker = L.marker([point.lat, point.lng], {
          icon: createCustomIcon(color ? color : point.color),
        }).bindTooltip(point.name, {
          permanent: false,
          interactive: true,
          direction: 'top',
        })

        featureGroupRef.current.addLayer(marker)
      })
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

  useEffect(() => {
    featureGroupRef.current = new L.FeatureGroup()
  }, [])

  console.log(isSidebarVisible)

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

          <FeatureGroup ref={precinctGroupRef}>
            {precinctShapes && <PrecinctLayer data={precinctShapes} featureGroupRef={precinctGroupRef} setHasPrecinctLayer={setHasPrecinctLayer} />}
          </FeatureGroup>

          <FeatureGroup ref={shapefileGroupRef}>
            {isShapefileVisible && filteredShapes && modalCompleted &&
            <ShapefileLayer
              data={filteredShapes}
              featureGroupRef={shapefileGroupRef}
              precinctShapes={precinctShapes}
              mapping={electoralFieldMapping}
              fields={electoralFields}
              setHasShapefileLayer={setHasShapefileLayer}
              idFieldName={idFieldName}
            />
            }
          </FeatureGroup>

          <SetViewToBounds points={mapPoints} />

          {isSidebarVisible && (
            <div className={`sidebar ${isSidebarVisible ? 'sidebar-visible' : ''}`}>
              <Button type="primary" onClick={() => managePrecinctLayer(false)} disabled={!hasPrecinctLayer}>Remove Precinct Layer</Button>
              <Button type="primary" onClick={() => manageShapefileLayer(false)} disabled={!hasShapefileLayer}>Remove Shapefile Layer</Button>
            </div>
          )}
        </MapContainer>
      </div>

      <ShapeSelectorModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        shapes={shapes}
        setFilteredShapes={setFilteredShapes}
        setModalCompleted={setModalCompleted}
        idFieldName={idFieldName}
        setIdFieldName={setIdFieldName}
      />
    </>
  )
}

export default InteractiveMapper
