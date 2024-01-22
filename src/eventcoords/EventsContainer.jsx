import React, { useRef } from 'react'
import styles from './EventsContainer.module.css'
import EventsMap from './EventsMap.jsx'
import DoorknockingToolPanel from './EventsToolPanel.jsx'


const EventsContainer = () => {
  const featureGroupRef = useRef(null)

  return (
    <div className={styles.interactiveMapperContainer}>
      <DoorknockingToolPanel
        featureGroupRef={featureGroupRef}
      />
      <EventsMap
        featureGroupRef={featureGroupRef}
      />
    </div>
  )
}

export default EventsContainer
