import { Layout, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CustomHeader from '../components/CustomHeader.jsx'
import AppFooter from '../components/Footer.jsx'
import DotToLineTextAnimation from '../components/styles/DotToLineTextAnimation.jsx'
import TypingEffect from '../components/styles/TypingEffect.jsx'
import pythonLogo from '../images/python_logo.png'
import styles from './Homescreen.module.css'
import OfferSectionHelper from '../components/OfferSection.jsx'

const { Content } = Layout
const { Text } = Typography

function useMedia(query) {
  const get = () => (typeof window !== 'undefined' && 'matchMedia' in window) ? window.matchMedia(query).matches : false
  const [matches, set] = useState(get)
  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = (e) => set(e.matches)
    if (mql.addEventListener) mql.addEventListener('change', onChange)
    else mql.addListener(onChange)
    set(mql.matches)
    return () => {
      if (mql.removeEventListener) mql.removeEventListener('change', onChange)
      else mql.removeListener(onChange)
    }
  }, [query])
  return matches
}

function Homescreen() {
  const isMobile = useMedia('(max-width: 768px)')

  return (
    <>
      <CustomHeader />
      <Layout>
        <Content style={{ padding: 0, overflow: 'hidden' }}>
          <div className={styles.globalAurora} />

          <div className={styles.pageStack}>
            <div className={styles.recordContainer}>
              <DotToLineTextAnimation text={'Proven Record of Success in Americas Heartland'} />
            </div>

            <div className={styles.heroWrap}>
              <div className={styles.heroInner}>
                <Text className={styles.headerLead}>Specializing in&nbsp;</Text>
                <TypingEffect
                  phrases={[
                    'Data-Driven Voter Targeting',
                    'Advanced Modeling and Analysis',
                    'Innovative Digital Strategies',
                    'Delivering Republican Victories',
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
                <h3>Missouri 2024 Republican Gubernatorial Primary Weekly Ad Spend Timeline</h3>
                <p>
                  Interactive Folium map that animates weekly DMA spend across Missouri.
                  Press play, scrub the slider, or click a DMA for a breakdown by spending source.
                </p>
              </div>

              {isMobile ? (
                <div className={styles.mapMobileNotice}>
                  <div>
                    <div className={styles.mapMobileTitle}>Best viewed full-screen</div>
                    <div className={styles.mapMobileSub}>
                      Map labels are dense on small screens. Open the timeline in a new tab for a clearer view.
                    </div>
                  </div>
                  <button
                    type="button"
                    className={styles.mapCtaBtn}
                    onClick={() =>
                      window.open(`${process.env.PUBLIC_URL}/mo_dma_spending_timeline.html`, '_blank', 'noopener,noreferrer')
                    }
                  >
                    Open Full Screen
                  </button>
                </div>
              ) : (
                <div className={styles.mapFrame}>
                  <div className={styles.mapInner}>
                    <iframe
                      src={`${process.env.PUBLIC_URL}/mo_dma_spending_timeline.html`}
                      title="MO Ad Spend Timeline"
                      loading="lazy"
                      ref={(el) => {
                        if (!el) return
                        el.onload = () => {
                          try {
                            const w = el.contentWindow
                            const doc = w.document
                            const st = doc.createElement('style')
                            doc.head.appendChild(st)

                            const mapEl = doc.querySelector('.folium-map')
                            if (!mapEl) return
                            const map = w[mapEl.id]
                            const go = () => map?.timeDimensionControl?._player?.start?.()
                            if (map?.timeDimension?._availableTimes?.length) go()
                            else map?.timeDimension?.on?.('availabletimeschanged', go)
                          } catch (e) {}
                        }
                      }}
                    />
                  </div>
                </div>
              )}

              <div className={styles.mapFooter}>
                <span className={styles.badgePython}>
                  <img src={pythonLogo} alt="Python logo" className={styles.pyIconImg} />
                  Powered by Python · Folium
                </span>
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

            <section id="offers" style={{ padding: '8px 20px 24px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
              <OfferSectionHelper />
            </section>

            <div className={styles.testPlatform}>
              <Link to="/contact" className={styles.testButton}>Contact Us</Link>
            </div>
          </div>
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
