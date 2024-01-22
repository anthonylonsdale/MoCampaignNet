import React, { useState } from 'react'
import styles from './EventsToolPanel.module.css'

const EventsToolPanel = () => {
  const [counties, setCounties] = useState([])

  setCounties([])

  return (
    <div className={styles.knockingPanel}>
      <div className={styles.shapeContainer}>
        <h3>COUNTIES</h3>
        <ul>
          {counties.map((county, index) => (
            <li key={index}>{county.properties.NAME}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default EventsToolPanel
