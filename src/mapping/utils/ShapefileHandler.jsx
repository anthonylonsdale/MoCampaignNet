import L from 'leaflet'
import { useEffect } from 'react'
import { useMap } from 'react-leaflet'

const customMarkerIcon = L.icon({
  iconSize: [25, 41],
  iconAnchor: [10, 41],
  popupAnchor: [2, -40],
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.6/dist/images/marker-shadow.png',
})

export default function Shapefile({ data, onFirstMarker }) {
  const map = useMap()

  useEffect(() => {
    if (!data || !map) return

    const geo = L.geoJson(
        { features: [] },
        {
          pointToLayer: function(feature, latlng) {
            return L.marker(latlng, { icon: customMarkerIcon })
          },
          onEachFeature: function popUp(f, l) {
            const out = []
            console.log(f.properties)
            if (f.properties) {
              // eslint-disable-next-line guard-for-in
              for (const key in f.properties) {
                out.push(key + ': ' + f.properties[key])
              }
              l.bindPopup(out.join('<br />'))
            }
          },
        },
    ).addTo(map)

    geo.addData(data)

    if (onFirstMarker && data.features.length > 0) {
      const firstMarker = data.features[0]
      const latlng = [
        firstMarker.geometry.coordinates[1],
        firstMarker.geometry.coordinates[0],
      ]
      onFirstMarker(latlng)
    }
  }, [map, data, onFirstMarker])

  return null
}
