import { Button, Modal, Space } from 'antd'
import React, { useState } from 'react'
import ChangeEmail from './ChangeEmail.jsx'
import ResetPassword from './ResetPassword.jsx'

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
        {activeTab === 'resetPassword' ? <ResetPassword /> : <ChangeEmail />}
      </Space>
    </Modal>
  )
}

export default AccountSettingsModal
