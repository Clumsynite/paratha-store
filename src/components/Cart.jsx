import React from 'react';
import {
  Badge, Col, Popover, Row,
} from 'antd';
import { ShoppingCartOutlined, CloseOutlined } from '@ant-design/icons';
import { arrayOf, func } from 'prop-types';
import { CartProduct } from '../helper/types';
import EmptyContent from '../CommonComponents/EmptyContent';
import Text from '../CommonComponents/Text';

export default function Cart({ products, clearCart }) {
  return (
    <Popover
      placement="bottom"
      title={<Title clearCart={clearCart} />}
      content={<CartContent products={products} />}
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

function CartContent({ products }) {
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
          <ProductCard product={product} key={JSON.stringify(product)} />
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
  products: arrayOf(CartProduct).isRequired,
};

function ProductCard({ product }) {
  return <Row>{product?.name}</Row>;
}
ProductCard.propTypes = {
  product: CartProduct.isRequired,
};
