import React from 'react';
import { Layout } from 'antd';

import './styles/App.css';
import Home from './Pages/Home';
import Text from './commonComponents/Text';

const { Content, Header } = Layout;

function App() {
  return (
    <Layout className="layout">
      <Header>
        <Text size={32} bold color="#fff">
          The Paratha Store

        </Text>
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
