import { DeleteOutlined, DesktopOutlined, MobileOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Form, Input, List, Modal, Tabs, Tag, Typography, message } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { sendPasswordResetEmail } from 'firebase/auth'
import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
import { getFunctions, httpsCallable } from 'firebase/functions'
import React, { useEffect, useState } from 'react'
import { getActiveSessions, usePermissions } from '../auth/Permissions.jsx'
import { auth, db } from '../auth/firebase.jsx'
import styles from './AccountInfoModal.module.css'

const { TabPane } = Tabs
const { Paragraph, Title } = Typography

function AccountInfoModal({ visible, onClose }) {
  const [form] = useForm()
  const { user, permissions } = usePermissions()
  const [subaccounts, setSubaccounts] = useState([])
  const [activeSessions, setActiveSessions] = useState([])

  const functions = getFunctions()

  const userInfo = {
    displayName: user?.displayName || 'N/A',
    email: user?.email || 'N/A',
    accountCreationTime: user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleString() : 'N/A',
  }

  const allPermissions = Object.keys(permissions).filter((key) => permissions[key])
  const isAdmin = permissions['Add Users']

  const handleDeleteSubaccount = async (subaccountDocId) => {
    const deleteSubaccountFn = httpsCallable(functions, 'deleteSubaccount')
    try {
      const subaccountDocRef = doc(db, 'users', user.uid, 'subaccounts', subaccountDocId)
      const subaccountDocSnapshot = await getDoc(subaccountDocRef)

      if (!subaccountDocSnapshot.exists) {
        throw new Error('Subaccount not found.')
      }

      const subaccountData = subaccountDocSnapshot.data()
      const deleteResponse = await deleteSubaccountFn({ subaccountUid: subaccountData.uid, parentUserUid: user.uid })
      if (deleteResponse.data.success) {
        message.success('Subaccount deleted successfully.')
        await fetchSubaccounts()
      } else {
        message.error('Failed to delete subaccount: ' + deleteResponse.data.error)
      }
    } catch (error) {
      console.error('Error deleting subaccount:', error)
      message.error('Failed to delete subaccount. Error: ' + error.message)
    }
  }

  const handleCreateSubaccount = async (values) => {
    const createSubaccountFn = httpsCallable(functions, 'createSubaccount')

    try {
      const subaccountArgs = {
        ...values,
        parentUserUid: user.uid,
      }

      const createResponse = await createSubaccountFn(subaccountArgs)

      if (createResponse.data.success) {
        try {
          await sendPasswordResetEmail(auth, values.email)
          message.success('Subaccount created successfully. Password reset email sent.')
          form.resetFields()
          await fetchSubaccounts()
        } catch (error) {
          message.error('Failed to send password reset email: ' + error.message)
        }
      } else {
        message.error('Failed to create subaccount: ' + createResponse.data.error)
      }
    } catch (error) {
      console.error('Error:', error)
      message.error('Failed to create subaccount. Error: ' + error.message)
    }
  }

  const fetchSubaccounts = async () => {
    if (!isAdmin) return

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

  useEffect(() => {
    fetchSubaccounts()
  }, [visible, user, isAdmin])

  useEffect(() => {
    if (visible && user) {
      const fetchSessions = async () => {
        const sessions = await getActiveSessions(user.uid)
        setActiveSessions(sessions.map((session) => ({
          ...session,
          icon: session.deviceType === 'mobile' ? <MobileOutlined /> : <DesktopOutlined />,
        })))
      }
      fetchSessions()
    }
  }, [visible, user])

  const handleTerminateSession = async (session) => {
    // Prevent terminating the current session
    if (session.sessionId === localStorage.getItem('sessionId')) {
      message.error('You cannot terminate the current active session.')
      return
    }

    const invalidateSessionFn = httpsCallable(functions, 'invalidateSession')
    try {
      const invalidateResponse = await invalidateSessionFn({ sessionId: session.sessionId })
      if (invalidateResponse.data.success) {
        setActiveSessions(activeSessions.filter((s) => s.sessionId !== session.sessionId))
        message.success('Session terminated successfully.')
      } else {
        message.error('Could not terminate the session. Please try again.')
      }
    } catch (error) {
      message.error('Failed to terminate session. Error: ' + error.message)
    }
  }

  return (
    <Modal
      title="Account Information"
      open={visible}
      onCancel={onClose}
      footer={null}
      className={styles.modal}
      width={800}
    >
      <div className={styles.accountDetailsContainer}>
        <div className={styles.accountSection}>
          <Title level={4}>
            <UserOutlined className={styles.adminIcon} /> Profile Details
          </Title>
          <Paragraph><strong>Display Name:</strong> {userInfo.displayName}</Paragraph>
          <Paragraph><strong>Email:</strong> {userInfo.email}</Paragraph>
          <Paragraph><strong>Date Created:</strong> {userInfo.accountCreationTime}</Paragraph>
          {isAdmin ? <Tag color="gold">Admin</Tag> : (
            <Paragraph className={styles.adminContactInfo}>
              For elevated privileges, please reach out to alonsdale@bernoullitechnologies.net
            </Paragraph>
          )}
        </div>
        {isAdmin && (
          <div className={`${styles.subaccountsSection} ${styles.scrollbar}`}>
            <Title level={4}>Subaccounts</Title>
            <List
              size="small"
              bordered
              dataSource={subaccounts}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <DeleteOutlined
                      key="delete"
                      className={styles.deleteIcon}
                      onClick={() => handleDeleteSubaccount(item.id)}
                    />,
                  ]}
                >
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
            className={`${styles.permissionsList} ${styles.scrollbar}`}
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

        <TabPane tab="Sessions" key="3">
          <List
            dataSource={activeSessions}
            renderItem={(session) => (
              <List.Item
                actions={[
                  <Button type="link" key={session.id} onClick={() => handleTerminateSession(session)}>
                    Terminate Session
                  </Button>,
                ]}
              >
                {session.icon} IP: {session.ip}, Browser: {session.browser}
              </List.Item>
            )}
          />
        </TabPane>
      </Tabs>
    </Modal>
  )
}

export default AccountInfoModal
