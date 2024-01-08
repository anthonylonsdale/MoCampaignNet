import { Layout, Typography } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'
import CustomHeader from '../components/CustomHeader.jsx'
import AppFooter from '../components/Footer.jsx'
import styles from './Portfolio.module.css'; // Import the CSS module
import PyCharmCodeDisplay from './PortfolioComponents/PythonCode.jsx'
import ReactCodeDisplay from './PortfolioComponents/ReactCode.jsx'

const { Title, Text } = Typography

function Portfolio() {
  return (
    <>
      <Layout className={styles.campaignLayout}>
        <CustomHeader />
        <div className={styles.flexContainer}>
          <Title level={3}>Software Collection</Title>
        </div>
        <div className={styles.portfolioContainer}>
          <div className={styles.portfolioItem}>
            <Title level={3}>Algorithmic Trader</Title>
            <Text>Shown below is the main entry point...</Text>
            <PyCharmCodeDisplay />
            <Link
              to="https://github.com/anthonylonsdale/Automated_Finance/tree/main/ALGO"
              target="_blank"
              className={styles.sourceLink}
            >
              <Text>View the Full Source Code Here</Text>
            </Link>
          </div>
          <div className={styles.portfolioItem}>
            <Title level={3}>Collection of Projects</Title>
            <Text>Below is (outdated) code for the homescreen...</Text>
            <ReactCodeDisplay />
            <Link
              to="https://github.com/anthonylonsdale/MoCampaignNet/tree/main/src"
              target="_blank"
              className={styles.sourceLink}
            >
              <Text>View the Full Source Code Here</Text>
            </Link>
          </div>
        </div>
      </Layout>
      <AppFooter />
    </>
  )
}

export default Portfolio
