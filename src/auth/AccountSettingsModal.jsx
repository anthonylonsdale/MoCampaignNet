import { Button, Modal, Space } from 'antd'
import React, { useState } from 'react'
import ChangeEmail from './ChangeEmail.jsx'
import ChangePassword from './ChangePassword.jsx'

function AccountSettingsModal({ visible, onCancel }) {
  const [activeTab, setActiveTab] = useState('resetPassword')

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
        <Button
          onClick={() => setActiveTab('resetPassword')}
          type={activeTab === 'resetPassword' ? 'primary' : 'default'}
        >
          Change Password
        </Button>
        <Button
          onClick={() => setActiveTab('changeEmail')}
          type={activeTab === 'changeEmail' ? 'primary' : 'default'}
        >
          Change Email
        </Button>
        {activeTab === 'resetPassword' ? <ChangePassword /> : <ChangeEmail />}
      </Space>
    </Modal>
  )
}

export default AccountSettingsModal
