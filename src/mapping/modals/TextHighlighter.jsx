import { Alert, Button, Modal } from 'antd'
import React, { useRef, useState } from 'react'
import './TextHighlighter.css'

const TextHighlighter = ({ text, onHighlightsChange }) => {
  const [highlights, setHighlights] = useState([])
  const [activeCategory, setActiveCategory] = useState(null)
  const textRef = useRef(null)

  const categories = ['type', 'year', 'office', 'party', 'candidate']

  const onMouseUp = () => {
    if (activeCategory && textRef.current) {
      const textSelection = window.getSelection()
      if (!textSelection.isCollapsed) {
        const range = textSelection.getRangeAt(0)
        let start = range.startOffset
        let end = range.endOffset

        const parentNode = range.startContainer.parentNode

        if (textRef.current.contains(parentNode)) {
          let node = parentNode.previousSibling
          while (node) {
            if (node.nodeType === Node.TEXT_NODE) {
              start += node.textContent.length
              end += node.textContent.length
            }
            node = node.previousSibling
          }
        }

        if (range.startContainer.nodeType === Node.TEXT_NODE && range.startContainer !== textRef.current) {
          const textNodes = Array.from(textRef.current.childNodes).filter((n) => n.nodeType === Node.TEXT_NODE)
          for (const node of textNodes) {
            if (node === range.startContainer) {
              break
            }
            start += node.textContent.length
          }
        }

        const newHighlights = [...highlights, {
          start,
          end,
          category: activeCategory,
        }]

        setHighlights(newHighlights)
        onHighlightsChange(newHighlights)
        setActiveCategory(null)
        textSelection.removeAllRanges()
      }
    }
  }


  const resetHighlights = () => {
    setHighlights([])
  }

  const renderTextWithHighlights = () => {
    let position = 0
    const elements = []

    const sortedHighlights = highlights.sort((a, b) => a.start - b.start)

    sortedHighlights.forEach((highlight, index) => {
      if (highlight.start > position) {
        elements.push(<span key={`text-${index}`}>{text.substring(position, highlight.start)}</span>)
      }
      elements.push(
          <span key={`highlight-${index}`} className={`highlight ${highlight.category}`}>
            {text.substring(highlight.start, highlight.end)}
          </span>,
      )
      position = highlight.end
    })

    elements.push(<span key="text-end">{text.substring(position)}</span>)
    return elements
  }

  return (
    <div>
      <div className="category-container">
        {categories.map((category) => (
          <span
            key={category}
            className={`category-tag ${activeCategory === category ? 'active' : ''}`}
            onClick={() => setActiveCategory(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </span>
        ))}
      </div>
      <div className="renderedtext" onMouseUp={onMouseUp} ref={textRef}>
        {renderTextWithHighlights()}
      </div>
      <Button onClick={resetHighlights}>Reset Highlights</Button>
    </div>
  )
}

export const HighlightModal = ({ text, onFinalize, visible, setVisible }) => {
  const [highlights, setHighlights] = useState([])

  const handleHighlightsChange = (newHighlights) => {
    setHighlights(newHighlights)
  }

  return (
    <Modal
      title="Highlight Electoral Field Segments"
      open={visible}
      onOk={() => {
        onFinalize(highlights)
        setVisible(false)
      }}
      onCancel={() => setVisible(false)}
    >
      <TextHighlighter text={text} onHighlightsChange={handleHighlightsChange} />
      <Alert
        message="This tool assumes that every electoral field you have classified is the same length, and uses the segments here to categorize every field by election and office sought."
        type="warning"
        showIcon
        style={{ marginTop: '1rem' }}
      />
    </Modal>
  )
}
