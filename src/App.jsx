import React from 'react';
import { Layout } from 'antd';

import './styles/App.css';
import Home from './Pages/Home';

const { Content, Header } = Layout;

function App() {
  return (
    <Layout className="layout">
      <Header>
        <div style={{ color: '#fff', fontSize: 32, fontWeight: 'bold' }}>
          The Paratha Store
        </div>
      </Header>
      <Content
        style={{
          padding: '20px 50px 80px 50px',
          overflowY: 'auto',
          height: 'calc(100vh - 134px)',
        }}
      >
        <Home />
      </Content>
    </Layout>
  );
}

export default App;
