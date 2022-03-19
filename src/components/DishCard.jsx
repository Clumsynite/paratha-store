import React, { useState } from 'react';
import {
  Button, Checkbox, Col, InputNumber, Row,
} from 'antd';
import { arrayOf, func } from 'prop-types';
import _ from 'lodash';
import Text from '../CommonComponents/Text';
import { Addon, Dish } from '../helper/types';
import '../styles/DishCard.css';

export default function DishCard({ dish, addons, onAddToCart }) {
  const { name, price, quantity } = dish;
  const [dishQuantity, setDishQuantity] = useState(quantity || 0);
  const [selectedAddons, setSelectedAddons] = useState([]);

  const dishAddons = addons.length > 0
    ? _.map(dish.addons, (addon) => _.find(addons, { id: addon })).filter(
      (x) => x,
    )
    : [];

  const onChange = (value) => setDishQuantity(value);

  const onClick = () => {
    setDishQuantity(1);
    onAddToCart(dish, selectedAddons);
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
            <InputNumber
              min={1}
              max={100}
              value={dishQuantity}
              onChange={onChange}
            />
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
