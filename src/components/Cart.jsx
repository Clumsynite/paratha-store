import React, { useState, useEffect } from 'react';
import {
  Badge, Button, Col, Popover, Row,
} from 'antd';
import {
  ShoppingCartOutlined,
  CloseOutlined,
  CaretDownFilled,
  CaretUpFilled,
  MinusSquareFilled,
  PlusSquareFilled,
  ArrowRightOutlined,
} from '@ant-design/icons';
import { arrayOf, func, bool } from 'prop-types';
import _ from 'lodash';
import {
  Addon, CartProduct, Dish, DishInCart,
} from '../helper/types';
import EmptyContent from '../CommonComponents/EmptyContent';
import Text from '../CommonComponents/Text';
import { getProductCost, getTotalCost } from '../helper/functions';

export default function Cart({
  products,
  clearCart,
  dishes,
  addons,
  onAddToCart,
  onRemoveFromCart,
  onCheckout,
  isCartVisible,
  setIsCartVisible,
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
          onCheckout={onCheckout}
        />
      )}
      trigger="click"
      arrowPointAtCenter
      visible={isCartVisible}
      id="cart-popover"
      onVisibleChange={(visible) => setIsCartVisible(visible)}
    >
      <Badge count={products.length} size="small" id="cart-badge">
        <ShoppingCartOutlined
          id="cart-icon"
          style={{ fontSize: 32, color: '#fff', cursor: 'pointer' }}
          onClick={() => setIsCartVisible(!isCartVisible)}
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
  onCheckout: func.isRequired,
  isCartVisible: bool.isRequired,
  setIsCartVisible: func.isRequired,
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

function CartContent({
  products, onAddToCart, onRemoveFromCart, onCheckout,
}) {
  return (
    <div
      style={{
        width: 360,
        height: 400,
        overflow: 'hidden',
      }}
    >
      {products.length > 0 ? (
        <div>
          <div style={{ height: 330, overflowY: 'auto' }}>
            {products.map((product) => (
              <ProductCard
                product={product}
                key={JSON.stringify(product)}
                onAddToCart={onAddToCart}
                onRemoveFromCart={onRemoveFromCart}
              />
            ))}
          </div>
          <Row
            style={{
              borderTop: '1px solid #000',
              borderBottom: '1px solid #000',
              padding: '4px 0',
            }}
          >
            <Col offset={2} span={10} style={{ textAlign: 'right' }}>
              <Text bold size={14}>
                Subtotal:
              </Text>
            </Col>
            <Col span={10} style={{ textAlign: 'right' }}>
              <Text size={14} bold>
                {`Rs. ${getTotalCost(products)}`}
              </Text>
            </Col>
          </Row>
          <Row style={{ padding: '4px 0' }} justify="center">
            <Button
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
              type="primary"
              onClick={onCheckout}
            >
              Proceed to Checkout
              {' '}
              <ArrowRightOutlined />
            </Button>
          </Row>
        </div>
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
  onCheckout: func.isRequired,
};

function ProductCard({ product, onAddToCart, onRemoveFromCart }) {
  const [showAddons, setShowAddons] = useState(false);

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
        <Col span={6} style={{ textAlign: 'right' }}>
          <Text bold size={12}>
            DIsh Costs:
          </Text>
        </Col>
        <Col span={12}>
          <Row align="middle" justify="center">
            (
            <div title="Dish Price">
              <Text size={12} bold>
                {`Rs. ${product.price}`}
              </Text>
            </div>
            <span style={{ padding: '0 6px' }}>+</span>
            <div title="Total Price of Addons">
              <Text size={12} bold>
                {`Rs. ${_.sumBy(product.addons, 'price')}`}
              </Text>
            </div>
            )
            <span style={{ padding: '0 6px' }}>*</span>
            <div>
              <Text size={12} bold>
                {product.quantity}
              </Text>
            </div>
          </Row>
        </Col>
        <Col span={4} style={{ textAlign: 'right' }}>
          <Text size={14} bold>
            {`Rs. ${getProductCost(product)}`}
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
