import { motion } from 'framer-motion'
import React from 'react'
import './DotToLineTextAnimation.css'; // Make sure to create this CSS file

const DotToLineTextAnimation = ({ text, direction = 'left' }) => {
  const initialX = direction === 'left' ? '-100%' : '100%'

  const lineVariants = {
    hidden: { height: 0 },
    visible: {
      height: '100%',
      transition: { delay: 0.5, duration: 1, ease: 'easeInOut' },
    },
  }

  const coveringLineVariants = {
    hidden: { height: 0 },
    visible: {
      height: '100%',
      transition: {
        duration: 4,
        delay: 2,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatType: 'reverse',
      },
    },
  }

  const textPanelVariants = {
    hidden: { x: initialX, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { delay: 1.5, duration: 1, ease: 'easeOut' },
    },
  }

  const lineClassName = `animated-line ${direction}`
  const coveringLineClassName = `covering-line ${direction}`

  return (
    <div className="animation-container">
      <motion.div
        className={lineClassName}
        variants={lineVariants}
        initial="hidden"
        animate="visible"
      />
      <motion.div
        className={coveringLineClassName}
        variants={coveringLineVariants}
        initial="hidden"
        animate="visible"
      />
      <motion.div
        className="text-panel"
        layout
        variants={textPanelVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.p layout>{text}</motion.p>
      </motion.div>
    </div>
  )
}

export default DotToLineTextAnimation
