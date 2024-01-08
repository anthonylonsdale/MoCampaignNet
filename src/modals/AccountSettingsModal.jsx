import { Button, Input, Modal, Space, Tabs, Typography, message } from 'antd'
import { getAuth, sendPasswordResetEmail, updateEmail, updatePassword, updateProfile } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import PasswordRequirements from '../auth/components/PasswordRequirements.jsx'
import styles from './AccountSettingsModal.module.css'

const { TabPane } = Tabs
const { Text } = Typography

function AccountSettingsModal({ visible, onCancel }) {
  const [activeTab, setActiveTab] = useState('changePassword')
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true)
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false)
  const [newDisplayName, setNewDisplayName] = useState('')

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

  const handleChangeDisplayName = async () => {
    try {
      await updateProfile(auth.currentUser, { displayName: newDisplayName })
      message.success('Display name updated successfully.')
    } catch (error) {
      message.error('Error updating display name. Please try again.')
    }
  }

  const handleChangeEmail = async () => {
    try {
      await updateEmail(auth.currentUser, newEmail)
      message.success('Email updated successfully.')
    } catch (error) {
      message.error('Error updating email. Please try again.')
    }
  }

  useEffect(() => {
    const passwordRequirements = [
      newPassword.length >= 8,
      /[A-Z]/.test(newPassword),
      /[a-z]/.test(newPassword),
      /[0-9]/.test(newPassword),
      /[!@#$%^&*]/.test(newPassword),
    ]
    setIsSubmitDisabled(passwordRequirements.some((requirement) => !requirement))
  }, [newPassword])

  const handleChangePassword = async () => {
    const user = auth.currentUser

    try {
      await updatePassword(user, newPassword)
      message.success('Password updated successfully.')
    } catch (error) {
      message.error('Error updating password. Please try again.')
    }
  }


  return (
    <Modal
      title="Account Settings"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel} className={styles.accountSettingsModalAntBtn}>
          Close
        </Button>,
      ]}
      className={styles.accountSettingsModal}
    >
      <Space direction="vertical" className={styles.spaceContainer}>
        <Tabs activeKey={activeTab} onChange={setActiveTab} className={styles.tabsContainerAntTabsNav}>
          <TabPane tab="Change Email" key="changeEmail" className={styles.changeTab}>
            <div className={styles.container}>
              <Text>Enter your new email address:</Text>
              <Input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className={styles.input}
                placeholder="New Email"
                required
              />
              <Button onClick={handleChangeEmail} className={styles.submitButton}>
                Change Email
              </Button>
            </div>
          </TabPane>
          <TabPane tab="Change Password" key="changePassword" className={styles.changePasswordTab}>
            <div className={styles.container}>
              <Text>Enter your new password:</Text>
              <Input.Password
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={styles.input}
                placeholder="New Password"
                required
                visibilityToggle
                onFocus={() => setShowPasswordRequirements(true)}
                onBlur={() => setShowPasswordRequirements(false)}
              />
              <PasswordRequirements password={newPassword} visible={showPasswordRequirements} />
              <Button
                onClick={handleChangePassword}
                className={styles.submitButton}
                disabled={isSubmitDisabled}
              >
                Change Password
              </Button>
            </div>
            <Button type="primary" onClick={sendPasswordReset} className={styles.changePasswordTabPasswordResetButton}>
              Send Password Reset Email
            </Button>
          </TabPane>
          <TabPane tab="Change Display Name" key="changeDisplayName" className={styles.changeTab}>
            <div className={styles.container}>
              <Text>Enter your new display name:</Text>
              <Input
                type="text"
                value={newDisplayName}
                onChange={(e) => setNewDisplayName(e.target.value)}
                className={styles.input}
                placeholder="New Display Name"
                required
              />
              <Button onClick={handleChangeDisplayName} className={styles.submitButton}>
                Change Display Name
              </Button>
            </div>
          </TabPane>
        </Tabs>
      </Space>
    </Modal>
  )
}

export default AccountSettingsModal
