import { FullscreenOutlined, MinusOutlined } from '@ant-design/icons'
import { Button, Card, Divider } from 'antd'
import React, { useState } from 'react'
import Draggable from 'react-draggable'
import './StatisticsPanel.css'

const StatisticsPanel = () => {
  const [isMinimized, setIsMinimized] = useState(false)

  return (
    <Draggable>
      <div style={{ position: 'absolute', top: 250, zIndex: 1000 }}>
        <Card
          title="Statistics"
          size="small"
          extra={
            <Button type="text" onClick={() =>
              setIsMinimized(!isMinimized)} icon={isMinimized ? <FullscreenOutlined /> : <MinusOutlined />} />
          }
          style={{ width: 300, display: isMinimized ? 'none' : 'block' }}
          headStyle={{ padding: '0 8px' }}
          bodyStyle={{ padding: '8px' }}
          bordered={false}
        >
          <Divider orientation="left">Demographics</Divider>
          <p>Average Population: ...</p>
          <p>Diversity Index: ...</p>

          <Divider orientation="left">Partisan Modeling</Divider>
          <p>Partisan Balance: ...</p>
          <p>Projected Turnout: ...</p>

          <Divider orientation="left">Other Statistics</Divider>
          <p>Additional Statistic 1: ...</p>
          <p>Additional Statistic 2: ...</p>

        </Card>
      </div>
    </Draggable>
  )
}

export default StatisticsPanel
