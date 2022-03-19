/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import {
  Col, Layout, message, Row,
} from 'antd';

import './styles/App.css';
import Home from './Pages/Home';
import Checkout from './Pages/Checkout';
import Cart from './components/Cart';
import { getAllAddons, getAllDishes } from './api';
import Text from './CommonComponents/Text';
import Loading from './CommonComponents/Loading';
import EmptyContent from './CommonComponents/EmptyContent';

const { Content, Header } = Layout;

function App() {
  const [dishes, setDishes] = useState([]);
  const [addons, setAddons] = useState([]);
  // const [cart, setCart] = useState([]);
  const [isCheckout] = useState(false);
  const [productsInCart, setProductsInCart] = useState([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const initialise = async () => {
    try {
      setIsLoading(true);
      const fetchedDishes = await getAllDishes();
      const fetchedAddons = await getAllAddons();
      setIsLoading(false);
      setDishes([...fetchedDishes]);
      setAddons([...fetchedAddons]);
    } catch (e) {
      setIsLoading(false);
      setIsError(true);
      message.error('Error Initialising app');
    }
  };

  useEffect(() => {
    initialise();
  }, []);

  const clearCart = () => {
    setProductsInCart([]);
  };

  const onAddToCart = (item) => {
    console.log('AAA', item);
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
        {isLoading ? (
          <Loading />
        ) : isError ? (
          <EmptyContent label="Oops! An error occurred" />
        ) : isCheckout ? (
          <Checkout />
        ) : (
          <Home dishes={dishes} addons={addons} onAddToCart={onAddToCart} />
        )}
      </Content>
    </Layout>
  );
}

export default App;
