import React, { useEffect, useRef, useState } from 'react'
import './TypingEffect.css'

import { Typography } from 'antd'

const { Text } = Typography


const TypingEffect = ({ phrases, typingSpeed, untypeSpeed, pauseDuration }) => {
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
        const timeoutId = setTimeout(untype, untypeSpeed)
        timeoutIds.current.push(timeoutId)
      }
    }

    type()

    return () => {
      timeoutIds.current.forEach(clearTimeout)
    }
  }, [currentPhraseIndex, typingSpeed, pauseDuration, phrases])

  return <Text className="typing-effect">{displayedText}</Text>
}

export default TypingEffect
