/* eslint-disable no-nested-ternary */
import {
  ArrowLeftOutlined,
  CaretDownFilled,
  CaretUpFilled,
} from '@ant-design/icons';
import {
  Button, Col, message, Row,
} from 'antd';
import _ from 'lodash';
import { func, arrayOf } from 'prop-types';
import React, { useState, useEffect } from 'react';
import { getAllDeliveryRates } from '../api';
import EmptyContent from '../CommonComponents/EmptyContent';
import Loading from '../CommonComponents/Loading';
import Text from '../CommonComponents/Text';
import { getProductCost, getTotalCost } from '../helper/functions';
import {
  Addon, CartProduct, Dish, DishInCart,
} from '../helper/types';

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
      <div style={{ padding: '20px 0' }}>
        <Row
          align="middle"
          style={{
            borderBottom: '1px solid #000',
            paddingBottom: 4,
            marginBottom: 4,
          }}
        >
          <Col span={8} offset={2}>
            <Text underline size={20}>
              Name
            </Text>
          </Col>
          <Col span={4}>
            <Text underline size={20}>
              Quantity
            </Text>
          </Col>
          <Col span={4}>
            <Text underline size={20}>
              Price
            </Text>
          </Col>
          <Col span={4}>
            <Text underline size={20}>
              Dish Total
            </Text>
          </Col>
          <Col span={2}>
            <Text underline size={20}>
              SubTotal
            </Text>
          </Col>
        </Row>
        {productsInCart.map((product) => (
          <DishCard key={JSON.stringify(product)} dish={product} />
        ))}
        <Row
          align="middle"
          style={{ padding: '12px 0', border: '1px solid #000' }}
        >
          <Col span={12} offset={2}>
            <Text bold size={22}>
              Cart SubTotal:
            </Text>
          </Col>
          <Col span={2} offset={8}>
            <Text bold underline size={22}>
              {`Rs. ${getTotalCost(productsInCart)}`}
            </Text>
          </Col>
        </Row>
        <Row style={{ padding: '20px 0' }} align="middle">
          <Col span={12}>
            <Text bold size={22}>
              Delivery Charges:
            </Text>
          </Col>
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

function DishCard({ dish }) {
  const [showAddons, setShowAddons] = useState(false);
  return (
    <div style={{ padding: '4px 0', borderBottom: '1px solid lightgrey' }}>
      <Row align="middle" style={{ padding: '8px 0' }}>
        <Col span={2}>
          {dish.addons.length > 0
            && (showAddons ? (
              <CaretUpFilled onClick={() => setShowAddons(false)} />
            ) : (
              <CaretDownFilled onClick={() => setShowAddons(true)} />
            ))}
        </Col>
        <Col span={8}>
          <Text bold size={20}>
            {dish.name}
          </Text>
        </Col>
        <Col span={4}>
          <Text bold size={20}>
            {dish.quantity}
          </Text>
        </Col>
        <Col span={4}>
          <Text bold size={20}>
            {`Rs. ${dish.price}`}
          </Text>
        </Col>
        <Col span={4}>
          <Text bold size={20}>
            {`Rs. ${dish.price * dish.quantity}`}
          </Text>
        </Col>
      </Row>
      {showAddons && (
        <div style={{ padding: '8px 0' }}>
          {dish.addons.map((addon) => (
            <Row align="middle" style={{ padding: '8px 0' }}>
              <Col span={10} offset={2}>
                <Text size={20}>{addon.name}</Text>
              </Col>
              <Col span={4} offset={2}>
                <Text size={20}>{`Rs. ${addon.price}`}</Text>
              </Col>
            </Row>
          ))}
        </div>
      )}
      <Row align="middle">
        <Col span={12} offset={2}>
          <Text size={14}>Subtotal</Text>
        </Col>
        <Col span={2} offset={8}>
          <Text bold underline size={20}>{`Rs. ${getProductCost(dish)}`}</Text>
        </Col>
      </Row>
    </div>
  );
}
DishCard.propTypes = {
  dish: DishInCart.isRequired,
};
