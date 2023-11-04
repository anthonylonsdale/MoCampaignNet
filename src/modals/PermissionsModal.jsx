import { StarOutlined } from '@ant-design/icons'
import { List, Modal, Tag, Typography } from 'antd'
import React from 'react'
import './PermissionsModal.css'

const { Paragraph } = Typography

function PermissionsModal({ visible, onClose, userRole }) {
  const userPermissions = ['View Generic Maps', 'Edit Profile', 'Edit User Settings']
  const additionalAdminPermissions = ['Add Users', 'Remove Users', 'View Premium Data', 'Build and Export Datasets']

  const isAdmin = userRole === 'administrator'

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
      {!isAdmin && (
        <Paragraph className="admin-contact-info">
          For elevated privileges, please reach out to Anthony Lonsdale at <a href="tel:234567890">(816) 872-7762</a> or <a href="mailto:alonsdale@bernoullitechnologies.net">alonsdale@bernoullitechnologies.net</a>.
        </Paragraph>
      )}
    </Modal>
  )
}

export default PermissionsModal
