import React, { useRef } from 'react'
import styles from './EventsContainer.module.css'
import EventsMap from './EventsMap.jsx'
import EventsToolPanel from './EventsToolPanel.jsx'
import useCounties from './hooks/useCountiesHook.jsx'
import useEventsData from './hooks/useEventsDataHook.jsx'


const EventsContainer = () => {
  const featureGroupRef = useRef(null)
  const countyNames = useCounties() // Use the custom hook

  const {
    eventsData,
    setEventsData,
    clearData,
  } = useEventsData()


  return (
    <div className={styles.interactiveMapperContainer}>
      <EventsToolPanel
        featureGroupRef={featureGroupRef}
        countyNames={countyNames}
        eventsData={eventsData}
        setEventsData={setEventsData}
        clearData={clearData}
      />
      <EventsMap
        featureGroupRef={featureGroupRef}
        // countyNames={countyNames}
        eventsData={eventsData}
        // setEventsData={setEventsData}
        // clearData={clearData}
      />
    </div>
  )
}

export default EventsContainer
