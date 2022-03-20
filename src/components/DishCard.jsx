import React, { useState, useEffect } from 'react';
import {
  Button, Checkbox, Col, InputNumber, Row,
} from 'antd';
import { arrayOf, func } from 'prop-types';
import _ from 'lodash';
import { MinusSquareFilled, PlusSquareFilled } from '@ant-design/icons';
import Text from '../CommonComponents/Text';
import { Addon, Dish } from '../helper/types';
import '../styles/DishCard.css';

export default function DishCard({ dish, addons, onAddToCart }) {
  const { name, price, quantity } = dish;
  const [tempQuantity, setTempQuantity] = useState(quantity || 0);
  const [dishQuantity, setDishQuantity] = useState(quantity || 0);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [isError, setIsError] = useState(false);

  const ERROR = {
    QUANTITY: 'You can only order 25 dishes at a time',
  };

  const dishAddons = addons.length > 0
    ? _.map(dish.addons, (addon) => _.find(addons, { id: addon })).filter(
      (x) => x,
    )
    : [];

  const onChange = (value) => setTempQuantity(value);
  const onBlur = () => (tempQuantity < 26
    ? setDishQuantity(tempQuantity)
    : setIsError(ERROR.QUANTITY));

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
      setTempQuantity(dishQuantity - 1);
      setDishQuantity(dishQuantity - 1);
    }
  };
  const onIncrease = () => {
    if (dishQuantity < 25) {
      setTempQuantity(dishQuantity + 1);
      setDishQuantity(dishQuantity + 1);
    } else {
      setIsError(ERROR.QUANTITY);
    }
  };

  useEffect(() => {
    if (isError) {
      if (tempQuantity < 25) {
        setIsError(false);
      } else {
        setTempQuantity(25);
      }
      const timeout = setTimeout(() => {
        setIsError(false);
      }, 3000);
      return () => clearTimeout(timeout);
    }
    return () => {};
  }, [isError, tempQuantity]);

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
                <InputNumber
                  min={1}
                  max={100}
                  value={tempQuantity}
                  onChange={onChange}
                  onBlur={onBlur}
                />
                <div style={{ padding: '0 4px' }}>
                  <PlusSquareFilled
                    style={{ color: '#65AB0B', fontSize: 34 }}
                    onClick={onIncrease}
                  />
                </div>
              </Row>
              {isError && (
                <Text size={12} color="#f00">
                  {isError}
                </Text>
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
};
