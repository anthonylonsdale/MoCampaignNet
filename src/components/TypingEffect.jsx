import React, { useEffect, useRef, useState } from 'react'
import './TypingEffect.css'

import { Typography } from 'antd'

const { Title } = Typography


const TypingEffect = ({ phrases, typingSpeed = 100, pauseDuration = 2000 }) => {
  const [displayedText, setDisplayedText] = useState('')
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0)
  const timeoutIds = useRef([])

  useEffect(() => {
    let index = 0
    const currentPhrase = phrases[currentPhraseIndex]

    const type = () => {
      setDisplayedText(currentPhrase.slice(0, index + 1))
      index += 1
      if (index === currentPhrase.length) {
        const timeoutId = setTimeout(untype, pauseDuration)
        timeoutIds.current.push(timeoutId)
      } else {
        const timeoutId = setTimeout(type, typingSpeed)
        timeoutIds.current.push(timeoutId)
      }
    }

    const untype = () => {
      setDisplayedText(currentPhrase.slice(0, index))
      index -= 1
      if (index === 0) {
        setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length)
        const timeoutId = setTimeout(type, typingSpeed)
        timeoutIds.current.push(timeoutId)
      } else {
        const timeoutId = setTimeout(untype, typingSpeed)
        timeoutIds.current.push(timeoutId)
      }
    }

    type()

    // Cleanup timeouts on component unmount
    return () => {
      timeoutIds.current.forEach(clearTimeout)
    }
  }, [currentPhraseIndex, typingSpeed, pauseDuration, phrases])

  return <Title level={2} className="typing-effect">{displayedText}</Title>
}

export default TypingEffect
