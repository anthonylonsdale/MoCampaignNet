import { GlobalOutlined, LeftOutlined, LineChartOutlined, MailOutlined, MessageOutlined, PhoneOutlined, RightOutlined } from '@ant-design/icons'
import { Card, Carousel, Col, Divider, Layout, Row, Space, Typography } from 'antd'
import React, { useRef } from 'react'
import CustomHeader from '../components/CustomHeader.jsx'
import AppFooter from '../components/Footer.jsx'
import DotToLineTextAnimation from '../components/styles/DotToLineTextAnimation.jsx'
import TypingEffect from '../components/styles/TypingEffect.jsx'
import logo2 from '../images/JCRPlogo.jpg'
import logo1 from '../images/JacksonCountyLogo.jpg'
import KCCouncil from '../images/KCCouncilMap.png'
import logo4 from '../images/KCFOPLogo.png'
import statehouse from '../images/LegDistrictMap.png'
import logo3 from '../images/NLStrongLogo.jpg'
import schoolboards from '../images/SchoolBoardMap.png'
import sendgrid from '../images/SendgridDashboard.png'
import billallen from '../images/billallen.jpg'
import clonsdale from '../images/chrislonsdale.jpg'
import debbieflorido from '../images/debbieflorido.jpg'
import jayjohnson from '../images/jayjohnson.jpg'
import jennbauer from '../images/jenn_bauer.jpg'
import josiahtown from '../images/josiah_town.jpg'
import lancepollard from '../images/lance_pollard.jpg'
import nathanwillett from '../images/nathanwillett.jpg'
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
import walkbooks from '../images/walkbook_gen.JPG'
import styles from './Homescreen.module.css'

const { Content } = Layout
const { Title, Text } = Typography

function CarouselComponent() {
  const carouselData = [
    { image: clonsdale, text: 'Chris Lonsdale (MO R-38)' },
    { image: billallen, text: 'Bill Allen (MO R-17)' },
    { image: jennbauer, text: 'Jenn Bauer (Liberty Public Schools SB)' },
    { image: jayjohnson, text: 'Jay Johnson (Clay Co Eastern Commissioner)' },
    { image: debbieflorido, text: 'Debbie Florido (Clay Co Health Board)' },
    { image: josiahtown, text: 'Josiah Town (Henry Co Health Board)' },
    { image: lancepollard, text: 'Lance Pollard (Grain Valley School Board)' },
    { image: nathanwillett, text: 'KC Councilman Nathan Willett' },
  ]

  const renderCarouselItem = (item, index) => (
    <div className={styles.carouselItem} key={index}>
      <img className={styles.carouselImage} src={item.image} alt={item.alt} />
      <div className={styles.overlay}>
        <div style={{ fontSize: '24px' }}>{item.text}</div>
      </div>
    </div>
  )

  return (
    <div className={styles.carouselContainer}>
      <Carousel autoplay>
        {carouselData.map(renderCarouselItem)}
      </Carousel>
    </div>
  )
}

