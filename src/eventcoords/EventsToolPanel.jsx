import { Button, List, Pagination, Typography } from 'antd'
import React, { useState } from 'react'
import styles from './EventsToolPanel.module.css'
import CountyInfoView from './components/CountyInfoView.jsx'

const { Text } = Typography

const EventsToolPanel = ({ countyNames, eventsData, setEventsData }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [isPanelExpanded, setIsPanelExpanded] = useState(false)

  const { selectedCounty } = eventsData
  const { setSelectedCounty } = setEventsData

  const itemsPerPage = 10
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentCounties = countyNames.slice(indexOfFirstItem, indexOfLastItem)


  const handleCountyClick = (county) => {
    setIsPanelExpanded(true)
    setSelectedCounty(county)
  }

  const handleBackClick = () => {
    setIsPanelExpanded(false)
    setSelectedCounty(null)
  }

  return (
    <div className={isPanelExpanded ? styles.knockingPanelExpanded : styles.knockingPanel }>
      <div className={styles.sectionContainer}>
        {isPanelExpanded ? (
          <>
            <h3>{selectedCounty}</h3>
            <Button onClick={handleBackClick} className={styles.modernButton}>Back</Button>
            <CountyInfoView selectedCounty={selectedCounty}/>
          </>
        ) : (
          <div className={styles.countyContainer}>
            <h3>COUNTIES</h3>
            <List
              itemLayout="horizontal"
              dataSource={currentCounties}
              renderItem={(county) => (
                <List.Item className={styles.listItem} key={county} onClick={() => handleCountyClick(county)}>
                  <List.Item.Meta title={<Text strong>{county}</Text>} />
                </List.Item>
              )}
            />
            <Pagination
              current={currentPage}
              onChange={(page) => setCurrentPage(page)}
              pageSize={itemsPerPage}
              total={countyNames.length}
              className={styles.pagination}
              itemClassName={styles.paginationItem}
              activeClassName={styles.paginationItemActive}
              showSizeChanger={false}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default EventsToolPanel
