import { CarOutlined, DeleteOutlined, EditOutlined, EyeInvisibleOutlined, EyeOutlined, FilterOutlined, IdcardOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { Button, Collapse, List, Pagination, Popconfirm, Tooltip, Upload, message } from 'antd'
import { getFunctions, httpsCallable } from 'firebase/functions'
import getDistance from 'geolib/es/getDistance'
import osmtogeojson from 'osmtogeojson'
import React, { useEffect, useState } from 'react'
import LoadingScreen from '../LoadingScreen.jsx'
import styles from './KnockingToolPanel.module.css'
import ExcelDataPlotModal from './modals/ExcelDataPlotModal.jsx'
import { addRoadData, addRoadMetrics, getRoadData, getRoadMetrics } from './utils/IndexedDBUtils.jsx'
import { filterMarkersByShape } from './utils/MarkerPlotting.jsx'

const { Panel } = Collapse
const { Dragger } = Upload


const DoorknockingToolPanel = ({ knockingData, setKnockingData, fileData, setFileData, featureGroupRef }) => {
  const { knockingPoints, drawnShape, selectedShapeForEditing } = knockingData
  const { setKnockingPoints, setSelectedShapeForEditing, setRoadMetrics } = setKnockingData
  const { voterDataFiles } = fileData
  const { handleAddVoterDataFile, handleRemoveVoterDataFile } = setFileData

  const [isLoading, setIsLoading] = useState(false)

  const [voterDataModalVisible, setVoterDataModalVisible] = useState(false)
  const [currentVoterDataFile, setCurrentVoterDataFile] = useState(null)
  const [drawnShapeList, setDrawnShapeList] = useState([])
  const [roadMapRetrieved, setRoadMapRetrieved] = useState({})
  const [roadLayers, setRoadLayers] = useState({})
  const [roadTypes, setRoadTypes] = useState(new Set())

  const [currentPage, setCurrentPage] = useState(1)
  const shapesPerPage = 5
  const indexOfLastShape = currentPage * shapesPerPage
  const indexOfFirstShape = indexOfLastShape - shapesPerPage
  const currentShapes = drawnShapeList.slice(indexOfFirstShape, indexOfLastShape)
  const totalShapes = drawnShapeList.length

  const functions = getFunctions()
  const getRoadMap = httpsCallable(functions, 'getStreetDataFromPolygon')

  const handleVoterData = (file) => {
    setCurrentVoterDataFile(file)
    setVoterDataModalVisible(true)
  }

  const genIcons = (iconType) => {
    const IconComponent = iconComponents[iconType]

    return (
      <IconComponent
        onClick={(event) => {
          event.stopPropagation()
        }}
      />
    )
  }

  const iconComponents = {
    voterId: IdcardOutlined,
    traffic: CarOutlined,
  }

  const renderImportTooltip = (tooltipCode) => {
    let tooltipText
    switch (tooltipCode) {
      case 1:
        tooltipText = 'Upload a .csv or Excel file with voter data.'
        break
      case 2:
        tooltipText = 'Upload a .csv or Excel file with district information.'
        break
      case 3:
        tooltipText = 'Upload a .zip file containing shapefiles.'
        break
      case 4:
        tooltipText = 'Upload a .zip file containing precinct results.'
        break
      default:
        tooltipText = 'No tooltip available.'
    }

    return (
      <Tooltip
        title={<span style={{ fontWeight: 600, color: 'white' }}>{tooltipText}</span>}
        color="#0052cc"
      >
        <InfoCircleOutlined style={{ marginLeft: '1rem' }} />
      </Tooltip>
    )
  }

  useEffect(() => {
    if (drawnShape) {
      if (!drawnShapeList.some((shape) => shape.id === drawnShape.id)) {
        setDrawnShapeList((prevShapes) => [...prevShapes, drawnShape])
      }
    }
  }, [drawnShape])

  const confirmDelete = (shapeId) => {
    const shapeToDelete = drawnShapeList.find((s) => s.id === shapeId)
    if (shapeToDelete && featureGroupRef.current) {
      featureGroupRef.current.removeLayer(shapeToDelete.layer)
    }
    setDrawnShapeList((prevShapes) => prevShapes.filter((s) => s.id !== shapeId))
  }

  const startEditingShape = (shapeId) => {
    const shapeToEdit = drawnShapeList.find((s) => s.id === shapeId)
    if (shapeToEdit) {
      setSelectedShapeForEditing(shapeToEdit)
    }
  }

  const stopEditingShape = (shapeId) => {
    setSelectedShapeForEditing(null)

    const shapeToStopEditing = drawnShapeList.find((s) => s.id === shapeId)
    if (shapeToStopEditing && shapeToStopEditing.layer) {
      shapeToStopEditing.layer.editing.disable()
    }
  }

  const toggleVisibility = (shapeId) => {
    setDrawnShapeList((prevShapes) => {
      const shapeIndex = prevShapes.findIndex((shape) => shape.id === shapeId)
      if (shapeIndex === -1) return prevShapes

      const newShapes = [...prevShapes]
      const shapeToToggle = newShapes[shapeIndex]
      shapeToToggle.visible = !shapeToToggle.visible

      if (shapeToToggle.visible) {
        featureGroupRef.current.addLayer(shapeToToggle.layer)
      } else {
        featureGroupRef.current.removeLayer(shapeToToggle.layer)
      }

      return newShapes
    })
  }

  const handleRetrieveRoadMap = async (shapeId) => {
    const roadMapData = await getRoadMetrics(shapeId)
    if (!roadMapData) {
      const shapeToRetrieve = drawnShapeList.find((s) => s.id === shapeId)
      if (!shapeToRetrieve) {
        console.error('Shape not found.')
        return
      }

      const ne = shapeToRetrieve.bounds._northEast
      const sw = shapeToRetrieve.bounds._southWest
      const bboxData = { north: ne.lat, south: sw.lat, east: ne.lng, west: sw.lng }

      try {
        setIsLoading(true)
        const response = await getRoadMap(bboxData)
        const osmData = response.data

        const geoJsonData = osmtogeojson({ elements: osmData.elements })
        const roadLayer = plotRoadData(geoJsonData, featureGroupRef, shapeId)

        let totalDistance = 0
        roadLayer.eachLayer((layer) => {
          if (layer.feature.geometry.type === 'LineString') {
            const coordinates = layer.feature.geometry.coordinates
            const convertedCoords = coordinates.map((coord) => ({
              longitude: coord[0],
              latitude: coord[1],
            }))

            for (let i = 1; i < convertedCoords.length; i++) {
              totalDistance += getDistance(
                  convertedCoords[i - 1],
                  convertedCoords[i],
              )
            }
          }
        })

        const roadData = { id: shapeId, geoJsonData }
        const roadMetrics = { id: shapeId, totalDistance, roadTypes: Array.from(roadTypes) }
        await addRoadData(roadData)
        await addRoadMetrics(roadMetrics)
        setRoadMetrics(roadMetrics)
        setRoadMapRetrieved((prevState) => ({
          ...prevState,
          [shapeId]: {
            retrieved: true,
            visible: true,
          },
        }))
      } catch (error) {
        console.error('Error retrieving road map:', error)
      } finally {
        setIsLoading(false)
      }
    } else {
      try {
        setIsLoading(true)
        const roadData = await getRoadData(shapeId)
        const roadMetrics = await getRoadMetrics(shapeId)

        if (roadData && roadData.geoJsonData) {
          plotRoadData(geoJsonData, featureGroupRef, shapeId)
        } else {
          console.error('No road data found in IndexedDB for this shape.')
        }

        if (roadMetrics) {
          setRoadMetrics(roadMetrics)
        } else {
          console.error('No road metrics found in IndexedDB for this shape.')
        }

        setRoadMapRetrieved((prevState) => ({
          ...prevState,
          [shapeId]: {
            retrieved: true,
            visible: true,
          },
        }))
      } catch (error) {
        console.error('Error retrieving road map data from IndexedDB:', error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const toggleRoadDataVisibility = (shapeId) => {
    setRoadMapRetrieved((prevState) => {
      const isVisible = !(prevState[shapeId] && prevState[shapeId].visible)
      const updatedState = {
        ...prevState,
        [shapeId]: {
          ...prevState[shapeId],
          visible: isVisible,
        },
      }

      setTimeout(() => {
        const roadLayer = roadLayers[shapeId]
        if (roadLayer) {
          if (isVisible) {
            featureGroupRef.current.addLayer(roadLayer)
          } else {
            try {
              featureGroupRef.current.removeLayer(roadLayer)
            } catch {}
          }
        }
      }, 0)
      return updatedState
    })
  }

  const plotRoadData = (geoJsonData, featureGroupRef, shapeId) => {
    const roadLayer = L.geoJSON(geoJsonData, {
      style: function(feature) {
        const roadStyle = {
          color: '#000',
          weight: 1,
          opacity: 0.95,
        }

        if (feature.properties && feature.properties.highway) {
          const roadType = feature.properties.highway
          roadTypes.add(roadType) // Add the roadType to the set
          switch (roadType) {
            case 'motorway':
              roadStyle.color = '#ff4d4d'
              roadStyle.weight = 2
              break
            case 'primary':
              roadStyle.color = '#ff9900'
              break
            case 'secondary':
              roadStyle.color = '#ffdb4d'
              break
            default:
              roadStyle.color = '#ffffff'
          }
        }
        return roadStyle
      },
    })

    setRoadTypes(new Set(roadTypes))
    roadLayer.shapeId = shapeId
    roadLayer.addTo(featureGroupRef.current)
    setRoadLayers((prevLayers) => ({ ...prevLayers, [shapeId]: roadLayer }))
    return roadLayer
  }

  useEffect(() => {
    return () => {
      try {
        Object.values(roadLayers).forEach((layer) => {
          featureGroupRef.current.removeLayer(layer)
        })
      } catch {}
    }
  }, [roadLayers])

  const handleFilterClick = (shape) => {
    filterMarkersByShape(featureGroupRef, shape, knockingPoints)
  }

  if (isLoading) {
    return (
      <LoadingScreen />
    )
  }

  return (
    <div className={styles.knockingPanel}>
      <div className={styles.sectionContainer}>
        <h3>DATA ENTRY</h3>
        <Collapse expandIconPosition="right">
          <Panel header={<span>Voter Data Import {renderImportTooltip(1)}</span>} key="1" extra={genIcons('voterId')}>
            <div className={styles.uploadContainer}>
              <Dragger
                accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.csv"
                beforeUpload={(file) => {
                  if (!/\.(xlsx|xls|csv)$/i.test(file.name)) {
                    message.error('Uploaded file is not an Excel file', 3)
                    return Upload.LIST_IGNORE
                  }
                  if (voterDataFiles.find((f) => f.name === file.name)) {
                    message.error('This file has already been uploaded.', 3)
                    return Upload.LIST_IGNORE
                  }
                  handleAddVoterDataFile(file)
                  handleVoterData(file)
                  return false
                }}
                multiple={false}
                showUploadList={false}
              >
                <p className="ant-upload-drag-icon">
                  <IdcardOutlined />
                </p>
                <p className={styles.uploadText}>Drag in Excel File</p>
                <p className={styles.uploadText}>or</p>
                <p className={styles.uploadText}>Click to Browse Files</p>
              </Dragger>
              <div className={styles.fileList}>
                {voterDataFiles.map((file, index) => (
                  <div key={index} className={styles.fileItem}>
                    <span onClick={() => handleVoterData(file)}>
                      {file.name}
                    </span>
                    <DeleteOutlined onClick={() => handleRemoveVoterDataFile(file.name)} className={styles.fileDeleteIcon} />
                  </div>
                ))}
              </div>
            </div>
          </Panel>
        </Collapse>
      </div>
      <div className={styles.shapeContainer}>
        <h3>SHAPES</h3>
        <div className={styles.listContainer}>
          <List
            itemLayout="horizontal"
            dataSource={currentShapes}
            renderItem={(shape) => (
              <List.Item key={shape.id} className={styles.listItem}>
                <List.Item.Meta
                  title={shape.name}
                  description={`ID: ${shape.id}`}
                />
                <div className={styles.actionContainer}>
                  {shape.visible ? (
                  <EyeOutlined onClick={() => toggleVisibility(shape.id)} />
                ) : (
                  <EyeInvisibleOutlined onClick={() => toggleVisibility(shape.id)} />
                )}
                  <span className={styles.iconSeparator}></span>
                  <FilterOutlined onClick={() => handleFilterClick(shape)} />
                  <span className={styles.iconSeparator}></span>
                  <EditOutlined onClick={() => startEditingShape(shape.id)} />
                  <span className={styles.iconSeparator}></span>
                  <Popconfirm
                    title="Are you sure you want to delete this shape?"
                    onConfirm={() => confirmDelete(shape.id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <DeleteOutlined />
                  </Popconfirm>
                  {selectedShapeForEditing && selectedShapeForEditing.id === shape.id && (
                    <>
                      <span className={styles.iconSeparator}></span>
                      <Button type="primary" size="small" onClick={() => stopEditingShape(shape.id)}>Apply</Button>
                    </>
                  )}
                </div>
              </List.Item>
            )}
          />
        </div>
        <Pagination
          current={currentPage}
          onChange={(page) => setCurrentPage(page)}
          pageSize={shapesPerPage}
          total={totalShapes}
          className={styles.paginationContainer}
        />
      </div>
      <div className={styles.sectionContainer}>
        <h3>TRAFFIC</h3>
        <Collapse expandIconPosition="right">
          <Panel header={<span>Traffic Data {renderImportTooltip(5)}</span>} key="5" extra={genIcons('traffic')}>
            <List
              itemLayout="horizontal"
              dataSource={drawnShapeList}
              renderItem={(shape) => (
                <List.Item key={shape.id}>
                  <List.Item.Meta
                    title={shape.name}
                    description={`ID: ${shape.id}`}
                  />
                  <div className={styles.actionContainer}>
                    {roadMapRetrieved[shape.id] && roadMapRetrieved[shape.id].retrieved ? (
                      <Button
                        type="primary"
                        size="small"
                        onClick={() => toggleRoadDataVisibility(shape.id)}
                      >
                        {roadMapRetrieved[shape.id].visible ? 'Hide Road Data' : 'Show Road Data'}
                      </Button>
                    ) : (
                      <Button type="primary" size="small" onClick={() => handleRetrieveRoadMap(shape.id)}>
                        Retrieve Road Map
                      </Button>
                    )}
                  </div>
                </List.Item>
              )}
            />
          </Panel>
        </Collapse>
      </div>

      <ExcelDataPlotModal
        visible={voterDataModalVisible}
        onCancel={() => setVoterDataModalVisible(false)}
        droppedFile={currentVoterDataFile}
        setKnockingPoints={setKnockingPoints} // Passed correctly here
      />
    </div>
  )
}

export default DoorknockingToolPanel
