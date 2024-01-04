import { UserOutlined } from '@ant-design/icons'
import { Button, Form, Input, List, Modal, Tabs, Tag, Typography, message } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { sendPasswordResetEmail } from 'firebase/auth'
import { collection, getDocs } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { usePermissions } from '../auth/Permissions.jsx'
import { auth, db } from '../auth/firebase.jsx'
import './AccountInfoModal.css'

const { TabPane } = Tabs
const { Paragraph, Title } = Typography

function AccountInfoModal({ visible, onClose }) {
  const [form] = useForm()
  const { user, permissions } = usePermissions()
  const [subaccounts, setSubaccounts] = useState([])

  const userInfo = {
    displayName: user?.displayName || 'N/A',
    email: user?.email || 'N/A',
    accountCreationTime: user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleString() : 'N/A',
  }

  const allPermissions = Object.keys(permissions).filter((key) => permissions[key])
  const isAdmin = permissions['Add Users']

  const handleCreateSubaccount = (values) => {
    const subaccountArgs = {
      ...values,
      parentUserUid: user.uid,
    }

    fetch('https://us-central1-leaddrive-pro.cloudfunctions.net/createSubaccount', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subaccountArgs),
    })
        .then((response) => response.json())
        .then(async (data) => {
          if (data.success) {
            sendPasswordResetEmail(auth, values.email)
                .then(() => {
                  message.success('Subaccount created successfully. Password reset email sent.')
                  form.resetFields()
                })
                .catch((error) => {
                  message.error('Failed to send password reset email: ' + error.message)
                })
          } else {
            message.error('Failed to create subaccount: ' + data.error)
          }
        })
        .catch((error) => {
          console.error('Error:', error)
          message.error('Network error: ' + error.message)
        })
  }

  useEffect(() => {
    if (isAdmin) {
      const fetchSubaccounts = async () => {
        const subaccountsCollectionRef = collection(db, 'users', user.uid, 'subaccounts')

        try {
          const querySnapshot = await getDocs(subaccountsCollectionRef)

          const subaccountsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          setSubaccounts(subaccountsData)
        } catch (error) {
          console.error('Error fetching subaccounts:', error)
          message.error('Failed to load subaccounts.')
        }
      }

      fetchSubaccounts()
    }
  }, [user, isAdmin, db])

  return (
    <Modal
      title="Account Information"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', maxHeight: '400px' }}>
        {/* Left half - Profile Details */}
        <div style={{ flex: '1 0 50%', overflowY: 'auto', paddingRight: '10px' }}>
          <Title level={4}>
            <UserOutlined className="admin-icon" /> Profile Details
          </Title>
          <Paragraph><strong>Display Name:</strong> {userInfo.displayName}</Paragraph>
          <Paragraph><strong>Email:</strong> {userInfo.email}</Paragraph>
          <Paragraph><strong>Date Created:</strong> {userInfo.accountCreationTime}</Paragraph>
          {isAdmin ? <Tag color="gold">Admin</Tag> :
            <Paragraph className="admin-contact-info">
              For elevated privileges, please reach out to alonsdale@bernoullitechnologies.net
            </Paragraph>}
        </div>

        {/* Right half - List of Subaccounts */}
        {isAdmin && (
          <div style={{ flex: '1 0 50%', overflowY: 'auto' }}>
            <Title level={4}>Subaccounts</Title>
            <List
              size="small"
              bordered
              dataSource={subaccounts}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={item.displayName}
                    description={
                      <>
                        <div>Email: {item.email}</div>
                        <div>Role: {item.role}</div>
                      </>
                    }
                  />
                </List.Item>
              )}
            />
          </div>
        )}
      </div>
      <Tabs defaultActiveKey="1" >
        <TabPane tab="Permissions" key="1">
          <List
            className="permissions-list"
            size="large"
            header={<Title level={4}>Permissions</Title>}
            bordered
            dataSource={allPermissions}
            renderItem={(permission) => (
              <List.Item className="permissions-list-item">
                <List.Item.Meta
                  title={
                    <span>
                      {permission}
                    </span>
                  }
                />
              </List.Item>
            )}
          />
        </TabPane>
        {isAdmin && (
          <TabPane tab="Create Subaccount" key="2">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleCreateSubaccount}
            >
              <Form.Item
                name="displayName"
                label="Display Name"
                rules={[{ required: true, message: 'Please input the display name!' }]}
              >
                <Input placeholder="Enter display name" />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true, message: 'Please input the email address!' }, { type: 'email', message: 'Please enter a valid email!' }]}
              >
                <Input placeholder="Enter email" />
              </Form.Item>
              <Form.Item
                name="role"
                label="Role"
                rules={[{ required: true, message: 'Please input the role!' }]}
              >
                <Input placeholder="Enter role" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Create Subaccount
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        )}
      </Tabs>
    </Modal>
  )
}

export default AccountInfoModal
