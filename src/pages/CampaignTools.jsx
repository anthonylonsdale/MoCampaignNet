import './CampaignTools.css'

import { Button, Layout, Space, Tabs, Typography } from 'antd'
import { GoogleAuthProvider, getAuth, signInWithPopup, signOut } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import * as XLSX from 'xlsx'
import AccountSettingsModal from '../auth/AccountSettingsModal.jsx'
import Auth from '../auth/auth.jsx'
import CustomHeader from '../components/CustomHeader.jsx'
import HtmlDisplay from '../components/HtmlDisplay.jsx'
import Sidebar from '../components/SideBar.jsx'
import ExcelColumnSelector from '../modals/ExcelColumnSelector.jsx'

const { TabPane } = Tabs
const { Content } = Layout
const { Text, Title } = Typography

function CampaignTools() {
  const [user, setUser] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [excelModalVisible, setExcelModalVisible] = useState(false)
  const [excelData, setExcelData] = useState(null)
  const auth = getAuth()

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider()
    try {
      const result = await signInWithPopup(auth, provider)
      setUser(result.user)
    } catch (error) {
      console.error('Sign in error:', error.message)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      setUser(null)
    } catch (error) {
      console.error('Sign out error:', error.message)
    }
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser)
    })
    return () => unsubscribe()
  }, [auth])

  const handleDrop = (acceptedFiles) => {
    if (acceptedFiles.length === 0) return
    const file = acceptedFiles[0]
    const reader = new FileReader()

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result)
      const workbook = XLSX.read(data, { type: 'array' })
      const sheetName = workbook.SheetNames[0]
      const sheet = workbook.Sheets[sheetName]

      const dataDict = {}
      const columns = []

      for (const cell in sheet) {
        if (sheet.hasOwnProperty(cell)) {
          const match = /^([A-Z]+)(\d+)$/.exec(cell)

          if (match) {
            const columnName = match[1]
            const rowNumber = parseInt(match[2], 10)

            if (rowNumber === 1) {
              columns.push(`${sheet[cell].v} (${columnName})`)
              dataDict[columnName] = []
            } else {
              if (!dataDict[columnName]) {
                dataDict[columnName] = []
              }
              dataDict[columnName].push(sheet[cell].v)
            }
          }
        }
      }
      setExcelData({
        sheetName,
        columns,
        data: dataDict,
      })
      setExcelModalVisible(true)
    }
    reader.readAsArrayBuffer(file)
  }

  function generateAndDownloadNewExcelFile(newData) {
    if (!newData || Object.keys(newData).length === 0) {
      return
    }

    const { sheetName, data } = newData
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.aoa_to_sheet([])
    const columns = Object.keys(data)
    XLSX.utils.sheet_add_aoa(worksheet, [columns], { origin: 'A1' })

    const columnData = Object.values(data)
    const maxRows = Math.max(...columnData.map((col) => col.length))
    for (let rowIdx = 0; rowIdx < maxRows; rowIdx++) {
      const rowData = columns.map((col) => data[col][rowIdx])
      XLSX.utils.sheet_add_aoa(worksheet,
          [rowData], { origin: `A${rowIdx + 2}` })
    }

    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
    XLSX.writeFile(workbook, `${sheetName}_filtered.xlsx`)
  }

  function reformatData(excelData, selected) {
    const { data } = excelData
    const newData = {}

    for (const col of selected) {
      const matches = col.match(/\(([^)]+)\)/)
      if (matches) {
        const letters = matches[1] // Get the letters
        newData[col] = data[letters]
      }
    }

    return {
      sheetName: excelData.sheetName,
      columns: selected,
      data: newData,
    }
  }

  const handleColumnSelection = (selected) => {
    setExcelModalVisible(false)

    // Reformat the data to include only the selected columns
    const newExcelData = reformatData(excelData, selected)
    generateAndDownloadNewExcelFile(newExcelData)
  }

  const { getRootProps, getInputProps } = useDropzone({ onDrop: handleDrop })

  const userContainer = () => {
    return (
      <Space direction="vertical" className="user-space">
        <div className="user-info">
          <div className="text-container">
            <Text className="welcome-text">Welcome, {user.displayName}</Text>
            <Button className="action-button" onClick={() =>
              setModalVisible(true)}>
              Account Settings
            </Button>
          </div>
          <div className="button-container">
            <Button className="action-button" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </Space>
    )
  }

  return (
    <Layout className="campaign-layout">
      <ExcelColumnSelector
        visible={excelModalVisible}
        columns={excelData?.columns}
        onCancel={() => setExcelModalVisible(false)}
        onConfirm={handleColumnSelection}
      />
      <AccountSettingsModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
      />
      <CustomHeader />
      <Layout>
        <Sidebar />
        <Content className="content">
          {user ? (
          <>
            <div className="user-container">
              {userContainer()}
            </div>
            <div className="html-container">
              <Title level={4}>
                Common Geographic Subdivisions:
              </Title>
              <Tabs defaultActiveKey="1">
                <TabPane tab="Missouri House Districts (2022)" key="1">
                  <HtmlDisplay fileName={'mohouse'} />
                </TabPane>
                <TabPane tab="Missouri House Districts (2011)" key="2">
                  <HtmlDisplay fileName={'mohouse2011'} />
                </TabPane>
                <TabPane tab="Missouri Senate Districts (2022)" key="3">
                  <HtmlDisplay fileName={'mosenate'} />
                </TabPane>
                <TabPane tab="Missouri Senate Districts (2012)" key="4">
                  <HtmlDisplay fileName={'mosenate2011'} />
                </TabPane>
                <TabPane tab="Missouri Cities (2022)" key="5">
                  <HtmlDisplay fileName={'mocities'} />
                </TabPane>
              </Tabs>
            </div>
            <div className="upload-container">
              <div className="upload-text">
                <p>Drag and drop an Excel file here</p>
                <p>or</p>
                <p>Click to select one</p>
              </div>
              <div {...getRootProps()} className="upload-button">
                <input {...getInputProps()} />
                <Button>Upload Excel File</Button>
              </div>
            </div>
          </>
          ) : (
            <Auth handleSignIn={handleSignIn} />
          )}
        </Content>
      </Layout>
    </Layout>
  )
}

export default CampaignTools
