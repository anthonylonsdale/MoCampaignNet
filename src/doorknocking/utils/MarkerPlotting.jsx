import L from 'leaflet'

const createHouseIconSVG = () => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ffffff" width="12px" height="12px">    
  <path d="M0 0h24v24H0V0z" fill="none"/>
  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
</svg>`

const determineColor = (point) => {
  return point.color || '#000000'
}

export const spreadOutVoters = (featureGroupRef, point, voters) => {
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

export const createAndAddMarker = (featureGroupRef, point, latOffset = 0, lngOffset = 0) => {
  const color = determineColor(point)
  const houseIcon = L.divIcon({
    className: 'custom-house-icon marker', // Add 'marker' class to distinguish marker layers
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

export const processKnockingPoints = (featureGroupRef, knockingPoints) => {
  if (featureGroupRef.current) {
    featureGroupRef.current.clearLayers()
  }

  const pointsByLocation = {}
  knockingPoints.forEach((point) => {
    const key = `${point.lat},${point.lng}`
    pointsByLocation[key] = pointsByLocation[key] || []
    pointsByLocation[key].push(point)
  })

  Object.values(pointsByLocation).forEach((points) => {
    if (points.length === 1) {
      createAndAddMarker(featureGroupRef, points[0])
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
      marker.on('click', () => spreadOutVoters(featureGroupRef, mainPoint, points))
    }
  })
}

const isPointInsideShape = (point, shapeLayer) => {
  return shapeLayer.getBounds().contains(point)
}

export const filterMarkersByShape = (featureGroupRef, shape, knockingPoints) => {
  featureGroupRef.current.clearLayers()
  knockingPoints.forEach((point) => {
    const pointLatLng = L.latLng(point.lat, point.lng)
    if (isPointInsideShape(pointLatLng, shape.layer)) {
      createAndAddMarker(featureGroupRef, point)
    }
  })
}
