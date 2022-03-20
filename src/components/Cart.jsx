import React, { useState, useEffect } from 'react';
import {
  Badge, Col, Popover, Row,
} from 'antd';
import {
  ShoppingCartOutlined,
  CloseOutlined,
  CaretDownFilled,
  CaretUpFilled,
  MinusSquareFilled,
  PlusSquareFilled,
} from '@ant-design/icons';
import { arrayOf, func } from 'prop-types';
import _ from 'lodash';
import {
  Addon, CartProduct, Dish, DishInCart,
} from '../helper/types';
import EmptyContent from '../CommonComponents/EmptyContent';
import Text from '../CommonComponents/Text';

export default function Cart({
  products,
  clearCart,
  dishes,
  addons,
  onAddToCart,
  onRemoveFromCart,
}) {
  const [productsInCart, setProductsInCart] = useState([]);
  useEffect(() => {
    const dishesInCart = products.map((product) => {
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
  }, [products]);

  return (
    <Popover
      placement="bottom"
      title={<Title clearCart={clearCart} />}
      content={(
        <CartContent
          products={productsInCart}
          onAddToCart={onAddToCart}
          onRemoveFromCart={onRemoveFromCart}
        />
      )}
      trigger="click"
      arrowPointAtCenter
    >
      <Badge count={products.length} size="small">
        <ShoppingCartOutlined
          style={{ fontSize: 32, color: '#fff', cursor: 'pointer' }}
        />
        <Text color="#fff">Cart</Text>
      </Badge>
    </Popover>
  );
}
Cart.propTypes = {
  products: arrayOf(CartProduct).isRequired,
  clearCart: func.isRequired,
  dishes: arrayOf(Dish).isRequired,
  addons: arrayOf(Addon).isRequired,
  onAddToCart: func.isRequired,
  onRemoveFromCart: func.isRequired,
};

function Title({ clearCart }) {
  return (
    <Row align="middle" justify="space-between">
      <Col style={{ fontSize: 16, fontWeight: 'bold' }}>Shopping Cart</Col>
      <Col style={{ fontSize: 14, cursor: 'pointer' }} onClick={clearCart}>
        <Row align="middle">
          <CloseOutlined />
          <div style={{ paddingLeft: 4 }}>Remove All Products</div>
        </Row>
      </Col>
    </Row>
  );
}
Title.propTypes = {
  clearCart: func.isRequired,
};

function CartContent({ products, onAddToCart, onRemoveFromCart }) {
  return (
    <div
      style={{
        width: 360,
        height: 400,
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
    >
      {products.length > 0 ? (
        products.map((product) => (
          <ProductCard
            product={product}
            key={JSON.stringify(product)}
            onAddToCart={onAddToCart}
            onRemoveFromCart={onRemoveFromCart}
          />
        ))
      ) : (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 50,
          }}
        >
          <EmptyContent label="Your cart is currently Empty" />
        </div>
      )}
    </div>
  );
}
CartContent.propTypes = {
  products: arrayOf(DishInCart).isRequired,
  onAddToCart: func.isRequired,
  onRemoveFromCart: func.isRequired,
};

function ProductCard({ product, onAddToCart, onRemoveFromCart }) {
  const [showAddons, setShowAddons] = useState(false);

  const getProductCost = () => {
    let total = product.price;
    product.addons.forEach((addon) => {
      total += addon.price;
    });
    return total * product.quantity;
  };

  const onDecrease = () => {
    onRemoveFromCart(product.id, product.product.addons);
  };
  const onIncrease = () => {
    onAddToCart(product.id, product.product.addons);
  };

  return (
    <div>
      <Row style={{ padding: '10px 0' }} align="middle">
        <Col span={2}>
          {product.addons.length > 0
            && (showAddons ? (
              <CaretUpFilled onClick={() => setShowAddons(false)} />
            ) : (
              <CaretDownFilled onClick={() => setShowAddons(true)} />
            ))}
        </Col>
        <Col span={10}>
          <Text size={12} bold>
            {product.name}
          </Text>
        </Col>
        <Col span={6} style={{ textAlign: 'right' }}>
          <Row align="middle" justify="center">
            <div style={{ padding: '0 4px' }}>
              <MinusSquareFilled
                style={{ color: '#be1826', fontSize: 20 }}
                onClick={onDecrease}
              />
            </div>
            <div
              style={{
                border: '1px solid #000',
                padding: '0 10px',
                fontSize: 12,
              }}
            >
              {product.quantity}
            </div>
            <div style={{ padding: '0 4px' }}>
              <PlusSquareFilled
                style={{ color: '#65AB0B', fontSize: 20 }}
                onClick={onIncrease}
              />
            </div>
          </Row>
        </Col>
        <Col span={4} style={{ textAlign: 'right' }}>
          <Text size={12} bold>
            {`Rs. ${product.price}`}
          </Text>
        </Col>
      </Row>
      {showAddons
        && product.addons.map((addon) => (
          <AddonCard addon={addon} key={JSON.stringify([product, addon])} />
        ))}
      <Row
        style={{
          borderTop: '1px solid lightgray',
          borderBottom: '1px solid #000',
          padding: '4px 0',
        }}
      >
        <Col offset={2} span={10} style={{ textAlign: 'right' }}>
          <Text bold size={12}>
            DIsh Costs:
          </Text>
        </Col>
        <Col span={10} style={{ textAlign: 'right' }}>
          <Text size={14} bold>
            {`Rs. ${getProductCost()}`}
          </Text>
        </Col>
      </Row>
    </div>
  );
}
ProductCard.propTypes = {
  product: DishInCart.isRequired,
  onAddToCart: func.isRequired,
  onRemoveFromCart: func.isRequired,
};

function AddonCard({ addon }) {
  return (
    <Row style={{ padding: '4px 0' }}>
      <Col span={10} offset={2}>
        <Text size={12}>{addon.name}</Text>
      </Col>
      <Col span={4} offset={8}>
        <Text size={10} bold>{`Rs. ${addon.price}`}</Text>
      </Col>
    </Row>
  );
}
AddonCard.propTypes = {
  addon: Addon.isRequired,
};
