/* eslint-disable no-nested-ternary */
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, message, Row } from 'antd';
import _ from 'lodash';
import { func, arrayOf } from 'prop-types';
import React, { useState, useEffect } from 'react';
import { getAllDeliveryRates } from '../api';
import EmptyContent from '../CommonComponents/EmptyContent';
import Loading from '../CommonComponents/Loading';
import Text from '../CommonComponents/Text';
import { Addon, CartProduct, Dish } from '../helper/types';

export default function Checkout({
  dishes, addons, cart, onBack,
}) {
  const [deliveryRate, setDeliveryRates] = useState([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [productsInCart, setProductsInCart] = useState([]);

  const initialise = async () => {
    try {
      setIsLoading(true);
      const fetchedDeliveryRanges = await getAllDeliveryRates();
      setIsLoading(false);
      setDeliveryRates([...fetchedDeliveryRanges]);
      const dishesInCart = cart.map((product) => {
        const dish = _.find(dishes, { id: product.dishID });
        const addonsInCart = product.addons.map((addon) => _.find(addons, { id: addon }));
        return {
          product,
          ...dish,
          addons: addonsInCart,
          quantity: product.quantity,
        };
      });
      setProductsInCart([...dishesInCart]);
      console.log({ deliveryRate, productsInCart });
    } catch (e) {
      setIsLoading(false);
      setIsError(true);
      message.error('Error Fetching app');
    }
  };

  useEffect(() => {
    initialise();
  }, []);

  return isLoading ? (
    <Loading />
  ) : isError ? (
    <EmptyContent label="Oops! An error occurred" />
  ) : (
    <div>
      <div style={{ padding: '12px 0', borderBottom: '1px solid lightgrey' }}>
        <Row align="middle">
          <div style={{ paddingRight: 20 }}>
            <Button
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
              type="link"
              onClick={onBack}
              size="large"
            >
              <ArrowLeftOutlined />
              {' '}
              Back to Home
            </Button>
          </div>
          <div>
            <Text bold={false} size={20}>
              You are about to checkout with
              {' '}
              <span style={{ fontWeight: 'bold' }}>{dishes.length}</span>
              {' '}
              dishes
            </Text>
            <div style={{ fontSize: 10 }}>
              To edit your cart, go back to home
            </div>
          </div>
        </Row>
      </div>
    </div>
  );
}
Checkout.propTypes = {
  dishes: arrayOf(Dish).isRequired,
  addons: arrayOf(Addon).isRequired,
  cart: arrayOf(CartProduct).isRequired,
  onBack: func.isRequired,
};
