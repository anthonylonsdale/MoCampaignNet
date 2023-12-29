// PrecinctDataModal.jsx
import { Button, Col, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import './PrecinctDataModal.css'
import { HighlightModal } from './TextHighlighter.jsx'


const PrecinctDataModal = ({ visible, precinctData, onCancel, setElectoralFieldMapping, setElectoralDataFields }) => {
  const [nonElectoralFields, setNonElectoralFields] = useState([])
  const [electoralFields, setElectoralFields] = useState([])
  const [items, setItems] = useState([])

  const [mappingModalVisible, setMappingModalVisible] = useState(false)
  const [currentElectoralField, setCurrentElectoralField] = useState(null)

  const dataFields = precinctData?.[0]?.properties

  useEffect(() => {
    if (visible && electoralFields.length > 0) {
      setCurrentElectoralField(electoralFields[0].content)
    }
  }, [visible, electoralFields])

  const handleMappingFinalized = (mapping) => {
    setElectoralFieldMapping(mapping)
    setElectoralDataFields(electoralFields)
    setMappingModalVisible(false)
    onCancel()
    setNonElectoralFields([])
    setElectoralFields([])
    setItems([])
  }

  const openMappingModal = () => {
    if (electoralFields.length > 0) {
      setMappingModalVisible(true)
    } else {
      alert('No electoral fields to map.')
    }
  }

  useEffect(() => {
    if (visible && dataFields) {
      const newItems = Object.keys(dataFields).map((key, index) => ({
        id: `item-${index}`,
        content: key,
      }))
      setItems(newItems)
    }
  }, [visible, dataFields])

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)
    return result
  }

  const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source)
    const destClone = Array.from(destination)
    const [removed] = sourceClone.splice(droppableSource.index, 1)

    destClone.splice(droppableDestination.index, 0, removed)

    const result = {}
    result[droppableSource.droppableId] = sourceClone
    result[droppableDestination.droppableId] = destClone

    return result
  }

  const onDragEnd = (result) => {
    const { source, destination } = result

    if (!destination) {
      return
    }

    if (source.droppableId === destination.droppableId) {
      const reorderedItems = reorder(
        source.droppableId === 'items' ? items : source.droppableId === 'nonElectoralFields' ? nonElectoralFields : electoralFields,
        source.index,
        destination.index,
      )

      if (source.droppableId === 'items') {
        setItems(reorderedItems)
      } else if (source.droppableId === 'nonElectoralFields') {
        setNonElectoralFields(reorderedItems)
      } else {
        setElectoralFields(reorderedItems)
      }
    } else {
      const result = move(
        source.droppableId === 'items' ? items : source.droppableId === 'nonElectoralFields' ? nonElectoralFields : electoralFields,
        destination.droppableId === 'nonElectoralFields' ? nonElectoralFields : electoralFields,
        source,
        destination,
      )

      setItems(result.items || items)
      setNonElectoralFields(result.nonElectoralFields || nonElectoralFields)
      setElectoralFields(result.electoralFields || electoralFields)
    }
  }

  const assignAllToNonElectoral = () => {
    setNonElectoralFields(nonElectoralFields.concat(items))
    setItems([])
  }

  const assignAllToElectoral = () => {
    setElectoralFields(electoralFields.concat(items))
    setItems([])
  }

  return (
    <>
      <Modal
        title="Import Precinct Data"
        open={visible}
        onCancel={onCancel}
        footer={[
          <Button key="back" onClick={onCancel}>
          Cancel
          </Button>,
          <Button key="finalize" type="primary" onClick={openMappingModal}>
            Finalize Assignments
          </Button>,
        ]}
      >
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="boxes-container">
            <Col span={24} className="assign-buttons-container">
              <Button type="primary" onClick={assignAllToNonElectoral} className="assign-button">
            Assign Remaining to Non-Electoral
              </Button>
              <Button type="primary" onClick={assignAllToElectoral} className="assign-button">
            Assign Remaining to Electoral
              </Button>
            </Col>
            <Droppable droppableId="items">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="pool">
                  <h3>Unassigned Fields</h3>
                  <div className="field-container">
                    {items.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="draggable-bubble"
                          >
                            {item.content}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
            <Droppable droppableId="nonElectoralFields">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="droppable-area">
                  <h3>Non-Electoral Data</h3>
                  <div className="field-container">
                    {nonElectoralFields.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="draggable-bubble"
                          >
                            {item.content}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
            <Droppable droppableId="electoralFields">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="droppable-area">
                  <h3>Electoral Data</h3>
                  <div className="field-container">
                    {electoralFields.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="draggable-bubble"
                          >
                            {item.content}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          </div>
        </DragDropContext>
      </Modal>

      <HighlightModal text={currentElectoralField} onFinalize={handleMappingFinalized} visible={(mappingModalVisible)} setVisible={setMappingModalVisible} />
    </>
  )
}

export default PrecinctDataModal
