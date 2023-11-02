import { Modal } from 'antd'
import React from 'react'

function PermissionsModal({ visible, onClose, permissions }) {
  return (
    <Modal
      title="Permissions"
      open={visible}
      onCancel={onClose}
      footer={null}
    >
      <ul>
        {permissions.map((permission) => (
          <li key={permission}>{permission}</li>
        ))}
      </ul>
    </Modal>
  )
}

export default PermissionsModal
