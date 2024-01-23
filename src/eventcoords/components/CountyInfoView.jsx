import { Button, Col, Form, Input, Row } from 'antd'
import { getFunctions, httpsCallable } from 'firebase/functions'
import React, { useEffect, useState } from 'react'
import DynamicTable from './DynamicTable.jsx'

const CountyInfoView = ({ selectedCounty }) => {
  const [grassrootsLeaders, setGrassrootsLeaders] = useState([])
  const [republicanOrgContacts, setRepublicanOrgContacts] = useState([])
  const [grassrootsColumns, setGrassrootsColumns] = useState(['FirstName', 'LastName', 'Email', 'Title', 'Phone #', 'Confirmation', 'Women For Eigel Col.', 'Notes'])
  const [republicanColumns, setRepublicanColumns] = useState(['Group', 'FirstName', 'LastName', 'Email', 'Title', 'Phone #', 'Meeting Days'])

  const [newEntry, setNewEntry] = useState({})
  const [newEntry2, setNewEntry2] = useState({})

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  }

  const handleAddData = async (dataType) => {
    await addDataForCounty(dataType, newEntry)
    setNewEntry({})
    fetchDataForCounty()
  }

  const functions = getFunctions()
  const getDataForCounty = httpsCallable(functions, 'getDataForCounty')
  const addDataToCounty = httpsCallable(functions, 'addDataToCounty')

  const addDataForCounty = async (dataType, documentData) => {
    try {
      await addDataToCounty({
        countyId: selectedCounty,
        dataType,
        dataValues: documentData,
      })
    } catch (error) {
      console.error('Error adding data:', error)
    }
  }

  const fetchDataForCounty = async () => {
    try {
      const grassrootsResponse = await getDataForCounty({ countyId: selectedCounty, dataType: 'grassrootsLeaders' })
      setGrassrootsLeaders(grassrootsResponse.data || [])
      const republicanResponse = await getDataForCounty({ countyId: selectedCounty, dataType: 'republicanOrgContacts' })
      setRepublicanOrgContacts(republicanResponse.data || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    if (selectedCounty) {
      fetchDataForCounty()
    }
  }, [selectedCounty])


  return (
    <div>
      <Form>
        <h4>Add New Grassroots Leader</h4>
        <Row gutter={16}>
          {grassrootsColumns.map((col) => (
            <Col span={8} key={col}>
              <Form.Item {...formItemLayout} label={col}>
                <Input
                  name={col}
                  value={newEntry[col] || ''}
                  onChange={(e) => setNewEntry({ ...newEntry, [e.target.name]: e.target.value })}
                  placeholder={`Enter ${col}`}
                />
              </Form.Item>
            </Col>
          ))}
        </Row>
        <Form.Item wrapperCol={{ span: 24 }}>
          <Button type="primary" onClick={() => handleAddData('grassrootsLeaders')}>
            Add Grassroots Leader
          </Button>
        </Form.Item>
      </Form>
      <Form>
        <h4>Add New Republican Org Contact</h4>
        <Row gutter={16}>
          {republicanColumns.map((col) => (
            <Col span={8} key={col}>
              <Form.Item {...formItemLayout} label={col}>
                <Input
                  name={col}
                  value={newEntry2[col] || ''}
                  onChange={(e) => setNewEntry2({ ...newEntry2, [e.target.name]: e.target.value })}
                  placeholder={`Enter ${col}`}
                />
              </Form.Item>
            </Col>
          ))}
        </Row>
        <Form.Item wrapperCol={{ span: 24 }}>
          <Button type="primary" onClick={() => handleAddData('republicanOrgContacts')}>
                Add Republican Org Contact
          </Button>
        </Form.Item>
      </Form>
      <DynamicTable
        data={grassrootsLeaders}
        setData={setGrassrootsLeaders}
        title="Grassroots Leaders"
        columns={grassrootsColumns}
        setColumns={setGrassrootsColumns}
      />
      <DynamicTable
        data={republicanOrgContacts}
        setData={setRepublicanOrgContacts}
        title="Republican Org Contacts"
        columns={republicanColumns}
        setColumns={setRepublicanColumns}
      />
    </div>
  )
}

export default CountyInfoView
