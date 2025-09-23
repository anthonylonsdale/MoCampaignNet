import { Row, Col, Card, Typography, Tag, Carousel, Space } from 'antd'
import { GlobalOutlined, LineChartOutlined, MailOutlined, MessageOutlined, PhoneOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'
import React from 'react'
import styles from './OfferSection.module.css'
import report1 from '../images/page_1.png'
import report2 from '../images/page_2.png'
import report3 from '../images/page_3.png'
import report4 from '../images/page_4.png'
import report5 from '../images/page_5.png'
import report6 from '../images/page_6.png'
import report7 from '../images/page_7.png'
import report8 from '../images/page_8.png'
import robocalls from '../images/robocalling.jpg'
import textmsgs from '../images/text_messages.jpg'
import walkbooks from '../images/Data Analytics Platform 1.JPG'
import sendgrid from '../images/SendgridDashboard.png'

const { Title, Paragraph } = Typography

export default function OfferSectionHelper() {
  const offerData = [
    {
      title: 'Mass Email Campaigns',
      icon: <MailOutlined />,
      points: [
        'Brand-true templates that render cleanly across clients',
        'Audience segmentation that actually moves KPIs',
        'Live dashboards for delivery, opens, clicks, and conversions'
      ],
      tags: ['Branding', 'Segmentation', 'Analytics'],
      images: [sendgrid],
      reverse: false,
    },
    {
      title: 'Mass Text Campaigns',
      icon: <MessageOutlined />,
      points: [
        'High-deliverability P2P & A2P sends with personalization',
        'MMS support for image/video moments that stand out',
        'Compliance guardrails baked in from day one'
      ],
      tags: ['MMS', 'Personalization', 'Compliance'],
      images: [textmsgs],
      reverse: true,
    },
    {
      title: 'Robocalling: Surveys, Polling & Ads',
      icon: <PhoneOutlined />,
      points: [
        'Structured IVR for issue ID and micro-polling',
        'Voicemail drop for efficient message saturation',
        'Elastic capacity for peak GOTV windows'
      ],
      tags: ['IVR', 'Voicemail', 'Scale'],
      images: [robocalls],
      reverse: false,
    },
    {
      title: 'Walkbook Building & Voter Analytics',
      icon: <LineChartOutlined />,
      points: [
        'Deliberate turfing and drive-time aware routing',
        'Behavioral & turnout models to prioritize touches',
        'Actionable dashboards your field can actually use'
      ],
      tags: ['Field Ops', 'Targeting', 'Dashboards'],
      images: [walkbooks],
      reverse: true,
    },
    {
      title: 'Professional Research & Analysis',
      icon: <GlobalOutlined />,
      points: [
        'Clear, defensible briefs for rapid decision-making',
        'District and precinct-level storylines that matter',
        'Interactive visuals for boardrooms & war rooms'
      ],
      tags: ['Forecasting', 'Visuals', 'Decision Support'],
      images: [report1, report2, report3, report4, report5, report6, report7, report8],
      reverse: false,
    },
  ]

  const MotionCard = motion(Card)
  const mediaCol = 14
  const textCol = 10

  const renderImages = (imgs) => {
    const multiple = imgs.length > 1
    return (
      <div className={styles.mediaWrap}>
        {multiple ? (
          <Carousel autoplay dots={true} className={styles.mediaCarousel}>
            {imgs.map((img, i) => (
              <div key={i} className={styles.slide}>
                <img src={img} alt="" className={styles.mediaImg} />
              </div>
            ))}
          </Carousel>
        ) : (
          <div className={styles.slide}>
            <img src={imgs[0]} alt="" className={styles.mediaImg} />
          </div>
        )}
      </div>
    )
  }

  const renderBlock = (o, idx) => {
    const body = (
      <MotionCard
        key={`card-${idx}`}
        className={styles.offerCard}
        hoverable
        initial={{ y: 14, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ type: 'spring', stiffness: 110, damping: 20 }}
      >
        <div className={styles.iconBubble}>{o.icon}</div>
        <Title level={3} className={styles.cardTitle}>{o.title}</Title>
        <Paragraph className={styles.cardSubtitle}>{o.subtitle}</Paragraph>
        <div className={styles.customList}>
          {o.points.map((p, i) => (
            <div key={i} className={styles.customListItem}>
              <span className={styles.bullet} />
              <span>{p}</span>
            </div>
          ))}
        </div>
        <Space wrap size={[6, 6]} className={styles.tagsRow}>
          {o.tags.map((t, i) => (
            <Tag key={i} className={styles.tag}>{t}</Tag>
          ))}
        </Space>
      </MotionCard>
    )

    const media = (
      <motion.div
        key={`media-${idx}`}
        className={styles.mediaCard}
        initial={{ scale: 0.98, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.4 }}
      >
        {renderImages(o.images)}
      </motion.div>
    )

    return (
      <Row key={idx} gutter={[20, 20]} align="middle" className={styles.offerRow}>
        {!o.reverse && (
          <Col xs={24} md={textCol}>
            {body}
          </Col>
        )}
        <Col xs={24} md={mediaCol}>
          {media}
        </Col>
        {o.reverse && (
          <Col xs={24} md={textCol}>
            {body}
          </Col>
        )}
      </Row>
    )
  }

  return <section className={styles.section}>{offerData.map(renderBlock)}</section>
}
