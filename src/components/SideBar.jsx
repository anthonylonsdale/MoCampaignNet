import React from 'react'
import {Button, Layout, Menu} from 'antd'
import {
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons'


const {Sider, Content} = Layout

function Sidebar({collapsed, toggleSidebar}) {
  return (
    <Layout style={{minHeight: '100vh'}}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <Menu theme="dark" mode="vertical" defaultSelectedKeys={['1']}>
          <Menu.Item key="1" icon={<HomeOutlined />}>
            Home
          </Menu.Item>
          <Menu.Item key="2" icon={<UserOutlined />}>
            Profile
          </Menu.Item>
          <Menu.Item key="3" icon={<SettingOutlined />}>
            Settings
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        {collapsed ? (
            <Button
              className="trigger"
              onClick={toggleSidebar}
              icon={<MenuUnfoldOutlined />}
            />
          ) : (
            <Button
              className="trigger"
              onClick={toggleSidebar}
              icon={<MenuFoldOutlined />}
            />
          )}
        <Content
          className="site-layout-background"
          style={{
            padding: 24,
            minHeight: 280,
            transition: 'margin-left 0.3s',
            marginLeft: collapsed ? 80 : 200, // Adjust the width when collapsed
          }}
        >
          Content goes here.
        </Content>
      </Layout>
    </Layout>
  )
}

export default Sidebar
