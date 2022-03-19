import React, { useState } from 'react';
import { Col, Layout, Row } from 'antd';

import './styles/App.css';
import Home from './Pages/Home';
import Text from './CommonComponents/Text';
import Checkout from './Pages/Checkout';
import Cart from './components/Cart';

const { Content, Header } = Layout;

function App() {
  // const [inventory, setInventory] = useState([]);
  const [isCheckout] = useState(false);
  const [productsInCart, setProductsInCart] = useState([]);

  const clearCart = () => {
    setProductsInCart([]);
  };

  return (
    <Layout className="layout">
      <Header>
        <Row align="middle" justify="space-between">
          <Col span={12}>
            <Text size={32} bold color="#fff">
              The Paratha Store
            </Text>
          </Col>
          <Col
            span={6}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Cart products={productsInCart} clearCart={clearCart} />
          </Col>
        </Row>
      </Header>
      <Content
        style={{
          padding: '20px 50px 80px 50px',
          overflowY: 'auto',
          height: 'calc(100vh - 134px)',
        }}
      >
        {isCheckout ? <Checkout /> : <Home />}
      </Content>
    </Layout>
  );
}

export default App;
