// HtmlDisplay.jsx
import React from 'react'

function HtmlDisplay({ fileName }) {
  const mapUrl = `https://bernoullitechnologies.net/${fileName}.html`

  return (
    <iframe
      src={mapUrl}
      style={{ width: '100%', height: '500px', border: 'none' }}
      title="Folium Map"
    />)
}

export default HtmlDisplay
