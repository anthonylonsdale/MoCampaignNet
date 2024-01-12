import React, { useRef } from 'react'
import styles from './KnockingContainer.module.css'
import KnockingMap from './KnockingMap.jsx'
import DoorknockingToolPanel from './KnockingToolPanel.jsx'
import useKnockingData from './hooks/useKnockingDataHook.jsx'
import useKnockingFileData from './hooks/useKnockingFileDataHook.jsx'

const KnockingContainer = () => {
  const {
    knockingData,
    setKnockingData,
    clearData,
  } = useKnockingData()
  const {
    fileData,
    setFileData,
  } = useKnockingFileData()

  const featureGroupRef = useRef(null)

  return (
    <div className={styles.interactiveMapperContainer}>
      <DoorknockingToolPanel
        knockingData={knockingData}
        setKnockingData={setKnockingData}
        fileData={fileData}
        setFileData={setFileData}
        featureGroupRef={featureGroupRef}
      />
      <KnockingMap
        knockingData={knockingData}
        setKnockingData={setKnockingData}
        clearData={clearData}
        featureGroupRef={featureGroupRef}
      />
    </div>
  )
}

export default KnockingContainer