function OfferSectionHelper() {
  const offerData = [
    {
      title: 'Mass Email Campaigns',
      icon: <MailOutlined />,
      content: [
        'Custom-designed email templates tailored to campaign branding',
        'Advanced audience segmentation for targeted outreach',
        'Comprehensive analytics for campaign optimization',
      ],
      images: [sendgrid],
      reverse: false,
      size: { height: '25rem' },
    },
    {
      title: 'Mass Text Campaigns',
      icon: <MessageOutlined />,
      content: [
        'Personalized political messaging campaigns with high deliverability rates',
        'Image / Video MMS capabilities for engaging and impactful content',
        'Opt-in and compliance management guaranteed',
      ],
      images: [textmsgs],
      reverse: true,
      size: { height: '25rem' },
    },
    {
      title: 'Robocalling: Surveys, Polling and Advertising',
      icon: <PhoneOutlined />,
      content: [
        'Interactive voice response for surveys and polls',
        'Efficient message delivery with voicemail drop',
        'Scalable solutions for large-scale outreach',
      ],
      images: [robocalls],
      reverse: false,
      size: { height: '28rem' },
    },
    {
      title: 'Walkbook Building and Voter Analytics',
      icon: <LineChartOutlined />,
      content: [
        'Customized and deliberate walkbook creation for effective canvassing',
        'Data-driven voter analytics for informed campaign decisions',
        'Reliable voter data with modeled behavior analytics, party affiliation, and voting records with 85%+ confidence',
      ],
      images: [walkbooks],
      reverse: true,
      size: { height: '28rem' },
    },
    {
      title: 'Professional Research and Analysis',
      icon: <GlobalOutlined />,
      content: [
        'In-depth political trend analysis and forecasting',
        'Data-driven insights into voter behavior and demographics',
        'Advanced analytics for electoral and campaign performance',
        'Interactive data visualizations for complex political scenarios',
      ],
      images: [report1, report2, report3, report4, report5, report6, report7, report8],
      reverse: false,
      size: { height: '42rem' },
    },
  ]

  const renderOfferSection = (offer, index) => {
    const { title, icon, content, images, reverse, size } = offer
    const isMultipleImages = images.length > 1

    return (
      <Row gutter={[16, 16]} className={styles.offerSection} key={index}>
        {!reverse && (
          <Col xs={24} md={12}>
            <Card className={styles.offerCard}>
              <div className={styles.iconStyle}>
                {icon}
              </div>
              <Title level={3}>{title}</Title>
              <div className={styles.customList}>
                {content.map((item, idx) => (<div className={styles.customListItem} key={idx}>{item}</div>))}
              </div>
            </Card>
          </Col>
        )}
        <Col xs={24} md={12} style={{ height: size.height }}>
          {isMultipleImages ? (
            <Carousel autoplay slidesToShow={2} dots={false}>
              {images.map((img, idx) => (
                <div key={idx} style={{ width: '50%', float: 'left' }}>
                  <img src={img} alt={`Description for ${title}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </Carousel>
          ) : (
            <img src={images[0]} alt={`Description for ${title}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          )}
        </Col>
        {reverse && (
          <Col xs={24} md={12}>
            <Card className={styles.offerCard}>
              <div className={styles.iconStyle}>
                {icon}
              </div>
              <Title level={3}>{title}</Title>
              <div className={styles.customList}>
                {content.map((item, idx) => (
                  <div className={styles.customListItem} key={idx}>{item}</div>
                ))}
              </div>
            </Card>
          </Col>
        )}
      </Row>
    )
  }

  return (
    <div>
      {offerData.map(renderOfferSection)}
    </div>
  )
}

function Homescreen() {
  const partnershipRef = useRef()

  return (
    <>
      <CustomHeader />
      <Layout>
        <Content>
          <div className={styles.globalAurora} />

          <Space direction="vertical" size={0} className={styles.pageStack} style={{ width: '100%' }}>
            <div className={styles.recordContainer}>
              <DotToLineTextAnimation text={'Proven Record of Success in Americas Heartland'} />
            </div>

            <div className={styles.heroWrap}>
              {/* removed <div className={styles.aurora} /> */}
              <div className={styles.heroInner}>
                <Text className={styles.headerLead}>Specializing in&nbsp;</Text>
                <TypingEffect
                  phrases={[
                    'Innovative Political Strategies',
                    'Advanced Data Modeling and Analysis',
                    'Affordability and Reliability',
                    'Delivering Conservative Victories',
                  ]}
                  typingSpeed={50}
                  untypeSpeed={25}
                  pauseDuration={1500}
                  className={styles.heroTyping}
                />
              </div>
              <div className={styles.heroShine} />
            </div>
            <div className={styles.metricsWrap}>
              <div className={`${styles.metric} ${styles.card}`}>
                <div className={`${styles.heroTyping} ${styles.calmTyping}`}>1.5M+</div>
                <div className={styles.metricCaption}>TEXT MESSAGES SENT</div>
              </div>

              <div className={`${styles.metric} ${styles.card} ${styles.topRightAccent}`}>
                <div className={`${styles.heroTyping} ${styles.calmTyping}`}>7.5M+</div>
                <div className={styles.metricCaption}>SOCIAL MEDIA IMPRESSIONS</div>
              </div>

              <div className={`${styles.metric} ${styles.card} ${styles.bottomLeftAccent}`}>
                <div className={`${styles.heroTyping} ${styles.calmTyping}`}>50K+</div>
                <div className={styles.metricCaption}>HARD IDs COLLECTED</div>
              </div>

              <div className={`${styles.metric} ${styles.card}`}>
                <div className={`${styles.heroTyping} ${styles.calmTyping}`}>250K+</div>
                <div className={styles.metricCaption}>VOTER ENGAGEMENTS</div>
              </div>
            </div>

            <section className={styles.mapSection}>
              <div className={styles.mapHeader}>
                <h3>Missouri Weekly Ad Spend Timeline</h3>
                <p>
                  Interactive Folium/Leaflet map that animates weekly DMA spend across Missouri.
                  Press play, scrub the slider, or click a DMA for a breakdown.
                </p>
              </div>

              <div className={styles.mapFrame}>
                <iframe
                  src="/maps/timeline.html"
                  title="MO Ad Spend Timeline"
                  loading="lazy"
                  ref={(el) => {
                    if (!el) return;
                    el.onload = () => {
                      try {
                        const w = el.contentWindow;
                        const mapEl = w.document.querySelector('.folium-map');
                        if (!mapEl) return;
                        const map = w[mapEl.id];
                        const go = () => map?.timeDimensionControl?._player?.start?.();
                        if (map?.timeDimension?._availableTimes?.length) go();
                        else map?.timeDimension?.on?.('availabletimeschanged', go);
                      } catch (e) {}
                    };
                  }}
                />
              </div>

              <div className={styles.mapFooter}>
                <span className={styles.badgePython}>Powered by Python · Folium</span>
              </div>
            </section>

            <div className={styles.centerContainer}>
              <div className={styles.heroBadge}>
                <div className={styles.heroInner}>
                  <Text className={styles.heroTyping}>What We Offer</Text>
                </div>
                <div className={styles.heroShine} />
              </div>
            </div>


            <OfferSectionHelper />
          </Space>
        </Content>

        {/* <div>
          <div className={styles.header}>
            Some of our involvement...
          </div>
          <div className={styles.container}>
            <div className={styles.item}>
              <h2>MO State House</h2>
              <img src={statehouse} alt="MO State House Map" className={styles.image} />
            </div>
            <div className={styles.item}>
              <h2>MO School Boards</h2>
              <img src={schoolboards} alt="MO School Boards Map" className={styles.image} />
            </div>
            <div className={styles.item}>
              <h2>KC Council</h2>
              <img src={KCCouncil} alt="KC Council Map" className={styles.image} />
            </div>
            <CarouselComponent />
          </div>
        </div> */}

        {/* <Divider />
        <div className={styles.carouselContainer}>
          <Title level={3}>Our Valued Partnerships</Title>
          <Carousel autoplay ref={partnershipRef}>
            <img className={styles.carouselImage} src={logo1} />
            <img className={styles.carouselImage} src={logo2} />
            <img className={styles.carouselImage} src={logo3} />
            <img className={styles.carouselImage} src={logo4} />
          </Carousel>
          <div className={styles.customArrow} style={{ left: '10px' }} onClick={() => partnershipRef.current.prev()}>
            <LeftOutlined />
          </div>
          <div className={styles.customArrow} style={{ right: '10px' }} onClick={() => partnershipRef.current.next()}>
            <RightOutlined />
          </div>
        </div> */}
      </Layout>
      <AppFooter />
    </>
  )
}

export default Homescreen
