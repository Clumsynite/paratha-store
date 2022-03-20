import React, { useState, useEffect } from 'react';
import {
  Button, Checkbox, Col, Row,
} from 'antd';
import { arrayOf, func } from 'prop-types';
import _ from 'lodash';
import { MinusSquareFilled, PlusSquareFilled } from '@ant-design/icons';
import Text from '../CommonComponents/Text';
import { Addon, CartProduct, Dish } from '../helper/types';
import '../styles/DishCard.css';

export default function DishCard({
  cart,
  dish,
  addons,
  onAddToCart,
  onRemoveFromCart,
}) {
  const { name, price } = dish;
  const quantity = _.sumBy(cart, 'quantity');
  const [dishQuantity, setDishQuantity] = useState(quantity || 0);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [isError, setIsError] = useState(false);
  const [refreshQuantity, setRefreshQuantity] = useState(false);

  const ERROR = {
    QUANTITY: 'You can only order 25 dishes at a time',
    CART: 'This dish is in your cart with a different set of addons, CLICK again to remove it',
  };

  const dishAddons = addons.length > 0
    ? _.map(dish.addons, (addon) => _.find(addons, { id: addon })).filter(
      (x) => x,
    )
    : [];

  const onClick = () => {
    setDishQuantity(1);
    onAddToCart(dish.id, selectedAddons);
  };

  const onCheck = (e) => {
    const { checked } = e.target;
    let clonedAddons = [...selectedAddons];
    if (checked) {
      clonedAddons.push(e.target.value);
    } else {
      clonedAddons = _.filter(
        clonedAddons,
        (addon) => addon !== e.target.value,
      );
    }
    setSelectedAddons([...clonedAddons]);
  };

  const getTotalAddonCost = () => _.sumBy(
    selectedAddons.map((addon) => ({
      id: addon,
      ..._.find(addons, { id: addon }),
    })),
    'price',
  );

  const getTotalCost = () => price + getTotalAddonCost();

  const onDecrease = () => {
    if (dishQuantity > 0) {
      const cartID = JSON.stringify(`${dish.id}${selectedAddons.sort()}`);
      const existsInCart = _.find(cart, { cartID });
      if (existsInCart) {
        setDishQuantity(dishQuantity - 1);
        onRemoveFromCart(dish.id, selectedAddons);
      } else {
        setIsError(ERROR.CART);
        const dishInCart = _.filter(cart, (x) => x.dishID === dish.id);
        if (dishInCart.length > 0) {
          setSelectedAddons(dishInCart[0].addons);
        }
      }
      setRefreshQuantity(true);
    }
  };
  const onIncrease = () => {
    if (dishQuantity < 25) {
      setDishQuantity(dishQuantity + 1);
      onAddToCart(dish.id, selectedAddons);
      setRefreshQuantity(true);
    } else {
      setIsError(ERROR.QUANTITY);
    }
  };

  useEffect(() => {
    if (isError) {
      const timeout = setTimeout(() => {
        setIsError(false);
      }, 3000);
      return () => clearTimeout(timeout);
    }
    return () => {};
  }, [isError]);

  useEffect(() => {
    if (refreshQuantity) {
      setDishQuantity(quantity);
      setRefreshQuantity(false);
    }
  }, [refreshQuantity]);

  useEffect(() => {
    if (!refreshQuantity) {
      setRefreshQuantity(true);
    }
  }, [cart]);

  return (
    <div className="card_body">
      <div className="card_title">
        <Text bold size={20}>
          {name}
        </Text>
      </div>
      <div className="card_addons">
        {dishAddons.map((addon) => (
          <Row key={`${dish.id}-${addon.id}`}>
            <Col span={4}>
              <Checkbox
                value={addon.id}
                checked={selectedAddons.includes(addon.id)}
                onChange={onCheck}
              />
            </Col>
            <Col span={14}>
              <Text>{addon.name}</Text>
            </Col>
            <Col span={6}>
              <Text>
                Rs.
                {' '}
                {addon.price}
              </Text>
            </Col>
          </Row>
        ))}
      </div>
      <div className="card_details">
        <Row className="card_details" align="middle" justify="space-between">
          <Col>
            <Row align="middle">
              <span style={{ fontSize: 20, paddingRight: 4 }}>Price: </span>
              <Text size={20} bold title="Dish Price">
                Rs.
                {' '}
                {price}
              </Text>
            </Row>
          </Col>
          <Col>
            {selectedAddons.length > 0 && (
              <Row>
                <span style={{ fontSize: 20, paddingRight: 4 }}>+ </span>
                <Text size={20} bold title="Addon Price">
                  Rs.
                  {' '}
                  {getTotalAddonCost()}
                </Text>
                <span style={{ fontSize: 20, padding: '0 8px' }}>=</span>
                <Text bold size={20} title="Total Price">
                  Rs.
                  {' '}
                  {getTotalCost()}
                </Text>
              </Row>
            )}
          </Col>
        </Row>
        <Row align="middle" justify="end" style={{ padding: '10px 0' }}>
          {dishQuantity > 0 ? (
            <div>
              <Row align="middle" justify="end">
                <div style={{ padding: '0 4px' }}>
                  <MinusSquareFilled
                    style={{ color: '#be1826', fontSize: 34 }}
                    onClick={onDecrease}
                  />
                </div>
                <div
                  style={{
                    border: '1px solid #000',
                    padding: '0 20px',
                    fontSize: 18,
                  }}
                >
                  {dishQuantity}
                </div>
                <div style={{ padding: '0 4px' }}>
                  <PlusSquareFilled
                    style={{ color: '#65AB0B', fontSize: 34 }}
                    onClick={onIncrease}
                  />
                </div>
              </Row>
              {isError && (
                <div
                  style={{
                    fontSize: 12,
                    color: '#f00',
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word',
                    width: 280,
                    userSelect: 'none',
                  }}
                >
                  {isError}
                </div>
              )}
            </div>
          ) : (
            <Button onClick={onClick}>Add to Card</Button>
          )}
        </Row>
      </div>
    </div>
  );
}
DishCard.propTypes = {
  dish: Dish.isRequired,
  addons: arrayOf(Addon).isRequired,
  onAddToCart: func.isRequired,
  onRemoveFromCart: func.isRequired,
  cart: arrayOf(CartProduct).isRequired,
};
