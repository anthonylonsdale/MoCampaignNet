import React from 'react'
import styles from './KnockingContainer.module.css'
import KnockingMap from './KnockingMap.jsx'
import DoorknockingToolPanel from './KnockingToolPanel.jsx'
import useKnockingData from './hooks/useKnockingDataHook.jsx'
import useKnockingFileData from './hooks/useKnockingFileDataHook.jsx'

const KnockingContainer = () => {
  const {
    knockingData,
    setKnockingData,
  } = useKnockingData()

  const {
    fileData,
    setFileData,
  } = useKnockingFileData()

  return (
    <div className={styles.interactiveMapperContainer}>
      <DoorknockingToolPanel
        knockingData={knockingData}
        setKnockingData={setKnockingData}
        fileData={fileData}
        setFileData={setFileData}
      />
      <KnockingMap
        knockingData={knockingData}
      />
    </div>
  )
}

export default KnockingContainer
