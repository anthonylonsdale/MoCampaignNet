// HtmlDisplay.jsx
import React, { useEffect, useState } from 'react'

import '../htmlfiles/mohouse.html'

function HtmlDisplay({ file }) {
  const [htmlContent, setHtmlContent] = useState('')

  useEffect(() => {
    console.log(`../htmlfiles/${file}`)
    fetch(`../htmlfiles/${file}`)
        .then((response) => response.text())
        .then((data) => setHtmlContent(data))
  }, [file])

  return (
    <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
  )
}

export default HtmlDisplay
