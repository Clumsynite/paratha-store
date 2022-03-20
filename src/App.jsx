/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import {
  Col, Layout, message, Row,
} from 'antd';

import './styles/App.css';
import _ from 'lodash';
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
  const [isCheckout, setIsCheckout] = useState(false);
  const [productsInCart, setProductsInCart] = useState([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCartVisible, setIsCartVisible] = useState(false);

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

  const onAddToCart = (dishID, selectedAddons) => {
    const cartID = JSON.stringify(`${dishID}${selectedAddons.sort()}`);
    const relatedDishInCart = _.find(productsInCart, { cartID });
    let clonedProductsInCart = [...productsInCart];
    if (relatedDishInCart) {
      clonedProductsInCart = _.map(clonedProductsInCart, (product) => (product.cartID === cartID
        ? { ...product, quantity: product.quantity + 1 }
        : product));
    } else {
      clonedProductsInCart.push({
        cartID,
        dishID,
        quantity: 1,
        addons: selectedAddons,
      });
    }
    setProductsInCart([...clonedProductsInCart]);
  };

  const onRemoveFromCart = (dishID, selectedAddons) => {
    const cartID = JSON.stringify(`${dishID}${selectedAddons.sort()}`);
    const relatedDishInCart = _.find(productsInCart, { cartID });
    let clonedProductsInCart = [...productsInCart];
    if (relatedDishInCart) {
      clonedProductsInCart = _.map(clonedProductsInCart, (product) => (product.cartID === cartID
        ? { ...product, quantity: product.quantity - 1 }
        : product));
    }
    clonedProductsInCart = _.filter(
      clonedProductsInCart,
      (product) => product.quantity > 0,
    );

    setProductsInCart([...clonedProductsInCart]);
  };

  const onCheckout = () => {
    setIsCartVisible(false);
    setIsCheckout(true);
  };

  return (
    <Layout className="layout">
      <Header>
        <Row align="middle" justify="space-between">
          <Col
            span={12}
            onClick={() => setIsCheckout(false)}
            style={{ cursor: 'pointer' }}
          >
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
            {!isCheckout && (
              <Cart
                products={productsInCart}
                clearCart={clearCart}
                dishes={dishes}
                addons={addons}
                onAddToCart={onAddToCart}
                onRemoveFromCart={onRemoveFromCart}
                onCheckout={onCheckout}
                isCartVisible={isCartVisible}
                setIsCartVisible={setIsCartVisible}
              />
            )}
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
          <Checkout
            dishes={dishes}
            addons={addons}
            cart={productsInCart}
            onBack={() => setIsCheckout(false)}
          />
        ) : (
          <Home
            cart={productsInCart}
            dishes={dishes}
            addons={addons}
            onAddToCart={onAddToCart}
            onRemoveFromCart={onRemoveFromCart}
          />
        )}
      </Content>
    </Layout>
  );
}

export default App;
