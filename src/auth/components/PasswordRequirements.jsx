import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { List, Progress, Typography } from 'antd'
import React, { useMemo } from 'react'
import './PasswordRequirements.css'

const { Text } = Typography

const PasswordRequirements = ({ password, visible }) => {
  if (!visible) {
    return null
  }

  const requirements = [
    { test: (pw) => pw.length >= 8, text: 'Must include at least 8 characters' },
    { test: (pw) => /[A-Z]/.test(pw), text: 'Must include one uppercase letter' },
    { test: (pw) => /[a-z]/.test(pw), text: 'Must include one lowercase letter' },
    { test: (pw) => /[0-9]/.test(pw), text: 'Must include one digit (0-9)' },
    { test: (pw) => /[!@#$%^&*]/.test(pw), text: 'Must include one special character (!@#$%^&*)' },
  ]

  const calculateStrength = (password) => {
    let strength = 0
    requirements.forEach((req) => {
      if (req.test(password)) strength += 20
    })
    return strength
  }

  const passwordStrength = useMemo(() => calculateStrength(password), [password])

  const getPasswordStrengthLevel = (strength) => {
    if (strength < 40) return 'Weak'
    if (strength < 60) return 'Fair'
    if (strength < 80) return 'Good'
    return 'Strong'
  }

  const getPasswordStrengthColor = (strength) => {
    if (strength < 40) return '#ff4d4f'
    if (strength < 60) return '#faad14'
    if (strength < 80) return '#1890ff'
    return '#52c41a'
  }

  return (
    <div>
      <Text strong>Password Strength: {getPasswordStrengthLevel(passwordStrength)}</Text>
      <Progress
        percent={passwordStrength}
        strokeColor={getPasswordStrengthColor(passwordStrength)}
        showInfo={false}
      />
      <List
        size="small"
        dataSource={requirements}
        renderItem={(item) => (
          <List.Item>
            {item.test(password) ? (
              <CheckCircleOutlined style={{ color: 'green' }} />
            ) : (
              <CloseCircleOutlined style={{ color: 'red' }} />
            )}
            <span style={{ marginLeft: '8px' }}>{item.text}</span>
          </List.Item>
        )}
        className="password-requirements"
      />
    </div>
  )
}

export default PasswordRequirements
