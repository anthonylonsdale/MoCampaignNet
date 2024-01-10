import { useState } from 'react'

const useKnockingFileData = () => {
  const [voterDataFiles, setVoterDataFiles] = useState([])

  const handleAddVoterDataFile = (file) => {
    // Prevent duplicates
    if (!voterDataFiles.some((f) => f.name === file.name)) {
      setVoterDataFiles((currentFiles) => [...currentFiles, file])
    }
  }

  const handleRemoveVoterDataFile = (fileName) => {
    setVoterDataFiles((currentFiles) => currentFiles.filter((f) => f.name !== fileName))
  }

  return {
    fileData: {
      voterDataFiles,
    },
    setFileData: {
      handleAddVoterDataFile,
      handleRemoveVoterDataFile,
    },
  }
}

export default useKnockingFileData
