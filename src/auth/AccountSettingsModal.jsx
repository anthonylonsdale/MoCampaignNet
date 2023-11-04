import { Button, Modal, Space, Tabs, message } from 'antd'
import React, { useState } from 'react'
import ChangeEmail from './ChangeEmail.jsx'
import ChangePassword from './ChangePassword.jsx'

import { getAuth, sendPasswordResetEmail } from 'firebase/auth'

const { TabPane } = Tabs

function AccountSettingsModal({ visible, onCancel }) {
  const [activeTab, setActiveTab] = useState('changePassword')

  const auth = getAuth()

  const sendPasswordReset = () => {
    const currentUser = auth.currentUser
    if (currentUser?.email) {
      sendPasswordResetEmail(auth, currentUser.email)
          .then(() => {
            message.success('Password reset email sent!')
          })
          .catch((error) => {
            message.error(error.message)
          })
    }
  }

  return (
    <Modal
      title="Account Settings"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Close
        </Button>,
      ]}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Change Email" key="changeEmail">
            <ChangeEmail />
          </TabPane>
          <TabPane tab="Change Password" key="changePassword">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
              <ChangePassword />
              <Button type="primary" onClick={sendPasswordReset} style={{ marginTop: 16 }}>
                Send Password Reset Email
              </Button>
            </div>
          </TabPane>
        </Tabs>
      </Space>
    </Modal>
  )
}

export default AccountSettingsModal
