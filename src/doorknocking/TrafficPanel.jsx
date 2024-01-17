import { FullscreenOutlined, MinusOutlined } from '@ant-design/icons'
import { Button, Card, Divider } from 'antd'
import React, { useState } from 'react'
import Draggable from 'react-draggable'

const RoadwayMetricsPanel = ({ roadMetrics }) => {
  const [isMinimized, setIsMinimized] = useState(false)

  return (
    <Draggable>
      <div style={{ position: 'absolute', top: 300, zIndex: 1000 }}>
        <Card
          title="Roadway Metrics"
          size="small"
          extra={
            <Button type="text" onClick={() => setIsMinimized(!isMinimized)}
              icon={isMinimized ? <FullscreenOutlined /> : <MinusOutlined />} />
          }
          style={{ width: 350, display: isMinimized ? 'none' : 'block' }}
          headStyle={{ padding: '0 8px' }}
          bodyStyle={{ padding: '8px' }}
          bordered={false}
        >
          <>
            <Divider orientation="left">Road Information</Divider>
            <p>Total Distance: {roadMetrics.totalDistance} meters</p>
            <p>Road Types: {roadMetrics.roadTypes.join(', ')}</p>
          </>
        </Card>
      </div>
    </Draggable>
  )
}

export default RoadwayMetricsPanel
