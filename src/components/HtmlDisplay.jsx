import React from 'react'

function HtmlDisplay({ fileName }) {
  // pulls from public html files that I have committed on Github
  const mapUrl = `https://bernoullitechnologies.net/${fileName}.html`

  return (
    <iframe
      src={mapUrl}
      style={{ width: '100%', height: '35rem', border: 'none' }}
      title="Folium Map"
    />)
}

export default HtmlDisplay
