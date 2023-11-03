import { StarOutlined } from '@ant-design/icons'
import { List, Modal, Tag } from 'antd'
import React from 'react'
import './PermissionsModal.css'

function PermissionsModal({ visible, onClose, userRole }) {
  // Define permissions here
  const userPermissions = ['View Generic Maps', 'Edit Profile', 'Edit User Settings']
  const additionalAdminPermissions = ['Add Users', 'Remove Users', 'View Premium Data', 'Build and Export Datasets']

  // Determine if the user is an admin
  const isAdmin = userRole === 'administrator'

  // Function to check if the permission is exclusive to admins
  const isAdminPermission = (permission) => {
    return additionalAdminPermissions.includes(permission)
  }

  const allPermissions = isAdmin ? [...userPermissions, ...additionalAdminPermissions] : userPermissions

  return (
    <Modal
      title="Permissions"
      open={visible}
      onCancel={onClose}
      footer={null}
    >
      <List
        size="large"
        bordered
        dataSource={allPermissions}
        renderItem={(permission) => (
          <List.Item className="permissions-list-item">
            <List.Item.Meta
              title={<span>{isAdminPermission(permission) && <StarOutlined className="admin-icon" />}{permission}</span>}
            />
            {isAdminPermission(permission) && <Tag color="gold">Admin</Tag>}
          </List.Item>
        )}
      />
    </Modal>
  )
}

export default PermissionsModal
