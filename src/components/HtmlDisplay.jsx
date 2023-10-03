// HtmlDisplay.jsx
import React from 'react'

function HtmlDisplay() {
  const mapUrl = 'https://bernoullitechnologies.net/mohouse.html'

  return (
    <iframe
      src={mapUrl}
      style={{ width: '100%', height: '500px', border: 'none' }}
      title="Folium Map"
    />)
}

export default HtmlDisplay
