import { Row } from 'antd';
import { func, arrayOf } from 'prop-types';
import React from 'react';
import Text from '../CommonComponents/Text';
import DishCard from '../components/DishCard';
import { Addon, Dish } from '../helper/types';

export default function Home({
  dishes,
  addons,
  onAddToCart,
  onRemoveFromCart,
}) {
  return (
    <div>
      <div style={{ padding: '12px 0', borderBottom: '1px solid lightgrey' }}>
        <Text bold={false} size={20}>
          Out store currently has
          {' '}
          <span style={{ fontWeight: 'bold' }}>{dishes.length}</span>
          {' '}
          dishes
          with around
          {' '}
          <span style={{ fontWeight: 'bold' }}>{addons.length}</span>
          {' '}
          adons.
        </Text>
      </div>
      <Row style={{ padding: '12px 0' }}>
        {dishes.map((dish) => (
          <DishCard
            key={dish.id}
            dish={dish}
            addons={addons}
            onAddToCart={onAddToCart}
            onRemoveFromCart={onRemoveFromCart}
          />
        ))}
      </Row>
    </div>
  );
}
Home.propTypes = {
  dishes: arrayOf(Dish).isRequired,
  addons: arrayOf(Addon).isRequired,
  onAddToCart: func.isRequired,
  onRemoveFromCart: func.isRequired,
};
