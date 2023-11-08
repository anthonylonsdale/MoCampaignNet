import { Button, Layout, Modal, Typography } from 'antd'
import React, { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import CustomHeader from '../components/CustomHeader.jsx'
import AppFooter from '../components/Footer.jsx'
import file from '../docs/Anthony Lonsdale Resume 23.pdf'
import './Portfolio.css'
import PyCharmCodeDisplay from './PortfolioComponents/PythonCode.jsx'
import ReactCodeDisplay from './PortfolioComponents/ReactCode.jsx'

const { Title, Text } = Typography
pdfjs.GlobalWorkerOptions.workerSrc =
`//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

function Portfolio() {
  const [isModalVisible, setIsModalVisible] = useState(false)

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  return (
    <>
      <Layout className="campaign-layout">
        <CustomHeader />
        <div className='flex-container'>
          <Title level={3}>Project Collection</Title>
        </div>
        <div className="portfolio-container">
          <div className="portfolio-item">
            <Title level={3}>Algorithmic Trader</Title>
            <Text>Shown below is the main entry point of the project which combines together every data fetch, storage and analysis function included. The entire project is 9,500 lines of code which uses custom developed functions to analyze raw tick data from exchanges, and execute paper trades using the Alpaca Brokerage API </Text>
            <PyCharmCodeDisplay />
          </div>
          <div className="portfolio-item">
            <Title level={3}>Collection of Projects</Title>
            <ReactCodeDisplay />
            <Title level={5}>
            View the rest here...
            </Title>
          </div>
        </div>
        <Modal
          title="Resume PDF"
          open={isModalVisible}
          onCancel={handleCancel}
          footer={[
            <Button key="back" onClick={handleCancel}>
            Close
            </Button>,
          ]}
          width={700}
        >
          <Document file={file}>
            <Page pageNumber={1} />
          </Document>
        </Modal>
        <div className='flex-container'>
          <Title level={3} style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }} onClick={showModal}>Resume</Title>
        </div>
      </Layout>
      <AppFooter />
    </>
  )
}

export default Portfolio
