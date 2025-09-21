import React, { useEffect, useRef, useState } from 'react'
import './TypingEffect.css'
import { Typography } from 'antd'

const { Text } = Typography

const TypingEffect = ({ phrases, typingSpeed, untypeSpeed, pauseDuration, className = '' }) => {
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
        const id = setTimeout(untype, pauseDuration)
        timeoutIds.current.push(id)
      } else {
        const id = setTimeout(type, typingSpeed)
        timeoutIds.current.push(id)
      }
    }

    const untype = () => {
      setDisplayedText(currentPhrase.slice(0, index))
      index -= 1
      if (index === 0) {
        setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length)
        const id = setTimeout(type, typingSpeed)
        timeoutIds.current.push(id)
      } else {
        const id = setTimeout(untype, untypeSpeed)
        timeoutIds.current.push(id)
      }
    }

    type()
    return () => timeoutIds.current.forEach(clearTimeout)
  }, [currentPhraseIndex, typingSpeed, pauseDuration, phrases, untypeSpeed])

  return <Text className={`typing-effect ${className}`}>{displayedText}</Text>
}

export default TypingEffect
